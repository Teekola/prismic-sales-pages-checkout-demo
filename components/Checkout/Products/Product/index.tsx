import { ProductProps } from "./types";
import Image from "next/image";
import StyledContainer from "./style";

export default function Product({ product }: ProductProps) {
   const { id, name, type, originalPrice, discountPrice, price, amount, image_url } = product;
   return (
      <StyledContainer>
         <div className="image-container">
            <Image
               src={image_url}
               alt="tuotekuva"
               layout="fill"
               objectFit="contain"
               draggable="false"
            />
         </div>
         <div className="product-data-container">
            <h3 className="product-name">{name}</h3>
            <div className="price-amount">
               <p
                  className={
                     discountPrice < originalPrice || price < originalPrice
                        ? "price discount"
                        : "price"
                  }
               >
                  {(originalPrice / 100).toFixed(2)} €
               </p>
               {(discountPrice < originalPrice || price < originalPrice) && (
                  <p className="price">
                     {discountPrice ? (discountPrice / 100).toFixed(2) : (price / 100).toFixed(2)}€
                  </p>
               )}
               <p className="amount">×</p>
               <p className="amount">{amount}</p>
               {(discountPrice < originalPrice || price < originalPrice) && (
                  <p className="amount">
                     (Säästät{" "}
                     {(
                        ((originalPrice - (discountPrice ? discountPrice : price)) / 100) *
                        amount
                     ).toFixed(2)}{" "}
                     €)
                  </p>
               )}
            </div>
         </div>
      </StyledContainer>
   );
}
