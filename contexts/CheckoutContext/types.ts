import { Order, Product } from "@prisma/client";
export type Step = "form" | "providers" | "edenred";
export type DiscountT = {
   discountAmount: number;
   discountType: "€" | "%";
   discountProducts: Array<Product["id"]>;
   discountCode: string;
};
export type CheckoutFormDataT = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   city: string;
};

export type ProductT = Product & { discountPrice: number; quantity: number };

export type CheckoutReferenceT = Order["reference"];
export type CheckoutOrderIdT = Order["id"];
export type ProviderFormsT = JSX.Element | JSX.Element[] | null;
export type CheckoutContextT = {
   checkoutStep: Step;
   checkoutProducts: ProductT[];
   checkoutFormData: CheckoutFormDataT;
   checkoutDiscount: DiscountT;
   checkoutOrderId: CheckoutOrderIdT;
   checkoutReference: CheckoutReferenceT;
   checkoutProviderForms: ProviderFormsT;
   setCheckoutStep: (newStep: Step) => void;
   setCheckoutProducts: (newCheckoutProducts: ProductT[]) => void;
   addCheckoutProduct: (newCheckoutProduct: ProductT) => void;
   setCheckoutFormData: (newCheckoutFormData: CheckoutFormDataT) => void;
   setCheckoutDiscount: (newCheckoutDiscount: DiscountT) => void;
   setCheckoutReference: (newCheckoutReference: CheckoutReferenceT) => void;
   setCheckoutOrderId: (newCheckoutOrderId: CheckoutOrderIdT) => void;
   setCheckoutProviderForms: (newCheckoutProviderForms: ProviderFormsT) => void;
} | null;
