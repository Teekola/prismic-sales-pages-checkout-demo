import type { NextApiRequest, NextApiResponse } from "next";
import { calculateEazybreakRequestChecksum } from "components/Checkout/Providers/Eazybreak/data/calculateEazybreakRequestChecksum";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   if (req.method !== "POST") {
      console.log("wrong method.");
      return res.status(400).end();
   }
   console.log(req.body);

   // Get data from the body
   const { payment_id, value, success_url, cancel_url, language, mode, success_url_callback } =
      req.body;
   try {
      // Calculate checksum
      const checksum = calculateEazybreakRequestChecksum(
         payment_id,
         value,
         success_url,
         cancel_url,
         language,
         mode,
         success_url_callback
      );
      return res.status(200).json(checksum);
   } catch (error) {
      // Log error
      console.error("Eazybreak checksum calculation error", error);
      return res.status(500).end();
   }
}
