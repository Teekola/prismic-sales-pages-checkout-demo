import StyledCard from "./style";
import { useCheckoutProducts, useCheckoutDiscount } from "contexts/CheckoutContext";
import Product from "./Product";
import {
   applyDiscountToProducts,
   centsToEurosString,
   calculateTotalPrice,
   calculateDiscountedTotalPrice,
} from "./prices";
import { useState, useEffect } from "react";
import { CheckoutProductsT } from "contexts/CheckoutContext/types";

export default function Products() {
   const checkoutProducts = useCheckoutProducts();
   const discount = useCheckoutDiscount();
   const [totalPrice, setTotalPrice] = useState<number>(0);
   const [discountedTotalPrice, setDiscountedTotalPrice] = useState<number>(totalPrice);
   const [productList, setProductList] = useState<CheckoutProductsT>(checkoutProducts);

   // Calculate total price and discount
   useEffect(() => {
      if (!checkoutProducts) return;
      setProductList(checkoutProducts);
      setTotalPrice(calculateTotalPrice(checkoutProducts));
      setDiscountedTotalPrice(calculateDiscountedTotalPrice(checkoutProducts));
      if (discount) {
         const discProds = applyDiscountToProducts(checkoutProducts, discount);
         setDiscountedTotalPrice(calculateDiscountedTotalPrice(discProds));
         setProductList(discProds);
      }
   }, [checkoutProducts, discount]);
   return (
      <StyledCard>
         <h3 className="h3">Tuotteet</h3>
         {productList.map((product) => (
            <Product key={product.id} product={product} />
         ))}

         <div className="total">
            <p className="total-heading">Yhteensä</p>
            {totalPrice && (
               <p
                  className={
                     discountedTotalPrice < totalPrice ? "total-price discount" : "total-price"
                  }
               >
                  {centsToEurosString(totalPrice)} €
               </p>
            )}
            {discountedTotalPrice < totalPrice && (
               <p className="total-price">{centsToEurosString(discountedTotalPrice)} €</p>
            )}
            {discountedTotalPrice < totalPrice && (
               <p className="discount-info">
                  {discount?.discountAmount && (
                     <>
                        <span>
                           Alennus: <i>{discount.discountCode}</i> –{discount.discountAmount}{" "}
                           {discount.discountType}
                        </span>
                        <br />
                     </>
                  )}
                  Säästät{" "}
                  <span className="savings">
                     {((totalPrice - discountedTotalPrice) / 100).toFixed(2)} €
                  </span>
               </p>
            )}
         </div>
      </StyledCard>
   );
}
