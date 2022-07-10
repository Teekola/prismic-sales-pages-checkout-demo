import { PropsWithChildren } from "react";
import styled from "styled-components";

const SH1 = styled.h1``;
const SH2 = styled.h2``;
const SP = styled.p``;
const SI = styled.i``;

const H1 = ({ children }: PropsWithChildren) => <SH1>{children}</SH1>;
const H2 = ({ children }: PropsWithChildren) => <SH2>{children}</SH2>;
const P = ({ children }: PropsWithChildren) => <SP>{children}</SP>;
const Italic = ({ children }: PropsWithChildren) => <SI>{children}</SI>;

export { H1, H2, P, Italic };
