import { createClient, linkResolver } from "../../prismicio";
import { SliceLike, SliceZone, SliceZoneLike } from "@prismicio/react";
import { components } from "../../slices";
import * as prismicH from "@prismicio/helpers";

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

   return {
      props: {
         slices: productPage.data.slices,
         product: productPage.data.integrationField,
      },
   };
};
