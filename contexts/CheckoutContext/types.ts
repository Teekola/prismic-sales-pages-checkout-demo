import { Product } from "@prisma/client";
export type Step = "form" | "providers";
export type DiscountT = {
   discountAmount: number;
   discountType: "€" | "%";
   discountProducts: Array<Pick<Product, "id">>;
   discountCode: string;
};
export type CheckoutFormDataT = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   city: string;
};

export type CheckoutReferenceT = string;
export type ProviderFormsT = JSX.Element | JSX.Element[] | null;
export type CheckoutContextT = {
   checkoutStep: Step;
   checkoutProducts: Product[];
   checkoutFormData: CheckoutFormDataT;
   checkoutDiscount: DiscountT;
   checkoutReference: CheckoutReferenceT;
   checkoutTransactionReference: CheckoutReferenceT;
   checkoutProviderForms: ProviderFormsT;
   setCheckoutStep: (newStep: Step) => void;
   setCheckoutProducts: (newCheckoutProducts: Product[]) => void;
   addCheckoutProduct: (newCheckoutProduct: Product) => void;
   setCheckoutFormData: (newCheckoutFormData: CheckoutFormDataT) => void;
   setCheckoutDiscount: (newCheckoutDiscount: DiscountT) => void;
   setCheckoutReference: (newCheckoutReference: CheckoutReferenceT) => void;
   setCheckoutTransactionReference: (newCheckoutTransactionReference: CheckoutReferenceT) => void;
   setCheckoutProviderForms: (newCheckoutProviderForms: ProviderFormsT) => void;
} | null;
