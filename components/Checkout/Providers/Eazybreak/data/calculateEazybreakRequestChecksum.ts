const crypto = require("crypto");

const EAZYBREAK_SECRET = process.env.EAZYBREAK_SECRET || "28867906d611e07adddd76d67d3a88b410396c00";
const EAZYBREAK_ACCOUNT = process.env.NEXT_PUBLIC_EAZYBREAK_ACCOUNT || "onlinedemo01";
const EAZYBREAK_LOCATION = process.env.NEXT_PUBLIC_EAZYBREAK_LOCATION || "S267";

export const calculateEazybreakRequestChecksum = (
   payment_id: string,
   value: string,
   success_url: string,
   cancel_url: string,
   language: string,
   mode: string,
   success_url_callback?: string | undefined
) => {
   let message =
      Buffer.from(EAZYBREAK_ACCOUNT).toString("base64") +
      "|" +
      Buffer.from(EAZYBREAK_LOCATION).toString("base64") +
      "|" +
      Buffer.from(payment_id).toString("base64") +
      "|" +
      Buffer.from(value).toString("base64") +
      "|" +
      Buffer.from(success_url).toString("base64") +
      "|" +
      Buffer.from(cancel_url).toString("base64") +
      "|" +
      Buffer.from(language).toString("base64") +
      "|" +
      Buffer.from(mode).toString("base64");
   // Add success_url_callback when the param is given
   if (success_url_callback) {
      message += "|" + Buffer.from(success_url_callback).toString("base64");
   }
   const checksum = crypto.createHmac("sha256", EAZYBREAK_SECRET).update(message).digest("hex");
   return checksum;
};
