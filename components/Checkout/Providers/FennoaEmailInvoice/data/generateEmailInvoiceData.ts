import emailInvoicePng from "./emailInvoice.png";

export const generateEmailInvoiceData = () => {
   const emailInvoice = {
      name: "Sähköpostilasku",
      id: "emailInvoice",
      svg: emailInvoicePng.src,
   };
   return emailInvoice;
};
