import calculateHmac from "components/Checkout/Providers/Paytrail/data/calculateHmac";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOrder, updateOrder } from "prisma/order";

const PAYTRAIL_SECRET = "SAIPPUAKAUPPIAS";

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
   // CHECK VALIDITY
   //////////////////////////////////////////////////////////

   // Check validity of Paytrail
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

      // If signatures don't match, update order status and log error
      if (paytrailHmac !== testSignature) {
         console.error("Signature does not match.");
         return res.status(401).end();
      }
   }

   /*
   // Check validity of Eazybreak
   else if (query["payment_id"]) {
      const eazybreakChecksum = calculateEazybreakResponseChecksum(query);
      console.log("Eazybreak checksum:", eazybreakChecksum);
      console.log(" Received checksum:", query.checksum);
      console.log("Samat?:", eazybreakChecksum === query.checksum);
      // If the checksum is invalid or the payment status is not 'completed', return error
      if (eazybreakChecksum !== query.checksum)
         return res.status(401).json({ error: "tarkistussumma ei täsmää" });
      if (query.status !== "completed")
         return res.status(401).json({ error: "maksu ei onnistunut" });
      console.log("Eazybreak varmistettu.");
   }

   // Check validity of ePassi
   else if (req.body.STAMP) {
      console.log("Request body: ", req.body);
      const epassiMac = calculateEpassiResponseMac(req.body);

      console.log("Laskettu epassi MAC:", epassiMac);
      console.log("Oikea epassi MAC:", req.body.MAC);
      console.log("Samat?", epassiMac === req.body.MAC);

      // If the mac is invalid, return error
      if (epassiMac !== req.body.MAC) return res.status(401).json({ error: "MAC ei täsmää" });
      console.log("ePassi varmistettu.");
   }

   // Check validity of Smartum
   else if (query["nonce"]) {
      if (query.kid !== process.env.SMARTUM_KID)
         return res.status(401).json({ error: "jwt:n kid ei täsmää" });
      console.log("Smartum varmistettu.");
   }
	*/

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
   // ADD TO HYROS
   //////////////////////////////////////////////////////////

   //////////////////////////////////////////////////////////
   // ADD TO ACTIVE CAMPAIGN
   //////////////////////////////////////////////////////////

   return res.status(200).end();
}
