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
    { code: "USD", name: "Dólar Estadounidense", symbol: "$", rate: 0.0011 }, // Approx 1 USD = 900 ARS (Official) / 1100 (Blue). Let's use ~900-1000 conservative or 1/900 = 0.0011
    { code: "EUR", name: "Euro", symbol: "€", rate: 0.0010 },
    { code: "GBP", name: "Libra Esterlina", symbol: "£", rate: 0.0009 },
    { code: "AUD", name: "Dólar Australiano", symbol: "A$", rate: 0.0017 },
    { code: "CAD", name: "Dólar Canadiense", symbol: "C$", rate: 0.0015 },
    { code: "CHF", name: "Franco Suizo", symbol: "CHF", rate: 0.0010 },
    { code: "CNY", name: "Yuan Chino", symbol: "¥", rate: 0.0079 },
    { code: "HKD", name: "Dólar Hong Kong", symbol: "HK$", rate: 0.0086 },
    { code: "NZD", name: "Dólar Neozelandés", symbol: "NZ$", rate: 0.0018 },
    { code: "SGD", name: "Dólar Singapur", symbol: "S$", rate: 0.0015 },
    { code: "ZAR", name: "Rand Sudafricano", symbol: "R", rate: 0.021 },
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
