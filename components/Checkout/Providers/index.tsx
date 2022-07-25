import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";
import { useSetCheckoutStep } from "contexts/CheckoutContext";
import { StyledContainer } from "./styles";
import { useEffect } from "react";

import { ProviderFormsT } from "pages/kassa";
export type ProvidersProps = {
   providerForms: ProviderFormsT;
};

export default function Providers({ providerForms }: ProvidersProps) {
   const setCheckoutStep = useSetCheckoutStep();

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
         {providerForms === null && (
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
