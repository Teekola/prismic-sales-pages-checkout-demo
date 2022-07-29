import { ParsedUrlQuery } from "querystring";
const crypto = require("crypto");
const EAZYBREAK_SECRET = process.env.EAZYBREAK_SECRET || "28867906d611e07adddd76d67d3a88b410396c00";

export const calculateEazybreakResponseChecksum = (query: ParsedUrlQuery): string => {
   const id = (query?.tp as string).split("=")[1] as string;
   const payment_id = query.payment_id as string;
   const status = query.status as string;
   const value = query.value as string;
   const first_name = query.first_name as string;
   const last_name = query.last_name as string;
   const time = query.time as string;
   const code = query.code as string;

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
