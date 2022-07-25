import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const getProducts = async () => {
   return await prisma.product.findMany();
};

type CreateProductData =
   | (Prisma.Without<Prisma.ProductCreateInput, Prisma.ProductUncheckedCreateInput> &
        Prisma.ProductUncheckedCreateInput)
   | (Prisma.Without<Prisma.ProductUncheckedCreateInput, Prisma.ProductCreateInput> &
        Prisma.ProductCreateInput);
export const createProduct = async (data: CreateProductData) => {
   return await prisma.product.create({
      data,
   });
};

export const deleteAllProducts = async () => {
   await prisma.product.deleteMany({});
};

export const deleteAllOrdersFromProducts = async () => {
   try {
      await prisma.product.updateMany({
         data: {
            orderIds: [],
         },
      });
      return true;
   } catch (error) {
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
      return false;
   }
};
