const crypto = require("crypto");

const EPASSI_SECRET = process.env.EPASSI_SECRET || "1TRQVUMAUBX4";

export default function calculateEpassiResponseMac({
   STAMP,
   PAID,
}: {
   STAMP: string;
   PAID: string;
}) {
   const message = STAMP + "&" + PAID + "&" + EPASSI_SECRET;
   const mac = crypto.createHash("sha512").update(message).digest("hex");
   return mac;
}
