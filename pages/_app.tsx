import type { AppProps } from "next/app";
import Link from "next/link";
import GlobalStyle from "styles/globalStyle";
import { ThemeProvider } from "next-themes";
import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { linkResolver, repositoryName } from "../prismicio";
import { H1, H2, P, Italic, UL } from "components/textComponents";
import { PropsWithChildren } from "react";
import { GlobalContextProvider } from "contexts/checkoutContext";

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
            heading1: ({ children }: PropsWithChildren) => <H1>{children}</H1>,
            heading2: ({ children }: PropsWithChildren) => <H2>{children}</H2>,
            paragraph: ({ children }: PropsWithChildren) => <P>{children}</P>,
            em: ({ children }: PropsWithChildren) => <Italic>{children}</Italic>,
            list: ({ children }: PropsWithChildren) => <UL>{children}</UL>,
         }}
      >
         <PrismicPreview repositoryName={repositoryName}>
            <GlobalStyle />
            <ThemeProvider defaultTheme="system" enableColorScheme>
               <GlobalContextProvider>
                  <Component {...pageProps} />
               </GlobalContextProvider>
            </ThemeProvider>
         </PrismicPreview>
      </PrismicProvider>
   );
}
