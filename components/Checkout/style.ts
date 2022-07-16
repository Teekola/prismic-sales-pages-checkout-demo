import styled from "styled-components";

const StyledCheckout = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1rem;
   max-width: var(--container-max-width);
   margin: 0 auto;
   padding: 1rem;
   min-height: 101vh;

   .checkout-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
   }
`;

export default StyledCheckout;
