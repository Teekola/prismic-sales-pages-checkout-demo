export const generateCheckoutReference = (): string =>
   Math.round(Date.now() + Math.random()).toString();
