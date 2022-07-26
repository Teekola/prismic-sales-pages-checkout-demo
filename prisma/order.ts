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
      return false;
   }
};

// Get multiple orders
export const getOrders = async (
   select?: Prisma.OrderSelect,
   where?: Prisma.OrderWhereInput,
   take?: number
) => {
   try {
      const orders = await prisma.order.findMany({
         select,
         where,
         take: take ? take : 100,
      });
      return orders;
   } catch (error) {
      console.error("Get orders error", error);
      return false;
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
      return false;
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
      return false;
   }
};

export const deleteAllOrders = async () => {
   try {
      const orders = await prisma.order.deleteMany({});
      return orders;
   } catch (error) {
      console.error("Delete orders error", error);
      return false;
   }
};

export const deleteOrder = async (where: Prisma.OrderDeleteArgs["where"]) => {
   try {
      const order = await prisma.order.delete({
         where,
      });
      return order;
   } catch (error) {
      console.error("Delete order error", error);
      return false;
   }
};
