import type { NextApiRequest, NextApiResponse } from "next";
import { calculateEpassiRequestMac } from "components/Checkout/Providers/Epassi/data/calculateEpassiRequestMac";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   if (req.method !== "POST") {
      console.log("wrong method.");
      return res.status(400).end();
   }
   // Get data from the body
   const { stamp, amount } = req.body;
   try {
      // Calculate MAC
      const mac = calculateEpassiRequestMac(stamp, amount);
      return res.status(200).json(mac);
   } catch (error) {
      // Log error
      console.error("ePassi MAC calculation error", error);
      return res.status(500).end();
   }
}
