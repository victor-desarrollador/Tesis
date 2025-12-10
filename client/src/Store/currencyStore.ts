import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCurrencyStore = create(
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
            name: "currency-storage", // LocalStorage Key
        }
    )
);
