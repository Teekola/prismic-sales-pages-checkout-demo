import { createClient, linkResolver } from "../../prismicio";
import { SliceLike, SliceZone, SliceZoneLike } from "@prismicio/react";
import { components } from "../../slices";
import * as prismicH from "@prismicio/helpers";
import { Slice, KeyTextField } from "@prismicio/types";

import { GetStaticProps } from "next";
import Head from "next/head";
import Layout from "components/layouts/productPageLayout";
import { ProductT } from "contexts/CheckoutContext/types";

interface ProductPageProps {
   slices: SliceZoneLike<SliceLike<string>> | undefined;
   metaTitle: KeyTextField;
   metaDescription: KeyTextField;
}

export default function ProductPage({ slices, metaTitle, metaDescription }: ProductPageProps) {
   return (
      <>
         <Head>
            <title>{metaTitle || "Eroonjumeista.fi"}</title>
            <meta name="description" content={metaDescription || "Eroonjumeista.fi"} />
         </Head>
         <Layout>
            <div className="ddio_countdown_wrap"></div>
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

   // Get product from the integrationfield and add missing
   // quantity and discountPrice
   const databaseProduct = productPage.data.integrationField;
   const product: ProductT = {
      ...databaseProduct,
      quantity: 1,
      discountPrice: databaseProduct.price,
   };

   // TODO: Maybe this should be limited some way? Maybe the product integration field
   // should rather be included in each slice that needs the data directly.
   // Add productdata to cta slices
   const slices = productPage.data.slices.map((slice: Slice) =>
      slice.slice_type === "call_to_action_section"
         ? { ...slice, primary: { ...slice.primary, product } }
         : { ...slice }
   );

   return {
      props: {
         slices,
         metaTitle: productPage.data.metaTitle,
         metaDescription: productPage.data.metaDescription,
      },
   };
};
