import { Provider } from "../Paytrail/types";

export type EdenredT = {
   name: string;
   svg: string;
};

export type EdenredFormProps = EdenredT & {
   mastercard: Provider;
   variants: {
      initial: object;
      animate: object;
      exit: object;
   };
};
