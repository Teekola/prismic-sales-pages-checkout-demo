import { css } from "styled-components";

const shadows = css`
   :root {
      // Light Theme
      --shadow-default: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      --shadow-input: rgba(0, 0, 0, 0.05) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      --shadow-provider: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
      --shadow-provider-hover: rgba(0, 0, 80, 0.3) 0px 1px 3px 0px,
         rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
   }

   :root[data-theme="dark"] {
      // Dark Theme
      --shadow-default: none;
      --shadow-input: none;
      --shadow-provider: none;
      --shadow-provider-hover: none;
   }
`;

export default shadows;
