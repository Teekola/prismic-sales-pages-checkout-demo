import { ProductT, DiscountT } from "contexts/CheckoutContext/types";

export const centsToEurosString = (cents: number) => {
   return (cents / 100).toFixed(2);
};

export const calculateTotalPrice = (arr: ProductT[]) => {
   let total = 0;
   arr.forEach((obj) => {
      total += obj.originalPrice * obj.quantity;
   });

   if (total === 0) total = 1;
   return total;
};

// Calculate price with discount price if exists
export const calculateDiscountedTotalPrice = (arr: ProductT[]) => {
   let total = 0;
   let price;
   arr.forEach((obj) => {
      price = obj.discountPrice !== undefined ? obj.discountPrice : obj.price;
      total += price * obj.quantity;
   });

   if (total === 0) total = 1;
   return total;
};

export const applyDiscountToProducts = (productsArr: ProductT[], discount: DiscountT) => {
   if (discount === null) {
      console.log("No discount");
      return productsArr;
   }
   const { discountAmount, discountType, discountProducts } = discount;
   const products = [...productsArr];
   if (discountType === "%") {
      // Get discount multiplier
      const d = 1 - discountAmount / 100;
      for (let product of products) {
         if (discountProducts.includes(product.id)) {
            // Add discount field with per cent sale
            product.discountPrice = d * product.price;
         }
      }
      return products;
   } else if (discountType === "€") {
      // Get discount amount in cents
      let discountAmountLeft = discountAmount * 100;

      // Jaa tuote eri hintojen perusteella useaan "eri" tuotteeseen, jotka
      // sitten näkyvät eri riveillä alennushintoineen
      const finalProducts = [];
      for (let product of products) {
         if (discountProducts.includes(product.id) && discountAmountLeft > 0) {
            // Jos tuotteen hinta * tuotteen määrä on pienempi kuin alennushinta,
            // Aseta tuotteen alennushinnaksi 0
            if (product.price * product.quantity <= discountAmountLeft) {
               product.discountPrice = 0;
               discountAmountLeft -= product.price * product.quantity;
               finalProducts.push(product);
               continue;
            }

            // Jos tuotteen hinta * tuotteen määrä >= alennushinta, jaa tuotteet 2-3 osaan:
            // 0 hintainen tuote * määrä => kuinka monta kertaa mahtuu tuotteen hinta alennushintaan
            let zeroes = Math.floor(discountAmountLeft / product.price);
            let new_product = { ...product, discountPrice: 0, quantity: zeroes };
            discountAmountLeft -= zeroes * product.price;
            finalProducts.push(new_product);
            // 0<x<=täyshinta hintainen tuote * 1 => paljonko alennushinta poistaa "viimeisestä" tuotteesta
            let middleprice = 0; // 0 jos ei jää "välihintaista" tuotetta, 1 muuten
            if (discountAmountLeft > 0) {
               new_product = {
                  ...product,
                  discountPrice: product.price - discountAmountLeft,
                  quantity: 1,
               };
               discountAmountLeft = 0;
               finalProducts.push(new_product);
               middleprice = 1;
            }
            // täyshintainen tuote * määrä => kuinka monta tuotetta jää jäljelle
            const productCopy = { ...product };
            productCopy.quantity -= zeroes + middleprice;
            if (productCopy.quantity > 0) {
               finalProducts.push(productCopy);
            }
         } else {
            finalProducts.push(product);
         }
      }
      return finalProducts;
   }
   return productsArr;
};
