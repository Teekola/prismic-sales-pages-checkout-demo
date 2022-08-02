import { css } from "styled-components";

const colors = css`
   :root {
      // Same Colors in All Themes
      --c-white: #fafafa;
      --c-black: #111122;
      --c-primary: #8e44ad;
      --c-primary-dark: #632881;
      --c-accent-red: #e74c3c;
      --c-accent-green: #28ac5f;
      --c-accent-blue: #0072ef;

      // Light Theme
      --c-light: #fafafa;
      --c-light-2: #f4f4f4;
      --c-background: #f9f7fa;
      --c-gray: #998d9e;
      --c-dark: #211029;
      --c-card: #ffffff;
      --c-card-2: #ffffff;
      --c-card-3: #f4f4f4;
      --c-formfield-border: #dfdbe0;
      --c-formfield: #ffffff;
   }

   :root[data-theme="dark"] {
      // Dark Theme
      --c-primary: #8e44ad;
      --c-light: #0e0e1c;
      --c-light-2: #17172e;
      --c-background: #111122;
      --c-dark: #fafafa;
      --c-card: #17172e;
      --c-card-2: #1d1d3c;
      --c-card-3: #17172e;
      --c-formfield-border: #4e4e67;
      --c-formfield: #323246;
      --c-accent-green: #2ecc71;
   }

   body {
      background-color: var(--c-background);
      color: var(--c-dark);
   }
`;

export default colors;
