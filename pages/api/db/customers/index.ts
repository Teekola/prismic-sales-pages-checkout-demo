// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteCustomers, getCustomers } from "prisma/customer";

const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   /*
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }
   */
   if (req.method === "GET") {
      // Return all Customers
      const orders = await getCustomers();
      return res.status(200).json({ orders });
   }
   if (req.method === "POST") {
      // Create a Customer
   }

   if (req.method === "DELETE") {
      // Delete all Customers
      await deleteCustomers();
      console.log("All customers have been deleted.");
      return res.status(200).end();
   }
   return res.status(200).end();
}
