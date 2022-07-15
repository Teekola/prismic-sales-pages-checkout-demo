import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";
import {
   useCheckoutDiscount,
   useCheckoutFormData,
   useCheckoutProducts,
   useSetCheckoutStep,
} from "contexts/CheckoutContext";
import { StyledContainer } from "./styles";
import { useEffect, useState } from "react";
import generateProviderData from "./generateProviderData";
import generateProviderForms from "./generateProviderForms";
import { FilledCheckoutFormDataT } from "./types";

export default function Providers() {
   const [providerForms, setProviderForms] = useState<JSX.Element | JSX.Element[] | null>(null);
   const [providerSelected, setProviderSelected] = useState(false);
   const [selectedProviderPosition, setSelectedProviderPosition] = useState(null);

   const checkoutProducts = useCheckoutProducts();
   const checkoutDiscount = useCheckoutDiscount();
   const checkoutFormData = useCheckoutFormData();
   const setCheckoutStep = useSetCheckoutStep();

   // Recreate the Provider Forms HTML when the providerData or the orderData changes
   useEffect(() => {
      let isCancelled = false;
      const generateAndSetProviderForms = async () => {
         // Create Provider Data
         const providerData = await generateProviderData(
            checkoutProducts,
            checkoutFormData as FilledCheckoutFormDataT,
            checkoutDiscount
         );

         // Create Provider Forms
         const providerForms = generateProviderForms(providerData);
         setProviderForms(providerForms);
      };
      generateAndSetProviderForms();

      // Cleanup
      return () => {
         isCancelled = true;
      };
   }, [checkoutDiscount, checkoutFormData, checkoutProducts]);
   return (
      <StyledContainer>
         <h1>Valitse maksutapa</h1>
         <BackButton label="Takaisin" onClick={() => setCheckoutStep("form")} />
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
         <p>Ladataan maksutapoja...</p>
         <Loader />
         {providerForms}
      </StyledContainer>
   );
}
