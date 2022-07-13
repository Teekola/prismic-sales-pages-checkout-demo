import { createClient } from "../prismicio";
import Head from "next/head";
import Layout from "components/Layouts/landingPageLayout";
import Form from "components/Checkout/Form";

interface CheckoutpageProps {
   title: string;
}

export default function Checkoutpage({ title }: CheckoutpageProps) {
   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Kassa</title>
            <meta name="description" content="Eroonjumeista.fi Kassa" />
         </Head>
         <Layout>
            <h1>{title}</h1>
            <Form />
         </Layout>
      </>
   );
}

export async function getStaticProps({ previewData }: any) {
   const client = createClient({ previewData });

   const document = await client.getSingle("checkout-page");

   return {
      props: {
         title: document.data.title,
      },
   };
}
