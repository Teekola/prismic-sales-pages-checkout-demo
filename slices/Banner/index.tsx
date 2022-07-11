import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { Slice, RichTextField } from "@prismicio/types";
import StyledContainer from "./style";

type BannerSlice = Slice<
   "banner",
   {
      text: RichTextField;
      image: {
         url: string;
         alt: string;
      };
   }
>;

const Banner = ({ slice }: SliceComponentProps<BannerSlice>) => (
   <StyledContainer>
      <PrismicRichText field={slice.primary.text} />
   </StyledContainer>
);

export default Banner;
