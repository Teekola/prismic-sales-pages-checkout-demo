// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getProducts } from "../../../../prisma/product";

type Data = {
   name: string;
};

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<any>
) {
   const products = await getProducts();
   const data = {
      results_size: products.length,
      results: products,
   };
   res.status(200).json(data);
}
