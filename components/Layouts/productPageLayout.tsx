import { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1rem;
   max-width: var(--container-max-width);
   margin: 10rem auto;
   padding: 1rem;
`;

export default function Layout({ children }: PropsWithChildren) {
   return <StyledContainer>{children}</StyledContainer>;
}
