/**
 * Context created according to best practices by Jack Herrington
 * https://www.youtube.com/watch?v=DEPwA3mv_R8
 */
import { useState, PropsWithChildren, useCallback } from "react";
import { createContext, useContext, useContextSelector } from "use-context-selector";
import {
   CheckoutProductsT,
   CheckoutContextT,
   CheckoutFormDataT,
   Step,
   DiscountT,
   ProductT,
   CheckoutReferenceT,
} from "./types";

// Context Hook
const useCheckoutContext = () => {
   const [checkoutProducts, setCheckoutProducts] = useState<CheckoutProductsT>([]);
   const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormDataT>(null);
   const [checkoutStep, setCheckoutStep] = useState<Step>("form");
   const [checkoutDiscount, setCheckoutDiscount] = useState<DiscountT>(null);
   const [checkoutReference, setCheckoutReference] = useState<CheckoutReferenceT>("");
   // Use Callback is needed to prevent it from creating
   // new function (so new reference) every time.
   // The empty dependency array means that the function is
   // only created once.
   return {
      // CheckoutStep
      checkoutStep,
      setCheckoutStep: useCallback((newCheckoutStep: Step) => {
         setCheckoutStep(newCheckoutStep);
         sessionStorage.setItem("checkoutStep", newCheckoutStep);
      }, []),
      // CheckoutProducts
      checkoutProducts,
      setCheckoutProducts: useCallback((newCheckoutProducts: CheckoutProductsT) => {
         setCheckoutProducts(newCheckoutProducts);
         sessionStorage.setItem("checkoutProducts", JSON.stringify(newCheckoutProducts));
      }, []),
      addCheckoutProduct: useCallback(
         (newCheckoutProduct: ProductT) => {
            const newCheckoutProducts = checkoutProducts.concat(newCheckoutProduct);
            setCheckoutProducts(newCheckoutProducts);
            sessionStorage.setItem("checkoutProducts", JSON.stringify(newCheckoutProducts));
         },
         [checkoutProducts]
      ),
      // CheckoutFormData
      checkoutFormData,
      setCheckoutFormData: useCallback((newCheckoutFormData: CheckoutFormDataT) => {
         setCheckoutFormData(newCheckoutFormData);
         sessionStorage.setItem("checkoutFormData", JSON.stringify(newCheckoutFormData));
      }, []),
      // CheckoutDiscount
      checkoutDiscount,
      setCheckoutDiscount: useCallback((newCheckoutDiscount: DiscountT) => {
         setCheckoutDiscount(newCheckoutDiscount);
         sessionStorage.setItem("checkoutDiscount", JSON.stringify(newCheckoutDiscount));
      }, []),
      // CheckoutReference
      checkoutReference,
      setCheckoutReference: useCallback((newCheckoutReference: CheckoutReferenceT) => {
         setCheckoutReference(newCheckoutReference);
         sessionStorage.setItem("checkoutReference", newCheckoutReference);
      }, []),
   };
};

// Create null context of the created type
const CheckoutContext = createContext<CheckoutContextT>(null);

// Create and export the context provider with the created context
// as the provider value
export const GlobalContextProvider = ({ children }: PropsWithChildren) => (
   <CheckoutContext.Provider value={useCheckoutContext()}>{children}</CheckoutContext.Provider>
);

// Create and export custom hooks for the context data.
// use-context-selector is used to prevent unnecessary renders
// ? is needed to get rid of the 'can be null error'.

// Checkout Step
export const useCheckoutStep = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutStep ? state.checkoutStep : "form"
   );

export const useSetCheckoutStep = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutStep ? state.setCheckoutStep : () => null
   );

// Checkout Products
export const useCheckoutProducts = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutProducts ? state.checkoutProducts : []
   );

export const useSetCheckoutProducts = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutProducts ? state.setCheckoutProducts : () => null
   );
export const useAddCheckoutProduct = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.addCheckoutProduct ? state.addCheckoutProduct : () => null
   );

// Checkout Form Data
export const useCheckoutFormData = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutFormData ? state.checkoutFormData : null
   );

export const useSetCheckoutFormData = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutFormData ? state.setCheckoutFormData : () => null
   );

// Checkout Discount
export const useCheckoutDiscount = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutDiscount ? state.checkoutDiscount : null
   );
export const useSetCheckoutDiscount = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutDiscount ? state.setCheckoutDiscount : () => null
   );

// Checkout Reference
export const useCheckoutReference = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutReference ? state.checkoutReference : ""
   );
export const useSetCheckoutReference = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutReference ? state.setCheckoutReference : () => null
   );
