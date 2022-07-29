export type EpassiT = {
   url: string;
   name: string;
   id: string;
   svg: string;
   parameters: {
      name: string;
      value: string;
   }[];
};

export type EpassiFormProps = EpassiT & {
   variants: { initial: object; animate: object; exit: object };
};
