import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

// Get the correct order using the reference
export const getOrder = async (
   select: Prisma.OrderSelect | null | undefined,
   reference: string
) => {
   try {
      let order = await prisma.order.findUnique({
         select,
         where: { reference },
      });
      return order;
   } catch (error) {
      console.error("Get order error", error);
      return null;
   }
};

// Get multiple orders
export const getOrders = async (
   select: Prisma.OrderSelect | null | undefined,
   where: Prisma.OrderWhereInput
) => {
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

type CreateOrderData =
   | (Prisma.Without<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput> &
        Prisma.OrderUncheckedCreateInput)
   | (Prisma.Without<Prisma.OrderUncheckedCreateInput, Prisma.OrderCreateInput> &
        Prisma.OrderCreateInput);

// Create a new order with data from the obj
export const createOrder = async (data: CreateOrderData) => {
   // Copy the reference to be also transactionReference
   data.transactionReference = data.reference;
   await prisma.order.create({
      data,
   });
};

type UpdateOrderData =
   | (Prisma.Without<Prisma.OrderUpdateInput, Prisma.OrderUncheckedUpdateInput> &
        Prisma.OrderUncheckedUpdateInput)
   | (Prisma.Without<Prisma.OrderUncheckedUpdateInput, Prisma.OrderUpdateInput> &
        Prisma.OrderUpdateInput);

// Update the order's data
// where is optional, default is to use the reference
// where is needed to change the status to success based on transactionReference
export const updateOrder = async (
   reference: string,
   data: UpdateOrderData,
   where: Prisma.OrderWhereUniqueInput
) => {
   try {
      await prisma.order.update({
         data,
         where: where ? where : { reference },
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
      });

      const created = upserted.createdAt === upserted.updatedAt;
      return created;
   } catch (error) {
      console.log("Upsert order error", error);
      return null;
   }
};
