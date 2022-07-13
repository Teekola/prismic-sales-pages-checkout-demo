import { ChangeEvent } from "react";
import { UseFormRegister, RegisterOptions, DeepMap, FieldError, Path } from "react-hook-form";

type FormFieldProps<TFormValues> = {
   fieldOptions: {
      name: Path<TFormValues>;
      label: string;
      attributes: {
         id: string;
         name: string;
         type: string;
         placeholder?: string;
         autoComplete?: "email" | "tel";
         inputMode?: "email" | "numeric";
      };
   };
   handlers: {
      handleKeyUp: (name: Path<TFormValues>) => void;
      handleBlur: (name: Path<TFormValues>) => void;
      handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
   };
   rhf: {
      register: UseFormRegister<TFormValues>;
      registerOptions: RegisterOptions;
      errors?: Partial<DeepMap<TFormValues, FieldError>>;
   };
};

export default FormFieldProps;
