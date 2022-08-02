import { Path, useForm } from "react-hook-form";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import FormField from "components/Checkout/Form/FormField";
import { HasTried } from "components/Checkout/Form/types";
import { StyledUserForm } from "./style";
import { useRouter } from "next/router";
import {
   useCheckoutFormData,
   useCheckoutProducts,
   useCheckoutReference,
   useSetCheckoutStep,
} from "contexts/CheckoutContext";
import { FilledCheckoutFormDataT } from "../../../types";
import { calculateDiscountedTotalPrice } from "components/Checkout/Products/prices";
import { InvoiceFormFields, FennoaInvoiceRow, FennoaFormData } from "../../types";
const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

type UserFormProps = {
   dueDate: Date;
   setIsSending: Dispatch<SetStateAction<boolean>>;
   isSending: boolean;
};

export default function InvoiceForm({ dueDate, setIsSending, isSending }: UserFormProps) {
   // Form's internal state
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [hasTried, setHasTried] = useState<HasTried>({});
   const [countries, setCountries] = useState<Array<any>>([]);
   const router = useRouter();
   const checkoutProducts = useCheckoutProducts();
   const checkoutReference = useCheckoutReference();
   const checkoutFormData = useCheckoutFormData() as FilledCheckoutFormDataT;
   const setCheckoutStep = useSetCheckoutStep();

   // Hooks
   const {
      register,
      handleSubmit,
      formState: { errors, dirtyFields },
      trigger,
      setValue,
      watch,
      setError,
      setFocus,
   } = useForm<InvoiceFormFields>({
      defaultValues: {
         name: "",
         email: "",
         address: "",
         postalcode: "",
         country: "FI",
         city: "",
      },
   });

   const handleKeyUp = (fieldName: Path<InvoiceFormFields>) => {
      // If the user has tried to fill correctly
      // run validation
      if (hasTried[fieldName]) {
         trigger(fieldName);
      }
   };

   const handleBlur = (fieldName: Path<InvoiceFormFields>) => {
      // Update the field's hasTried value to be true
      if (!hasTried[fieldName]) {
         setHasTried({ ...hasTried, [fieldName]: true });
      }
      // Run validation
      trigger(fieldName);
   };

   // Create mask for phone number
   const handlePostalcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length < 1) {
         setValue("postalcode", "");
         return;
      }
      // Max length is 10 chars for US postalcodes (xxxxx-xxxx)
      if (e.target.value.length > 10) {
         setValue("postalcode", e.target.value.substring(0, 10));
         return;
      }
      // Accept only digits or dashes
      let char = e.target.value.substring(0).replace(/[^\d\-]/g, "");
      setValue("postalcode", char);
      dirtyFields.postalcode = true;
   };

   const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setValue("country", e.target.value);
   };

   const handleFormSubmit = async (submittedData: InvoiceFormFields) => {
      setIsSending(true);
      //////////////////////////////////////
      // Get correct data for the invoice //
      //////////////////////////////////////
      const { name, address, postalcode, city, country, email } = submittedData;

      // Convert dates to correct form
      const [due_date] = dueDate.toISOString().split("T");
      const [invoice_date] = new Date().toISOString().split("T");

      /// Generate row data to an array of JSONs
      const row: Array<FennoaInvoiceRow> = [];
      let current_row: FennoaInvoiceRow;
      checkoutProducts.forEach((product) => {
         current_row = {
            product_no: product.id.toString(),
            name: product.name,
            description: product.type,
            price: Number((product.price / 100.0).toFixed(2)),
            quantity: product.quantity,
            vatpercent: 24,
            discount_percent: 0,
            // TODO: Pitäisikö tässä näkyä, jos tuotteella on alennus.
            // Siis pitäisikö laskea prosentuaalinen alennus tähän discountPricen, pricen ja originalPricen avulla?
         };
         row.push(current_row);
      });

      // Create the JSON
      const formDataJSON: FennoaFormData = {
         name,
         address,
         postalcode,
         city,
         country,
         invoice_date,
         due_date,
         einvoice_address: email,
         delivery_method: "email",
         currency: "EUR",
         order_identifier: checkoutReference,
         notes_before:
            "Huom! Maksa lasku käyttäen sivun alareunasta löytyvää viitenumeroa. Muuten emme tiedä keneltä maksu on tullut.",
         include_vat: 1,
         row,
      };

      // Create, Approve and Send the Email Invoice
      const create_invoice = await fetch(`${WEBSITE_URL}/api/checkout/createEmailInvoice`, {
         method: "POST",
         headers: { "content-type": "application/json" },
         body: JSON.stringify(formDataJSON),
      });
      const create_invoice_json = await create_invoice.json();
      console.log(create_invoice_json);

      // Handle errors
      if (create_invoice_json.errors) {
         if (create_invoice_json.errors.postalcode) {
            setIsSending(false);
            setError(
               "postalcode",
               { type: "focus", message: "Postinumero on virheellinen." },
               { shouldFocus: true }
            );
         }
      } else {
         // successful order
         await fetch(`${WEBSITE_URL}/api/successfulOrder?email-reference=${checkoutReference}`);
         // Redirect to thanks page
         router.push(
            `/kassa/success?pid=${checkoutProducts[0].id}&tp=${calculateDiscountedTotalPrice(
               checkoutProducts
            )}&email-reference=${checkoutReference}`
         );
      }
   };

   // Fill the form fields
   useEffect(() => {
      // If the forms were already loaded, return
      if (isLoaded) return;

      // When going back from a payment provider, set current step to providers
      const storageStep = sessionStorage.getItem("checkoutStep");
      if (storageStep === "providers") {
         setCheckoutStep("providers");
      }

      setFocus("address", { shouldSelect: true });

      // Place the values from formData
      if (checkoutFormData) {
         setValue("name", checkoutFormData.firstName + " " + checkoutFormData.lastName, {
            shouldDirty: true,
         });
         setValue("email", checkoutFormData.email, { shouldDirty: true });
         setValue("city", checkoutFormData.city, { shouldDirty: true });
         setValue("country", "FI", { shouldDirty: true });
         setIsLoaded(true);
         return;
      }

      // Place the values from storageData
      const storageData = JSON.parse(sessionStorage.getItem("checkoutFormData") || "");
      if (storageData) {
         setValue("name", storageData.firstName + " " + storageData.lastName, {
            shouldDirty: true,
         });
         setValue("email", storageData.email, { shouldDirty: true });
         setValue("city", storageData.city, { shouldDirty: true });
         setValue("country", "FI", { shouldDirty: true });
      }
      setIsLoaded(true);
   }, [checkoutFormData, isLoaded, setCheckoutStep, setValue, setFocus]);

   // Get country options
   // TODO: typings
   // TODO: Component for Dropdown menu
   useEffect(() => {
      const getCountries = async () => {
         const rawCountryData = await fetch("https://restcountries.com/v3.1/all");
         const countryData = await rawCountryData.json();
         const countryNamesAndCodes = countryData
            .filter((country: any) => country.name.nativeName != undefined)
            .map((country: any) => {
               return {
                  name: country.name.nativeName[Object.keys(country.name.nativeName)[0]].common,
                  code: country.cca2,
               };
            })
            .sort((a: any, b: any) => a.name > b.name);

         setCountries(countryNamesAndCodes);
      };
      getCountries();
   }, []);

   return !isSending ? (
      <StyledUserForm onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
         <FormField
            fieldOptions={{
               name: "name",
               label: "Nimi",
               attributes: { id: "name", name: "name", type: "text" },
            }}
            handlers={{ handleKeyUp, handleBlur }}
            rhf={{
               register,
               registerOptions: {
                  required: "Nimi vaaditaan.",
               },
               errors,
            }}
         />
         <FormField
            fieldOptions={{
               name: "email",
               label: "Sähköpostiosoite",
               instruction: "Huom! Lasku lähetetään tähän sähköpostiosoitteeseen.",
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
                        "Tarkista, että kirjoitit sähköpostisi oikein. Huom! Lasku lähetetään tähän sähköpostiosoitteeseen.",
                  },
               },
               errors,
            }}
         />
         <FormField
            fieldOptions={{
               name: "address",
               label: "Osoite",
               attributes: { id: "address", name: "address", type: "text" },
            }}
            handlers={{ handleKeyUp, handleBlur }}
            rhf={{
               register,
               registerOptions: {
                  required: "Osoite vaaditaan.",
               },
               errors,
            }}
         />

         <div className="input-group">
            <FormField
               fieldOptions={{
                  name: "postalcode",
                  label: "Postinumero",
                  attributes: {
                     id: "postalcode",
                     name: "postalcode",
                     type: "tel",
                     inputMode: "numeric",
                     autoComplete: "postal-code",
                  },
                  maxWidth: "17ch",
               }}
               handlers={{ handleKeyUp, handleBlur, handleChange: handlePostalcodeChange }}
               rhf={{
                  register,
                  registerOptions: {
                     required: "Postinumero vaaditaan.",
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
         </div>

         <div className="form-block">
            <label htmlFor="country" className="required">
               Kotimaa
            </label>
            <select
               value={watch("country")}
               {...register("country", { required: "Kotimaa vaaditaan." })}
               className={errors.country ? "dropdown error" : "dropdown"}
               name="country"
               id="country"
               onChange={(e) => handleDropdownChange(e)}
               onBlur={() => handleBlur("country")}
            >
               <option value="">--Valitse maa--</option>
               {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                     {country.name} ({country.code})
                  </option>
               ))}
            </select>
            <p className="error-message">{errors.country?.message}</p>
         </div>

         <button
            className="primary-cta submit"
            type="submit"
            data-disabled={Object.keys(errors).length != 0 || Object.keys(dirtyFields).length < 5}
         >
            Lähetä lasku
         </button>
      </StyledUserForm>
   ) : (
      <></>
   );
}
