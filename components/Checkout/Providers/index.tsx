import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";
import {
   useCheckoutDiscount,
   useCheckoutFormData,
   useCheckoutProducts,
   useCheckoutReference,
   useSetCheckoutReference,
   useSetCheckoutStep,
} from "contexts/CheckoutContext";
import { StyledContainer } from "./styles";
import { useEffect, useState } from "react";
import generateProviderData from "./generateProviderData";
import generateProviderForms from "./generateProviderForms";
import { FilledCheckoutFormDataT } from "./types";

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export default function Providers() {
   const [providerForms, setProviderForms] = useState<JSX.Element | JSX.Element[] | null>(null);
   const checkoutProducts = useCheckoutProducts();
   const checkoutDiscount = useCheckoutDiscount();
   const checkoutFormData = useCheckoutFormData();
   const checkoutReference = useCheckoutReference();
   const setCheckoutStep = useSetCheckoutStep();

   // Recreate the Provider Forms HTML and update the order when data changes
   useEffect(() => {
      const generateAndSetProviderForms = async () => {
         // Create Provider Data
         const providerData = await generateProviderData(
            checkoutProducts,
            checkoutFormData as FilledCheckoutFormDataT,
            checkoutDiscount
         );

         // Create and Set Provider Forms
         const providerForms = generateProviderForms(providerData);
         setProviderForms(providerForms);

         // TODO: CREATE / UPDATE => UPSERT ORDER INTO DATABASE
      };
      generateAndSetProviderForms();
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
