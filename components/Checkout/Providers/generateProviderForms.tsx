import { PaytrailResponseT } from "./Paytrail/types";
import { ProviderData } from "./types";
import PaytrailForm from "./Paytrail/PaytrailForm";
import { motion } from "framer-motion";

const formVariants = {
   initial: { rotate: -15 },
   animate: { rotate: 0 },
   exit: { opacity: 0, transition: { duration: 0.05 } },
};

type OkPaytrailResponseT = Extract<PaytrailResponseT, { status: "ok" }>;

const addPaytrailProvidersToGroups = (paytrail: OkPaytrailResponseT) => {
   const groupedProviders = paytrail.groups.map((group) => {
      let providers = paytrail.providers.filter((provider) => provider.group === group.id);
      return { ...group, providers };
   });

   return groupedProviders;
};

const generateProviderForms = ({ paytrail }: ProviderData) => {
   if (paytrail.status !== "ok") {
      return <div>Virhe. Paytrail. generateProviderForms.</div>;
   }

   const groups = addPaytrailProvidersToGroups(paytrail);

   const paytrailForms = groups.map((group) => (
      <motion.div key={group.id} className="group-container">
         <h3 className="group-heading">{group.name}</h3>
         <motion.div className="provider-group-container">
            {group.providers.map((provider, i) => (
               <PaytrailForm
                  key={provider.id + i}
                  name={provider.name}
                  url={provider.url}
                  svg={provider.svg}
                  parameters={provider.parameters}
                  variants={formVariants}
               />
            ))}
         </motion.div>
      </motion.div>
   ));

   // TODO: ADD CUSTOM PROVIDERS: LIIKUNTASETELIT JA SÄHKÖPOSTILASKU
   return paytrailForms;
};

export default generateProviderForms;
