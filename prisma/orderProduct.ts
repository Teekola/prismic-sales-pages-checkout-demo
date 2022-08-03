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

export const deleteAllOrdersFromOrderProducts = async () => {
   try {
      const orderProducts = await prisma.orderProduct.updateMany({
         data: {
            orderIds: [],
         },
      });
      return orderProducts;
   } catch (error) {
      console.error("Delete orders from orderProducts error", error);
      return false;
   }
};

export const deleteOrderFromOrderProducts = async (reference: string) => {
   try {
      // Get the id of the order
      const order = await prisma.order.findUnique({
         select: { id: true },
         where: { reference },
      });
      // If the order does not exist, end
      if (order === null) return true;

      const orderId = order.id;

      // Get ids and orderIds of orderProducts that have the orderId
      const orderProductsToUpdate = await prisma.orderProduct.findMany({
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

      // Remove the orderId from each orderProduct
      for (let orderProduct of orderProductsToUpdate) {
         await prisma.orderProduct.update({
            where: {
               id: orderProduct.id,
            },
            data: {
               orderIds: orderProduct.orderIds.filter((id) => id !== orderId),
            },
         });
      }
      return true;
   } catch (error) {
      console.error("Delete order from orderProducts error", error);
      return false;
   }
};
