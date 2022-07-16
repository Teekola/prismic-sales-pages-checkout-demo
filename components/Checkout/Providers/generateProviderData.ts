/*
import epassiSvg from "../../public/epassi.webp";
import edenredPng from "../../public/edenred.png";
import emailInvoicePng from "../../public/emailInvoice.png";
*/
import { CheckoutProductsT, DiscountT } from "contexts/CheckoutContext/types";
import { VatPercentage, FilledCheckoutFormDataT } from "./types";
import { applyDiscountToProducts, calculateDiscountedTotalPrice } from "../Products/prices";
import generatePaytrailProviderData from "./Paytrail/data";
import { ProviderData } from "./types";

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
   checkoutProducts: CheckoutProductsT,
   checkoutFormData: FilledCheckoutFormDataT,
   checkoutDiscount: DiscountT
): Promise<ProviderData> => {
   ///////////////////////////////////////
   // UNIVERSAL PROPERTIES
   ///////////////////////////////////////
   const stamp = Math.round(Date.now() + Math.random()).toString();
   const reference = stamp.toString();
   const discountedProducts = checkoutDiscount
      ? applyDiscountToProducts(checkoutProducts, checkoutDiscount)
      : [...checkoutProducts];
   const totalPrice = calculateDiscountedTotalPrice(discountedProducts);
   const successCallbackUrl = `${ABSOLUTE_URL}/api/successfulOrder`;
   const successRedirectUrl = `${ABSOLUTE_URL}/kiitos/${checkoutProducts[0]?.id}-${totalPrice}`;
   const cancelRedirectUrl = `${ABSOLUTE_URL}/kassa`;

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
   /*
   ///////////////////////////////////////
   // EAZYBREAK
   ///////////////////////////////////////

   // Parameters
   const eazybreakParameters = [
      {
         name: "merchant",
         value: process.env.NEXT_PUBLIC_EAZYBREAK_ACCOUNT,
      },
      {
         name: "merchant_location",
         value: process.env.NEXT_PUBLIC_EAZYBREAK_LOCATION,
      },
      {
         name: "payment_id",
         value: reference,
      },
      {
         name: "value",
         value: (sum / 100.0).toFixed(2).toString(),
      },
      {
         name: "success_url",
         value: `${ABSOLUTE_URL}/kiitos/${items[0].productCode}-${paytrail.amount}`,
      },
      {
         name: "cancel_url",
         value: cancel_url,
      },
      {
         name: "language",
         value: "fi",
      },
      {
         name: "mode",
         value: "redirect",
      },
   ];

   // callBackUrls: activates courses, production only
   if (process.env.NODE_ENV === "production") {
      eazybreakParameters.push({
         name: "success_url_callback",
         value: `${ABSOLUTE_URL}/api/successfulOrder`,
      });
   }

   // Body for the checksum calculation
   const eazybreakBody = {};
   eazybreakParameters.forEach((param) => {
      eazybreakBody[param.name] = param.value;
   });

   // Calculate the checksum
   const apiUrl = `${RELATIVE_URL}/api/eazybreakChecksum`;
   const generateEazybreakChecksum = await fetch(apiUrl, {
      method: "POST",
      headers: {
         "content-type": "application/json",
      },
      body: JSON.stringify(eazybreakBody),
   });
   const eazybreakChecksumObject = await generateEazybreakChecksum.json();
   const eazybreakChecksum = eazybreakChecksumObject.checksum;

   // Add the calculated checksum to the parameters
   eazybreakParameters.push({
      name: "checksum",
      value: eazybreakChecksum,
   });

   // Eazybreak object
   const eazybreak = {
      url: process.env.NEXT_PUBLIC_EAZYBREAK_URL,
      name: "Eazybreak",
      id: "eazybreak",
      svg: "https://eazybreak.fi/assets/img/eazybreak-logo.svg",
      parameters: eazybreakParameters,
   };

   ///////////////////////////////////////
   // EPASSI
   ///////////////////////////////////////

   // Body for epassi mac
   const epassiBody = {
      stamp: reference,
      amount: (sum / 100.0).toFixed(2).toString(),
   };

   // Calculate epassi mac
   const generateEpassiMac = await fetch(`${RELATIVE_URL}/api/epassiMac`, {
      method: "POST",
      headers: {
         "content-type": "application/json",
      },
      body: JSON.stringify(epassiBody),
   });
   const epassiMacObject = await generateEpassiMac.json();
   const epassiMac = epassiMacObject.mac;

   // Parameters
   const epassiParameters = [
      {
         name: "STAMP",
         value: reference,
      },
      {
         name: "SITE",
         value: process.env.NEXT_PUBLIC_EPASSI_SITE,
      },
      {
         name: "AMOUNT",
         value: (sum / 100.0).toFixed(2).toString(),
      },
      {
         name: "REJECT",
         value: "https://www.eroonjumeista.fi/tilaus-keskeytyi",
      },
      {
         name: "CANCEL",
         value: cancel_url,
      },
      {
         name: "RETURN",
         value: `${ABSOLUTE_URL}/kiitos/${items[0].productCode}-${paytrail.amount}?ePassi-order=${reference}`,
      },
      {
         name: "MAC",
         value: epassiMac,
      },
      {
         name: "NOTIFY_URL",
         value: `${ABSOLUTE_URL}/api/successfulOrder`,
      },
   ];

   // ePassi object
   const epassi = {
      url: process.env.NEXT_PUBLIC_EPASSI_URL,
      name: "ePassi",
      id: "epassi",
      svg: epassiSvg.src,
      parameters: epassiParameters,
   };

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
      paytrail,
      /*
		eazybreak,
      epassi,
      smartum,
      edenred,
      emailInvoice,
		*/
   };
   return payloads;
};

export default generateProviderData;
