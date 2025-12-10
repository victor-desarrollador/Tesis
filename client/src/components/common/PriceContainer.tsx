import React from "react";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number;
  comparePrice?: number;
  discountPercentage?: number;
}

const PriceContainer = ({ price, comparePrice, discountPercentage }: Props) => {
  // Calculate discount percentage if comparePrice is provided
  const actualDiscount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : discountPercentage || 0;

  const hasDiscount = actualDiscount > 0 && comparePrice && comparePrice > price;

  return (
    <div className="flex items-center gap-2 text-sm">
      {hasDiscount ? (
        <>
          <PriceFormatter
            amount={comparePrice!}
            className="text-gray-400 line-through font-medium text-xs"
          />
          <PriceFormatter
            amount={price}
            className="text-pink-600 font-bold"
          />
        </>
      ) : (
        <PriceFormatter
          amount={price}
          className="text-gray-800 font-semibold"
        />
      )}
    </div>
  );
};

export default PriceContainer;
