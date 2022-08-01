import FormFieldProps from "./types";
import StyledFormField from "./style";
import get from "lodash.get";
import { ErrorMessage } from "@hookform/error-message";

const FormField = <TFormValues extends Record<string, unknown>>({
   fieldOptions,
   rhf,
   handlers,
}: FormFieldProps<TFormValues>) => {
   const { name, label, instruction, attributes, maxWidth } = fieldOptions;
   const { register, registerOptions, errors } = rhf;
   const { handleBlur, handleKeyUp, handleChange } = handlers;
   const errorMessages = get(errors, name);
   const hasError = !!(errors && errorMessages);
   return (
      <StyledFormField style={maxWidth ? { maxWidth } : {}}>
         <label
            htmlFor={attributes.id}
            className={registerOptions.required ? "label required" : "label"}
         >
            {label}
         </label>
         <input
            className={hasError ? "text-input error" : "text-input"}
            {...attributes}
            {...register(name, registerOptions)}
            onBlur={() => handleBlur(name)}
            onKeyUp={() => handleKeyUp(name)}
            {...(handleChange ? { onChange: (e) => handleChange(e) } : {})}
         />
         <ErrorMessage
            errors={errors}
            name={name as any}
            render={({ message }) => <p className="error-message">{message}</p>}
         />
         {!hasError && !!instruction && <p className="instruction">{instruction}</p>}
      </StyledFormField>
   );
};

export default FormField;
