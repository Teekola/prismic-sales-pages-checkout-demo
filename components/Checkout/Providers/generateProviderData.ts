/*
import epassiSvg from "../../public/epassi.webp";
import edenredPng from "../../public/edenred.png";
import emailInvoicePng from "../../public/emailInvoice.png";
*/
import { CheckoutOrderIdT, CheckoutReferenceT, DiscountT } from "contexts/CheckoutContext/types";
import { VatPercentage, FilledCheckoutFormDataT } from "./types";
import { applyDiscountToProducts, calculateDiscountedTotalPrice } from "../Products/prices";
import generatePaytrailProviderData from "./Paytrail/data";
import { ProviderData } from "./types";
import { generateCheckoutReference } from "../data/checkoutReference";
import { ProductT } from "contexts/CheckoutContext/types";
import { Prisma } from "@prisma/client";
import { generateEazybreakData } from "./Eazybreak/data/generateEazybreakData";
import { generateEpassiData } from "./Epassi/data/generateEpassiData";

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

   /*
   ///////////////////////////////////////
   // SMARTUM
   ///////////////////////////////////////

   // Get the product names to a string
   let product_name = "";
   checkoutProducts.forEach((product) => {
      product_name += product.name + " ";
   });
   product_name = product_name.trimEnd();

   // Body to get the url
   const smartumFetchBody = {
      venue: process.env.NEXT_PUBLIC_SMARTUM_VENUE_ID,
      amount: sum,
      benefit: "exercise",
      product_name,
      success_url: `${ABSOLUTE_URL}/kiitos/${items[0].productCode}-${paytrail.amount}`,
      cancel_url: cancel_url,
      product_image_url: checkoutProducts[0].image_url,
      timeout: 600,
      nonce: reference,
   };

   // Get the url
   const fetchSmartumUrl = await fetch(process.env.NEXT_PUBLIC_SMARTUM_URL, {
      method: "POST",
      headers: {
         "content-type": "application/json",
      },
      body: JSON.stringify(smartumFetchBody),
   });
   const smartumUrlObject = await fetchSmartumUrl.json();
   const smartumUrl = smartumUrlObject.data.url;

   // Parameters
   const smartumParameters = [];

   // Smartum object
   const smartum = {
      url: smartumUrl,
      name: "Smartum",
      id: "smartum",
      svg: "https://badges.smartum.fi/button/color.svg",
      parameters: smartumParameters,
   };

   ///////////////////////////////////////
   // EDENRED
   ///////////////////////////////////////
   const edenred = {
      name: "Edenred",
      id: "edenred",
      svg: edenredPng.src,
   };

   ///////////////////////////////////////
   // EMAIL
   ///////////////////////////////////////
   const emailInvoice = {
      name: "Sähköpostilasku + 0 €",
      id: "emailinvoice",
      svg: emailInvoicePng.src,
      data: {
         customer: checkoutFormData,
         products: checkoutProducts,
         amount: paytrail.amount,
         reference: paytrail.reference,
      },
      success_url: `${redirectUrls.success}?email-reference=${paytrail.reference}`,
      parameters: [],
   };

	*/
   ///////////////////////////////////////
   // RETURN OBJECT
   ///////////////////////////////////////
   const payloads = {
      data,
      paytrail,
      eazybreak,
      epassi,
      /*
      smartum,
      edenred,
      emailInvoice,
		*/
   };

   return payloads;
};

export default generateProviderData;
