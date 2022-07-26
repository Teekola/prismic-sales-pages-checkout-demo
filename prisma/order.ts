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

// Create a new order with data
export const createOrder = async (data: CreateOrderData) => {
   try {
      const order = await prisma.order.create({
         data,
         include: {
            customer: true,
         },
      });
      return order;
   } catch (error) {
      console.error("Create order error", error);
   }
};

// Update the order's data
export const updateOrder = async (data: UpdateOrderData, where: Prisma.OrderWhereUniqueInput) => {
   try {
      const order = await prisma.order.update({
         data,
         where,
         include: {
            customer: true,
         },
      });
      return order;
   } catch (error) {
      console.error("Update order error", error);
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
