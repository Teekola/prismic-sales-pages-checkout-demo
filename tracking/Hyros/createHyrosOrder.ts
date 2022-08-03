import { Customer, Order, OrderProduct, Product } from "@prisma/client";

const HYROS_API_KEY = process.env.HYROS_API_KEY || "";

export default async function createHyrosOrder(
   order: Order & { customer: Customer; products: (OrderProduct & { product: Product })[] }
) {
   const { customer, products } = order;
   console.log(order);

   const items = products.map((orderProduct) => {
      const { quantity, price, product } = orderProduct;
      const { name, id } = product;
      return {
         name,
         price,
         externalId: id,
         quantity,
      };
   });
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
      items,
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
