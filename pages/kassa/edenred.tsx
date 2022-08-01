import { Provider } from "components/Checkout/Providers/Paytrail/types";
import BackButton from "components/ui/BackButton";
import { useSetCheckoutStep } from "contexts/CheckoutContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Layout from "components/layouts/productPageLayout";
import { createClient } from "prismicio";
import { KeyTextField, RichTextField } from "@prismicio/types";
import { PrismicRichText } from "@prismicio/react";

type EdenredProps = {
   url: Provider["url"];
   parameters: Provider["parameters"];
   title: KeyTextField;
   instructions: RichTextField;
};
export default function Edenred({ title, instructions }: EdenredProps) {
   const router = useRouter();
   const setCheckoutStep = useSetCheckoutStep();

   const url = useMemo(() => {
      if (router.query.data) return JSON.parse(router.query.data as string).url;
   }, [router.query]);

   const parameters = useMemo(() => {
      if (router.query.data) return JSON.parse(router.query.data as string).parameters;
   }, [router.query]);

   // Browser Back Button Functionality
   useEffect(() => {
      window.onpopstate = () => {
         router.push("/kassa");
         setCheckoutStep("providers");
      };
      history.pushState("Edenred", "", router.asPath);
   }, [router, setCheckoutStep]);

   const handleBackButtonClick = () => {
      router.push("/kassa");
      setCheckoutStep("providers");
   };

   return (
      <Layout>
         <Head>
            <title>Eroonjumeista.fi: Maksa Edenredillä</title>
         </Head>
         <h1>{title}</h1>
         <PrismicRichText field={instructions} />

         <form method="POST" action={url}>
            {parameters &&
               parameters.map((param: { name: string; value: string }) => (
                  <input key={param.name} type="hidden" name={param.name} value={param.value} />
               ))}
            <button style={{ margin: "1rem 0" }} className="primary-cta" disabled={url === null}>
               Maksa Edenredillä
            </button>
         </form>

         <BackButton label="Takaisin" onClick={handleBackButtonClick} />
      </Layout>
   );
}

type StaticPropsT = {
   previewData: any;
};

export async function getStaticProps({ previewData }: StaticPropsT) {
   const client = createClient({ previewData });
   const document = await client.getSingle("edenred_checkout_page");

   return {
      props: {
         title: document.data.title,
         instructions: document.data.instructions,
      },
   };
}
