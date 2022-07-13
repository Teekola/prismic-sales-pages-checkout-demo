import BackButton from "components/Utilities/BackButton";
import { useSetCheckoutStep } from "contexts/checkoutContext";

export default function Providers() {
   const setCheckoutStep = useSetCheckoutStep();
   return <BackButton label="Takaisin" onClick={() => setCheckoutStep("form")} />;
}
