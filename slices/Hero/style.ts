import styled from "styled-components";

type ContainerProps = {
   imagePosition: "Behind" | "Left" | "Right";
};

const StyledContainer = styled.section<ContainerProps>`
   margin-top: ${({ imagePosition }) =>
      imagePosition === "Behind" ? "-1rem" : "0rem"};
   display: flex;
   flex-direction: ${({ imagePosition }) =>
      imagePosition === "Left" ? "column-reverse" : "column-reverse"};
   gap: 1rem;
   height: ${({ imagePosition }) =>
      imagePosition === "Behind" ? "100vh" : "auto"};

   .text-section {
      position: ${({ imagePosition }) =>
         imagePosition === "Behind" ? "absolute" : "static"};
      top: ${({ imagePosition }) =>
         imagePosition === "Behind" ? "50%" : "auto"};
      transform: ${({ imagePosition }) =>
         imagePosition === "Behind" ? "translateY(-70%)" : "translateY(0)"};
      display: flex;
      flex-direction: column;
      gap: 2rem;
      color: ${({ imagePosition, theme }) =>
         imagePosition === "Behind" && theme === "light"
            ? "var(--c-light)"
            : "var(--c-dark)"};
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

   .buttons-container {
      margin-top: 1rem;
      display: flex;
      flex-flow: row wrap;
      gap: 2rem;
   }

   .image-container {
      position: relative;
      width: 100%;
      height: min(500px, 40vh);
   }

   .image-container > span > img {
      object-fit: contain;
      object-position: left center;
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
      flex-direction: ${({ imagePosition }) =>
         imagePosition === "Right" ? "row" : "row-reverse"};
      align-items: center;
      justify-content: ${({ imagePosition }) =>
         imagePosition === "Behind" ? "center" : "space-between"};

      .text-section {
         margin-top: ${({ imagePosition }) =>
            imagePosition === "Behind" ? 0 : "-10rem"};
         transform: ${({ imagePosition }) =>
            imagePosition === "Behind" ? "translateY(-100%)" : "translateY(0)"};
      }

      .image-spacer {
         position: relative;
         width: 45%;
         height: 75vh;
         overflow: visible;
         margin: ${({ imagePosition }) =>
            imagePosition === "Right" ? "0 -1rem 0 0" : "0 0 0 -1rem"};
      }

      .image-container {
         position: absolute;
         width: 60vw;
         height: 75vh;
         overflow: visible;
         top: -1rem;
         left: ${({ imagePosition }) =>
            imagePosition === "Right" ? 0 : "-100%"};
      }

      .image-container > span > img {
         object-fit: cover;
         object-position: ${({ imagePosition }) =>
            imagePosition === "Right" ? "-150px center" : "150px center"};
      }
   }
`;

export default StyledContainer;
