export type ProductId = string;
export type ProductT = {
   id: ProductId;
   name: string;
   type: string;
   originalPrice: number;
   price: number;
   imageUrl: string;
   activationUrl: string;
   createdAt: Date;
   updatedAt: Date;
   quantity: number;
   discountPrice: number;
};

export type Order = {
   id: string;
   reference: string;
   transactionReference: string;
   totalPrice: number;
   provider: string;
   status: string;
   createdAt: Date;
   updatedAt: Date;
};

export type Customer = {
   id: string;
   email: string;
   name: string;
   phone: string;
   city: string;
   createdAt: Date;
   updatedAt: Date;
};
