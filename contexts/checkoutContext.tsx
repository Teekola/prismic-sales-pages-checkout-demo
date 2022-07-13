/**
 * Context created according to best practices by Jack Herrington
 * https://www.youtube.com/watch?v=DEPwA3mv_R8
 */
import { useState, PropsWithChildren, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";

// Types
type ProductT = {
   id: string;
};
type CheckoutProductsT = Array<ProductT>;
type CheckoutContextT = {
   checkoutProducts: CheckoutProductsT;
   setCheckoutProducts: (newCheckoutProducts: CheckoutProductsT) => void;
} | null;

// Context Hook
const useCheckoutContext = () => {
   const [checkoutProducts, setCheckoutProducts] = useState<CheckoutProductsT>([]);
   // Use Callback is needed to prevent it from creating
   // new function (so new reference) every time.
   // The empty dependency array means that the function is
   // only created once.
   return {
      checkoutProducts,
      setCheckoutProducts: useCallback(
         (newCheckoutProducts: CheckoutProductsT) => setCheckoutProducts(newCheckoutProducts),
         []
      ),
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
export const useCheckoutProducts = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.checkoutProducts ? state.checkoutProducts : []
   );
export const useSetCheckoutProducts = () =>
   useContextSelector(CheckoutContext, (state) =>
      state?.setCheckoutProducts ? state.setCheckoutProducts : () => null
   );
