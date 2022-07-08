import { prisma } from "./prisma";

const getProducts = async () => {
   return await prisma.product.findMany();
};

export { getProducts };
