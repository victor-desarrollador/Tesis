import { fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import React from "react";
import ProductCard from "../common/ProductCard";
import SectionHeader from "../common/SectionHeader";
import { Sparkles } from "lucide-react";

interface ProductsResponse {
    success: boolean;
    data: Product[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

const NewArrivals = async () => {
    let products: Product[] = [];

    try {
        const response = await fetchData<ProductsResponse>("/products?sortOrder=desc&perPage=8");

        if (response?.success && response?.data) {
            products = response.data;
        } else if (Array.isArray(response)) {
            products = response;
        }
    } catch (err) {
        console.error("Error al recuperar nuevos productos:", err);
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="w-full py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-tiendaLVText mb-2">Nuevos Ingresos</h2>
                    <p className="text-gray-500">Descubre lo último en belleza y estilo</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product?._id} className="group">
                            {/* Simplified Wrapper for consistency */}
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <a href="/shop?sortOrder=desc" className="inline-block border-b-2 border-black pb-1 text-sm font-semibold uppercase tracking-wide hover:text-tiendaLVSecondary hover:border-tiendaLVSecondary transition-colors">
                        Ver Toda la Colección
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NewArrivals;
