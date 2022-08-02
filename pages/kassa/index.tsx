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
   useCheckoutFormData,
   useCheckoutDiscount,
   useSetCheckoutProviderForms,
   useSetCheckoutOrderId,
   useCheckoutOrderId,
} from "../../contexts/CheckoutContext";
import CheckoutLayout from "components/Checkout/checkoutLayout";
import { AnimatePresence } from "framer-motion";
import StyledCheckout from "components/Checkout/style";
import generateProviderData from "components/Checkout/Providers/data/generateProviderData";
import generateProviderForms from "components/Checkout/Providers/data/generateProviderForms";
import { FilledCheckoutFormDataT } from "components/Checkout/Providers/types";
import { DiscountT, Step } from "contexts/CheckoutContext/types";
import FennoaEmailInvoice from "components/Checkout/Providers/FennoaEmailInvoice/Page";
import Edenred from "components/Checkout/Providers/Edenred/Page";
import { KeyTextField, RichTextField } from "@prismicio/types";
import { Provider } from "components/Checkout/Providers/Paytrail/types";

interface CheckoutpageProps {
   title: string;
   formProps: {
      emailInstruction: string;
      phoneInstruction: string;
   };
   edenredPage: {
      title: KeyTextField;
      instructions: RichTextField;
   };
}

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN || "";

export default function Checkoutpage({ title, formProps, edenredPage }: CheckoutpageProps) {
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [mastercard, setMastercard] = useState<Provider>();
   const checkoutStep = useCheckoutStep();
   const checkoutProducts = useCheckoutProducts();
   const checkoutFormData = useCheckoutFormData();
   const checkoutDiscount = useCheckoutDiscount();
   const checkoutOrderId = useCheckoutOrderId();
   const setCheckoutProviderForms = useSetCheckoutProviderForms();
   const setCheckoutFormData = useSetCheckoutFormData();
   const setCheckoutStep = useSetCheckoutStep();
   const setCheckoutProducts = useSetCheckoutProducts();
   const setCheckoutDiscount = useSetCheckoutDiscount();
   const setCheckoutOrderId = useSetCheckoutOrderId();
   const setCheckoutReference = useSetCheckoutReference();

   // Update CheckoutContext Data From Session Storage
   // When Returning Back to The Checkout Page.
   useEffect(() => {
      const storageCheckoutStep = sessionStorage.getItem("checkoutStep") || "";
      const storageCheckoutProducts = JSON.parse(
         sessionStorage.getItem("checkoutProducts") || "[]"
      );
      const storageCheckoutFormData = JSON.parse(
         sessionStorage.getItem("checkoutFormData") || "{}"
      );
      const storageCheckoutDiscount = JSON.parse(
         sessionStorage.getItem("checkoutDiscount") || "{}"
      );
      const storageCheckoutOrderId = sessionStorage.getItem("checkoutOrderId") || "";

      setCheckoutOrderId(storageCheckoutOrderId);
      setCheckoutProducts(storageCheckoutProducts);
      setCheckoutFormData(storageCheckoutFormData);
      setCheckoutDiscount(storageCheckoutDiscount);
      if (["form", "providers", "emailInvoice", "edenred"].includes(storageCheckoutStep)) {
         setCheckoutStep(storageCheckoutStep as Step);
      }
      setIsLoaded(true);
   }, [
      setCheckoutStep,
      setCheckoutProducts,
      setCheckoutFormData,
      setCheckoutDiscount,
      setCheckoutOrderId,
   ]);

   // Recreate the Provider Forms HTML and update the order when data changes
   useEffect(() => {
      // Cleanup variable
      let isCancelled = false;

      // If there is no formdata or products, return
      if (Object.keys(checkoutFormData).length === 0 || checkoutProducts.length < 1) {
         return;
      }

      const generateAndSetProviderForms = async () => {
         // Create Provider Data
         const providerData = await generateProviderData(
            checkoutProducts,
            checkoutFormData as FilledCheckoutFormDataT,
            checkoutDiscount as DiscountT,
            setCheckoutReference
         );

         if (providerData.paytrail.status === "error") {
            setCheckoutProviderForms(<p>Paytrail Error!</p>);
            return;
         }

         // Get mastercard data for Edenred
         const mastercard = providerData.paytrail.providers.find(
            (provider) => provider.name === "Mastercard"
         );
         setMastercard(mastercard);

         // Create and Set Provider Forms
         const providerForms = generateProviderForms(providerData);
         setCheckoutProviderForms(providerForms);

         // Prevent updating multiple times in a row
         if (isCancelled) {
            return;
         }
         ////////////////////////////////////////////
         // Create or Update Order in the Database //
         ////////////////////////////////////////////

         // Create Order and Set Order Id
         if (checkoutOrderId === "") {
            const orderRes = await fetch(`${WEBSITE_URL}/api/db/orders`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  authorization: DATABASE_ACCESS_TOKEN,
               },
               body: JSON.stringify(providerData.data),
            });
            const order = await orderRes.json();
            setCheckoutOrderId(order.id);
         }
         // Update Order
         else {
            await fetch(`${WEBSITE_URL}/api/db/orders/${checkoutOrderId}`, {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
                  authorization: DATABASE_ACCESS_TOKEN,
               },
               body: JSON.stringify(providerData.data),
            });
         }
      };
      generateAndSetProviderForms();

      // Cleanup
      return () => {
         isCancelled = true;
      };

      // checkoutOrderId is not included in the dependency array
      // to prevent unnecessary rerender when creating order
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [
      checkoutDiscount,
      checkoutFormData,
      checkoutProducts,
      setCheckoutReference,
      setCheckoutProviderForms,
      setCheckoutOrderId,
   ]);

   // TODO: ADD SEO & Social TO PRISMIC
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
                     {checkoutStep === "providers" && <Providers />}
                     {checkoutStep === "emailInvoice" && <FennoaEmailInvoice />}
                     {checkoutStep === "edenred" && (
                        <Edenred
                           mastercard={mastercard}
                           title={edenredPage.title}
                           instructions={edenredPage.instructions}
                        />
                     )}
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
   const edenredPage = await client.getSingle("edenred_checkout_page");

   return {
      props: {
         title: document.data.title,
         formProps: {
            emailInstruction: document.data.emailInstruction,
            phoneInstruction: document.data.phoneInstruction,
         },
         edenredPage: {
            title: edenredPage.data.title,
            instructions: edenredPage.data.instructions,
         },
      },
   };
}
