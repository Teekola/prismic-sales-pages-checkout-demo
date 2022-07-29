const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

const EAZYBREAK_ACCOUNT = process.env.NEXT_PUBLIC_EAZYBREAK_ACCOUNT || "onlinedemo01";
const EAZYBREAK_LOCATION = process.env.NEXT_PUBLIC_EAZYBREAK_LOCATION || "S267";
const EAZYBREAK_URL =
   process.env.NEXT_PUBLIC_EAZYBREAK_URL || "https://demo.eazybreak.com/onlinepayment/create";

export const generateEazybreakData = async (
   reference: string,
   totalPrice: number,
   successCallbackUrl: string,
   successRedirectUrl: string,
   cancelRedirectUrl: string
) => {
   // Parameters
   const eazybreakParameters = [
      {
         name: "merchant",
         value: EAZYBREAK_ACCOUNT,
      },
      {
         name: "merchant_location",
         value: EAZYBREAK_LOCATION,
      },
      {
         name: "payment_id",
         value: reference,
      },
      {
         name: "value",
         value: (totalPrice / 100.0).toFixed(2).toString(),
      },
      {
         name: "success_url",
         value: successRedirectUrl,
      },
      {
         name: "cancel_url",
         value: cancelRedirectUrl,
      },
      {
         name: "language",
         value: "fi",
      },
      {
         name: "mode",
         value: "redirect",
      },
      {
         name: "return_code",
         value: "1",
      },
   ];

   // Add success_url_callback for production only
   if (process.env.NODE_ENV === "production") {
      eazybreakParameters.push({
         name: "success_url_callback",
         value: successCallbackUrl,
      });
   }

   // Derive Body for the checksum calculation
   // From the parameters array
   const checksumBody: { [key: string]: string } = {};
   eazybreakParameters.forEach((param) => {
      checksumBody[param.name] = param.value;
   });

   // Calculate the checksum
   const checksumRes = await fetch(`${WEBSITE_URL}/api/checkout/calculateEazybreakChecksum`, {
      method: "POST",
      headers: {
         "content-type": "application/json",
      },
      body: JSON.stringify(checksumBody),
   });
   const checksum = await checksumRes.json();

   // Add the calculated checksum to the parameters
   eazybreakParameters.push({
      name: "checksum",
      value: checksum,
   });

   // Eazybreak object
   const eazybreak = {
      url: EAZYBREAK_URL,
      name: "Eazybreak",
      id: "eazybreak",
      svg: "https://eazybreak.fi/assets/img/eazybreak-logo.svg",
      parameters: eazybreakParameters,
   };

   return eazybreak;
};
