import type { AppProps } from "next/app";
import Link from "next/link";
import GlobalStyle from "styles/globalStyle";
import { ThemeProvider } from "next-themes";
import { PrismicProvider } from "@prismicio/react";
import { PrismicPreview } from "@prismicio/next";
import { linkResolver, repositoryName } from "../prismicio";
import { H1, H2, P, Italic, UL, OL } from "components/textComponents";
import { PropsWithChildren } from "react";
import { CheckoutContextProvider } from "contexts/CheckoutContext";

import Script from "next/script";

export default function MyApp({ Component, pageProps }: AppProps) {
   return (
      <>
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
               oList: ({ children }: PropsWithChildren) => <OL>{children}</OL>,
            }}
         >
            <PrismicPreview repositoryName={repositoryName}>
               <GlobalStyle />
               <ThemeProvider defaultTheme="system" enableColorScheme>
                  <CheckoutContextProvider>
                     <Component {...pageProps} />
                  </CheckoutContextProvider>
               </ThemeProvider>
            </PrismicPreview>
         </PrismicProvider>
         <Script id="deadline-funnel" type="text/javascript" data-cfasync="false">
            {`function SendUrlToDeadlineFunnel(e){var r,t,c,a,h,n,o,A,i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",d=0,l=0,s="",u=[];if(!e)return e;do r=e.charCodeAt(d++),t=e.charCodeAt(d++),c=e.charCodeAt(d++),A=r<<16|t<<8|c,a=A>>18&63,h=A>>12&63,n=A>>6&63,o=63&A,u[l++]=i.charAt(a)+i.charAt(h)+i.charAt(n)+i.charAt(o);while(d<e.length);s=u.join("");var C=e.length%3;var decoded = (C?s.slice(0,C-3):s)+"===".slice(C||3);decoded = decoded.replace("+", "-");decoded = decoded.replace("/", "_");return decoded;} var dfUrl = SendUrlToDeadlineFunnel(location.href); var dfParentUrlValue;try {dfParentUrlValue = window.parent.location.href;} catch(err) {if(err.name === "SecurityError") {dfParentUrlValue = document.referrer;}}var dfParentUrl = (parent !== window) ? ("/" + SendUrlToDeadlineFunnel(dfParentUrlValue)) : "";(function() {var s = document.createElement("script");s.type = "text/javascript";s.async = true;s.setAttribute("data-scriptid", "dfunifiedcode");s.src ="https://a.deadlinefunnel.com/unified/reactunified.bundle.js?userIdHash=eyJpdiI6InAxVFRQMXZ6anhlcVBzUkRFSEJQclE9PSIsInZhbHVlIjoidlhCaFJIQS82RmRTbE4xK1h5N05DZz09IiwibWFjIjoiZmVlNDU5NGUxMGYwZjkxMGFkOTVjNWYzMjhkOGUyZDUyZjYzZDgxOGNlOGVjMDRlYWYyYWUzNjg0MDNmYzAzMSJ9&pageFromUrl="+dfUrl+"&parentPageFromUrl="+dfParentUrl;var s2 = document.getElementsByTagName("script")[0];s2.parentNode.insertBefore(s, s2);})();`}
         </Script>
      </>
   );
}
