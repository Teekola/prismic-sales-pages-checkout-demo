import { Customer, Order, Prisma } from "@prisma/client";
import { getOrder } from "prisma/order";
import { createClient } from "prismicio";
import { useEffect } from "react";
import { KeyTextField, RichTextField, LinkField } from "@prismicio/types";
import * as prismicH from "@prismicio/helpers";
import { PrismicLink, SliceLike, SliceZone, SliceZoneLike } from "@prismicio/react";
import { components } from "slices";
import { ParsedUrlQuery } from "querystring";
import Layout from "components/layouts/productPageLayout";
import { IncomingMessage } from "http";
import getRawBody from "raw-body";
import calculateSmartumResponseJwt from "components/Checkout/Providers/Smartum/data/calculateSmartumResponseJwt";

const WEBSITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

type SuccessProps = {
   orderData: {
      name: Customer["name"];
      reference: Order["reference"];
      id: Order["id"];
      email: Customer["email"];
   };
   title: KeyTextField;
   instructions: RichTextField;
   buttonLink: LinkField;
   buttonLabel: KeyTextField;
   slices: SliceZoneLike<SliceLike<string>> | undefined;
};

export default function Success({
   orderData,
   title,
   instructions,
   buttonLink,
   buttonLabel,
   slices,
}: SuccessProps) {
   // Clear session storage
   useEffect(() => {
      setTimeout(() => {
         sessionStorage.clear();
      }, 500);
   }, []);

   // Inject name and email values to the texts
   let injectedTitle = title;
   let injectedInstructions = prismicH.asHTML(instructions);
   if (orderData !== null) {
      injectedTitle = injectedTitle
         ? injectedTitle.replace(/{{name}}/g, orderData.name.split(" ")[0])
         : null;
      injectedInstructions = injectedInstructions
         .replace(/{{name}}/g, orderData.name.split(" ")[0])
         .replace(/{{email}}/g, orderData.email);
   }

   return (
      <Layout>
         <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h1>{injectedTitle}</h1>
            <div
               style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  maxWidth: "75ch",
                  marginBottom: "1rem",
               }}
               dangerouslySetInnerHTML={{ __html: injectedInstructions }}
            ></div>
            {buttonLink && buttonLabel && (
               <PrismicLink field={buttonLink}>
                  <button className="primary-cta">{buttonLabel}</button>
               </PrismicLink>
            )}

            <SliceZone slices={slices} components={components} />
         </div>
      </Layout>
   );
}

type ServerSidePropsT = {
   query: ParsedUrlQuery;
   previewData: any;
   resolvedUrl: string;
   req: IncomingMessage & { cookies: { [key: string]: string } };
};

export async function getServerSideProps({
   query,
   previewData,
   resolvedUrl,
   req,
}: ServerSidePropsT) {
   const client = createClient({ previewData });
   const document = await client.getSingle("checkout_success_page");

   // Error return object
   const { errorTitle, errorInstructions, errorButtonLink, errorButtonLabel, slices1 } =
      document.data;
   const error = {
      props: {
         orderData: null,
         title: errorTitle,
         instructions: errorInstructions,
         buttonLink: errorButtonLink,
         buttonLabel: errorButtonLabel,
         slices: slices1,
      },
   };

   //////////////////////////////////////////////////////////
   // HANDLE DIFFERENT PAYMENT PROVIDERS
   //////////////////////////////////////////////////////////
   // TODO: ADD SÄHKÖPOSTILASKU

   // Development only to test the successfulOrder endpoint
   if (process.env.NODE_ENV === "development" && !query["ePassi-order"] && !query["jwt"]) {
      const successfulOrder = await fetch(
         `${WEBSITE_URL}/api/checkout/successfulOrder?${resolvedUrl.split("?")[1]}`
      );
      console.log("Successful order response status", successfulOrder.status);
   }

   /////////////////////////////////////////
   // Smartum reference + successfulOrder //
   /////////////////////////////////////////
   let smartumReference = null;
   if (query["jwt"]) {
      // Get and verify Smartum data
      const { header, payload } = calculateSmartumResponseJwt(query["jwt"] as string);
      const header1 = header as { [key: string]: any };
      const payload1 = payload as { [key: string]: any };

      // Set nonce as the smartumReferenec
      smartumReference = payload1.nonce;

      // Create queryparameter string
      let smartumQueryParams = "";
      Object.keys(header1).forEach((headerKey) => {
         smartumQueryParams += headerKey + "=" + header1[headerKey] + "&";
      });
      Object.keys(payload1).forEach((payloadKey) => {
         smartumQueryParams += payloadKey + "=" + payload1[payloadKey] + "&";
      });
      smartumQueryParams = smartumQueryParams.substring(0, smartumQueryParams.length - 1);

      // Call successfulOrder for Smartum
      const successfulOrderRes = await fetch(
         `${WEBSITE_URL}/api/checkout/successfulOrder?${smartumQueryParams}`
      );
      console.log("Smartum successful order status:", successfulOrderRes.status);
   }

   // Get reference from: Paytrail (Edenred) || Eazybreak || ePassi || Smartum
   const reference =
      query["checkout-reference"] ||
      query["payment_id"] ||
      query["ePassi-order"] ||
      smartumReference;

   // Handle error
   if (typeof reference !== "string") {
      return error;
   }

   // Get the order data
   const where: Prisma.OrderWhereUniqueInput = { reference };
   const order = await getOrder(where);

   // Handle error
   if (order === false || order === null) {
      return error;
   }

   /////////////////////////////////////
   // Call successfulOrder for ePassi //
   /////////////////////////////////////
   if (req.method === "POST" && query["ePassi-order"]) {
      // Get the post data as a string
      const bodyBuffer = await getRawBody(req);
      const bodyString = bodyBuffer.toString("utf-8");
      console.log("ePassiBodyString:", bodyString);

      // Transform the body string into object
      const bodyValues = bodyString.split("&");
      const body: { [key: string]: any } = {};
      let values;
      for (let attribute of bodyValues) {
         values = attribute.split("=");
         body[values[0]] = values[1];
      }
      console.log("ePassiBody:", body);

      // Post the ePassi data to successfulOrder
      const successfulOrderRes = await fetch(`${WEBSITE_URL}/api/checkout/successfulOrder`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(body),
      });
      console.log("Epassi successful order status:", successfulOrderRes.status);
   }

   // Get success messages from Prismic document
   const { successTitle, successInstructions, successButtonLink, successButtonLabel, slices } =
      document.data;

   return {
      props: {
         orderData: {
            id: order.id,
            reference: order.reference,
            name: order.customer.name,
            email: order.customer.email,
         },
         title: successTitle,
         instructions: successInstructions,
         buttonLink: successButtonLink,
         buttonLabel: successButtonLabel,
         slices,
      },
   };
}
