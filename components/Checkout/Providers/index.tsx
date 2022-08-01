import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";
import { useCheckoutProviderForms, useSetCheckoutStep } from "contexts/CheckoutContext";
import { StyledContainer } from "./styles";
import { useEffect } from "react";
import Head from "next/head";

export default function Providers() {
   const setCheckoutStep = useSetCheckoutStep();
   const checkoutProviderForms = useCheckoutProviderForms();

   // Browser Back Button
   useEffect(() => {
      const onPopstate = (event: PopStateEvent) => {
         setCheckoutStep("form");
      };
      window.addEventListener("popstate", onPopstate);

      console.log(history.state);

      if (history.state === "form") {
         history.pushState("providers", "", "/kassa");
      } else {
         history.replaceState("providers", "", "/kassa");
      }

      return () => {
         window.removeEventListener("popstate", onPopstate);
      };
   }, [setCheckoutStep]);

   return (
      <>
         <Head>
            <title>Eroonjumeista.fi Kassa Maksutavan Valinta</title>
         </Head>
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
            {checkoutProviderForms === null && (
               <>
                  <p>Ladataan maksutapoja...</p>
                  <Loader />
               </>
            )}
            {checkoutProviderForms}
            <BackButton
               label="Takaisin"
               onClick={() => {
                  setCheckoutStep("form");
               }}
            />
         </StyledContainer>
      </>
   );
}
