import { createClient, linkResolver } from "../../prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "../../slices";
import * as prismicH from "@prismicio/helpers";

import { GetStaticProps } from "next";
import Layout from "components/productPageLayout";

export default function ProductPage({ slices }: any) {
   return (
      <Layout>
         <SliceZone slices={slices} components={components} />
      </Layout>
   );
}

export async function getStaticPaths() {
   const client = createClient();
   const productPages = await client.getAllByType("product-page");
   return {
      paths: productPages.map((course: any) =>
         prismicH.asLink(course, linkResolver)
      ),
      fallback: false,
   };
}

export const getStaticProps: GetStaticProps = async ({
   params,
   previewData,
}: any) => {
   const client = createClient({ previewData });
   const productPage = await client.getByUID("product-page", params.uid);

   return {
      props: {
         slices: productPage.data.slices,
      },
   };
};
