import { ProductT } from "contexts/CheckoutContext/types";

const SMARTUM_URL =
   process.env.NEXT_PUBLIC_SMARTUM_URL || "https://api.staging.smartum.fi/checkout";
const SMARTUM_VENUE_ID = process.env.NEXT_PUBLIC_SMARTUM_VENUE_ID || "ven_p86yX97hw74W5Njq";

export const generateSmartumData = async (
   reference: string,
   checkoutProducts: ProductT[],
   totalPrice: number,
   successRedirectUrl: string,
   cancelRedirectUrl: string
) => {
   // Get the product names to a string
   let product_name = "";
   checkoutProducts.forEach((product) => {
      product_name += product.name + " ";
   });
   product_name = product_name.trimEnd();

   // Body to get the url
   const smartumFetchBody = {
      venue: SMARTUM_VENUE_ID,
      amount: totalPrice,
      benefit: "exercise",
      product_name,
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl,
      product_image_url: checkoutProducts[0].imageUrl,
      timeout: 600,
      nonce: reference,
   };

   // Get the url
   const smartumUrlRes = await fetch(SMARTUM_URL, {
      method: "POST",
      headers: {
         "content-type": "application/json",
      },
      body: JSON.stringify(smartumFetchBody),
   });
   const smartumUrlObject = await smartumUrlRes.json();
   const url = smartumUrlObject.data.url;

   // Smartum object
   const smartum = {
      url,
      name: "Smartum",
      id: "smartum",
      svg: "https://badges.smartum.fi/button/color.svg",
   };

   return smartum;
};
