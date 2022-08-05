/**
 * Context created according to best practices by Jack Herrington
 * https://www.youtube.com/watch?v=DEPwA3mv_R8
 */
import { useState, PropsWithChildren, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import {
   CheckoutContextT,
   CheckoutFormDataT,
   Step,
   DiscountT,
   CheckoutReferenceT,
   ProviderFormsT,
   CheckoutOrderIdT,
} from "./types";
import { ProductT } from "./types";

// Context Hook
const useCheckoutContext = () => {
   const [checkoutProducts, setCheckoutProducts] = useState<ProductT[]>([]);
   const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormDataT>(
      {} as CheckoutFormDataT
   );
   const [checkoutStep, setCheckoutStep] = useState<Step>("form");
   const [checkoutDiscount, setCheckoutDiscount] = useState<DiscountT>({} as DiscountT);
   const [checkoutOrderId, setCheckoutOrderId] = useState<CheckoutOrderIdT>("");
   const [checkoutReference, setCheckoutReference] = useState<CheckoutReferenceT>("");
   const [checkoutProviderForms, setCheckoutProviderForms] = useState<ProviderFormsT>(null);
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
      setCheckoutProducts: useCallback((newCheckoutProducts: ProductT[]) => {
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
      // CheckoutOrderId
      checkoutOrderId,
      setCheckoutOrderId: useCallback((newCheckoutOrderId: CheckoutOrderIdT) => {
         setCheckoutOrderId(newCheckoutOrderId);
         sessionStorage.setItem("checkoutOrderId", newCheckoutOrderId);
      }, []),
      // CheckoutReference
      checkoutReference,
      setCheckoutReference: useCallback((newCheckoutReference: CheckoutReferenceT) => {
         setCheckoutReference(newCheckoutReference);
         sessionStorage.setItem("checkoutReference", newCheckoutReference);
      }, []),
      // Provider Forms
      checkoutProviderForms,
      setCheckoutProviderForms: useCallback((newCheckoutProviderForms: ProviderFormsT) => {
         setCheckoutProviderForms(newCheckoutProviderForms);
      }, []),
   };
};

// Create null context of the created type
const CheckoutContext = createContext<CheckoutContextT>(null);

// Create and export the context provider with the created context
// as the provider value
export const CheckoutContextProvider = ({ children }: PropsWithChildren) => (
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
      state?.checkoutFormData ? state.checkoutFormData : {}
   );

export const useSetCheckoutFormData = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutFormData ? state.setCheckoutFormData : () => null
   );

// Checkout Discount
export const useCheckoutDiscount = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutDiscount ? state.checkoutDiscount : {}
   );
export const useSetCheckoutDiscount = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutDiscount ? state.setCheckoutDiscount : () => null
   );

// Checkout Order Id
export const useCheckoutOrderId = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutOrderId ? state.checkoutOrderId : ""
   );
export const useSetCheckoutOrderId = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutOrderId ? state.setCheckoutOrderId : () => null
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

// Provider Forms
export const useCheckoutProviderForms = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutProviderForms ? state.checkoutProviderForms : null
   );
export const useSetCheckoutProviderForms = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutProviderForms ? state.setCheckoutProviderForms : () => null
   );
