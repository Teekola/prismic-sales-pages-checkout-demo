import { Customer, Order, Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getOrder } from "prisma/order";
import { useEffect } from "react";

type SuccessProps = {
   orderData: {
      name: Customer["name"];
      reference: Order["reference"];
      id: Order["id"];
   };
};

export default function Success({ orderData }: SuccessProps) {
   // Clear session storage
   useEffect(() => {
      setTimeout(() => {
         sessionStorage.clear();
      }, 500);
   }, []);
   // TODO: Prismiciin onnistuneen tilauksen sivu muokattavaksi
   if (orderData === null) {
      return (
         <>
            <h1>Tapahtui virhe.</h1>
         </>
      );
   }

   return (
      <>
         <h1>Kiitos tilauksestasi!</h1>
         <p>Tilaajan nimi: {orderData.name}</p>
         <p>Reference: {orderData.reference}</p>
         <p>Order id: {orderData.id}</p>
      </>
   );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
   const { query } = context;

   //////////////////////////////////////////////////////////
   // HANDLE DIFFERENT PAYMENT PROVIDERS
   //////////////////////////////////////////////////////////
   // Paytrail
   if (query["checkout-reference"]) {
      const reference = query["checkout-reference"].toString();

      // Get the order data
      const where: Prisma.OrderWhereUniqueInput = { reference };

      const order = await getOrder(where);

      if (order !== null) {
         return {
            props: {
               orderData: {
                  id: order.id,
                  reference: order.reference,
                  name: order.customer.name,
               },
            },
         };
      } else {
         return {
            props: {
               orderData: null,
            },
         };
      }
   }
}
