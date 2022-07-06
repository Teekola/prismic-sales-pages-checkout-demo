import { createClient } from "../prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "../slices";

import Head from "next/head";

export default function Homepage({ title, slices }: any) {
   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Etusivu</title>
            <meta name="description" content="Eroonjumeista.fi Etusivu" />
         </Head>
         <h1>{title}</h1>
         <SliceZone slices={slices} components={components} />
      </>
   );
}

export async function getStaticProps({ previewData }: any) {
   const client = createClient({ previewData });

   const document = await client.getSingle("home-page");

   return {
      props: {
         title: document.data.title,
         slices: document.data.slices,
      },
   };
}
