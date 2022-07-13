import StyledBackButton from "./style";

type BackButtonProps = {
   onClick: () => void;
   label: string;
};

const BackButton = ({ onClick, label }: BackButtonProps) => (
   <StyledBackButton className="back-button" onClick={onClick}>
      <span className="back-arrow"></span>
      {label}
   </StyledBackButton>
);

export default BackButton;
