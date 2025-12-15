import { fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import React from "react";
import ProductCard from "../common/ProductCard";
import SectionHeader from "../common/SectionHeader";
import { Star } from "lucide-react";

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

const FeaturedProducts = async () => {
    let products: Product[] = [];

    try {
        const response = await fetchData<ProductsResponse>("/products?featured=true&perPage=8");

        if (response?.success && response?.data) {
            products = response.data;
        } else if (Array.isArray(response)) {
            products = response;
        }
    } catch (err) {
        console.error("Error al recuperar productos destacados:", err);
    }

    if (!products || products.length === 0) {
        return null; // No mostrar la sección si no hay productos
    }

    return (
        <div className="w-full py-12 bg-tiendaLVSoft/30">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-tiendaLVText mb-2">Productos Destacados</h2>
                        <p className="text-gray-500">Selección especial para ti</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product?._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
