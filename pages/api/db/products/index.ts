// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createProduct, deleteAllProducts, getProducts } from "prisma/product";

type Data = {
   products: Array<any>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method === "GET") {
      const products = await getProducts();
      return res.status(200).json({ products });
   }
   if (req.method === "POST") {
      // Create Product
      const product = await createProduct(req.body);
      console.log(product);
      return res.status(201).end();
   }

   if (req.method === "DELETE") {
      // Delete all Products
      await deleteAllProducts();
      return res.status(200).end();
   }

   return res.status(200).end();
}
