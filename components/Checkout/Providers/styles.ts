import styled from "styled-components";
import { motion } from "framer-motion";

export const StyledContainer = styled.div`
   max-width: 700px;
   width: 100%;
   display: flex;
   flex-direction: column;
   gap: 2rem;

   .group-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
   }

   .provider-group-container {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
   }
`;

export const StyledProviderForm = styled(motion.form)`
   width: 160px;
   height: 96px;

   .provider-button {
      width: 100%;
      height: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: var(--c-white);
      display: flex;
      align-items: center;
      transform: scale(1);
      transition: transform 100ms ease-out;
   }

   .provider-button:hover {
      cursor: pointer;
      transform: scale(1.05);
      transition: transform 100ms ease-out;
   }

   .provider-button:active {
      transform: scale(0.95);
      transition: transform 100ms ease-out;
   }

   .provider-button:disabled {
      opacity: 0.2;
      transition: opacity 150ms ease-in-out;
   }

   .provider-button:disabled:hover,
   .provider-button:disabled:active,
   .provider-button:disabled:active {
      cursor: default;
      transform: scale(1);
   }

   &.selected > .provider-button {
      transform: scale(1) !important;
      opacity: 0.75 !important;
      transition: transform 100ms ease-in-out, opacity 100ms ease-in-out;
   }

   .provider-img-container {
      position: relative;
      height: 51.2px;
      width: 128px;
      margin: 0 auto;
   }
`;
