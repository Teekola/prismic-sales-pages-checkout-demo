import { createClient } from "../prismicio";
import Head from "next/head";
import Layout from "components/Layouts/landingPageLayout";
import Form from "components/Checkout/Form";
import Providers from "components/Checkout/Providers";

import { useCheckoutStep } from "../contexts/checkoutContext";

interface CheckoutpageProps {
   title: string;
   formProps: {
      emailInstruction: string;
      phoneInstruction: string;
   };
}

export default function Checkoutpage({ title, formProps }: CheckoutpageProps) {
   const checkoutStep = useCheckoutStep();
   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Kassa</title>
            <meta name="description" content="Eroonjumeista.fi Kassa" />
         </Head>
         <Layout>
            <p>Vaihe: {checkoutStep}</p>
            <h1>{title}</h1>
            {checkoutStep === "form" && <Form formProps={formProps} />}
            {checkoutStep === "providers" && <Providers />}
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
         formProps: {
            emailInstruction: document.data.emailInstruction,
            phoneInstruction: document.data.phoneInstruction,
         },
      },
   };
}
