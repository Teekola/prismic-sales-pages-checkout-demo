import styled from "styled-components";

const StyledForm = styled.form`
   --input-focus-color: var(--c-primary);
   --form-max-width: 80ch;
   --error-color: var(--c-accent-red);

   display: flex;
   flex-direction: column;
   gap: 1rem;
   max-width: var(--form-max-width);

   .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
   }

   @media screen and (min-width: 80ch) {
      .input-group {
         flex-direction: row;
         gap: 2rem;
      }
   }
`;

export default StyledForm;
