import styled from "styled-components";

const StyledFormField = styled.div`
   --error-color: var(-c-accent-red);
   width: 100%;
   display: flex;
   flex-direction: column;
   gap: 0.25rem;

   .text-input {
      width: 100%;
      padding: 0.3rem 0.6rem;
      border-radius: 0.5rem;
      background-color: var(--c-formfield);
      outline: 1px solid var(--c-formfield-border);
      box-shadow: var(--shadow-input);
   }

   .text-input:focus {
      outline: 2px solid var(--input-focus-color);
   }

   .required::after {
      content: "*";
      margin-left: 0.5rem;
      color: var(--error-color);
   }

   .error {
      outline: 1px solid var(--error-color) !important;
   }

   .error:focus {
      outline: 2px solid var(--error-color) !important;
   }

   .error-message {
      color: var(--error-color);
   }

   .instruction {
      font-size: 0.875rem;
   }
`;

export default StyledFormField;
