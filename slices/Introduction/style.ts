import styled from "styled-components";

const StyledContainer = styled.section`
   position: relative;
   padding: 5rem 0;
   display: flex;
   flex-direction: column;
   justify-content: center;
   gap: 2rem;
   color: var(--c-white);

   // Full Width Background
   ::before {
      content: "";
      position: absolute;
      z-index: -1;
      width: 100vw;
      height: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--c-primary-dark);
   }

   .image-container {
      position: relative;
      width: 100%;
      height: 300px;
      overflow: hidden;
   }

   .image-container > span > img {
      object-fit: contain;
      object-position: bottom left;
   }

   .text-container {
      max-width: 65ch;
      display: grid;
      gap: 1rem;
   }

   @media screen and (min-width: 900px) {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding-top: 5rem;
      gap: 2rem;

      .image-container {
         width: 25%;
         height: 0;
         padding-bottom: 30%;
      }

      .image-container > span > img {
         object-fit: cover;
         object-position: center center;
      }
   }

   @media screen and (min-width: 1024px) {
      gap: max(5rem, 5vw);
   }
`;

export default StyledContainer;
