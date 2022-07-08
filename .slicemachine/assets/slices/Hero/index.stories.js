import MyComponent from '../../../../slices/Hero';

export default {
  title: 'slices/Hero'
}


export const _Default = () => <MyComponent slice={{"variation":"default","name":"Default","slice_type":"hero","items":[],"primary":{"title":"innovate sticky initiatives","subtitle":"orchestrate out-of-the-box models","description":[{"type":"paragraph","text":"Tempor magna incididunt proident consequat labore ipsum adipisicing ullamco reprehenderit ipsum est laboris commodo Lorem.","spans":[]}],"image":{"dimensions":{"width":900,"height":500},"alt":"Placeholder image","copyright":null,"url":"https://images.unsplash.com/photo-1589321578146-4c1ba445cc88?w=900&h=500&fit=crop"},"imagePosition":"Right"},"id":"_Default"}} />
_Default.storyName = 'Default'

export const _WithButton = () => <MyComponent slice={{"variation":"withButton","name":"withButton","slice_type":"hero","items":[{"subtitle":"architect 24/365 ROI","description":"optimize end-to-end infrastructures","buttonText":"facilitate synergistic infomediaries"},{"subtitle":"mesh distributed solutions","description":"harness B2C deliverables","buttonText":"e-enable rich technologies"},{"subtitle":"productize turn-key architectures","description":"incubate dynamic communities","buttonText":"maximize turn-key convergence"}],"primary":{"title":"syndicate out-of-the-box web services"},"id":"_WithButton"}} />
_WithButton.storyName = 'withButton'

export const _WithTwoButtons = () => <MyComponent slice={{"variation":"withTwoButtons","name":"withTwoButtons","slice_type":"hero","items":[{"subtitle":"transform world-class deliverables","description":"disintermediate sexy users","primaryButtonText":"revolutionize proactive synergies","secondaryButtonText":"integrate 24/7 content"},{"subtitle":"transition visionary networks","description":"transform 24/365 partnerships","primaryButtonText":"innovate dot-com e-services","secondaryButtonText":"integrate killer paradigms"}],"primary":{"title":"innovate mission-critical vortals"},"id":"_WithTwoButtons"}} />
_WithTwoButtons.storyName = 'withTwoButtons'
