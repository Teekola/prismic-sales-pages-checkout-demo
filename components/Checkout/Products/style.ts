import styled from "styled-components";

const StyledCard = styled.div`
   width: 100%;
   max-width: 600px;

   border-radius: 1rem;
   padding: 1rem;
   display: grid;
   gap: 0.75rem;
   height: fit-content;
   background: var(--c-card);
   box-shadow: var(--shadow-default);

   .h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-left: 1rem;
      padding: 1rem 0;
   }

   .total {
      padding: 1rem 1rem;
      display: flex;
      flex-flow: row wrap;
      gap: 1.5rem;
      align-items: center;
   }

   .total-heading {
      font-size: 1.25rem;
   }

   .total-price {
      font-size: 1.25rem;
      font-weight: bold;
   }

   .discount {
      text-decoration-line: line-through;
      text-decoration-style: solid;
      text-decoration-color: var(--c-accent-red);
      text-decoration-thickness: 2px;
      font-weight: 400;
   }

   .discount-price {
      font-size: 1.25rem;
      font-weight: bold;
   }

   .discount-info {
      word-break: break-word;
   }

   .savings {
      font-weight: bold;
      color: var(--c-accent-green);
   }
`;

export default StyledCard;
