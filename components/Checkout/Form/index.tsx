import { useForm, Path } from "react-hook-form";
import StyledForm from "./style";
import FormField from "./FormField";
import { useState } from "react";
import { FormFields, HasTried } from "./types";

export default function Form() {
   const [hasTried, setHasTried] = useState<HasTried>({});
   const {
      register,
      handleSubmit,
      formState: { errors },
      trigger,
   } = useForm<FormFields>({
      defaultValues: {
         firstName: "",
         lastName: "",
         email: "",
         phone: "",
         city: "",
      },
   });

   const handleKeyUp = (fieldName: Path<FormFields>) => {
      // If the user has tried to fill correctly
      // run validation
      if (hasTried[fieldName]) {
         trigger(fieldName);
      }
   };
   const handleBlur = (fieldName: Path<FormFields>) => {
      // Update the field's hasTried value to be true
      if (!hasTried[fieldName]) {
         setHasTried({ ...hasTried, [fieldName]: true });
      }
      // Run validation
      trigger(fieldName);
   };
   const onSubmit = (data: any) => console.log(data);

   return (
      <StyledForm>
         <div className="input-group">
            <FormField
               fieldOptions={{
                  name: "firstName",
                  label: "Etunimi",
                  attributes: { id: "firstName", name: "firstName", type: "text" },
               }}
               handlers={{ handleKeyUp, handleBlur }}
               rhf={{
                  register,
                  registerOptions: {
                     required: "Etunimi vaaditaan.",
                  },
                  errors,
               }}
            />
            <FormField
               fieldOptions={{
                  name: "lastName",
                  label: "Sukunimi",
                  attributes: { id: "lastName", name: "lastName", type: "text" },
               }}
               handlers={{ handleKeyUp, handleBlur }}
               rhf={{ register, registerOptions: { required: "Sukunimi vaaditaan." }, errors }}
            />
         </div>
      </StyledForm>
   );
}
