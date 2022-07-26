import { useForm, Path } from "react-hook-form";
import StyledForm from "./style";
import FormField from "./FormField";
import { ChangeEvent, useState, useEffect } from "react";
import { FormProps, FormFields, HasTried } from "./types";
import Script from "next/script";
import {
   useCheckoutFormData,
   useSetCheckoutStep,
   useSetCheckoutFormData,
   useCheckoutProducts,
} from "contexts/CheckoutContext";
import { useRouter } from "next/router";
import { CheckoutFormDataT } from "contexts/CheckoutContext/types";

export default function Form({ formProps }: FormProps) {
   const [hasTried, setHasTried] = useState<HasTried>({});
   const router = useRouter();
   const checkoutFormData = useCheckoutFormData() as CheckoutFormDataT;
   const checkoutProducts = useCheckoutProducts();
   const setCheckoutFormData = useSetCheckoutFormData();
   const setCheckoutStep = useSetCheckoutStep();
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

   // TODO: Cleanup current step, and products at the end of checkout flow

   // TODO: Fill in the Form Fields when  Returning from reminder email

   // Fill form fields
   useEffect(() => {
      // Place the values from formData
      if (Object.keys(checkoutFormData).length > 0) {
         setValue("firstName", checkoutFormData.firstName, { shouldDirty: true });
         setValue("lastName", checkoutFormData.lastName, { shouldDirty: true });
         setValue("email", checkoutFormData.email, { shouldDirty: true });
         setValue("phone", checkoutFormData.phone, { shouldDirty: true });
         setValue("city", checkoutFormData.city, { shouldDirty: true });
         return;
      }
   }, [checkoutFormData, setValue, router.asPath]);

   // Check for autocomplete
   useEffect(() => {
      // Set values and trigger validation on autocomplete
      const triggerOnAutoComplete = () => {
         console.log("Autocompleted");
         const firstNameEl = document.getElementById("firstName") as HTMLInputElement;
         if (firstNameEl?.attributes.getNamedItem("autocompleted")) {
            setValue("firstName", firstNameEl.value, { shouldDirty: true });
            trigger("firstName");
            firstNameEl.attributes.removeNamedItem("autocompleted");
         }
         const lastNameEl = document.getElementById("lastName") as HTMLInputElement;
         if (lastNameEl?.attributes.getNamedItem("autocompleted")) {
            setValue("lastName", lastNameEl.value, { shouldDirty: true });
            trigger("lastName");
            lastNameEl.attributes.removeNamedItem("autocompleted");
         }
         const emailEl = document.getElementById("email") as HTMLInputElement;
         if (emailEl?.attributes.getNamedItem("autocompleted")) {
            setValue("email", emailEl.value, { shouldDirty: true });
            trigger("email");
            emailEl.attributes.removeNamedItem("autocompleted");
         }
         const phoneEl = document.getElementById("phone") as HTMLInputElement;
         if (phoneEl?.attributes.getNamedItem("autocompleted")) {
            setValue("phone", phoneEl.value, { shouldDirty: true });
            trigger("phone");
            phoneEl.attributes.removeNamedItem("autocompleted");
         }
         const cityEl = document.getElementById("city") as HTMLInputElement;
         if (cityEl?.attributes.getNamedItem("autocompleted")) {
            setValue("city", cityEl.value, { shouldDirty: true });
            trigger("city");
            cityEl.attributes.removeNamedItem("autocompleted");
         }
      };
      document.addEventListener("onautocomplete", () => triggerOnAutoComplete());
      return document.removeEventListener("onautocomplete", () => triggerOnAutoComplete());
   }, [trigger, setValue]);

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
   const handleFormSubmit = async (submittedData: FormFields) => {
      setCheckoutStep("providers");

      // Check if the fields have same values with old ones
      // and only set formdata if there are differences
      if (
         Object.keys(checkoutFormData).length === 5 &&
         checkoutFormData.firstName === submittedData.firstName &&
         checkoutFormData.lastName === submittedData.lastName &&
         checkoutFormData.email === submittedData.email &&
         checkoutFormData.city === submittedData.city &&
         checkoutFormData.phone === submittedData.phone
      ) {
         return;
      }
      setCheckoutFormData(submittedData);
   };

   const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Create mask for phone number
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
      <StyledForm onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
         <h1>Laskutustiedot</h1>
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
         <FormField
            fieldOptions={{
               name: "city",
               label: "Paikkakunta",
               attributes: { id: "city", name: "city", type: "text" },
            }}
            handlers={{ handleKeyUp, handleBlur }}
            rhf={{ register, registerOptions: { required: "Paikkakunta vaaditaan." }, errors }}
         />
         <button
            className="primary-cta submit"
            type="submit"
            data-disabled={
               Object.keys(errors).length != 0 ||
               Object.keys(dirtyFields).length < 5 ||
               checkoutProducts.length < 1
            }
            disabled={checkoutProducts.length < 1}
         >
            Jatka maksutavan valintaan
         </button>
         {checkoutProducts.length < 1 && (
            <p className="error-message">
               Kassalla ei ole tuotteita. Lisää tuotteita ostoskoriin jatkaaksesi.
            </p>
         )}

         <Script src="https://unpkg.com/detect-autofill/dist/detect-autofill.js" />
      </StyledForm>
   );
}
