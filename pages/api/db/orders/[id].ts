// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteOrder, updateOrder } from "prisma/order";
import { deleteOrderFromProducts } from "prisma/product";

const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   /*
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }
   */

   // Reference from query
   const { id } = req.query;
   const orderId = id?.toString() || "";

   if (req.method === "GET") {
      // TODO: Return specific order
   }

   const body = req.body;
   if (req.method === "PATCH") {
      // Update order
      const order = await updateOrder(body, { id: orderId });
      console.log("Order " + orderId + " was updated.");
      return res.status(200).json(order);
   }

   if (req.method === "DELETE") {
      // Delete specific order from all products
      const deletedFromProducts = await deleteOrderFromProducts(orderId);

      // Log error
      if (!deletedFromProducts) {
         console.log("Order deletion from products failed.");
         return res.status(500).end();
      }

      // Delete specific order
      const deleted = await deleteOrder(orderId);

      // Log error
      if (!deleted) {
         console.log("Order deletion failed.");
         return res.status(500).end();
      }

      // Log success
      console.log("Order " + orderId + " was deleted.");
      return res.status(200).end();
   }
   return res.status(200).end();
}
