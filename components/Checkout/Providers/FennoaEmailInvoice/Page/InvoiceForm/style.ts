import styled from "styled-components";

export const StyledUserForm = styled.form`
   --input-focus-color: var(--c-primary);
   --form-max-width: 600px;
   --error-color: var(--c-accent-red);
   display: flex;
   flex-direction: column;
   gap: 1rem;
   max-width: var(--form-max-width);
   width: 100%;

   .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
   }

   .dropdown {
      width: 100%;
      padding: 0.6rem 0.6rem;
      border-radius: 0.5rem;
      outline: 1px solid var(--c-formfield-border);
      background-color: var(--c-formfield);
      box-shadow: var(--input-shadow);
   }

   .dropdown:focus {
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

   .submit {
      max-width: 100%;
      margin-top: 1rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
   }

   .submit[data-disabled="true"] {
      background-color: var(--c-gray);
   }

   .error-message {
      color: var(--error-color);
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
