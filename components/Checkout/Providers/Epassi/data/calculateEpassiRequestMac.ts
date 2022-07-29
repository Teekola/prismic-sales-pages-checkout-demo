const crypto = require("crypto");

const EPASSI_SECRET = process.env.EPASSI_SECRET || "1TRQVUMAUBX4";
const EPASSI_SITE = process.env.NEXT_PUBLIC_EPASSI_SITE || "77190";
export const calculateEpassiRequestMac = (stamp: string, amount: string) => {
   const message = stamp + "&" + EPASSI_SITE + "&" + amount + "&" + EPASSI_SECRET;
   const mac = crypto.createHash("sha512").update(message).digest("hex");
   return mac;
};
