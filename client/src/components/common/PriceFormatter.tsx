"use client";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/Store/currencyStore";
import React from "react";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  const { selectedCurrency } = useCurrencyStore();

  // Convert amount based on selected currency rate
  const convertedAmount = amount ? amount * (selectedCurrency?.rate || 1) : 0;

  if (!amount) return null;

  const formattedPrice = new Number(convertedAmount).toLocaleString("es-AR", {
    currency: selectedCurrency?.code || "ARS",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span className={cn("text-sm font-semibold text-tiendaLVSecondary", className)}>
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
