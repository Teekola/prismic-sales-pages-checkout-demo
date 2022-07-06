import { PropsWithChildren } from "react";
import styled from "styled-components";
const SH1 = styled.h1``;

const SP = styled.p``;

const H1 = ({ children }: PropsWithChildren<{}>) => <SH1>{children}</SH1>;
const P = ({ children }: PropsWithChildren<{}>) => <SP>{children}</SP>;

export { H1, P };
