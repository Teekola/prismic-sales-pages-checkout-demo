import { PaytrailResponseT } from "./Paytrail/types";
import { ProviderData } from "./types";
import PaytrailForm from "./Paytrail/PaytrailForm";
import { motion } from "framer-motion";
import EazybreakForm from "./Eazybreak/EazybreakForm";
import EpassiForm from "./Epassi/EpassiForm";
import SmartumForm from "./Smartum/SmartumForm";
import EdenredForm from "./Edenred/EdenredForm";

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

const generateProviderForms = ({ paytrail, eazybreak, epassi, smartum, edenred }: ProviderData) => {
   if (paytrail.status !== "ok") {
      return <div>Virhe. Paytrail. generateProviderForms.</div>;
   }

   const paytrailGroups = addPaytrailProvidersToGroups(paytrail);

   const paytrailForms = paytrailGroups.map((group) => (
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

   // Get mastercard data for Edenred
   const mastercard = paytrail.providers.find((provider) => provider.name === "Mastercard");

   const voucherForms = (
      <motion.div key="vouchers" className="group-container">
         <h3 className="group-heading">Liikuntasetelit</h3>
         <motion.div className="provider-group-container">
            <EpassiForm {...epassi} variants={formVariants} />
            <EazybreakForm {...eazybreak} variants={formVariants} />
            <SmartumForm {...smartum} variants={formVariants} />
            {mastercard && (
               <EdenredForm {...edenred} mastercard={mastercard} variants={formVariants} />
            )}
         </motion.div>
      </motion.div>
   );

   // TODO: ADD CUSTOM PROVIDER SÄHKÖPOSTILASKU
   return (
      <>
         {voucherForms}
         {paytrailForms}
      </>
   );
};

export default generateProviderForms;
