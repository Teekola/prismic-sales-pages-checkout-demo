export type PaytrailItem = {
   unitPrice: number;
   units: number;
   vatPercentage: 24 | 0;
   productCode: string;
   description: string;
};

export type PaytrailCustomer = {
   email: string;
   firstName: string;
   lastName: string;
   phone: string;
};

export type PaytrailRedirectUrls = {
   success: string;
   cancel: string;
};

export type PaytrailCallbackUrls = {
   success: string;
};

export type PaytrailParams = {
   stamp: string;
   reference: string;
   items: Array<PaytrailItem>;
   amount: number;
   currency: string;
   language: string;
   customer: PaytrailCustomer;
   redirectUrls: PaytrailRedirectUrls;
   callbackUrls: PaytrailCallbackUrls;
};

// Create Payment Types
export type FormField = {
   name: string;
   value: string;
};

export type PaymentMethodGroup = "mobile" | "bank" | "creditcard" | "credit";

export type PaymentMethodGroupData = {
   id: PaymentMethodGroup;
   name: string;
   icon: string;
   svg: string;
};

export type Provider = {
   url: string;
   icon: string;
   svg: string;
   group: PaymentMethodGroup;
   name: string;
   id: string;
   parameters: Array<FormField>;
};

export type PaytrailFormProps = {
   name: string;
   url: string;
   svg: string;
   parameters: Array<FormField>;
   variants: {
      initial: object;
      animate: object;
      exit: object;
   };
};

export type PaytrailResponseT =
   | {
        status: "ok";
        transactionId: string;
        href: string;
        terms: string;
        groups: Array<PaymentMethodGroupData>;
        reference: string;
        providers: Array<Provider>;
        customProviders: any;
     }
   | { status: "error"; message: "wrong method" }
   | { status: "error"; message: "signature mismatch" }
   | { status: "error"; message: string };
