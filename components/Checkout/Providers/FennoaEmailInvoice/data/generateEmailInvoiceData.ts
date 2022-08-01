import { CheckoutFormDataT, ProductT } from "contexts/CheckoutContext/types";
import emailInvoicePng from "./emailInvoice.png";

export const generateEmailInvoiceData = (
   reference: string,
   products: ProductT[],
   checkoutFormData: CheckoutFormDataT,
   totalPrice: number,
   successRedirectUrl: string
) => {
   const emailInvoice = {
      name: "Sähköpostilasku",
      id: "emailInvoice",
      svg: emailInvoicePng.src,
      data: {
         customer: checkoutFormData,
         products,
         amount: totalPrice,
         reference,
      },
      successUrl: `${successRedirectUrl}?email-reference=${reference}`,
   };
   return emailInvoice;
};
