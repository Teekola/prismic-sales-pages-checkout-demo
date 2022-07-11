import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Slice, RichTextField, KeyTextField } from "@prismicio/types";
import Image from "next/image";
import StyledContainer from "./style";

type IntroductionSlice = Slice<
   "introduction",
   {
      title: KeyTextField;
      paragraphs: RichTextField;
      image: {
         url: string;
         alt: string;
      };
   }
>;

const Introduction = ({ slice }: SliceComponentProps<IntroductionSlice>) => (
   <StyledContainer>
      <div className="image-container">
         <Image
            src={slice.primary.image.url}
            alt={slice.primary.image.alt}
            layout="fill"
         />
      </div>
      <div className="text-container">
         <h2>{slice.primary.title}</h2>
         <PrismicRichText field={slice.primary.paragraphs} />
      </div>
   </StyledContainer>
);

export default Introduction;
