import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const getCustomer = async (where: Prisma.CustomerWhereUniqueInput) => {
   try {
      const customer = await prisma.customer.findUnique({
         where,
         include: {
            orders: true,
         },
      });
      return customer;
   } catch (error) {
      console.error("Get customer error", error);
      return false;
   }
};

export const getCustomers = async () => {
   try {
      const customers = await prisma.customer.findMany({});
      return customers;
   } catch (error) {
      console.error("Get customers error", error);
      return false;
   }
};

export const deleteCustomers = async () => {
   try {
      const customers = await prisma.customer.deleteMany({});
      return customers;
   } catch (error) {
      console.error("Delete customers error", error);
      return false;
   }
};
