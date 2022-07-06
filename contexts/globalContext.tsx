/**
 * Context created according to best practices by Jack Herrington
 * https://www.youtube.com/watch?v=DEPwA3mv_R8
 */
import { useState, PropsWithChildren, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";

// Create type for Value
type Value = number | undefined;

// Create type for the context
// allow null
type GlobalContextType = {
   value: Value;
   setValue: (val: Value) => void;
} | null;

const useGlobalContext = () => {
   const [value, setValue] = useState<Value>(undefined);
   // Use Callback is needed to prevent it from creating
   // new function (so new reference) every time.
   // The empty dependency array means that the function is
   // only created once.
   return {
      value,
      setValue: useCallback((val: Value) => setValue(val), []),
   };
};

// Create null context of the created type
const GlobalContext = createContext<GlobalContextType>(null);

// Create and export the context provider with the created context
// as the provider value
export const GlobalContextProvider = ({ children }: PropsWithChildren<{}>) => (
   <GlobalContext.Provider value={useGlobalContext()}>{children}</GlobalContext.Provider>
);

// Create and export custom hooks for the context data.
// use-context-selector is used to prevent unnecessary renders
// ? is needed to get rid of the 'can be null error'.
export const useValue = () => useContextSelector(GlobalContext, (state) => state?.value);
export const useSetValue = () => useContextSelector(GlobalContext, (state) => state?.setValue);
