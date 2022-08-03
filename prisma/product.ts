import { Prisma } from "@prisma/client";
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
      const products = await prisma.product.deleteMany({});
      return products;
   } catch (error) {
      console.error("Delete products error", error);
      return false;
   }
};
