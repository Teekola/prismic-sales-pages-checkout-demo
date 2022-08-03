import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const getOrderProduct = async (where: Prisma.OrderProductWhereUniqueInput) => {
   try {
      const orderProduct = await prisma.orderProduct.findUnique({
         where,
      });
      return orderProduct;
   } catch (error) {
      console.error("Get orderProduct error", error);
      return false;
   }
};

export const getOrderProducts = async () => {
   try {
      const orderProducts = await prisma.orderProduct.findMany();
      return orderProducts;
   } catch (error) {
      console.error("Get orderProducts error", error);
      return false;
   }
};

export const deleteAllOrderProducts = async () => {
   try {
      const orderProducts = await prisma.orderProduct.deleteMany({});
      return orderProducts;
   } catch (error) {
      console.error("Delete orderProducts error", error);
      return false;
   }
};

/* TODO: REPLACE THIS TO DELETE ORDER FROM ORDERPRODUCTS
export const deleteAllOrdersFromProducts = async () => {
   try {
      const products = await prisma.product.updateMany({
         data: {
            orderIds: [],
         },
      });
      return products;
   } catch (error) {
      console.error("Delete orders from products error", error);
      return false;
   }
};

export const deleteOrderFromProducts = async (reference: string) => {
   try {
      // Get the id of the order
      const order = await prisma.order.findUnique({
         select: { id: true },
         where: { reference },
      });
      // If the order does not exist, end
      if (order === null) return true;

      const orderId = order.id;

      // Get productIds and orderIds of products that have the orderId
      const productsToUpdate = await prisma.product.findMany({
         select: {
            id: true,
            orderIds: true,
         },
         where: {
            orderIds: {
               has: orderId,
            },
         },
      });

      // Remove the orderId from each product
      for (let product of productsToUpdate) {
         await prisma.product.update({
            where: {
               id: product.id,
            },
            data: {
               orderIds: product.orderIds.filter((id) => id !== orderId),
            },
         });
      }
      return true;
   } catch (error) {
      console.error("Delete order from products error", error);
      return false;
   }
};
*/
