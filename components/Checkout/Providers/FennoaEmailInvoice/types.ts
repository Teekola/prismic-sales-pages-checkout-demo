import { CheckoutFormDataT, ProductT } from "contexts/CheckoutContext/types";

export type EmailInvoiceT = {
   name: string;
   svg: string;
   data: {
      customer: CheckoutFormDataT;
      products: ProductT[];
      amount: number;
      reference: string;
   };
   successUrl: string;
};

export type EmailInvoiceFormProps = EmailInvoiceT & {
   variants: {
      initial: object;
      animate: object;
      exit: object;
   };
};
