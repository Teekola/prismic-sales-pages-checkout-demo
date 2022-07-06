import React from 'react';
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';

const StyledSection = styled.section`
   .paragraphs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
  }
`

const TextParagraph = ({ slice }) => (
   <StyledSection>
      {slice.variation === "withTitle" && <h2>{slice.primary.title}</h2>}
      <div className='paragraphs'>
         <RichText render={slice.primary.paragraph} />
      </div>
   </StyledSection>
)

export default TextParagraph