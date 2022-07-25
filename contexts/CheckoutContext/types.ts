import { ProductT, ProductId } from "prisma/types";
export type Step = "form" | "providers";
export type DiscountT = {
   discountAmount: number;
   discountType: "€" | "%";
   discountProducts: Array<ProductId>;
   discountCode: string;
};
export type CheckoutProductsT = Array<ProductT>;
export type CheckoutFormDataT = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   city: string;
};

export type CheckoutReferenceT = string;
export type CheckoutContextT = {
   checkoutStep: Step;
   checkoutProducts: CheckoutProductsT;
   checkoutFormData: CheckoutFormDataT;
   checkoutDiscount: DiscountT;
   checkoutReference: CheckoutReferenceT;
   checkoutTransactionReference: CheckoutReferenceT;
   setCheckoutStep: (newStep: Step) => void;
   setCheckoutProducts: (newCheckoutProducts: CheckoutProductsT) => void;
   addCheckoutProduct: (newCheckoutProduct: ProductT) => void;
   setCheckoutFormData: (newCheckoutFormData: CheckoutFormDataT) => void;
   setCheckoutDiscount: (newCheckoutDiscount: DiscountT) => void;
   setCheckoutReference: (newCheckoutReference: CheckoutReferenceT) => void;
   setCheckoutTransactionReference: (newCheckoutTransactionReference: CheckoutReferenceT) => void;
} | null;
