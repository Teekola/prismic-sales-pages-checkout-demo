import { useEffect, useState } from "react";
import { useSetCheckoutStep } from "contexts/CheckoutContext";
import UserForm from "components/Checkout/Providers/FennoaEmailInvoice/Page/InvoiceForm";
import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";
import { StyledContainer } from "./style";

export default function FennoaEmailInvoice() {
   const [isSending, setIsSending] = useState<boolean>(false);
   const setCheckoutStep = useSetCheckoutStep();

   // Set invoice duedate
   const currentDate = new Date();
   const dueDate = new Date(currentDate.setDate(currentDate.getDate() + 14));

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
               <h1>Täytä puuttuvat laskun tiedot</h1>
               <p>
                  Täytä allaolevat kentät ja paina lähetä lasku -painiketta. Lasku lähetetään
                  automaattisesti antamaasi sähköpostiosoitteeseen. Maksuaikaa on 14 päivää.{" "}
                  <strong>
                     Eräpäivä on{" "}
                     {dueDate &&
                        `${dueDate.getDate()}.${dueDate.getMonth() + 1}.${dueDate.getFullYear()}`}
                  </strong>
               </p>
            </>
         )}
         <UserForm dueDate={dueDate} isSending={isSending} setIsSending={setIsSending} />
         {!isSending && <BackButton onClick={handleBackButtonClick} label="Takaisin" />}

         {isSending && (
            <>
               <p>
                  Lähetetään laskua. <strong>Ethän sulje välilehteä.</strong>
               </p>
               <Loader />
            </>
         )}
      </StyledContainer>
   );
}
