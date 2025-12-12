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
        <div className="w-full bg-white border mt-3 rounded-lg shadow-sm p-5">
            <SectionHeader
                icon={Star}
                badgeText="Destacados"
                title="⭐ Productos Destacados"
                description={`${products.length} ${products.length === 1 ? 'producto seleccionado' : 'productos seleccionados'} especialmente para ti`}
                href="/shop?featured=true"
                buttonText="Ver Todos"
            />

            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts;
