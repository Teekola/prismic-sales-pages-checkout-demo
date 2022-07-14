import BackButton from "components/ui/BackButton";
import { useSetCheckoutStep } from "contexts/CheckoutContext";
import StyledContainer from "./style";

export default function Providers() {
   const setCheckoutStep = useSetCheckoutStep();
   return (
      <StyledContainer>
         <h1>Valitse maksutapa</h1>
         <BackButton label="Takaisin" onClick={() => setCheckoutStep("form")} />
      </StyledContainer>
   );
}
