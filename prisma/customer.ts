import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const getCustomers = async () => {
   const customers = await prisma.customer.findMany({});
   return customers;
};

export const deleteCustomers = async () => {
   await prisma.customer.deleteMany({});
   return true;
};
