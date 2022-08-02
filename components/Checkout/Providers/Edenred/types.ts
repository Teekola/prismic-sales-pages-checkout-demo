export type EdenredT = {
   name: string;
   svg: string;
};

export type EdenredFormProps = EdenredT & {
   variants: {
      initial: object;
      animate: object;
      exit: object;
   };
};
