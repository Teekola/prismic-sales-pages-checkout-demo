import styled from "styled-components";

export const StyledContainer = styled.section`
   margin: 5rem 0;
   display: grid;
   gap: 3rem;
`;

type StoryBlockProps = {
   imagePosition: "left" | "right" | "behind";
};

export const StyledStoryBlock = styled.section<StoryBlockProps>`
   display: flex;
   flex-direction: column;
   gap: 3rem;

   .text-section {
      display: grid;
      gap: 1.5rem;
      max-width: 65ch;
   }

   .image-container {
      position: relative;
      width: 100%;
      height: 35vh;
      overflow: hidden;
      border-radius: 2rem;
   }

   @media screen and (min-width: 1024px) {
      flex-direction: ${({ imagePosition }) =>
         imagePosition === "left" ? "row-reverse" : "row"};
      justify-content: ${({ imagePosition }) =>
         imagePosition === "left" ? "flex-end" : "space-between"};
      align-items: center;
      gap: min(15rem, 5vw);

      .image-container {
         width: 50%;
      }
   }
`;
