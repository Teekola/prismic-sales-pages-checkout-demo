// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteOrder, upsertOrder } from "prisma/order";
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
   const { reference } = req.query;
   const orderReference = reference?.toString() || "";

   if (req.method === "GET") {
      // TODO: Return specific order
   }

   const body = req.body;
   if (req.method === "PUT") {
      // Upsert order
      const { update, create } = body;
      const created = await upsertOrder(orderReference, update, create);

      // Handle Error
      if (created === null) {
         console.log("Order upsert failed.");
         return res.status(500).end();
      }

      // Return status
      if (created) {
         console.log("Order " + orderReference + " was created.");
         return res.status(201).end();
      } else {
         console.log("Order " + orderReference + " was updated.");
         return res.status(204).end();
      }
   }

   if (req.method === "PATCH") {
      // TODO: Update order
   }

   if (req.method === "DELETE") {
      // Delete specific order from all products
      const deletedFromProducts = await deleteOrderFromProducts(orderReference);

      // Log error
      if (!deletedFromProducts) {
         console.log("Order deletion failed from products.");
         return res.status(500).end();
      }

      // Delete specific order
      const deleted = await deleteOrder(orderReference);

      // Log error
      if (!deleted) {
         console.log("Order deletion failed.");
         return res.status(500).end();
      }

      // Log success
      console.log("Order " + orderReference + " was deleted.");
      return res.status(200).end();
   }
   return res.status(200).end();
}
