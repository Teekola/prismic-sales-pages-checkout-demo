import { Prisma } from "@prisma/client";

export type CreateOrderData =
   | (Prisma.Without<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput> &
        Prisma.OrderUncheckedCreateInput)
   | (Prisma.Without<Prisma.OrderUncheckedCreateInput, Prisma.OrderCreateInput> &
        Prisma.OrderCreateInput);

export type UpdateOrderData =
   | (Prisma.Without<Prisma.OrderUpdateInput, Prisma.OrderUncheckedUpdateInput> &
        Prisma.OrderUncheckedUpdateInput)
   | (Prisma.Without<Prisma.OrderUncheckedUpdateInput, Prisma.OrderUpdateInput> &
        Prisma.OrderUpdateInput);

export type OrderUpsert = {
   reference: string;
   update: UpdateOrderData;
   create: CreateOrderData;
};
