import { createClient, linkResolver } from "../../prismicio";
import { SliceLike, SliceZone, SliceZoneLike } from "@prismicio/react";
import { components } from "../../slices";
import * as prismicH from "@prismicio/helpers";
import { Slice } from "@prismicio/types";

import { GetStaticProps } from "next";
import Head from "next/head";
import Layout from "components/layouts/productPageLayout";

interface ProductPageProps {
   slices: SliceZoneLike<SliceLike<string>> | undefined;
}

export default function ProductPage({ slices }: ProductPageProps) {
   return (
      <>
         <Head>
            <title>Eroonjumeista.fi</title>
            <meta name="description" content="Eroonjumeista.fi" />
         </Head>
         <Layout>
            <SliceZone slices={slices} components={components} />
         </Layout>
      </>
   );
}

export async function getStaticPaths() {
   const client = createClient();
   const productPages = await client.getAllByType("product-page");
   return {
      paths: productPages.map((course: any) => prismicH.asLink(course, linkResolver)),
      fallback: false,
   };
}

export const getStaticProps: GetStaticProps = async ({ params, previewData }: any) => {
   const client = createClient({ previewData });
   const productPage = await client.getByUID("product-page", params.uid);

   // TODO: Remove below when there is
   // Proper Data In Database so no modifications are needed
   // Modify product to fit the type
   const databaseProduct = productPage.data.integrationField;
   const product = {
      id: databaseProduct.id.toString(),
      name: databaseProduct.name,
      type: databaseProduct.type,
      originalPrice: databaseProduct.originalPrice,
      price: databaseProduct.price,
      discountPrice: databaseProduct.price,
      quantity: 1,
      imageUrl:
         databaseProduct.imageUrl ||
         "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149406054/settings_images/XXOMbqhTBmXubMuk7hhg_c9b54f34-b54f-490d-9eca-a9c1d01357d5.jpg",
      activationUrl: databaseProduct.activationUrl || "",
      createdAt: databaseProduct.createdAt,
      updatedAt: databaseProduct.updatedAt,
   };

   console.log(product);

   // Add productdata to cta slices
   const slices = productPage.data.slices.map((slice: Slice) =>
      slice.slice_type === "call_to_action_section"
         ? { ...slice, primary: { ...slice.primary, product } }
         : { ...slice }
   );

   return {
      props: {
         slices,
         product: productPage.data.integrationField,
      },
   };
};
