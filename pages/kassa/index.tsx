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
} from "../../contexts/CheckoutContext";
import CheckoutLayout from "components/Checkout/checkoutLayout";
import { AnimatePresence } from "framer-motion";
import StyledCheckout from "components/Checkout/style";
import { generateCheckoutReference } from "components/Checkout/data/checkoutReference";

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
   const checkoutProducts = useCheckoutProducts();
   const checkoutReference = useCheckoutReference();
   const setCheckoutFormData = useSetCheckoutFormData();
   const setCheckoutStep = useSetCheckoutStep();
   const setCheckoutProducts = useSetCheckoutProducts();
   const setCheckoutDiscount = useSetCheckoutDiscount();
   const setCheckoutReference = useSetCheckoutReference();

   // Check and set correct step when coming back from another page
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
      setCheckoutProducts(storageCheckoutProducts);
      setCheckoutFormData(storageCheckoutFormData);
      setCheckoutDiscount(storageCheckoutDiscount);

      if (storageCheckoutReference) {
         setCheckoutReference(storageCheckoutReference);
      } else {
         setCheckoutReference(generateCheckoutReference());
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
      checkoutReference,
   ]);

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
