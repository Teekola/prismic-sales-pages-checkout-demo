import { CheckoutFormDataT } from "contexts/CheckoutContext/types";
import { OrderUpsert } from "prisma/types";
import { PaytrailResponseT } from "./Paytrail/types";

export type VatPercentage = 24 | 0;
export type FilledCheckoutFormDataT = NonNullable<CheckoutFormDataT>;
export type ProviderData = {
   upsert: OrderUpsert;
   paytrail: PaytrailResponseT;
};
