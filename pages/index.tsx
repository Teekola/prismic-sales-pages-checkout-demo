import { createClient } from "../prismicio";
import { SliceLike, SliceZone, SliceZoneLike } from "@prismicio/react";
import { components } from "../slices";

import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "components/layouts/landingPageLayout";
import { useEffect } from "react";

interface HomepageProps {
   title: string;
   slices: SliceZoneLike<SliceLike<string>> | undefined;
}

export default function Homepage({ title, slices }: HomepageProps) {
   const router = useRouter();

   // Temporarily always redirect to NHE
   useEffect(() => {
      router.push("/tuotteet/nhe");
   }, [router]);

   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Etusivu</title>
            <meta name="description" content="Eroonjumeista.fi Etusivu" />
         </Head>
         <Layout>
            <h1>{title}</h1>
            <SliceZone slices={slices} components={components} />
         </Layout>
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
