// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getOrders, deleteAllOrders, createOrder, getOrder } from "prisma/order";
import { deleteAllOrdersFromOrderProducts } from "prisma/orderProduct";

const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }
   // Get body from request
   const body = req.body;

   if (req.method === "GET" && req.query.reference) {
      // Get order based on order reference given as a query string
      const order = await getOrder({ reference: req.query.reference as string });

      // Handle error
      if (order === false) {
         console.error("An error occurred when trying to get order.");
         return res.status(500).end();
      }

      // Return order on success
      return res.status(200).json(order);
   }

   if (req.method === "GET") {
      // Get all orders (default limit 100)
      const orders = await getOrders();

      // Handle error
      if (orders === false) {
         console.error("An error occurred when trying to get orders.");
         return res.status(500).end();
      }

      // Return orders on success
      return res.status(200).json(orders);
   }

   if (req.method === "POST") {
      // Create Order
      const order = await createOrder(body);

      // Handle error
      if (order === false) {
         console.error("An error occurred when trying to create order.");
         return res.status(400).end();
      }

      // Return created order
      console.log("Order ", order.id, " was created.");
      return res.status(200).json({ id: order.id });
   }

   if (req.method === "DELETE") {
      // Delete all orders
      const orders = await deleteAllOrders();

      // Handle error
      if (orders === false) {
         console.error("An error occurred when trying to delete orders.");
         return res.status(400).end();
      }
      console.log("All orders have been deleted.");

      // Delete all orders from all products
      const deleted = await deleteAllOrdersFromOrderProducts();

      // Handle error
      if (deleted === false) {
         console.error("An error occurred when trying to delete orders from products.");
         return res.status(400).end();
      }

      // Log success
      console.log("All orders have been deleted from products.");

      return res.status(200).end();
   }

   // Default success on any other method
   return res.status(200).end();
}
