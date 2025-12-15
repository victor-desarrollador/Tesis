import { fetchData } from "@/lib/api";
import { Category } from "@/types/type";
import Link from "next/link";
import React from "react";
import {
    Sparkles,
    Palette,
    Smile,
    Scissors,
    ShoppingBag,
    Gem,
    Gift
} from "lucide-react";

interface CategoriesResponse {
    categories: Category[];
}

const HomeCategories = async () => {
    let categories: Category[] = [];

    try {
        const data = await fetchData<CategoriesResponse>("/categories");
        categories = data?.categories || [];
    } catch (err) {
        console.error("Error fetching categories:", err);
    }

    // Extract unique Category Types
    const categoryTypes = Array.from(new Set(categories.map(cat => cat.categoryType).filter(Boolean)));

    // Map icons to Category Types
    const typeIcons: Record<string, any> = {
        "Perfumería": Sparkles,
        "Maquillaje": Palette,
        "Cuidado de Piel": Smile,
        "Cabello": Scissors,
        "Cuidado Diario": ShoppingBag,
        "Carteras y Bolsos": ShoppingBag,
        "Joyería y Accesorios": Gem,
        "Otros": Gift
    };

    return (
        <div className="w-full py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-tiendaLVText">Explora por Tipo</h2>
                <p className="text-center text-gray-500 mb-8">Navega por nuestras colecciones principales</p>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {categoryTypes.map((type) => {
                        const Icon = typeIcons[type as string] || Gift; // Type assertion since Set returns unknown in map/filter chain sometimes
                        return (
                            <Link
                                key={type as string}
                                href={{
                                    pathname: "/shop",
                                    query: { category: type as string }
                                }}
                                className="group flex flex-col items-center gap-3 w-28 sm:w-32"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-tiendaLVSoft flex items-center justify-center border border-transparent group-hover:border-tiendaLVSecondary/50 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md">
                                    <Icon strokeWidth={1.5} className="w-8 h-8 sm:w-10 sm:h-10 text-tiendaLVSecondary group-hover:text-amber-600 transition-colors" />
                                </div>
                                <span className="text-sm font-medium text-center text-gray-700 group-hover:text-tiendaLVSecondary transition-colors leading-tight">
                                    {type as string}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomeCategories;
