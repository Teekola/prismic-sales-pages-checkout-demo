// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteAllOrderProducts, getOrderProducts } from "prisma/orderProduct";
const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }
   // Get body from request
   const body = req.body;

   if (req.method === "GET") {
      // Get all orders (default limit 100)
      const orderProducts = await getOrderProducts();

      // Handle error
      if (orderProducts === false) {
         console.error("An error occurred when trying to get orderProducts.");
         return res.status(500).end();
      }

      // Return orderProducts on success
      return res.status(200).json(orderProducts);
   }

   if (req.method === "DELETE") {
      // Delete all orderProducts
      const orderProducts = await deleteAllOrderProducts();

      // Handle error
      if (orderProducts === false) {
         console.error("An error occurred when trying to delete orderProducts.");
         return res.status(400).end();
      }
      console.log("All orderProducts have been deleted.");

      return res.status(200).end();
   }

   // Default success on any other method
   return res.status(200).end();
}
