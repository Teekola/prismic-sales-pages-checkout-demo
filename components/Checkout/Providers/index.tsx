import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";
import {
   useCheckoutDiscount,
   useCheckoutFormData,
   useCheckoutProducts,
   useCheckoutReference,
   useSetCheckoutStep,
} from "contexts/CheckoutContext";
import { StyledContainer } from "./styles";
import { useEffect, useState } from "react";
import generateProviderData from "./generateProviderData";
import generateProviderForms from "./generateProviderForms";
import { FilledCheckoutFormDataT } from "./types";

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN || "";

export default function Providers() {
   const [providerForms, setProviderForms] = useState<JSX.Element | JSX.Element[] | null>(null);
   const checkoutProducts = useCheckoutProducts();
   const checkoutDiscount = useCheckoutDiscount();
   const checkoutFormData = useCheckoutFormData();
   const checkoutReference = useCheckoutReference();
   const setCheckoutStep = useSetCheckoutStep();

   // Recreate the Provider Forms HTML and update the order when data changes
   useEffect(() => {
      // Cleanup variable
      let isCancelled = false;
      const generateAndSetProviderForms = async () => {
         // Create Provider Data
         const providerData = await generateProviderData(
            checkoutReference,
            checkoutProducts,
            checkoutFormData as FilledCheckoutFormDataT,
            checkoutDiscount
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
         console.log("UPSERT");

         // Upsert order into database
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
   }, [checkoutDiscount, checkoutFormData, checkoutProducts, checkoutReference]);

   // Browser History
   useEffect(() => {
      history.pushState("Maksutavan valinta", "");
      window.onpopstate = () => {
         setCheckoutStep("form");
         sessionStorage.setItem("checkoutStep", "form");
      };
      // Cleanup the entry on rerender
      return () => {
         history.back();
      };
   }, [setCheckoutStep]);

   return (
      <StyledContainer>
         <h1>Valitse maksutapa</h1>
         <p className="terms">
            Valitsemalla maksutavan hyväksyt{" "}
            <a
               href="https://www.paytrail.com/kuluttaja/maksupalveluehdot"
               target="_blank"
               rel="noopener noreferrer"
            >
               maksupalveluehdot
            </a>
            .
         </p>
         {!providerForms && (
            <>
               <p>Ladataan maksutapoja...</p>
               <Loader />
            </>
         )}
         {providerForms}
         <BackButton
            label="Takaisin"
            onClick={() => {
               setCheckoutStep("form");
               history.back();
            }}
         />
      </StyledContainer>
   );
}
