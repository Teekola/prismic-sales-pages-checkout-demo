import { createClient } from "../prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "../slices";

import Head from "next/head";

export default function Homepage({ slices }: any) {
   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Etusivu</title>
            <meta name="description" content="Eroonjumeista.fi Etusivu" />
         </Head>
         <SliceZone slices={slices} components={components} />
      </>
   );
}

export async function getStaticProps({ previewData }: any) {
   const client = createClient({ previewData });

   const document = await client.getSingle("home-page");

   return {
      props: {
         slices: document.data.slices,
      },
   };
}
