export type EazybreakT = {
   url: string;
   name: string;
   id: string;
   svg: string;
   parameters: {
      name: string;
      value: string;
   }[];
};

export type EazybreakFormProps = EazybreakT & {
   variants: { initial: object; animate: object; exit: object };
};
