////////////////////////////////////////////////////////////////
// Styled Components Declarations file for TS
// Extra info: https://styled-components.com/docs/api#typescript
////////////////////////////////////////////////////////////////

// Import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {}

// DefaultTheme is being used as an interface of props.theme out of the box.
// By default the interface DefaultTheme is empty so that's why we need to extend it.
