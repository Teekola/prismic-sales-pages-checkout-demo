import { createGlobalStyle } from "styled-components";
import colors from "./colors";
import defaultResets from "./defaultResets";
import buttons from "./buttons";
import text from "./text";

const GlobalStyle = createGlobalStyle`
	${colors}
	${defaultResets}
	${text}
	${buttons}
`;

export default GlobalStyle;
