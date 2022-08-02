import { createGlobalStyle } from "styled-components";
import colors from "./colors";
import defaultResets from "./defaultResets";
import layout from "./layout";
import buttons from "./buttons";
import text from "./text";
import shadows from "./shadows";

const GlobalStyle = createGlobalStyle`
	${colors}
	${defaultResets}
	${layout}
	${text}
	${buttons}
	${shadows}
`;

export default GlobalStyle;
