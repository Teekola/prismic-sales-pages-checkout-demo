import styled from "styled-components";

export const StyledContainer = styled.section`
	margin: 7rem 0;
	display: grid;
	gap: 3rem;
	
`

export const StyledStoryBlock = styled.section`
	display: flex;
	flex-direction: column;
	gap: 3rem;
	max-width: 1800px;

	.text-section {
		display: grid;
		gap: 1.5rem;
		max-width: 65ch;
	}

	.image-container {
		position: relative;
		width: 50%;
		height: 35vh;
		overflow: hidden;
		background: var(--c-background);
		filter: brightness(200%);
		border-radius: 2rem;
	}

	@media screen and (min-width: 1024px) {
		flex-direction: ${({ imagePosition }) => imagePosition === "left" ? "row-reverse" : "row"};
		justify-content: ${({ imagePosition }) => imagePosition === "left" ? "flex-end" : "space-between"};
		align-items: center;
		gap: min(15rem, 5vw);
	}
`