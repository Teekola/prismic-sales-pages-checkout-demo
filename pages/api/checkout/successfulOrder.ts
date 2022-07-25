import calculateHmac from "components/Checkout/Providers/Paytrail/data/calculateHmac";
import type { NextApiRequest, NextApiResponse } from "next";

const PAYTRAIL_SECRET = process.env.PAYTRAIL_SECRET || "SAIPPUAKAUPPIAS";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   const query = req.query;

   //////////////////////////////////////////////////////////
   // REFERENCE TO THE ORDER
   //////////////////////////////////////////////////////////

   // Get the reference to the order from the query parameters
   const transactionReference =
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
           undefined;

   // If there is no order reference, return error
   if (!transactionReference) return res.status(400).json({ error: "tilausviite puuttuu" });

   //////////////////////////////////////////////////////////
   // CHECK VALIDITY
   //////////////////////////////////////////////////////////

   // Check validity of Paytrail
   if (query["checkout-reference"]) {
      // Retrieve the signature to be verified and remove it from the payload headers
      const testSignature = query["signature"];
      const paytrailHeaders = query;
      delete paytrailHeaders["signature"];

      // Calculate the correct hmac
      const paytrailHmac = calculateHmac(PAYTRAIL_SECRET, paytrailHeaders);

      if (paytrailHmac !== testSignature)
         return res.status(401).json({ error: "signatuuri ei täsmää" });
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

   /*

   // Get the order data
   try {
      const order = await getOrder(transactionReference);

      // If the order has already been set successful, return (don't reactivate courses)
      if (order.success) return res.status(200).json({ success: "kurssit on jo aktivoitu" });

      // Generate Kajabi-payload
      const body = {
         name: order.name,
         email: order.email,
         external_user_id: order.email,
      };

      // Fetch the activation links from the DB
      const activationProducts = [...order.products];

      // Fetch and Add Order Bump Product Data to activationProducts
      const orderBumpIds = order.products.filter((id) => id >= 900);
      if (orderBumpIds.length > 0) {
         const orderBumps = await getOrderBumps(orderBumpIds);
         orderBumps.forEach((ob) => {
            activationProducts.push(ob.productId);
         });
      }

      const activationLinks = await getActivationLinks(activationProducts);

      // Activate the courses on the list
      try {
         activationLinks.forEach(async (link) => {
            await fetch(link, {
               method: "POST",
               headers: {
                  "content-type": "application/json",
               },
               body: JSON.stringify(body),
            });
         });
      } catch (error) {
         console.log("Virhe kurssien aktivoinnissa:", error);
      }

      // Update the order status to success
      await updateOrder(transactionReference, { success: true }, { transactionReference });


      //////////////////////////////////////////////////////////
      // ADD TO HYROS
      //////////////////////////////////////////////////////////
      //await createHyrosOrder(order);

      //////////////////////////////////////////////////////////
      // ADD TO ACTIVE CAMPAIGN
      //////////////////////////////////////////////////////////
      await addToActiveCampaign(
         order.email,
         order.name,
         order.phone,
         order.city,
         order.activationProducts
      );
		
   } catch (error) {
      console.error("Successful order: Tilausta ei löydy");
      return res.status(404).json({ error, message: "tilausta ei löydy" });
   }

	*/

   return res.status(200).json({ success: "kurssit aktivoitu" });
}
