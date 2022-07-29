import epassiSvg from "./epassi.webp";
const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
const EPASSI_SITE = process.env.NEXT_PUBLIC_EPASSI_SITE || "77190";
const EPASSI_URL =
   process.env.NEXT_PUBLIC_EPASSI_URL || "https://prodstaging.epassi.fi/e_payments/v2";

export const generateEpassiData = async (
   reference: string,
   totalPrice: number,
   successCallbackUrl: string,
   successRedirectUrl: string,
   cancelRedirectUrl: string
) => {
   // Body for epassi mac
   const macBody = {
      stamp: reference,
      amount: (totalPrice / 100.0).toFixed(2).toString(),
   };

   // Calculate epassi mac
   const macRes = await fetch(`${WEBSITE_URL}/api/checkout/calculateEpassiMac`, {
      method: "POST",
      headers: {
         "content-type": "application/json",
      },
      body: JSON.stringify(macBody),
   });
   const mac = await macRes.json();

   // Parameters
   const parameters = [
      {
         name: "STAMP",
         value: reference,
      },
      {
         name: "SITE",
         value: EPASSI_SITE,
      },
      {
         name: "AMOUNT",
         value: (totalPrice / 100.0).toFixed(2).toString(),
      },
      {
         name: "REJECT",
         value: cancelRedirectUrl, // TODO: kassa/fail -sivu näitä tilanteita varten? Popup maksutavan-valintasivulle, kun tietty url-parametri löytyy?
      },
      {
         name: "CANCEL",
         value: cancelRedirectUrl,
      },
      {
         name: "RETURN",
         value: `${successRedirectUrl}&ePassi-order=${reference}`,
      },
      {
         name: "MAC",
         value: mac,
      },
      {
         name: "NOTIFY_URL",
         value: successCallbackUrl,
      },
   ];

   // ePassi object
   const epassi = {
      url: EPASSI_URL,
      name: "ePassi",
      id: "epassi",
      svg: epassiSvg.src,
      parameters,
   };
   return epassi;
};
