// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
   name: string;
};
const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }
   if (req.method === "GET") {
      // Return all orders
   }
   if (req.method === "POST") {
      // Create Order
   }
   return res.status(200).json({ name: "John Doe" });
}
