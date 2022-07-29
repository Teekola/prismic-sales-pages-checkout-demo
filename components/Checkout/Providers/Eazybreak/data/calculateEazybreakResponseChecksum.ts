const crypto = require("crypto");
const EAZYBREAK_SECRET = process.env.EAZYBREAK_SECRET;

export const calculateEazybreakResponseChecksum = (
   id: string,
   payment_id: string,
   status: string,
   value: string,
   first_name: string,
   last_name: string,
   time: string,
   code: string
) => {
   const message =
      Buffer.from(id).toString("base64") +
      "|" +
      Buffer.from(payment_id).toString("base64") +
      "|" +
      Buffer.from(status).toString("base64") +
      "|" +
      Buffer.from(value).toString("base64") +
      "|" +
      Buffer.from(first_name).toString("base64") +
      "|" +
      Buffer.from(last_name).toString("base64") +
      "|" +
      Buffer.from(time).toString("base64") +
      "|" +
      Buffer.from(code).toString("base64");

   const checksum = crypto.createHmac("sha256", EAZYBREAK_SECRET).update(message).digest("hex");
   return checksum;
};
