import styled from "styled-components";

const CheckoutLayout = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: flex-start;
   gap: 2rem;
   min-height: 101vh;

   @media screen and (min-width: 1024px) {
      flex-direction: row;
      justify-content: space-between;
   }
`;

export default CheckoutLayout;
