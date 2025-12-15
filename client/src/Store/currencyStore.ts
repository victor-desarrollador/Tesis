import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Currency {
    code: string;
    name: string;
    symbol: string;
    rate: number;
}

interface CurrencyState {
    selectedCurrency: Currency;
    setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set) => ({
            selectedCurrency: {
                code: "ARS",
                name: "Pesos Argentinos",
                symbol: "$",
                rate: 1,
            },

            setCurrency: (currency) => set({ selectedCurrency: currency }),
        }),
        {
            name: "currency-storage",
        }
    )
);
