import { Provider } from "components/Checkout/Providers/Paytrail/types";
import BackButton from "components/ui/BackButton";
import { useSetCheckoutStep } from "contexts/CheckoutContext";
import Head from "next/head";
import { KeyTextField, RichTextField } from "@prismicio/types";
import { PrismicRichText } from "@prismicio/react";
import { StyledContainer } from "./style";
import { useEffect } from "react";

type EdenredProps = {
   mastercard: Provider | undefined;
   title: KeyTextField;
   instructions: RichTextField;
};
export default function Edenred({ title, instructions, mastercard }: EdenredProps) {
   const setCheckoutStep = useSetCheckoutStep();

   // Browser Back Button
   useEffect(() => {
      const onPopstate = (event: PopStateEvent) => {
         setCheckoutStep("providers");
      };
      window.addEventListener("popstate", onPopstate);
      history.replaceState("edenred", "", "/kassa");

      return () => {
         window.removeEventListener("popstate", onPopstate);
      };
   }, [setCheckoutStep]);

   const handleBackButtonClick = () => {
      setCheckoutStep("providers");
   };

   return (
      <>
         <Head>
            <title>Eroonjumeista.fi: Maksa Edenredillä</title>
         </Head>
         <StyledContainer>
            <BackButton label="Takaisin" onClick={handleBackButtonClick} />
            <h1>{title}</h1>
            <PrismicRichText field={instructions} />

            {mastercard && (
               <form method="POST" action={mastercard.url}>
                  {mastercard.parameters &&
                     mastercard.parameters.map((param: { name: string; value: string }) => (
                        <input
                           key={param.name}
                           type="hidden"
                           name={param.name}
                           value={param.value}
                        />
                     ))}
                  <button
                     style={{ margin: "1rem 0" }}
                     className="primary-cta"
                     disabled={mastercard.url === null}
                  >
                     Maksa Edenredillä
                  </button>
               </form>
            )}
         </StyledContainer>
      </>
   );
}
