// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getOrders, deleteAllOrders, createOrder } from "prisma/order";
import { deleteAllOrdersFromProducts } from "prisma/product";

const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   // Authorize
   /*if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }
   */
   if (req.method === "GET") {
      // Return all orders
      const orders = await getOrders();
      return res.status(200).json({ orders });
   }
   const body = req.body;
   if (req.method === "POST") {
      // Create Order
      const order = await createOrder(body);
      console.log("Order ", order?.id, " was created.");
      return res.status(200).json(order);
   }

   if (req.method === "DELETE") {
      // Delete all orders
      await deleteAllOrders();

      // Delete all orders from all products
      await deleteAllOrdersFromProducts();
   }
   return res.status(200).end();
}
