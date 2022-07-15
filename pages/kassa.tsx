import { createClient } from "../prismicio";
import Head from "next/head";
import Layout from "components/layouts/landingPageLayout";
import Form from "components/Checkout/Form";
import Providers from "components/Checkout/Providers";
import Products from "components/Checkout/Products";
import { useEffect, useState } from "react";
import {
   useCheckoutStep,
   useSetCheckoutStep,
   useSetCheckoutProducts,
   useSetCheckoutFormData,
} from "../contexts/CheckoutContext";
import CheckoutLayout from "components/Checkout/checkoutLayout";
import { AnimatePresence } from "framer-motion";

interface CheckoutpageProps {
   title: string;
   formProps: {
      emailInstruction: string;
      phoneInstruction: string;
   };
}

export default function Checkoutpage({ title, formProps }: CheckoutpageProps) {
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const checkoutStep = useCheckoutStep();
   const setCheckoutFormData = useSetCheckoutFormData();
   const setCheckoutStep = useSetCheckoutStep();
   const setCheckoutProducts = useSetCheckoutProducts();

   // Check and set correct step when coming back from another page
   useEffect(() => {
      // TODO: OPTIMOI KÄYTTÄMÄLLÄ CHECKOUTPROVIDERIN DATAA, JOS SE LÖYTYY JA VASTA MUUTOIN STORAGESTA
      const storageCheckoutStep = sessionStorage.getItem("checkoutStep");
      const storageCheckoutProducts = JSON.parse(
         sessionStorage.getItem("checkoutProducts") || "[]"
      );
      const storageCheckoutFormData = JSON.parse(
         sessionStorage.getItem("checkoutFormData") || "{}"
      );
      setCheckoutProducts(storageCheckoutProducts);
      setCheckoutFormData(storageCheckoutFormData);
      if (storageCheckoutStep === "providers") {
         setCheckoutStep("providers");
      }
      setIsLoaded(true);
   }, [setCheckoutStep, setCheckoutProducts, setCheckoutFormData]);

   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Kassa</title>
            <meta name="description" content="Eroonjumeista.fi Kassa" />
         </Head>
         <Layout>
            <h2 style={{ fontSize: "2rem" }}>{title}</h2>
            {isLoaded && (
               <>
                  <p style={{ position: "absolute", left: 0, top: 0 }}>Vaihe: {checkoutStep}</p>
                  <AnimatePresence exitBeforeEnter>
                     <CheckoutLayout>
                        {checkoutStep === "form" && <Form formProps={formProps} />}
                        {checkoutStep === "providers" && <Providers />}
                        <Products />
                     </CheckoutLayout>
                  </AnimatePresence>
               </>
            )}
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
