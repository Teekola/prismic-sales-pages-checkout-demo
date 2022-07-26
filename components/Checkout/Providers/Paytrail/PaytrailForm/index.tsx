import Image from "next/image";
import { StyledProviderForm } from "../../styles";
import { PaytrailFormProps } from "components/Checkout/Providers/Paytrail/types";
import { useState, FormEvent } from "react";
import Loader from "components/ui/Loader";
import { useCheckoutReference, useCheckoutTransactionReference } from "contexts/CheckoutContext";
import { Order } from "@prisma/client";

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN || "";

export default function PaytrailForm({ name, url, svg, parameters, variants }: PaytrailFormProps) {
   const [selected, setSelected] = useState<boolean>(false);
   const checkoutReference = useCheckoutReference();
   const checkoutTransactionReference = useCheckoutTransactionReference();

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSelected(true);
      // Disable all provider-buttons
      const providerButtons = [...document.getElementsByClassName("provider-button")];
      providerButtons.forEach((button) => {
         button.setAttribute("disabled", "true");
      });
      // Add class to the selected form's button to style it differently
      (e.target as HTMLFormElement).classList.add("selected");

      // Update order
      const body = {
         provider: name,
         transactionReference: checkoutTransactionReference,
      } as Partial<Order>;

      await fetch(`${WEBSITE_URL}/api/db/orders/${checkoutReference}`, {
         method: "PATCH",
         headers: {
            Authorization: DATABASE_ACCESS_TOKEN,
            "Content-Type": "application/json",
         },
         body: JSON.stringify(body),
      });
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
