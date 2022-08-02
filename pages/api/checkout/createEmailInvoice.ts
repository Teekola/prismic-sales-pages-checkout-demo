import type { NextApiRequest, NextApiResponse } from "next";
import type {
   FennoaFormData,
   FennoaInvoiceRow,
   FennoaInvoiceRowKey,
} from "components/Checkout/Providers/FennoaEmailInvoice/types";
const FormData = require("form-data");

// Credentials for Basic Authentication
const API_USER = process.env.FENNOA_API_USER;
const API_KEY = process.env.FENNOA_API_KEY;
const credentials = API_USER + ":" + API_KEY;
const credentialsBase64 = Buffer.from(credentials).toString("base64");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") return res.status(400).json({ error: "wrong method" });

   // Create body for the request to Fennoa
   const formDataJSON: FennoaFormData = req.body;
   const formData = new FormData();

   // Go through the formDataJSON and add the
   // key-value pairs to the formData
   for (let pair of Object.entries(formDataJSON)) {
      // Handle rows separately
      if (pair[0] == "row") {
         // Iterate through each row in the invoice rows
         (pair[1] as FennoaInvoiceRow[]).forEach((row: FennoaInvoiceRow, index: number) => {
            (Object.keys(row) as Array<FennoaInvoiceRowKey>).forEach((key) => {
               // Add key-value pairs to the formData
               formData.append(`row[${index + 1}][${key}]`, row[key]);
            });
         });
      }
      // Add the key-value pair directly
      else {
         formData.append(pair[0], pair[1]);
      }
   }

   try {
      // Create invoice
      const sales_api_add = await fetch("https://app.fennoa.com/api/sales_api/add", {
         method: "POST",
         headers: {
            Authorization: `Basic ${credentialsBase64}`,
         },
         body: formData,
      });
      const add_json = await sales_api_add.json();

      // Handle errors
      if (add_json.status === "error") {
         return res.status(200).json({ errors: add_json.errors });
      }

      // Get the id of the created invoice
      const { id } = add_json;
      console.log(`Invoice id ${id} was created.`);

      // Approve the invoice
      const sales_api_do_approve = await fetch(
         `https://app.fennoa.com/api/sales_api/do/approve/${id}`,
         {
            method: "POST",
            headers: {
               Authorization: `Basic ${credentialsBase64}`,
            },
         }
      );
      const approve_json = await sales_api_do_approve.json();
      if (approve_json.status === "ok") {
         console.log(`Invoice id ${id} was approved.`);
      }

      // Send the invoice
      const sales_api_do_send = await fetch(`https://app.fennoa.com/api/sales_api/do/send/${id}`, {
         method: "POST",
         headers: {
            Authorization: `Basic ${credentialsBase64}`,
         },
      });
      const send_json = await sales_api_do_send.json();
      if (send_json.status === "ok") {
         console.log(`Invoice id ${id} was sent.`);
      }
   } catch (error) {
      console.log(error);
      return res.status(400).json({ status: "error", error });
   }

   return res.status(201).json({ status: "ok", message: "invoice has been created" });
}
