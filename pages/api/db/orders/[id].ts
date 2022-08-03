// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteOrder, getOrder, updateOrder } from "prisma/order";
import { deleteOrderFromOrderProducts } from "prisma/orderProduct";

const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }

   // Get id and body
   const { id } = req.query;
   if (typeof id !== "string") {
      console.error("Id is missing.");
      return res.status(400).end();
   }
   const body = req.body;

   if (req.method === "GET") {
      // Return order based on id
      const where = { id };
      const order = await getOrder(where);

      // Handle error
      if (order === false) {
         console.error("An error occurred when trying to get order.");
         return res.status(500).end();
      }
      // Handle not found
      if (order === null) {
         console.log("Order", "was not found.");
         return res.status(404).end();
      }
      // Return order on success
      return res.status(200).json(order);
   }

   if (req.method === "PATCH") {
      // Update order
      const order = await updateOrder(body, { id });

      // Handle error
      if (order === false) {
         console.error("An error occurred when trying to update order.");
         return res.status(400).end();
      }
      console.log("Order " + id + " was updated.");
      // Return order on success
      return res.status(200).json(order);
   }

   if (req.method === "DELETE") {
      // Delete specific order from all products
      const deletedFromProducts = await deleteOrderFromOrderProducts(id);

      // Handle error
      if (!deletedFromProducts) {
         console.log("Order deletion from products failed.");
         return res.status(500).end();
      }

      // Delete specific order
      const order = await deleteOrder({ id });

      // Log error
      if (order === false) {
         console.log("Order deletion failed.");
         return res.status(400).end();
      }

      // Return order on success
      console.log("Order " + id + " was deleted.");
      return res.status(200).json(order);
   }

   // Default success on any other method
   return res.status(200).end();
}
