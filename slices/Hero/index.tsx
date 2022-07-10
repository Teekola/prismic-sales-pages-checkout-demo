import React from "react";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Slice, RichTextField, KeyTextField } from "@prismicio/types";
import Image from "next/image";
import StyledContainer from "./style";

type HeroSlice = Slice<
   "hero",
   {
      title: KeyTextField;
      subtitle: KeyTextField;
      description: RichTextField;
      image: {
         url: string;
         alt: string;
      };
      imagePosition: "Behind" | "Left" | "Right";
      primaryButtonText: string;
      primaryButtonLink: string;
      secondaryButtonText: string;
      secondaryButtonLink: string;
   }
>;

const Hero = ({ slice }: SliceComponentProps<HeroSlice>) => {
   const handlePrimaryClick = () => {
      if (slice.primary.primaryButtonLink.toLowerCase() === "scroll") {
         window.scrollBy({
            top: 300,
            left: 0,
            behavior: "smooth",
         });
      }
   };

   const handleSecondaryClick = () => {
      if (slice.primary.secondaryButtonLink.toLowerCase() === "scroll") {
         window.scrollBy({
            top: 300,
            left: 0,
            behavior: "smooth",
         });
      } else if (
         slice.primary.secondaryButtonLink.toLowerCase() === "lisää ostoskoriin"
      ) {
         console.log("LISÄÄ OSTOSKORIIN");
      }
   };

   return (
      <StyledContainer imagePosition={slice.primary.imagePosition}>
         <div className="text-section">
            <h1 className="title">
               {slice.primary.title}
               <span>{slice.primary.subtitle}</span>
            </h1>
            <PrismicRichText field={slice.primary.description} />
            {(slice.primary.primaryButtonText ||
               slice.primary.secondaryButtonText) && (
               <div className="buttons-container">
                  {slice.primary.primaryButtonText && (
                     <button
                        className="primary-cta"
                        onClick={handlePrimaryClick}
                     >
                        {slice.primary.primaryButtonText}
                     </button>
                  )}
                  {slice.primary.secondaryButtonText && (
                     <button
                        className="secondary-cta"
                        onClick={handleSecondaryClick}
                     >
                        {slice.primary.secondaryButtonText}
                     </button>
                  )}
               </div>
            )}
         </div>

         {slice.primary.image.url && slice.primary.imagePosition !== "Behind" && (
            <div className="image-container">
               <Image
                  src={slice.primary.image.url}
                  alt={slice.primary.image.alt}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
               />
            </div>
         )}

         {slice.primary.image.url && slice.primary.imagePosition === "Behind" && (
            <div className="background-image-positioner">
               <div className="background-image-container">
                  <Image
                     src={slice.primary.image.url}
                     alt={slice.primary.image.alt}
                     layout="fill"
                     objectFit="cover"
                     objectPosition="center"
                  />
               </div>
            </div>
         )}
      </StyledContainer>
   );
};

export default Hero;
