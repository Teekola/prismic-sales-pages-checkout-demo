import { PaytrailParams, PaytrailResponseT } from "../types";

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

const fetchPaytrailProviderData = async (body: PaytrailParams): Promise<PaytrailResponseT> => {
   // Fetch and validate the data
   const response = await fetch(`${WEBSITE_URL}/api/checkout/createPaytrailPayment`, {
      method: "POST",
      headers: {
         "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
   });

   // Turn into JSON
   const data = await response.json();

   if (!data.error) {
      data.status = "ok";
   }

   // Return the validated dataobject in the response object.
   return data;
};

export default fetchPaytrailProviderData;
