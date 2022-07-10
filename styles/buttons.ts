import { css } from "styled-components";

const buttons = css`
   // Button Styles
   button {
      font-family: "Lato", sans-serif;
   }
   .primary-cta {
      font-weight: bold;
      color: var(--c-white);
      background-color: var(--c-primary);
      border-radius: 1rem;
      padding: 0.5em 3em;
      transition: filter 0.3s;
   }

   .primary-cta:hover {
      cursor: pointer;
      filter: brightness(90%) contrast(150%);
      transition: filter 0.1s;
   }

   .secondary-cta {
      font-weight: bold;
      color: var(--c-primary);
      padding: 0.5em 0.5em;
      background: none;
   }

   .secondary-cta:hover {
      cursor: pointer;
      filter: brightness(90%) contrast(150%);
   }
`;

export default buttons;
