export type SmartumT = {
   url: string;
   name: string;
   id: string;
   svg: string;
};

export type SmartumFormProps = SmartumT & {
   variants: { initial: object; animate: object; exit: object };
};
