import type { NextApiRequest, NextApiResponse } from "next";
import calculateHmac from "components/Checkout/Providers/Paytrail/data/calculateHmac";
import { PaytrailResponseT } from "components/Checkout/Providers/Paytrail/types";

// Get Paytrail Account Credentials
const ACCOUNT = process.env.PAYTRAIL_ACCOUNT || "375917";
const SECRET = process.env.PAYTRAIL_SECRET || "SAIPPUAKAUPPIAS";

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<PaytrailResponseT>
) {
   if (req.method != "POST")
      return res.status(400).json({ status: "error", message: "wrong method" });

   const headers: HeadersInit = {
      "checkout-account": ACCOUNT,
      "checkout-algorithm": "sha256",
      "checkout-method": "POST",
      "checkout-nonce": Math.round(Date.now() + Math.random()).toString(),
      "checkout-timestamp": new Date().toISOString(),
   };
   const body = req.body;

   // Add the signature to the request headers
   const signature = calculateHmac(SECRET, headers, body);
   headers.signature = signature;
   headers["content-type"] = "application/json; charset=utf-8";

   try {
      // Create payment
      const response = await fetch("https://services.paytrail.com/payments", {
         method: "POST",
         headers,
         body: JSON.stringify(body),
      });

      // Add headers to resHeaders object from the response iterator
      const resHeaders: any = {};
      for (var pair of response.headers.entries()) {
         resHeaders[pair[0]] = pair[1];
      }

      // Get the signature
      const resSignature = resHeaders.signature;

      // Store all possible payload headers to an array
      const payloadHeaders = [
         "checkout-account",
         "checkout-algorithm",
         "checkout-method",
         "checkout-nonce",
         "checkout-timestamp",
         "checkout-transaction-id",
         "platform-name",
      ];

      // Remove headers that don't belong to the hmac payload
      Object.keys(resHeaders).forEach((header) => {
         if (!payloadHeaders.includes(header)) {
            delete resHeaders[header];
         }
      });
      const data = await response.json();

      // Validate the data with the signature
      const correct = calculateHmac(SECRET, resHeaders, data);

      // If the signatures don't match, return error
      if (resSignature != correct)
         return res.status(401).json({ status: "error", message: "signature mismatch" });

      // Return the validated data
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json(error as PaytrailResponseT);
   }
}
