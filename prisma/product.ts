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
