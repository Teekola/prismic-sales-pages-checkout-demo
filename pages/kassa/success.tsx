import { Customer, Order, Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getOrder } from "prisma/order";
import { useEffect } from "react";

type SuccessProps = {
   orderData: Partial<Order & Customer>;
};

export default function Success({ orderData }: SuccessProps) {
   // Clear session storage
   useEffect(() => {
      setTimeout(() => {
         sessionStorage.clear();
      }, 500);
   }, []);
   // TODO: Prismiciin onnistuneen tilauksen sivu muokattavaksi
   return (
      <>
         <h1>Kiitos tilauksestasi!</h1>
         <p>Tilaajan nimi: {orderData?.name}</p>
         <p>Reference: {orderData?.reference}</p>
         <p>Transaction reference: {orderData?.transactionReference}</p>
      </>
   );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
   const { req, query } = context;

   //////////////////////////////////////////////////////////
   // HANDLE DIFFERENT PAYMENT PROVIDERS
   //////////////////////////////////////////////////////////
   try {
      // Paytrail
      if (query["checkout-reference"]) {
         const transactionReference = query["checkout-reference"].toString();

         // Get the order data
         const where: Prisma.OrderWhereUniqueInput = { transactionReference };

         const order = await getOrder(where);
         const orderData = {
            name: order?.customer?.name,
            reference: order?.reference,
            transactionReference: order?.transactionReference,
         };

         // Return order reference
         return {
            props: {
               orderData,
            },
         };
      }
   } catch (error) {
      console.log(error);

      return {
         props: {
            orderData: null,
         },
      };
   }
}
