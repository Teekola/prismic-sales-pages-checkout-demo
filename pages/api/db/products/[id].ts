// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteProduct, getProduct, updateProduct } from "prisma/product";

const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN;
const PRISMIC_PRODUCTS_ENDPOINT = process.env.PRISMIC_PRODUCTS_ENDPOINT;
const PRISMIC_PRODUCTS_TOKEN = process.env.PRISMIC_PRODUCTS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }

   // Get id and body
   const { id } = req.query;
   const body = req.body;
   if (typeof id !== "string") {
      console.error("Id is missing.");
      return res.status(400).end();
   }

   if (req.method === "GET") {
      // Return product based on id
      const where = { id };
      const product = await getProduct(where);

      // Handle error
      if (product === false) {
         console.error("An error occurred when trying to get product.");
         return res.status(500).end();
      }
      // Handle not found
      if (product === null) {
         console.log("Product", id, "was not found.");
         return res.status(404).end();
      }
      // Return product on success
      return res.status(200).json(product);
   }

   if (req.method === "PATCH") {
      // Update product
      const product = await updateProduct(body, { id });

      // Handle error
      if (product === false) {
         console.error("An error occurred when trying to update product.");
         return res.status(400).end();
      }
      console.log("Product " + id + " was updated.");
      // Return product on success
      return res.status(200).json(product);
   }

   if (req.method === "DELETE") {
      // Delete product
      const product = await deleteProduct(id);
      console.log("Product " + id + " was deleted.");

      // Delete Product from Prismic
      const prismicRes = await fetch(`${PRISMIC_PRODUCTS_ENDPOINT}/deleteItems`, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${PRISMIC_PRODUCTS_TOKEN}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify([id]),
      });

      // Log error
      if (prismicRes.ok === false) {
         console.error("Failed delete prismic product.");
         return res.status(400).end();
      }
      // Return product on success
      return res.status(200).json(product);
   }
}
