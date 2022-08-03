// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createProduct, deleteAllProducts, getProducts } from "prisma/product";

const PRISMIC_PRODUCTS_ENDPOINT = process.env.PRISMIC_PRODUCTS_ENDPOINT as string;
const PRISMIC_PRODUCTS_TOKEN = process.env.PRISMIC_PRODUCTS_TOKEN;
const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   // Authorize
   if (req.headers.authorization !== DATABASE_ACCESS_TOKEN) {
      return res.status(401).end();
   }

   // Get body
   const body = req.body;

   if (req.method === "GET") {
      // Get all products
      const products = await getProducts();

      // Handle error
      if (products === false) {
         console.error("An error occurred when trying to get products.");
         return res.status(400).end();
      }
      // Return products
      return res.status(200).json(products);
   }

   if (req.method === "POST") {
      // Create Product to database
      const product = await createProduct(body);

      // Handle error
      if (product === false) {
         console.error("An error occurred when trying to create product.");
         return res.status(400).end();
      }
      console.log("Product '" + product.id + "' was created to database.");

      // Body for pushing product to prismic
      const prismicProducts = [
         {
            id: product.id,
            title: product.name,
            description: product.type,
            image_url: product.imageUrl,
            last_update: Number(product.updatedAt),
            blob: product,
         },
      ];

      // Push created product to prismic
      const prismicRes = await fetch(PRISMIC_PRODUCTS_ENDPOINT, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${PRISMIC_PRODUCTS_TOKEN}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify(prismicProducts),
      });

      // Log error
      if (prismicRes.ok === false) {
         console.error("Failed to add product to Prismic.");
         return res.status(400).end();
      }

      // Log success
      console.log("Product '" + product.id + "' added to prismic.");
      return res.status(201).end();
   }

   if (req.method === "DELETE") {
      // Delete all Products
      const products = await deleteAllProducts();

      // Handle error
      if (products === false) {
         console.error("An error occurred when trying to delete products.");
         return res.status(400).end();
      }
      console.log("All products were deleted from the database.");

      // Delete all Products from Prismic
      const prismicRes = await fetch(`${PRISMIC_PRODUCTS_ENDPOINT}/reset`, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${PRISMIC_PRODUCTS_TOKEN}`,
            "Content-Type": "application/json",
         },
      });

      // Log error
      if (prismicRes.ok === false) {
         console.error("Failed delete prismic products.");
         return res.status(400).end();
      }

      // Log success
      console.log("All products were deleted from prismic.");
      return res.status(200).end();
   }

   return res.status(200).end();
}
