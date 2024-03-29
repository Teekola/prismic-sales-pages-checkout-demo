import { css } from "styled-components";

const buttons = css`
   // Button Styles
   button {
      font-family: "Lato", sans-serif;
      min-width: fit-content;
      max-width: max-content;
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

   .primary-cta:focus {
      cursor: pointer;
      outline: none;
      filter: brightness(90%) contrast(150%);
      transition: filter 0.1s;
   }

   .primary-cta:disabled {
      background-color: var(--c-gray);
   }

   .primary-cta[data-disabled="true"] {
      background-color: var(--c-gray);
   }

   .primary-cta:disabled:hover {
      filter: none;
      cursor: default;
   }

   .secondary-cta {
      font-weight: bold;
      color: var(--c-dark);
      border: 2px solid var(--c-dark);
      border-radius: 1rem;
      padding: 0.5em 1em;
      transition: all 0.3s;
   }

   .secondary-cta:hover {
      cursor: pointer;
      filter: brightness(150%) contrast(150%);
      color: var(--c-primary);
      border-color: var(--c-primary);
      transition: all 0.1s;
   }

   .secondary-cta:focus {
      cursor: pointer;
      filter: brightness(150%) contrast(150%);
      color: var(--c-primary);
      border-color: var(--c-primary);
      transition: all 0.1s;
   }
`;

export default buttons;
