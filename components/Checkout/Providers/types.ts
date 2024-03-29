import { CheckoutFormDataT } from "contexts/CheckoutContext/types";
import { Prisma } from "@prisma/client";
import { PaytrailResponseT } from "./Paytrail/types";
import { EazybreakT } from "./Eazybreak/types";
import { EpassiT } from "./Epassi/types";
import { SmartumT } from "./Smartum/types";
import { EdenredT } from "./Edenred/types";
import { EmailInvoiceT } from "./FennoaEmailInvoice/types";

export type VatPercentage = 24 | 0;
export type FilledCheckoutFormDataT = NonNullable<CheckoutFormDataT>;
export type ProviderData = {
   data: Prisma.OrderUpdateArgs["data"] | Prisma.OrderCreateArgs["data"];
   paytrail: PaytrailResponseT;
   eazybreak: EazybreakT;
   epassi: EpassiT;
   smartum: SmartumT;
   edenred: EdenredT;
   emailInvoice: EmailInvoiceT;
};
