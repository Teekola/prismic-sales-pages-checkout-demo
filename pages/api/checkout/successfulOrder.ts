import { calculateEazybreakResponseChecksum } from "components/Checkout/Providers/Eazybreak/data/calculateEazybreakResponseChecksum";
import calculateEpassiResponseMac from "components/Checkout/Providers/Epassi/data/calculateEpassiResponseMac";
import calculateHmac from "components/Checkout/Providers/Paytrail/data/calculateHmac";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOrder, updateOrder } from "prisma/order";

const PAYTRAIL_SECRET = process.env.PAYTRAIL_SECRET || "SAIPPUAKAUPPIAS";
const SMARTUM_KID = process.env.SMARTUM_KID || "UBJZYFXrOKHq_3VZWIs_XQHDY8ZOS2UrocBvyXm8ejI";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   const query = req.query;
   const body = req.body;

   //////////////////////////////////////////////////////////
   // REFERENCE TO THE ORDER
   //////////////////////////////////////////////////////////

   // Get the reference to the order from the query parameters
   const reference =
      // Paytrail
      query["checkout-reference"]
         ? query["checkout-reference"]
         : // Eazybreak
         query["payment_id"]
         ? query["payment_id"]
         : // ePassi
         req.body
         ? req.body.STAMP
         : // Smartum
         query["nonce"]
         ? query["nonce"]
         : // Email Invoice
         query["email-reference"]
         ? query["email-reference"]
         : // Not defined
           null;

   // If there is no order reference, return error
   if (reference === null) {
      console.error("Order reference is missing.");
      return res.status(400).end();
   }

   //////////////////////////////////////////////////////////
   // VALIDATE PAYMENT FOR EACH PROVIDER
   //////////////////////////////////////////////////////////

   // Check validity of Paytrail (Includes Edenred)
   if (query["checkout-reference"]) {
      // Retrieve the signature to be verified and remove it from the payload headers
      const testSignature = query["signature"];
      const paytrailHeaders = query;

      // Remove headers that don't belong to the hmac payload
      // so headers that don't start with "checkout-"
      for (let header of Object.keys(paytrailHeaders)) {
         if (header.split("-")[0] !== "checkout") {
            delete paytrailHeaders[header];
         }
      }

      // Calculate the correct hmac
      const paytrailHmac = calculateHmac(PAYTRAIL_SECRET, paytrailHeaders, "");

      // If signatures don't match log error
      if (paytrailHmac !== testSignature) {
         console.error("Signature does not match.");
         return res.status(401).end();
      }
      // Log success
      console.log("Paytrail was successfully validated.");
   }

   // Check validity of Eazybreak
   else if (query["payment_id"]) {
      const eazybreakChecksum = calculateEazybreakResponseChecksum(query);
      console.log("Eazybreak checksum:", eazybreakChecksum);
      console.log("Received checksum:", query.checksum);
      console.log("Match?", eazybreakChecksum === query.checksum);
      // Log error
      if (eazybreakChecksum !== query.checksum) {
         console.error("The checksum is invalid.");
         return res.status(401).end();
      }
      if (query.status !== "completed") {
         console.error("The payment was not completed.");
         return res.status(401).end();
      }
      // Log success
      console.log("Eazybreak was successfully validated.");
   }

   // Check validity of ePassi
   else if (body.STAMP) {
      console.log("Epassi request body: ", body);
      const epassiMac = calculateEpassiResponseMac(body);
      console.log("Calculated ePassi MAC:", epassiMac);
      console.log("Received ePassi MAC:", body.MAC);
      console.log("Match?", epassiMac === body.MAC);
      // Log error
      if (epassiMac !== req.body.MAC) {
         console.error("The MAC is invalid.");
         return res.status(401).end();
      }
      // Log success
      console.log("ePassi was successfully validated.");
   }

   // Check validity of Smartum
   else if (query["nonce"]) {
      if (query.kid !== SMARTUM_KID) {
         console.error("The jwt's kid was invalid");
         return res.status(401).end();
      }
      console.log("Smartum was successfully validated.");
   }

   //////////////////////////////////////////////////////////
   // ACTIVATE COURSES
   //////////////////////////////////////////////////////////

   // Get the order data
   // Get order with reference
   const order = await getOrder({ reference });

   // Handle error
   if (order === false) {
      console.error("An error occurred when trying to get order.");
      return res.status(500).end();
   }

   // Handle no order found
   if (order === null) {
      console.error("No order was found with reference", reference);
      return res.status(404).end();
   }

   // Handle already activated
   if (order.status === "valmis") {
      console.log("Courses were already activated for transaction", reference);
      return res.status(200).end();
   }

   // Generate Kajabi payload
   const kajabiBody = {
      name: order.customer.name,
      email: order.customer.email,
      external_user_id: order.customer.email,
   };

   // Get activation urls from the order's products
   const activationUrls = order.products
      .map((product) => product.activationUrl)
      .filter((url): url is string => url !== (null || ""));

   if (activationUrls.length > 0) {
      try {
         // Go through the urls and activate them
         for (let url of activationUrls) {
            // Activate course
            const kajabiRes = await fetch(url, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(kajabiBody),
            });
            // Log Kajabi response
            const kajabi = await kajabiRes.json();
            console.log(kajabi);
         }
         // Log success
         console.log("Courses have been activated.");
      } catch (error) {
         console.error("An error occurred when activating courses.", error);
      }
   }

   // Update the order status to "valmis"
   await updateOrder({ status: "valmis" }, { reference });

   //////////////////////////////////////////////////////////
   // TODO: ADD TO HYROS (production only)
   //////////////////////////////////////////////////////////
   if (process.env.NODE_ENV === "production") {
      // Add to Hyros
   }

   //////////////////////////////////////////////////////////
   // TODO: ADD TO ACTIVE CAMPAIGN (production only)
   //////////////////////////////////////////////////////////
   if (process.env.NODE_ENV === "production") {
      // Add to AC
   }

   return res.status(200).end();
}
