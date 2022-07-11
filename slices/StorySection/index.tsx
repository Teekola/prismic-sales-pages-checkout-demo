import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Slice, RichTextField, GroupField } from "@prismicio/types";
import Image from "next/image";
import { StyledContainer, StyledStoryBlock } from "./style";

type StorySectionSlice = Slice<
   "story_section",
   {
      title: RichTextField;
      paragraph: RichTextField;
      image: {
         url: string;
         alt: string;
      };
      imagePosition: "behind" | "left" | "right";
   }
>;

const StorySection = ({ slice }: SliceComponentProps<StorySectionSlice>) => {
   return (
      <StyledContainer>
         {slice.items?.map((item: any, i: Number) => {
            return (
               <StyledStoryBlock
                  key={JSON.stringify(item).substring(0, 5) + i}
                  imagePosition={item.imagePosition}
               >
                  <div className="text-section">
                     {item.title && (
                        <PrismicRichText
                           key={item.title[0]?.text.substring(0, 5) + i}
                           field={item.title}
                        />
                     )}
                     {item.paragraph && (
                        <PrismicRichText
                           key={item.paragraph[0].text.substring(0, 5) + i}
                           field={item.paragraph}
                        />
                     )}
                  </div>
                  {item.image.url && item.imagePosition !== "behind" && (
                     <div className="image-container">
                        <Image
                           src={item.image.url}
                           alt={item.image.alt}
                           layout="fill"
                           objectFit="contain"
                           objectPosition="center"
                        />
                     </div>
                  )}
               </StyledStoryBlock>
            );
         })}
      </StyledContainer>
   );
};

export default StorySection;
