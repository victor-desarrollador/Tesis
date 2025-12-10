import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useCurrencyStore } from "@/Store/currencyStore";

const SelectCurrency = () => {
  const { selectedCurrency, setCurrency } = useCurrencyStore();

  const currencies = [
    { code: "ARS", name: "Pesos Argentinos", symbol: "$", rate: 1.0 },
    { code: "USD", name: "Dólar Estadounidense", symbol: "$", rate: 1 },
    { code: "EUR", name: "Euro", symbol: "€", rate: 0.85 },
    { code: "GBP", name: "Libra Esterlina", symbol: "£", rate: 0.75 },
    { code: "AUD", name: "Dólar Australiano", symbol: "A$", rate: 1.35 },
    { code: "CAD", name: "Dólar Canadiense", symbol: "C$", rate: 1.25 },
    { code: "CHF", name: "Franco Suizo", symbol: "CHF", rate: 0.95 },
    { code: "CNY", name: "Yuan Chino", symbol: "¥", rate: 6.5 },
    { code: "HKD", name: "Dólar Hong Kong", symbol: "HK$", rate: 7.8 },
    { code: "NZD", name: "Dólar Neozelandés", symbol: "NZ$", rate: 1.65 },
    { code: "SGD", name: "Dólar Singapur", symbol: "S$", rate: 1.3 },
    { code: "ZAR", name: "Rand Sudafricano", symbol: "R", rate: 17.5 },
  ];

  return (
    <Select
      onValueChange={(value) => {
        const selected = currencies.find((c) => c.code === value);
        if (selected) setCurrency(selected);
      }}
    >
      <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:outline-none shadow-none flex items-center justify-between px-2 py-1 h-6">
        <SelectValue placeholder={selectedCurrency?.name || "Seleccionar"} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Monedas</SelectLabel>

          {currencies.map((cur) => (
            <SelectItem key={cur.code} value={cur.code}>
              {cur.symbol} {cur.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectCurrency;
