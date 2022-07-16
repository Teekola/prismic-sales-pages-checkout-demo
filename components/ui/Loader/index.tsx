import StyledLoader from "./style";

type LoaderProps = {
   style?: { [key: string]: any };
   layout?: boolean | "position" | "size" | undefined;
   initial?: any;
   animate?: any;
   transition?: any;
};
export default function Loader({ style, layout, initial, animate, transition }: LoaderProps) {
   return (
      <StyledLoader
         style={style}
         layout={layout}
         initial={initial}
         animate={animate}
         transition={transition}
      >
         <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
         </div>
      </StyledLoader>
   );
}
