import MyComponent from '../../../../slices/TextParagraph';

export default {
  title: 'slices/TextParagraph'
}


export const _Default = () => <MyComponent slice={{"variation":"default","name":"Default","slice_type":"text_paragraph","items":[],"primary":{"paragraph":[{"type":"paragraph","text":"Cillum dolor anim officia excepteur ipsum ex anim laboris minim quis. Velit non in cupidatat laboris veniam fugiat. Officia deserunt Lorem ea labore labore ullamco proident id laboris dolore qui aliquip.","spans":[]}],"alignment":"Center"},"id":"_Default"}} />
_Default.storyName = 'Default'

export const _WithTitle = () => <MyComponent slice={{"variation":"withTitle","name":"With Title","slice_type":"text_paragraph","items":[],"primary":{"title":"synergize next-generation channels","paragraph":[{"type":"paragraph","text":"Est duis Lorem exercitation reprehenderit aliqua fugiat exercitation Lorem. Id veniam consectetur aute aute deserunt enim nulla ut proident cupidatat. Nulla laboris id et consectetur officia pariatur enim excepteur occaecat officia labore consectetur.","spans":[]}]},"id":"_WithTitle"}} />
_WithTitle.storyName = 'With Title'
