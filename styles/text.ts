import { css } from "styled-components";

const text = css`
   body {
      font-family: "Lato", sans-serif;
      font-size: 18px;
      line-height: 1.5;
   }

   h1 {
      font-weight: 900;
      font-size: clamp(2rem, 10vw, 4rem);
      line-height: 1.1;
   }

   h2 {
      font-weight: 900;
      font-size: 2.5rem;
      line-height: 1.3;
   }
`;

export default text;
