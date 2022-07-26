import generatePaytrailPayload from "./generatePaytrailPayload";
import fetchPaytrailProviderData from "./fetchPaytrailProviderData";
import { ProductT } from "contexts/CheckoutContext/types";
import { VatPercentage, FilledCheckoutFormDataT } from "../../types";
import { Order } from "@prisma/client";

const generatePaytrailProviderData = async (
   stamp: string,
   reference: Order["reference"],
   products: ProductT[],
   formData: FilledCheckoutFormDataT,
   totalPrice: Order["totalPrice"],
   vatPercentage: VatPercentage,
   successCallbackUrl: string,
   successRedirectUrl: string,
   cancelRedirectUrl: string
) => {
   const paytrailPayload = generatePaytrailPayload(
      stamp,
      reference,
      products,
      formData,
      totalPrice,
      vatPercentage,
      successCallbackUrl,
      successRedirectUrl,
      cancelRedirectUrl
   );
   const paytrailProviderData = await fetchPaytrailProviderData(paytrailPayload);
   return paytrailProviderData;
};

export default generatePaytrailProviderData;
