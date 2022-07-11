import { createGlobalStyle } from "styled-components";
import colors from "./colors";
import defaultResets from "./defaultResets";
import layout from "./layout";
import buttons from "./buttons";
import text from "./text";

const GlobalStyle = createGlobalStyle`
	${colors}
	${defaultResets}
	${layout}
	${text}
	${buttons}
`;

export default GlobalStyle;
