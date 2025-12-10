import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  price?: number;
  comparePrice?: number;
  discountPercentage?: number;
  className?: string;
}

const DiscountBadge = ({ price, comparePrice, discountPercentage, className }: Props) => {
  // Calculate discount percentage if comparePrice is provided
  const actualDiscount = comparePrice && price && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : discountPercentage || 0;

  // Don't show badge if no discount
  if (actualDiscount <= 0) {
    return null;
  }

  return (
    <span
      className={cn(
        "block bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-md",
        className
      )}
    >
      -{actualDiscount}%
    </span>
  );
};

export default DiscountBadge;
