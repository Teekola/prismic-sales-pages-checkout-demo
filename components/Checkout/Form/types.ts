export type FormFields = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   city: string;
};

export type HasTried = {
   [key: string]: boolean;
};

export type FormProps = {
   formProps: {
      emailInstruction: string;
      phoneInstruction: string;
   };
};
