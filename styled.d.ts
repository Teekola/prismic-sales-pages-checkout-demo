////////////////////////////////////////////////////////////////
// Styled Components Declarations file for TS
// Extra info: https://styled-components.com/docs/api#typescript
////////////////////////////////////////////////////////////////

// Import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
   export interface DefaultTheme {
      colors: {
         primary: string;
         primaryVariant1: string;
         primaryVariant2: string;

         white: string;
         lightGray: string;
         lightGray2: string;
         primaryGray: string;
         gray: string;
         darkGray: string;
         blueGray: string;
         black: string;

         accentRed: string;
         accentRedVariant1: string;
         accentGreen: string;
         accentGreenVariant1: string;
         accentGreenVariant2: string;
         accentBlue: string;
         accentBlueVariant1: string;
      };
   }
}

// DefaultTheme is being used as an interface of props.theme out of the box.
// By default the interface DefaultTheme is empty so that's why we need to extend it.
