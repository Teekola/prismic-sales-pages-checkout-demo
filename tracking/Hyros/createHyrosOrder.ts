import { Customer, Order } from "@prisma/client";
import { ProductT } from "contexts/CheckoutContext/types";

const HYROS_API_KEY = process.env.HYROS_API_KEY || "";

export default async function createHyrosOrder(
   order: Order & { customer: Customer; products: ProductT[] }
) {
   const { customer, products } = order;
   const createHyrosOrderBody = {
      email: customer.email,
      firstName: customer.name.split(" ")[0],
      lastName: customer.name.split(" ")[1],
      leadIps: [],
      phoneNumbers: [customer.phone],
      provider: "kassa.eroonjumeista.fi",
      orderId: order.id,
      date: order.updatedAt.toISOString().slice(0, -5),
      priceFormat: "INTEGER",
      currency: "EUR",
      items: products,
   };

   // Create new order to hyros
   const hyrosResponse = await fetch("https://api.hyros.com/v1/api/v1.0/orders", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "API-Key": HYROS_API_KEY,
      },
      body: JSON.stringify(createHyrosOrderBody),
   });

   const hyrosResponseData = await hyrosResponse.json();

   // Log for debugging
   console.log("Hyros:", hyrosResponseData);
}
