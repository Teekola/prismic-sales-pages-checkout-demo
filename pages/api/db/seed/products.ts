// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createProduct, getProducts } from "prisma/product";

type Data = {
   name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   if (req.method === "GET") {
      const products = await getProducts();
      console.log(products);
      return res.status(200).end();
   }
   if (req.method === "POST") {
      // Create Product
      const product = await createProduct(req.body);
      console.log(product);
      return res.status(201).end();
   }
   return res.status(200).json({ name: "John Doe" });
}
