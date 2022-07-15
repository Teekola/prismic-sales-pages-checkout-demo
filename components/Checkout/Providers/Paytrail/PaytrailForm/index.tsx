import Image from "next/image";
import { StyledProviderForm } from "../../styles";
import { PaytrailFormProps } from "components/Checkout/Providers/Paytrail/types";

export default function PaytrailForm({ name, url, svg, parameters, variants }: PaytrailFormProps) {
   return (
      <StyledProviderForm
         variants={variants}
         key={name}
         className="provider-form"
         method="POST"
         action={url}
         onSubmit={() => console.log("submit")}
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
      </StyledProviderForm>
   );
}
