import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { CreateOrderData, UpdateOrderData } from "./types";

// Get the correct order using the reference
export const getOrder = async (where: Prisma.OrderWhereUniqueInput) => {
   try {
      const order = await prisma.order.findUnique({
         where,
         include: {
            customer: true,
         },
      });
      return order;
   } catch (error) {
      console.error("Get order error", error);
      return null;
   }
};

// Get multiple orders
export const getOrders = async (select?: Prisma.OrderSelect, where?: Prisma.OrderWhereInput) => {
   try {
      const orders = await prisma.order.findMany({
         select,
         where,
         take: 100,
      });
      return orders;
   } catch (error) {
      console.error("Get orders error", error);
      return null;
   }
};

// Create a new order with data from the obj
export const createOrder = async (data: CreateOrderData) => {
   // Copy the reference to be also transactionReference
   data.transactionReference = data.reference;
   await prisma.order.create({
      data,
   });
};

// Update the order's data
// where is optional, default is to use the reference
// where is needed to change the status to success based on transactionReference
export const updateOrder = async (data: UpdateOrderData, where: Prisma.OrderWhereUniqueInput) => {
   try {
      await prisma.order.update({
         data,
         where,
      });
   } catch (error) {
      console.error("Update order error", error);
   }
};

// Upsert order
export const upsertOrder = async (
   reference: string,
   update: UpdateOrderData,
   create: CreateOrderData
) => {
   try {
      const upserted = await prisma.order.upsert({
         where: { reference },
         update,
         create,
         include: {
            products: true,
            customer: true,
         },
      });
      const created = upserted.reference === upserted.transactionReference;
      return created;
   } catch (error) {
      console.log(error);
      return null;
   }
};

export const deleteAllOrders = async () => {
   await prisma.order.deleteMany({});
   console.log("All orders have been deleted");
};

export const deleteOrder = async (reference: string) => {
   try {
      await prisma.order.delete({
         where: { reference },
      });
      return true;
   } catch (error) {
      return false;
   }
};
