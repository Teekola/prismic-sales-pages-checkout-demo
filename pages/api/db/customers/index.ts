// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteCustomers, getCustomers } from "prisma/customer";

const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   /*
   TODO
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }
   */
   if (req.method === "GET") {
      // Return all Customers
      const customers = await getCustomers();

      // Handle error
      if (customers === false) {
         console.error("An error occurred when trying to get customers.");
         return res.status(400).end();
      }
      return res.status(200).json(customers);
   }

   if (req.method === "POST") {
      // TODO: Create a Customer
   }

   if (req.method === "DELETE") {
      // Delete all Customers
      const customers = await deleteCustomers();

      // Handle error
      if (customers === false) {
         console.error("An error occurred when trying to delete customers.");
         return res.status(400).end();
      }

      // Log success
      console.log("All customers have been deleted.");
      return res.status(200).json(customers);
   }
   return res.status(200).end();
}
