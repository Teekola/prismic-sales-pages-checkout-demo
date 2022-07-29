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
};

export async function getServerSideProps({ query, previewData, resolvedUrl }: ServerSidePropsT) {
   const client = createClient({ previewData });
   const document = await client.getSingle("checkout_success_page");

   //////////////////////////////////////////////////////////
   // HANDLE DIFFERENT PAYMENT PROVIDERS
   //////////////////////////////////////////////////////////
   // TODO: ADD OTHER PROVIDERS
   // TODO: UPDATE ORDER FOR PROVIDERS WHERE CALLBACK IS NOT POSSIBLE

   // Development only to test the successfulOrder endpoint
   if (process.env.NODE_ENV === "development") {
      const successfulOrder = await fetch(
         `${WEBSITE_URL}/api/checkout/successfulOrder?${resolvedUrl.split("?")[1]}`
      );
      console.log("Successful order response status", successfulOrder.status);
   }

   // Paytrail
   if (query["checkout-reference"]) {
      const reference = query["checkout-reference"].toString();

      // Get the order data
      const where: Prisma.OrderWhereUniqueInput = { reference };

      const order = await getOrder(where);

      if (order === false || order === null) {
         // Get error messages from Prismic document
         const { errorTitle, errorInstructions, errorButtonLink, errorButtonLabel, slices1 } =
            document.data;
         return {
            props: {
               orderData: null,
               title: errorTitle,
               instructions: errorInstructions,
               buttonLink: errorButtonLink,
               buttonLabel: errorButtonLabel,
               slices: slices1,
            },
         };
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

   // Get error messages from Prismic document
   const { errorTitle, errorInstructions, errorButtonLink, errorButtonLabel, slices1 } =
      document.data;
   return {
      props: {
         orderData: null,
         title: errorTitle,
         instructions: errorInstructions,
         buttonLink: errorButtonLink,
         buttonLabel: errorButtonLabel,
         slices: slices1,
      },
   };
}
