import {
   PaytrailItem,
   PaytrailCustomer,
   PaytrailRedirectUrls,
   PaytrailCallbackUrls,
   PaytrailParams,
} from "../types";
import { VatPercentage, FilledCheckoutFormDataT } from "../../types";
import { ProductT } from "contexts/CheckoutContext/types";

///////////////////////////////////////
// PAYTRAIL
///////////////////////////////////////

const generatePaytrailPayload = (
   stamp: string,
   reference: string,
   products: ProductT[],
   formData: FilledCheckoutFormDataT,
   totalPrice: number,
   vatPercentage: VatPercentage,
   successCallbackUrl: string,
   successRedirectUrl: string,
   cancelRedirectUrl: string
) => {
   // items
   const items: Array<PaytrailItem> = [];
   products.forEach((product) => {
      let item: PaytrailItem = {
         unitPrice: product.discountPrice !== undefined ? product.discountPrice : product.price,
         units: product.quantity,
         vatPercentage,
         productCode: product.id.toString(),
         description: product.name,
      };
      items.push(item);
   });

   // customer
   const customer: PaytrailCustomer = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone.replace(/ |\+/g, ""), // Remove empty spaces and possible + sign
   };

   // redirectUrls
   const redirectUrls: PaytrailRedirectUrls = {
      success: successRedirectUrl,
      cancel: cancelRedirectUrl,
   };

   const callbackUrls: PaytrailCallbackUrls = {
      success: successCallbackUrl,
   };

   // Create paytrail object
   const paytrail: PaytrailParams = {
      stamp,
      reference,
      items,
      amount: totalPrice,
      currency: "EUR",
      language: "FI",
      customer,
      redirectUrls,
      callbackUrls,
   };

   if (process.env.NODE_ENV === "development") {
      paytrail.callbackUrls.success = "/";
   }
   return paytrail;
};

export default generatePaytrailPayload;
