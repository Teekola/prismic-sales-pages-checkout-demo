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

   const prismicProducts: any = [];
   products.forEach((product) => {
      let pp: any = {};
      pp.id = "" + product.id;
      pp.title = product.name;
      pp.description = product.type;
      pp.image_url = product.image_url;
      pp.last_update = Number(product.createdAt);
      pp.blob = product;
      prismicProducts.push(pp);
   });

   prismicProducts.sort((a: any, b: any) =>
      a.last_update < b.last_update ? 1 : -1
   );

   const data = {
      results_size: products.length,
      results: prismicProducts,
   };
   res.status(200).json(data);
}
