import React from 'react';
import { PrismicRichText } from '@prismicio/react';
import styled from 'styled-components';

const StyledSection = styled.section`
   .paragraphs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 70ch;
  }
`

const TextParagraph = ({ slice }) => (
   <StyledSection>
      {slice.variation === "withTitle" && <h2>{slice.primary.title}</h2>}
      <div className='paragraphs'>
         <PrismicRichText field={slice.primary.paragraph} />
      </div>
   </StyledSection>
)

export default TextParagraph