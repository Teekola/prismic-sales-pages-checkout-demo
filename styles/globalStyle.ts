import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	// Theme
	:root {
		--c-white: #fafafa;
		--c-black: #111122;
		--c-primary: #8e44ad;
		--c-light: #fafafa;
		--c-background: #f9f7fa;
		--c-dark: #211029;
	}

	[data-theme="dark"] {
		:root {
			--c-primary: #8e44ad;
			--c-light: #211029;
			--c-background: #111122;
			--c-dark: #fafafa;
		}
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
		background-color: var(--c-background);
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

	.primary-cta {
		background-color: var(--c-primary);
		color: var(--c-white);
		border-radius: 1rem;
		padding: .5em 3em;
		transition: filter .3s;
	}

	.primary-cta:hover {
		cursor: pointer;
		filter: brightness(90%) contrast(150%);
		transition: filter .1s;
	}

	.secondary-cta {
		padding: .5em .5em;
		background: none;
		color: var(--c-primary);
		font-weight: 700;
	}

	.secondary-cta:hover {
		cursor: pointer;
		filter: brightness(90%) contrast(200%);
	}

	.secondary-cta::after {
		content: ' 🛒'
	}
`;

export default GlobalStyle;
