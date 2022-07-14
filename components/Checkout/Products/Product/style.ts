import styled from "styled-components";

const StyledContainer = styled.div`
   padding: 0.5rem;
   display: flex;
   align-items: center;
   gap: 1rem;
   background: var(--c-card-2);
   border-radius: 1rem;
   outline: 2px solid var(--c-card-3);

   .image-container {
      border-radius: 1rem;
      position: relative;
      min-width: 96px;
      min-height: 96px;
      background: var(--c-white);
   }

   .product-data-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
   }

   .price-amount {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
   }

   .price {
      font-size: 1.125rem;
   }

   .discount {
      text-decoration-line: line-through;
      text-decoration-style: solid;
      text-decoration-color: var(--c-accent-red);
      text-decoration-thickness: 2px;
      font-weight: 400;
   }

   .amount {
      opacity: 0.75;
   }
`;

export default StyledContainer;
