// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getProducts } from "../../../../prisma/product";

type Data =
   | {
        results_size: Number;
        results: Array<PrismicProduct>;
     }
   | {
        message: string;
     };

type PrismicProduct = {
   id: string;
   title: string;
   description: string;
   image_url: string;
   last_update: Number;
   blob: object;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   // Basic Authorize Request
   const authorization: any = req.headers["Authorization"] || req.headers.authorization;

   if (!authorization) {
      return res.status(401).json({ message: "unauthorized" });
   }

   // Prismic has Basic Auth in which Access token replaces "username".
   // The "password" is omitted, but there is a colon as the last character.
   if (
      Buffer.from(authorization.split("Basic ")[1], "base64").toString("utf8") !==
      process.env.DATABASE_ACCESS_TOKEN + ":"
   ) {
      return res.status(401).json({ message: "unauthorized" });
   }
   const products = await getProducts();

   const prismicProducts: Array<PrismicProduct> = [];
   products.forEach((product) => {
      let pp: PrismicProduct = {
         id: product.id,
         title: product.name,
         description: product.type,
         image_url: product.imageUrl,
         last_update: Number(product.createdAt),
         blob: product,
      };
      prismicProducts.push(pp);
   });

   // Sort decending order based on last updated
   prismicProducts.sort((a: PrismicProduct, b: PrismicProduct) =>
      a.last_update < b.last_update ? 1 : -1
   );

   const data = {
      results_size: products.length,
      results: prismicProducts,
   };
   return res.status(200).json(data);
}