import Image from "next/image";
import { StyledProviderForm } from "../../styles";
import { PaytrailFormProps } from "components/Checkout/Providers/Paytrail/types";
import { useState, FormEvent } from "react";
import Loader from "components/ui/Loader";

export default function PaytrailForm({ name, url, svg, parameters, variants }: PaytrailFormProps) {
   const [selected, setSelected] = useState<boolean>(false);

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSelected(true);
      // Disable all provider-buttons
      const providerButtons = [...document.getElementsByClassName("provider-button")];
      providerButtons.forEach((button) => {
         button.setAttribute("disabled", "true");
      });
      // Add class to the selected form's button to style it differently
      (e.target as HTMLFormElement).classList.add("selected");

      // Submit form
      (e.target as HTMLFormElement).submit();
   };
   return (
      <StyledProviderForm
         variants={variants}
         key={name}
         method="POST"
         action={url}
         onSubmit={(e) => handleSubmit(e)}
      >
         {parameters.map((param) => (
            <input key={param.name} type="hidden" name={param.name} value={param.value} />
         ))}

         <button className="provider-button" type="submit" value={name}>
            <span className="provider-img-container">
               <Image
                  className="provider-img"
                  src={svg}
                  alt={name}
                  draggable="false"
                  layout="fill"
                  objectFit="contain"
               />
            </span>
         </button>
         {selected && <Loader style={{ position: "absolute", x: 40, y: -90, zIndex: 1 }} />}
      </StyledProviderForm>
   );
}
