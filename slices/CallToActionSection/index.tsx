import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { Slice, RichTextField, KeyTextField } from "@prismicio/types";
import StyledContainer from "./style";

type CallToActionSlice = Slice<
   "call_to_action_section",
   {
      text: RichTextField;
      buttonText: KeyTextField;
   }
>;

const CallToActionSection = ({
   slice,
}: SliceComponentProps<CallToActionSlice>) => (
   <StyledContainer>
      <PrismicRichText field={slice.primary.text} />
      <button className="primary-cta">{slice.primary.buttonText}</button>
   </StyledContainer>
);

export default CallToActionSection;
