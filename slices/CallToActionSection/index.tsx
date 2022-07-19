import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { Slice, RichTextField, KeyTextField, FilledLinkToDocumentField } from "@prismicio/types";
import StyledContainer from "./style";
import { useAddCheckoutProduct, useCheckoutProducts } from "contexts/CheckoutContext";
import { ProductT } from "prisma/types";

type CallToActionSlice = Slice<
   "call_to_action_section",
   {
      text: RichTextField;
      product?: ProductT;
   },
   {
      buttonLabel: KeyTextField;
      buttonLink: FilledLinkToDocumentField;
   }
>;

const CallToActionSection = ({ slice }: SliceComponentProps<CallToActionSlice>) => {
   const addCheckoutProduct = useAddCheckoutProduct();
   const checkoutProducts = useCheckoutProducts();
   const product = slice.primary.product ? slice.primary.product : null;
   const handleBuyInstantly = (product: ProductT) => {
      if (checkoutProducts.find((checkoutProduct) => checkoutProduct.id === product.id)) {
         return;
      }
      addCheckoutProduct(product);
   };

   return (
      <StyledContainer>
         <PrismicRichText field={slice.primary.text} />
         {slice.items.map((item, i) => (
            <PrismicLink key={item.buttonLabel ? item.buttonLabel + i : i} field={item.buttonLink}>
               <button
                  className="primary-cta"
                  {...(item.buttonLink.type === "checkout-page" && product !== null
                     ? { onClick: () => handleBuyInstantly(product) }
                     : {})}
               >
                  {item.buttonLabel}
               </button>
            </PrismicLink>
         ))}
      </StyledContainer>
   );
};

export default CallToActionSection;
