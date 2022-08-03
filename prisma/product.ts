import { Prisma, Product } from "@prisma/client";
import { prisma } from "./prisma";

export const getProduct = async (where: Prisma.ProductWhereUniqueInput) => {
   try {
      const product = await prisma.product.findUnique({
         where,
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
      });
      return product;
   } catch (error) {
      console.error("Update product error", error);
      return false;
   }
};

export const deleteAllProducts = async () => {
   try {
      // Delete products and orderProducts
      const deleteOrderProducts = prisma.orderProduct.deleteMany();
      const deleteProducts = prisma.product.deleteMany();
      return await prisma.$transaction([deleteOrderProducts, deleteProducts]);
   } catch (error) {
      console.error("Delete products error", error);
      return false;
   }
};

export const deleteProduct = async (id: Product["id"]) => {
   try {
      // Find OrderProducts that have matching productId
      const orderProducts = await prisma.orderProduct.findMany({
         select: {
            id: true,
         },
         where: {
            productId: id,
         },
      });
      const orderProductIds = orderProducts.map((prod) => prod.id);

      // Delete product and matching orderProducts
      const deleteOrderProducts = prisma.orderProduct.deleteMany({
         where: {
            id: {
               in: orderProductIds,
            },
         },
      });
      // Delete product with id
      const deleteProduct = prisma.product.delete({
         where: {
            id,
         },
      });
      return await prisma.$transaction([deleteOrderProducts, deleteProduct]);
   } catch (error) {
      console.error("Delete product error.");
      return false;
   }
};
