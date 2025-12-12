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
        <div className="w-full bg-white border mt-3 rounded-lg shadow-sm p-5">
            <SectionHeader
                icon={Sparkles}
                badgeText="Nuevos"
                title="✨ Nuevos Ingresos"
                description={`${products.length} ${products.length === 1 ? 'producto nuevo' : 'productos nuevos'} recién llegados`}
                href="/shop?sortOrder=desc"
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

export default NewArrivals;
