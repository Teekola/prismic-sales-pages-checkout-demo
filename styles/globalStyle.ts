import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	// Theme
	:root {
		--c-primary: ${({ theme }) => theme.colors.primary};
		
		--c-white: ${({ theme }) => theme.colors.white};
		--c-black: ${({ theme }) => theme.colors.black};

	}

	*, *::before, *::after {
		box-sizing: border-box;
	}
	
	* {
		margin: 0;
		padding: 0;
	}

	html, body {
		height: 100%;
	}

	body {
		font-size: 18px;
		font-family: 'Lato', sans-serif;
		line-height: 1.5;
		-webkit-font-smoothing: antialiased;
	}
	
	img, picture, video, canvas, svg {
	   display: block;
		max-width: 100%;
	}

	input, button, textarea, select {
		font: inherit;
		border: none;
	}

	p, h1, h2, h3, h4, h5, h6 {
		overflow-wrap: break-word;
	}

	h1 {
		font-weight: 900;
		font-size: 4rem;
		line-height: 1.1;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
    
	#root, #__next {
		isolation: isolate;
	}
`;

export default GlobalStyle;
