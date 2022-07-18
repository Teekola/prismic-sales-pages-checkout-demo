// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { upsertOrder } from "prisma/order";

type Data = {
   name: any;
};
const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }

   const { reference } = req.query;

   if (req.method === "GET") {
      // Return specific order
   }

   const body = req.body;
   if (req.method === "PUT") {
      // Upsert order
      const { reference, update, create } = body;
      const created = await upsertOrder(reference, update, create);

      // Handle Error
      if (created === null) {
         console.log("Order upsert failed.");
         return res.status(500).end();
      }

      // Return Created 201
      if (created) {
         console.log("Order " + reference + " was created.");
         return res.status(201).end();
      } else {
         console.log("Order " + reference + " was updated.");
         return res.status(204).end();
      }
   }

   if (req.method === "PATCH") {
      // Update order
   }
   return res.status(200).json({ name: "John Doe" });
}
