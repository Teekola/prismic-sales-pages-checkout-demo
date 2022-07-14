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
} from "../contexts/CheckoutContext";
import CheckoutLayout from "components/Checkout/checkoutLayout";

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
   const setCheckoutStep = useSetCheckoutStep();
   const setCheckoutProducts = useSetCheckoutProducts();

   // Check and set correct step when coming back from another page
   useEffect(() => {
      const storageCheckoutStep = sessionStorage.getItem("checkoutStep");
      if (storageCheckoutStep === "providers") {
         setCheckoutStep("providers");
      }
      setIsLoaded(true);
      // TOREMOVE: Temporarily add product
      setCheckoutProducts([
         {
            id: "1",
            name: "Niska-Hartian Ensiapupakkaus",
            type: "verkkokurssi",
            originalPrice: 4700,
            discountPrice: 3700,
            price: 3700,
            image_url:
               "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/719691/settings_images/1DKf5v6WTOuKvY4885RG_file.jpg",
            activation_url:
               "https://checkout.kajabi.com/webhooks/offers/LvWfev2Go3jvbCpN/238844/activatex?send_offer_grant_email=truex",
            createdAt: "2022-02-15T10:49:16.066Z",
            updatedAt: "2022-02-15T10:49:16.066Z",
            amount: 1,
         },
         {
            id: "2",
            name: "Niska-Hartian Ensiapupakkaus",
            type: "verkkokurssi",
            originalPrice: 4700,
            discountPrice: 3700,
            price: 3700,
            image_url:
               "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/719691/settings_images/1DKf5v6WTOuKvY4885RG_file.jpg",
            activation_url:
               "https://checkout.kajabi.com/webhooks/offers/LvWfev2Go3jvbCpN/238844/activatex?send_offer_grant_email=truex",
            createdAt: "2022-02-15T10:49:16.066Z",
            updatedAt: "2022-02-15T10:49:16.066Z",
            amount: 1,
         },
      ]);
   }, [setCheckoutStep, setCheckoutProducts]);
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
                  <CheckoutLayout>
                     {checkoutStep === "form" && <Form formProps={formProps} />}
                     {checkoutStep === "providers" && <Providers />}
                     <Products />
                  </CheckoutLayout>
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
