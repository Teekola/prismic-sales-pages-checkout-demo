export type Step = "form" | "providers";
export type ProductId = string;
export type ProductT = {
   id: ProductId;
   name: string;
   type: string;
   originalPrice: number;
   price: number;
   discountPrice: number;
   amount: number;
   image_url: string;
   activation_url: string;
   createdAt: string;
   updatedAt: string;
};
export type DiscountT = {
   discountAmount: number;
   discountType: "€" | "%";
   discountProducts: Array<ProductId>;
   discountCode: string;
} | null;
export type CheckoutProductsT = Array<ProductT>;
export type CheckoutFormDataT = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   city: string;
} | null;
export type CheckoutReferenceT = string | null;
export type CheckoutContextT = {
   checkoutStep: Step;
   checkoutProducts: CheckoutProductsT;
   checkoutFormData: CheckoutFormDataT;
   checkoutDiscount: DiscountT;
   checkoutReference: CheckoutReferenceT;
   setCheckoutStep: (newStep: Step) => void;
   setCheckoutProducts: (newCheckoutProducts: CheckoutProductsT) => void;
   addCheckoutProduct: (newCheckoutProduct: ProductT) => void;
   setCheckoutFormData: (newCheckoutFormData: CheckoutFormDataT) => void;
   setCheckoutDiscount: (newCheckoutDiscount: DiscountT) => void;
   setCheckoutReference: (newCheckoutReference: NonNullable<CheckoutReferenceT>) => void;
} | null;
