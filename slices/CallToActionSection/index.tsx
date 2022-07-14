import { SliceComponentProps, PrismicRichText, PrismicLink } from "@prismicio/react";
import { Slice, RichTextField, KeyTextField, LinkField } from "@prismicio/types";
import StyledContainer from "./style";

type CallToActionSlice = Slice<
   "call_to_action_section",
   {
      text: RichTextField;
   },
   {
      buttonLabel: KeyTextField;
      buttonLink: LinkField;
   }
>;

const CallToActionSection = ({ slice }: SliceComponentProps<CallToActionSlice>) => {
   return (
      <StyledContainer>
         <PrismicRichText field={slice.primary.text} />
         {slice.items.map((item, i) => (
            <PrismicLink key={item.buttonLabel ? item.buttonLabel + i : i} field={item.buttonLink}>
               <button className="primary-cta">{item.buttonLabel}</button>
            </PrismicLink>
         ))}
      </StyledContainer>
   );
};

export default CallToActionSection;
