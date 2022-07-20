// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createProduct, deleteAllProducts, getProducts } from "prisma/product";

const PRISMIC_PRODUCTS_ENDPOINT =
   "https://if-api.prismic.io/if/write/eroonjumeista--product_catalog";
const PRISMIC_PRODUCTS_TOKEN = process.env.PRISMIC_PRODUCTS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
   if (req.method === "GET") {
      const products = await getProducts();
      return res.status(200).json({ products });
   }

   if (req.method === "POST") {
      // Create Product to database
      const product = await createProduct(req.body);
      console.log(product);

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

      // Log error if deletion fails
      if (!prismicRes.ok) {
         console.error("Failed to add product to Prismic.");
      } else {
         console.log("Product '" + product.name + "' added to prismic.");
      }

      return res.status(201).end();
   }

   if (req.method === "DELETE") {
      // Delete all Products
      await deleteAllProducts();
      console.log("All products were deleted from the database.");

      // Delete all Products from Prismic
      const prismicRes = await fetch(`${PRISMIC_PRODUCTS_ENDPOINT}/reset`, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${PRISMIC_PRODUCTS_TOKEN}`,
            "Content-Type": "application/json",
         },
      });

      // Log error if deletion fails
      if (!prismicRes.ok) {
         console.error("Failed delete prismic products.");
      } else {
         console.log("All products were deleted from prismic.");
      }

      return res.status(200).end();
   }

   return res.status(200).end();
}
