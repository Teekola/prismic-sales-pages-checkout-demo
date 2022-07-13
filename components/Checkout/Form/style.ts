import styled from "styled-components";

const StyledForm = styled.form`
   --input-focus-color: var(--c-primary);
   --form-max-width: 60ch;
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

   .submit {
      max-width: 100%;
      margin-top: 1rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
   }

   .submit[data-disabled="true"] {
      background-color: var(--c-gray);
   }

   @media screen and (max-width: 360px) {
      .submit {
         font-size: 0.975rem;
      }
   }

   @media screen and (min-width: 80ch) {
      .input-group {
         flex-direction: row;
         gap: 2rem;
      }
   }
`;

export default StyledForm;
