import Image from "next/image";
import { StyledProviderForm } from "../../styles";
import { useState, FormEvent } from "react";
import Loader from "components/ui/Loader";
import { useCheckoutOrderId, useCheckoutReference } from "contexts/CheckoutContext";
import { Order } from "@prisma/client";
import { useRouter } from "next/router";
import { EdenredFormProps } from "../types";

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
const DATABASE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DATABASE_ACCESS_TOKEN || "";

export default function EdenredForm({ name, svg, mastercard, variants }: EdenredFormProps) {
   const [selected, setSelected] = useState<boolean>(false);
   const checkoutOrderId = useCheckoutOrderId();
   const checkoutReference = useCheckoutReference();
   const router = useRouter();

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
         reference: checkoutReference,
         status: "maksamassa",
      } as Partial<Order>;

      await fetch(`${WEBSITE_URL}/api/db/orders/${checkoutOrderId}`, {
         method: "PATCH",
         headers: {
            Authorization: DATABASE_ACCESS_TOKEN,
            "Content-Type": "application/json",
         },
         body: JSON.stringify(body),
      });

      // Redirect
      router.push({
         pathname: "/kassa/edenred",
         query: { data: JSON.stringify(mastercard) },
      });
   };
   return (
      <StyledProviderForm variants={variants} key={name} onSubmit={(e) => handleSubmit(e)}>
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
