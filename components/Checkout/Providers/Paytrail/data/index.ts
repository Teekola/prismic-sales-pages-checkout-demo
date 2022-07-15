import generatePaytrailPayload from "./generatePaytrailPayload";
import fetchPaytrailProviderData from "./fetchPaytrailProviderData";
import { CheckoutProductsT } from "contexts/CheckoutContext/types";
import { VatPercentage, FilledCheckoutFormDataT } from "../../types";

const generatePaytrailProviderData = async (
   stamp: string,
   reference: string,
   products: CheckoutProductsT,
   formData: FilledCheckoutFormDataT,
   totalPrice: number,
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
