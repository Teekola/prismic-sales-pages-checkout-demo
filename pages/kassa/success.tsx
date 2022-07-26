import { Customer, Order, Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getOrder } from "prisma/order";
import { createClient } from "prismicio";
import { useEffect } from "react";
import { KeyTextField, RichTextField, LinkField } from "@prismicio/types";
import {
   PrismicLink,
   PrismicRichText,
   SliceLike,
   SliceZone,
   SliceZoneLike,
} from "@prismicio/react";
import { components } from "slices";
import { ParsedUrlQuery } from "querystring";

type SuccessProps = {
   orderData: {
      name: Customer["name"];
      reference: Order["reference"];
      id: Order["id"];
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

   // TODO: Function to inject orderdata to correct positions
   return (
      <>
         <h1>{title}</h1>
         <PrismicRichText field={instructions}></PrismicRichText>
         {buttonLink && buttonLabel && (
            <PrismicLink field={buttonLink}>
               <button className="primary-cta">{buttonLabel}</button>
            </PrismicLink>
         )}

         <SliceZone slices={slices} components={components} />
      </>
   );
}

type ServerSidePropsT = {
   query: ParsedUrlQuery;
   previewData: any;
};
export async function getServerSideProps({ query, previewData }: ServerSidePropsT) {
   const client = createClient({ previewData });
   const document = await client.getSingle("checkout_success_page");

   //////////////////////////////////////////////////////////
   // HANDLE DIFFERENT PAYMENT PROVIDERS
   //////////////////////////////////////////////////////////
   // TODO: ADD OTHER PROVIDERS
   // TODO: UPDATE ORDER FOR PROVIDERS WHERE CALLBACK IS NOT POSSIBLE
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
