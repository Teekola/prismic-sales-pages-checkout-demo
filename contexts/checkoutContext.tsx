/**
 * Context created according to best practices by Jack Herrington
 * https://www.youtube.com/watch?v=DEPwA3mv_R8
 */
import { useState, PropsWithChildren, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";

// Types
type Step = "form" | "providers";
type ProductT = {
   id: string;
};
type CheckoutProductsT = Array<ProductT>;
type CheckoutFormDataT = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   city: string;
} | null;
type CheckoutContextT = {
   checkoutStep: Step;
   checkoutProducts: CheckoutProductsT;
   checkoutFormData: CheckoutFormDataT;
   setCheckoutStep: (newStep: Step) => void;
   setCheckoutProducts: (newCheckoutProducts: CheckoutProductsT) => void;
   setCheckoutFormData: (newCheckoutFormData: CheckoutFormDataT) => void;
} | null;

// Context Hook
const useCheckoutContext = () => {
   const [checkoutProducts, setCheckoutProducts] = useState<CheckoutProductsT>([]);
   const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormDataT>(null);
   const [checkoutStep, setCheckoutStep] = useState<Step>("form");
   // Use Callback is needed to prevent it from creating
   // new function (so new reference) every time.
   // The empty dependency array means that the function is
   // only created once.
   return {
      checkoutStep,
      checkoutProducts,
      checkoutFormData,
      setCheckoutStep: useCallback((newCheckoutStep: Step) => {
         setCheckoutStep(newCheckoutStep);
         sessionStorage.setItem("checkoutStep", newCheckoutStep);
      }, []),
      setCheckoutProducts: useCallback((newCheckoutProducts: CheckoutProductsT) => {
         setCheckoutProducts(newCheckoutProducts);
         sessionStorage.setItem("checkoutProducts", JSON.stringify(newCheckoutProducts));
      }, []),
      setCheckoutFormData: useCallback((newCheckoutFormData: CheckoutFormDataT) => {
         setCheckoutFormData(newCheckoutFormData);
         sessionStorage.setItem("checkoutFormData", JSON.stringify(newCheckoutFormData));
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
export const useCheckoutStep = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutStep ? state.checkoutStep : "form"
   );
export const useCheckoutProducts = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutProducts ? state.checkoutProducts : []
   );
export const useCheckoutFormData = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutFormData ? state.checkoutFormData : null
   );

export const useSetCheckoutStep = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutStep ? state.setCheckoutStep : () => null
   );
export const useSetCheckoutProducts = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutProducts ? state.setCheckoutProducts : () => null
   );
export const useSetCheckoutFormData = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutFormData ? state.setCheckoutFormData : () => null
   );
