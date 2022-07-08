import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "styles/globalStyle";
import themeDefault from "styles/themes/themeDefault";

import Link from "next/link";
import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { linkResolver, repositoryName } from "../prismicio";
import { H1, P, Italic } from "components/textComponents";

export default function MyApp({ Component, pageProps }: AppProps) {
   return (
      <PrismicProvider
         linkResolver={linkResolver}
         internalLinkComponent={({ href, children, ...props }) => (
            <Link href={href} passHref>
               <a {...props}>{children}</a>
            </Link>
         )}
         richTextComponents={{
            heading1: ({ children }) => <H1>{children}</H1>,
            paragraph: ({ children }) => <P>{children}</P>,
            em: ({ children }) => <Italic>{children}</Italic>,
         }}
      >
         <PrismicPreview repositoryName={repositoryName}>
            <ThemeProvider theme={themeDefault}>
               <GlobalStyle />
               <Component {...pageProps} />
            </ThemeProvider>
         </PrismicPreview>
      </PrismicProvider>
   );
}
