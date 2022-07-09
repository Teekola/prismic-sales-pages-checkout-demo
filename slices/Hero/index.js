import React from 'react';
import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';
import styled from 'styled-components';
import { useTheme } from 'next-themes';

const StyledContainer = styled.section`
   margin-top: ${({ imagePosition }) => imagePosition === "Behind" ? "-1rem" : "5rem"};
   display: flex;
   flex-direction: ${({ imagePosition }) => imagePosition === "Left" ? "column-reverse" : "column-reverse"};
   gap: 1rem;
   height: ${({ imagePosition }) => imagePosition === "Behind" ? "100vh" : "auto"};

   .text-section {
      position: ${({ imagePosition }) => imagePosition === "Behind" ? "absolute" : "static"};
      top: ${({ imagePosition }) => imagePosition === "Behind" ? "50%" : "auto"};
      transform: ${({ imagePosition }) => imagePosition === "Behind" ? "translateY(-70%)" : "translateY(0)"};
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: ${({ imagePosition, theme }) => imagePosition === "Behind" && theme === "light" ? "var(--c-white)" : "var(--c-black)"};
      word-break: break-word;
   }

   .title {
      display: flex;
      flex-direction: column;
   }

   .title > span {
      color: var(--c-primary);
      font-size: 2rem;
      font-weight: bold;
   }

   .image-container {
      position: relative;
      width: 100%;
      height: min(500px, 40vh);
   }

   .background-image-positioner {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      filter: brightness(20%);
      height: 100%;
      width: 100%;
   }

   .background-image-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
   }



   @media screen and (min-width: 1024px) {
      flex-direction: ${({ imagePosition }) => imagePosition === "Right" ? "row" : "row-reverse"};
      align-items: center;
      justify-content: ${({ imagePosition }) => imagePosition === "Behind" ? "center" : "space-between"};

      .text-section {
         margin-top: ${({ imagePosition }) => imagePosition === "Behind" ? 0 : "-10rem"};
         transform: ${({ imagePosition }) => imagePosition === "Behind" ? "translateY(-100%)" : "translateY(0)"};
      }

      .image-container {
         position: relative;
         width: 45%;
         height: 75vh;
         overflow: hidden;
         margin: ${({ imagePosition }) => imagePosition === "Right" ? "0 -1rem 0 0" : "0 0 0 -1rem"};
      }
   }
`

const Hero = ({ slice }) => {
   const { theme } = useTheme();
   return (
      <StyledContainer imagePosition={slice.primary.imagePosition} theme={theme}>
         <div className="text-section">
            <h1 className="title">
               {slice.primary.title}
               <span>{slice.primary.subtitle}</span>
            </h1>
            <PrismicRichText field={slice.primary.description} />
         </div>

         {slice.primary.image.url && slice.primary.imagePosition !== "Behind" &&
            < div className="image-container">
               <Image src={slice.primary.image.url} alt={slice.primary.image.alt} layout="fill" objectFit='cover' objectPosition='center' />
            </div>
         }

         {slice.primary.image.url && slice.primary.imagePosition === "Behind" &&
            <div className="background-image-positioner">
               <div className="background-image-container">
                  <Image src={slice.primary.image.url} alt={slice.primary.image.alt} layout="fill" objectFit='cover' objectPosition='center' />
               </div>
            </div>
         }
      </StyledContainer >
   )
}

export default Hero