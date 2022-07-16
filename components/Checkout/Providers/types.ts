import { CheckoutFormDataT } from "contexts/CheckoutContext/types";
import { PaytrailResponseT } from "./Paytrail/types";

export type VatPercentage = 24 | 0;
export type FilledCheckoutFormDataT = NonNullable<CheckoutFormDataT>;
export type ProviderData = {
   paytrail: PaytrailResponseT;
};