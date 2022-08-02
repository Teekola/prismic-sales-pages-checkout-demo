import { CheckoutReferenceT, DiscountT } from "contexts/CheckoutContext/types";
import { VatPercentage, FilledCheckoutFormDataT } from "../types";
import { applyDiscountToProducts, calculateDiscountedTotalPrice } from "../../Products/prices";
import generatePaytrailProviderData from "../Paytrail/data";
import { ProviderData } from "../types";
import { generateCheckoutReference } from "../../data/checkoutReference";
import { ProductT } from "contexts/CheckoutContext/types";
import { Prisma } from "@prisma/client";
import { generateEazybreakData } from "../Eazybreak/data/generateEazybreakData";
import { generateEpassiData } from "../Epassi/data/generateEpassiData";
import { generateSmartumData } from "../Smartum/data/generateSmartumData";
import { generateEdenredData } from "../Edenred/data/generateEdenredData";
import { generateEmailInvoiceData } from "../FennoaEmailInvoice/data/generateEmailInvoiceData";

const vatPercentage: VatPercentage = 24;
const ABSOLUTE_URL =
   process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : `https://${process.env.NEXT_PUBLIC_URL}`;
// const RELATIVE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

// Generate payloads for all payment providers
const generateProviderData = async (
   checkoutProducts: ProductT[],
   checkoutFormData: FilledCheckoutFormDataT,
   checkoutDiscount: DiscountT,
   setCheckoutReference: (newCheckoutReference: CheckoutReferenceT) => void
): Promise<ProviderData> => {
   ///////////////////////////////////////
   // UNIVERSAL PROPERTIES
   ///////////////////////////////////////
   const stamp = generateCheckoutReference();
   const reference = stamp.toString();
   setCheckoutReference(reference);
   const discountedProducts = checkoutDiscount
      ? applyDiscountToProducts(checkoutProducts, checkoutDiscount)
      : [...checkoutProducts];
   const totalPrice = calculateDiscountedTotalPrice(discountedProducts);
   const successCallbackUrl = `${ABSOLUTE_URL}/api/checkout/successfulOrder`;
   const successRedirectUrl = `${ABSOLUTE_URL}/kassa/success?pid=${checkoutProducts[0]?.id}&tp=${totalPrice}`;
   const cancelRedirectUrl = `${ABSOLUTE_URL}/kassa`;

   ///////////////////////////////////////
   // DATA FOR ORDER CREATE
   ///////////////////////////////////////
   const data: Prisma.OrderUpdateArgs["data"] | Prisma.OrderCreateArgs["data"] = {
      reference,
      products: {
         connect: checkoutProducts.map((checkoutProduct) => {
            return { id: checkoutProduct.id };
         }),
      },
      provider: "Odottaa valintaa",
      totalPrice,
      customer: {
         connectOrCreate: {
            where: {
               email: checkoutFormData.email,
            },
            create: {
               email: checkoutFormData.email,
               name: checkoutFormData.firstName + " " + checkoutFormData.lastName,
               phone: checkoutFormData.phone,
               city: checkoutFormData.city,
            },
         },
      },
   };

   ///////////////////////////////////////
   // PROVIDERS
   ///////////////////////////////////////
   const paytrail = await generatePaytrailProviderData(
      stamp,
      reference,
      discountedProducts,
      checkoutFormData,
      totalPrice,
      vatPercentage,
      successCallbackUrl,
      successRedirectUrl,
      cancelRedirectUrl
   );

   ///////////////////////////////////////
   // EAZYBREAK
   ///////////////////////////////////////
   const eazybreak = await generateEazybreakData(
      reference,
      totalPrice,
      successCallbackUrl,
      successRedirectUrl,
      cancelRedirectUrl
   );

   ///////////////////////////////////////
   // EPASSI
   ///////////////////////////////////////
   const epassi = await generateEpassiData(
      reference,
      totalPrice,
      successCallbackUrl,
      successRedirectUrl,
      cancelRedirectUrl
   );

   ///////////////////////////////////////
   // SMARTUM
   ///////////////////////////////////////

   const smartum = await generateSmartumData(
      reference,
      checkoutProducts,
      totalPrice,
      successRedirectUrl,
      cancelRedirectUrl
   );

   ///////////////////////////////////////
   // EDENRED
   ///////////////////////////////////////
   const edenred = generateEdenredData();

   ///////////////////////////////////////
   // EMAIL
   ///////////////////////////////////////
   const emailInvoice = generateEmailInvoiceData();

   ///////////////////////////////////////
   // RETURN OBJECT
   ///////////////////////////////////////
   const payloads = {
      data,
      paytrail,
      eazybreak,
      epassi,
      smartum,
      edenred,
      emailInvoice,
   };

   return payloads;
};

export default generateProviderData;
