import { css } from "styled-components";

const defaultResets = css`
   *,
   *::before,
   *::after {
      box-sizing: border-box;
   }

   * {
      margin: 0;
      padding: 0;
   }

   html,
   body {
      height: 100%;
   }

   img,
   picture,
   video,
   canvas,
   svg {
      display: block;
      max-width: 100%;
   }

   input,
   button,
   textarea,
   select {
      font: inherit;
      border: none;
   }

   p,
   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
      overflow-wrap: break-word;
   }

   table {
      border-collapse: collapse;
      border-spacing: 0;
   }

   #root,
   #__next {
      isolation: isolate;
   }
`;

export default defaultResets;
