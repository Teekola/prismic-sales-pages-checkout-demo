import { createClient } from "../../prismicio";
import Head from "next/head";
import Form from "components/Checkout/Form";
import Providers from "components/Checkout/Providers";
import Products from "components/Checkout/Products";
import { useEffect, useState } from "react";
import {
   useCheckoutStep,
   useSetCheckoutStep,
   useSetCheckoutProducts,
   useSetCheckoutFormData,
   useCheckoutProducts,
   useSetCheckoutDiscount,
   useSetCheckoutReference,
   useCheckoutReference,
   useCheckoutFormData,
   useCheckoutDiscount,
   useSetCheckoutTransactionReference,
} from "../../contexts/CheckoutContext";
import CheckoutLayout from "components/Checkout/checkoutLayout";
import { AnimatePresence } from "framer-motion";
import StyledCheckout from "components/Checkout/style";
import { generateCheckoutReference } from "components/Checkout/data/checkoutReference";
import generateProviderData from "components/Checkout/Providers/generateProviderData";
import generateProviderForms from "components/Checkout/Providers/generateProviderForms";
import { FilledCheckoutFormDataT } from "components/Checkout/Providers/types";
import { DiscountT } from "contexts/CheckoutContext/types";

interface CheckoutpageProps {
   title: string;
   formProps: {
      emailInstruction: string;
      phoneInstruction: string;
   };
}

export type ProviderFormsT = JSX.Element | JSX.Element[] | null;

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN || "";

export default function Checkoutpage({ title, formProps }: CheckoutpageProps) {
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [providerForms, setProviderForms] = useState<ProviderFormsT>(null);
   const checkoutStep = useCheckoutStep();
   const checkoutProducts = useCheckoutProducts();
   const checkoutFormData = useCheckoutFormData();
   const checkoutDiscount = useCheckoutDiscount();
   const checkoutReference = useCheckoutReference();
   const setCheckoutFormData = useSetCheckoutFormData();
   const setCheckoutStep = useSetCheckoutStep();
   const setCheckoutProducts = useSetCheckoutProducts();
   const setCheckoutDiscount = useSetCheckoutDiscount();
   const setCheckoutReference = useSetCheckoutReference();
   const setCheckoutTransactionReference = useSetCheckoutTransactionReference();

   // Update CheckoutContext Data From Session Storage
   // When Returning Back to The Checkout Page.
   useEffect(() => {
      const storageCheckoutStep = sessionStorage.getItem("checkoutStep");
      const storageCheckoutProducts = JSON.parse(
         sessionStorage.getItem("checkoutProducts") || "[]"
      );
      const storageCheckoutFormData = JSON.parse(
         sessionStorage.getItem("checkoutFormData") || "{}"
      );
      const storageCheckoutDiscount = JSON.parse(
         sessionStorage.getItem("checkoutDiscount") || "{}"
      );
      const storageCheckoutReference = sessionStorage.getItem("checkoutReference");
      const storageCheckoutTransactionReference = sessionStorage.getItem(
         "checkoutTransactionReference"
      );
      setCheckoutProducts(storageCheckoutProducts);
      setCheckoutFormData(storageCheckoutFormData);
      setCheckoutDiscount(storageCheckoutDiscount);

      if (storageCheckoutReference) {
         setCheckoutReference(storageCheckoutReference);
      } else {
         setCheckoutReference(generateCheckoutReference());
      }

      if (storageCheckoutTransactionReference) {
         setCheckoutTransactionReference(storageCheckoutTransactionReference);
      } else {
         setCheckoutTransactionReference(generateCheckoutReference());
      }

      if (storageCheckoutStep === "providers") {
         setCheckoutStep("providers");
      }
      setIsLoaded(true);
   }, [
      setCheckoutStep,
      setCheckoutProducts,
      setCheckoutFormData,
      setCheckoutDiscount,
      setCheckoutReference,
      setCheckoutTransactionReference,
      checkoutReference,
   ]);

   // Recreate the Provider Forms HTML and update the order when data changes
   useEffect(() => {
      // Cleanup variable
      let isCancelled = false;

      // If there is no formdata, products or reference, return
      if (
         Object.keys(checkoutFormData).length === 0 ||
         checkoutProducts.length < 1 ||
         checkoutReference === ""
      ) {
         return;
      }

      const generateAndSetProviderForms = async () => {
         // Create Provider Data
         const providerData = await generateProviderData(
            checkoutReference,
            checkoutProducts,
            checkoutFormData as FilledCheckoutFormDataT,
            checkoutDiscount as DiscountT,
            setCheckoutTransactionReference
         );

         if (providerData.paytrail.status === "error") {
            setProviderForms(<p>Paytrail Error!</p>);
            return;
         }

         // Create and Set Provider Forms
         const providerForms = generateProviderForms(providerData);
         setProviderForms(providerForms);

         // Prevent updating multiple times in a row
         if (isCancelled) {
            return;
         }
         //////////////////////////////////
         // Upsert Order in the Database //
         //////////////////////////////////
         await fetch(`${WEBSITE_URL}/api/db/orders/${checkoutReference}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               authorization: DATABASE_ACCESS_TOKEN,
            },
            body: JSON.stringify(providerData.upsert),
         });
      };
      generateAndSetProviderForms();

      // Cleanup
      return () => {
         isCancelled = true;
      };
   }, [
      checkoutDiscount,
      checkoutFormData,
      checkoutProducts,
      checkoutReference,
      setCheckoutTransactionReference,
   ]);

   // TODO: ADD SEO TO PRISMIC
   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Kassa</title>
            <meta name="description" content="Eroonjumeista.fi Kassa" />
         </Head>
         <StyledCheckout>
            <div className="checkout-info">
               <h2 style={{ fontSize: "2rem" }}>{title}</h2>
               <p>Vaihe {checkoutStep === "form" ? 1 : 2}/2</p>
            </div>
            {isLoaded && (
               <AnimatePresence exitBeforeEnter>
                  <CheckoutLayout>
                     {checkoutStep === "form" && <Form formProps={formProps} />}
                     {checkoutStep === "providers" && <Providers providerForms={providerForms} />}
                     {checkoutProducts.length > 0 && <Products />}
                  </CheckoutLayout>
               </AnimatePresence>
            )}
         </StyledCheckout>
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
