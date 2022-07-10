import { css } from "styled-components";

const colors = css`
   :root {
      // Same Colors in All Themes
      --c-white: #fafafa;
      --c-black: #111122;
      --c-primary: #8e44ad;
      --c-primaryDark: #632881;
      --c-accentRed: #e74c3c;
      --c-accentGreen: #2ecc71;
      --c-accentBlue: #0072ef;

      // Light Theme
      --c-light: #fafafa;
      --c-background: #f9f7fa;
      --c-gray: #998d9e;
      --c-dark: #211029;
   }

   :root[data-theme="dark"] {
      // Dark Theme
      --c-primary: #8e44ad;
      --c-light: #211029;
      --c-background: #111122;
      --c-dark: #fafafa;
   }

   body {
      background-color: var(--c-background);
      color: var(--c-dark);
   }
`;

export default colors;