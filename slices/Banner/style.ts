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
`;

export default StyledContainer;
