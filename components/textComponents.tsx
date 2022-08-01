import { PropsWithChildren } from "react";
import styled from "styled-components";

const SH1 = styled.h1``;
const SH2 = styled.h2``;
const SP = styled.p``;
const SI = styled.i``;
const SUL = styled.ul`
   display: grid;
   gap: 1rem;
   margin-left: 2rem;

   li {
      color: var(--c-accent-green);
   }
`;
const SOL = styled.ol`
   display: grid;
   gap: 0.5rem;
   margin-left: 2rem;
`;

const H1 = ({ children }: PropsWithChildren) => <SH1>{children}</SH1>;
const H2 = ({ children }: PropsWithChildren) => <SH2>{children}</SH2>;
const P = ({ children }: PropsWithChildren) => <SP>{children}</SP>;
const Italic = ({ children }: PropsWithChildren) => <SI>{children}</SI>;
const UL = ({ children }: PropsWithChildren) => <SUL>{children}</SUL>;
const OL = ({ children }: PropsWithChildren) => <SOL>{children}</SOL>;

export { H1, H2, P, Italic, UL, OL };
