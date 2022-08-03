// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const DATABASE_ACCESS_TOKEN = process.env.DATABASE_ACCESS_TOKEN;

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
      // TODO: Get Customer
   }

   if (req.method === "PATCH") {
      // TODO: Update Customer
   }

   if (req.method === "DELETE") {
      // TODO: Delete Customer
   }
   return res.status(200).end();
}
