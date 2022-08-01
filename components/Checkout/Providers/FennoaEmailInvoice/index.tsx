import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSetCheckoutStep } from "contexts/CheckoutContext";
import UserForm from "components/Checkout/Providers/FennoaEmailInvoice/UserForm";
import BackButton from "components/ui/BackButton";
import Loader from "components/ui/Loader";

// TODO: OMAAN TIEDOSTOON?
const StyledPage = styled(motion.div)`
   display: flex;
   flex-direction: column;
   &[data-is-sending="true"] {
      justify-content: center;
   }
   &[data-is-sending="false"] {
      justify-content: space-between;
   }
   gap: 1rem;
   width: 100%;
   max-width: 600px;

   .h2 {
      font-size: clamp(2rem, 10vw, 3rem);
      line-height: 1.25;
   }
`;

export default function FennoaEmailInvoice() {
   const router = useRouter();
   const [dueDate, setDueDate] = useState<Date>();
   const [isSending, setIsSending] = useState<boolean>(false);
   const setCheckoutStep = useSetCheckoutStep();

   // Set invoice duedate
   useEffect(() => {
      const currentDate = new Date();
      const dueDateDate = new Date(currentDate.setDate(currentDate.getDate() + 14));
      setDueDate(dueDateDate);
   }, []);

   // Scroll to top
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // Change Browser's back-button functionality
   useEffect(() => {
      window.onpopstate = () => {
         setCheckoutStep("providers");
         router.push("/kassa");
      };
      history.pushState({}, "", router.asPath);
   }, [setCheckoutStep, router]);

   // Change view on back button click
   const handleBackButtonClick = () => {
      setCheckoutStep("providers");
      router.push("/kassa");
   };

   const variants = {
      page: {
         visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
         enter: { opacity: 0, x: -10, transition: { duration: 0.15 } },
         exit: { opacity: 0, x: 10, transition: { duration: 0.05 } },
      },
   };

   // TODO: PRISMICIIN MUOKATTAVAKSI
   return (
      <StyledPage
         key="emailInvoicePage"
         initial="enter"
         animate="visible"
         exit="exit"
         variants={variants.page}
         data-is-sending={isSending.toString()}
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
         {dueDate && (
            <UserForm dueDate={dueDate} isSending={isSending} setIsSending={setIsSending} />
         )}
         {!isSending && <BackButton onClick={handleBackButtonClick} label="Takaisin" />}

         {isSending && (
            <>
               <p>
                  Lähetetään laskua. <strong>Ethän sulje välilehteä.</strong>
               </p>
               <Loader />
            </>
         )}
      </StyledPage>
   );
}
