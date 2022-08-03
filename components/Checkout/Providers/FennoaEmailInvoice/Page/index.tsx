import { useEffect, useState } from "react";
import { useSetCheckoutStep } from "contexts/CheckoutContext";
import InvoiceForm from "components/Checkout/Providers/FennoaEmailInvoice/Page/InvoiceForm";
import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";
import { StyledContainer } from "./style";
import { KeyTextField, RichTextField } from "@prismicio/types";
import * as prismicH from "@prismicio/helpers";
import { PrismicRichText } from "@prismicio/react";

type FennoaEmailInvoiceProps = {
   title: KeyTextField;
   instructions: RichTextField;
   sendingMessage: RichTextField;
};

export default function FennoaEmailInvoice({
   title,
   instructions,
   sendingMessage,
}: FennoaEmailInvoiceProps) {
   const [isSending, setIsSending] = useState<boolean>(false);
   const setCheckoutStep = useSetCheckoutStep();

   // Set invoice duedate
   const currentDate = new Date();
   const dueDate = new Date(currentDate.setDate(currentDate.getDate() + 14));
   const dueDateString = `${dueDate.getDate()}.${dueDate.getMonth() + 1}.${dueDate.getFullYear()}`;
   const injectedInstructions = prismicH
      .asHTML(instructions)
      .replace(/{{dueDate}}/g, dueDateString);

   // Browser Back Button
   useEffect(() => {
      const onPopstate = (event: PopStateEvent) => {
         setCheckoutStep("providers");
      };
      window.addEventListener("popstate", onPopstate);
      history.replaceState("emailInvoice", "", "/kassa");

      return () => {
         window.removeEventListener("popstate", onPopstate);
      };
   }, [setCheckoutStep]);

   // Scroll to top
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // Change view on back button click
   const handleBackButtonClick = () => {
      setCheckoutStep("providers");
   };

   const variants = {
      visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
      enter: { opacity: 0, x: -10, transition: { duration: 0.15 } },
      exit: { opacity: 0, x: 10, transition: { duration: 0.05 } },
   };

   // TODO: PRISMICIIN MUOKATTAVAKSI
   return (
      <StyledContainer
         key="emailInvoiceContainer"
         initial="enter"
         animate="visible"
         exit="exit"
         variants={variants}
      >
         {!isSending && (
            <>
               <BackButton onClick={handleBackButtonClick} label="Takaisin" />

               <h1>{title}</h1>
               <div dangerouslySetInnerHTML={{ __html: injectedInstructions }}></div>
            </>
         )}
         <InvoiceForm dueDate={dueDate} isSending={isSending} setIsSending={setIsSending} />

         {isSending && (
            <>
               <PrismicRichText field={sendingMessage} />
               <Loader />
            </>
         )}
      </StyledContainer>
   );
}
