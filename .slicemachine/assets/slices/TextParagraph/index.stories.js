import MyComponent from '../../../../slices/TextParagraph';

export default {
  title: 'slices/TextParagraph'
}


export const _Default = () => <MyComponent slice={{"variation":"default","name":"Default","slice_type":"text_paragraph","items":[],"primary":{"paragraph":[{"type":"paragraph","text":"Do id proident elit eu mollit ad duis sunt elit pariatur irure ipsum dolore mollit. Irure in aliquip commodo irure adipisicing ipsum proident nisi officia mollit anim velit irure. Ea sunt ea eu.","spans":[]}]},"id":"_Default"}} />
_Default.storyName = 'Default'

export const _TextParagraphWithTitle = () => <MyComponent slice={{"variation":"textParagraphWithTitle","name":"TextParagraph – With Title","slice_type":"text_paragraph","items":[],"primary":{"title":"unleash bleeding-edge blockchains","paragraph":[{"type":"paragraph","text":"Ut laborum elit aute officia in in ea.","spans":[]}]},"id":"_TextParagraphWithTitle"}} />
_TextParagraphWithTitle.storyName = 'TextParagraph – With Title'
