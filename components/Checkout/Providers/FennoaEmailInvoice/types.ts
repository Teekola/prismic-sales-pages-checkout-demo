import { ProductT } from "contexts/CheckoutContext/types";
import { VatPercentage } from "../types";

export type EmailInvoiceT = {
   name: string;
   id: string;
   svg: string;
};

export type EmailInvoiceFormProps = EmailInvoiceT & {
   variants: {
      initial: object;
      animate: object;
      exit: object;
   };
};

export type InvoiceFormFields = {
   name: string;
   email: string;
   address: string;
   postalcode: string;
   country: string;
   city: string;
};

export type FennoaInvoiceRow = {
   product_no: string;
   name: ProductT["name"];
   description: ProductT["type"];
   price: number;
   quantity: number;
   vatpercent: VatPercentage;
   discount_percent: 0;
};

export type FennoaInvoiceRowKey = keyof FennoaInvoiceRow;

export type FennoaFormData = {
   name: string;
   address: string;
   postalcode: string;
   city: string;
   country: string;
   invoice_date: string;
   due_date: string;
   einvoice_address: string;
   delivery_method: "email";
   currency: "EUR";
   order_identifier: string;
   notes_before: string;
   include_vat: 1;
   row: FennoaInvoiceRow[];
};
