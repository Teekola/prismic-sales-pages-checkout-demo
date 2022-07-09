import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';
import { StyledContainer, StyledStoryBlock } from './style';

const StorySection = ({ slice }) => {
   return (
      <StyledContainer>
         {
            slice.items?.map((item, i) => {
               return (
                  <StyledStoryBlock key={JSON.stringify(item).substring(0, 5) + i} imagePosition={item.imagePosition}>
                     <div className="text-section">
                        {item.title && <PrismicRichText key={item.title[0].text.substring(0, 5) + i} field={item.title} />}
                        {item.paragraph && <PrismicRichText key={item.paragraph[0].text.substring(0, 5) + i} field={item.paragraph} />}
                     </div>
                     {item.image.url && item.imagePosition !== "Behind" &&
                        <div className="image-container">
                           <Image src={item.image.url} alt={item.image.alt} layout="fill" objectFit='contain' objectPosition='center' />
                        </div>
                     }
                  </StyledStoryBlock>
               )
            })
         }

      </StyledContainer>
   )
}

export default StorySection