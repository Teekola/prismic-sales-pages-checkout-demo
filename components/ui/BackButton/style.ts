import styled from "styled-components";

const StyledBackButton = styled.button`
   --arrow-color: var(--c-dark);

   margin-top: 3rem;
   opacity: 0.5;
   background: none;
   width: max-content;
   height: max-content;
   padding: 0.25rem 0.5rem;
   display: flex;
   align-items: center;
   gap: 1rem;
   transition: transform 150ms ease, width 150ms ease, opacity 150ms ease;

   :hover {
      cursor: pointer;
      transform: scale(1.05) translate(-7px);
      transition: transform 100ms ease;
      opacity: 1;
   }

   :hover > .back-arrow {
      transform: translate(5px);
      transition: transform 100ms ease;
   }

   .back-arrow {
      display: inline-block;
      width: 16px;
      height: 2px;
      background: var(--arrow-color);
      transition: transform 100ms ease;
   }

   .back-arrow:before,
   .back-arrow:after {
      display: block;
      content: "";
      width: 12px;
      height: 2px;
      background: var(--arrow-color);
   }

   .back-arrow:before {
      transform-origin: center;
      transform: rotate(-45deg) translate(1px, -5px);
   }

   .back-arrow:after {
      transform: rotate(45deg) translate(-1px, 3px);
   }
`;

export default StyledBackButton;
