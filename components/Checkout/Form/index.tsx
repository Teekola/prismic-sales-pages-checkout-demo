import { useForm, Path } from "react-hook-form";
import StyledForm from "./style";
import FormField from "./FormField";
import { ChangeEvent, useState } from "react";
import { FormFields, HasTried } from "./types";

type FormProps = {
   formProps: {
      emailInstruction: string;
      phoneInstruction: string;
   };
};
export default function Form({ formProps }: FormProps) {
   const [hasTried, setHasTried] = useState<HasTried>({});
   const {
      register,
      handleSubmit,
      formState: { errors, dirtyFields },
      trigger,
      setValue,
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

   // Create mask for phone number
   const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Accept only plus sign or digits as the first sign
      // and digits for the rest. Replace other characters with empty char.
      if (e.target.value.length <= 1) {
         setValue("phone", e.target.value.replace(/[^\d|\+]/g, ""));
         dirtyFields.phone = true;
      } else {
         let first = e.target.value[0];
         let end = e.target.value.substring(1).replace(/[^\d]/g, "");
         setValue("phone", first + end);
         dirtyFields.phone = true;
      }

      // Add spaces, if plus sign, after the country code,
      // otherwise as xxx xxx xxxx
      if (e.target.value[0] === "+") {
         if (e.target.value.length > 4) {
            let start = e.target.value.substring(1, 4);
            let end = e.target.value.substring(4);
            setValue("phone", "+" + start + " " + end);
         }
      } else {
         if (e.target.value.length > 3 && e.target.value.length < 7) {
            let start = e.target.value.substring(0, 3);
            let end = e.target.value.substring(3);
            setValue("phone", start + " " + end);
         } else if (e.target.value.length > 6) {
            let start = e.target.value.substring(0, 3);
            let mid = e.target.value.substring(3, 6);
            let end = e.target.value.substring(6);
            setValue("phone", start + " " + mid + " " + end);
         }
      }
   };

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
         <FormField
            fieldOptions={{
               name: "email",
               label: "Sähköpostiosoite",
               instruction: formProps.emailInstruction,
               attributes: {
                  id: "email",
                  name: "email",
                  type: "text",
                  autoComplete: "email",
                  inputMode: "email",
               },
            }}
            handlers={{ handleKeyUp, handleBlur }}
            rhf={{
               register,
               registerOptions: {
                  required: "Sähköpostiosoite vaaditaan.",
                  pattern: {
                     value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                     message:
                        "Tarkista, että kirjoitit sähköpostisi oikein. Tällä sähköpostiosoitteella pääset kirjautumaan kursseillesi.",
                  },
               },
               errors,
            }}
         />

         <FormField
            fieldOptions={{
               name: "phone",
               label: "Puhelinnumero",
               instruction: formProps.phoneInstruction,
               attributes: {
                  id: "phone",
                  name: "phone",
                  type: "tel",
                  inputMode: "numeric",
                  autoComplete: "tel",
               },
            }}
            handlers={{ handleKeyUp, handleBlur, handleChange: handlePhoneChange }}
            rhf={{
               register,
               registerOptions: {
                  required: "Puhelinnumero vaaditaan.",
                  minLength: {
                     value: 6,
                     message: "Virheellinen puhelinnumero.",
                  },
                  maxLength: {
                     value: 17,
                     message: "Virheellinen puhelinnumero.",
                  },
               },
               errors,
            }}
         />
      </StyledForm>
   );
}
