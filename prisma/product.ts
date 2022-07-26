import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const getProduct = async (where: Prisma.ProductWhereUniqueInput) => {
   try {
      const product = await prisma.product.findUnique({
         where,
         include: {
            orders: true,
         },
      });
      return product;
   } catch (error) {
      console.error("Get product error", error);
      return false;
   }
};

export const getProducts = async () => {
   try {
      const products = await prisma.product.findMany();
      return products;
   } catch (error) {
      console.error("Get products error", error);
      return false;
   }
};

export const createProduct = async (data: Prisma.ProductCreateArgs["data"]) => {
   try {
      const product = await prisma.product.create({
         data,
      });
      return product;
   } catch (error) {
      console.error("Create product error", error);
      return false;
   }
};

export const updateProduct = async (
   data: Prisma.ProductUpdateArgs["data"],
   where: Prisma.ProductUpdateArgs["where"]
) => {
   try {
      const product = await prisma.product.update({
         where,
         data,
         include: {
            orders: true,
         },
      });
      return product;
   } catch (error) {
      console.error("Update product error", error);
      return false;
   }
};

export const deleteAllProducts = async () => {
   try {
      const products = await prisma.product.deleteMany({});
      return products;
   } catch (error) {
      console.error("Delete products error", error);
      return false;
   }
};

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
