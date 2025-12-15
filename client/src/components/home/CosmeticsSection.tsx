import { fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import React from "react";
import ProductCard from "../common/ProductCard";
import { Sparkles } from "lucide-react";
import Link from "next/link";

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

const CosmeticsSection = async () => {
    let products: Product[] = [];

    try {
        const response = await fetchData<ProductsResponse>("/products?categoryType=Cosmetica&perPage=8");

        if (response?.success && response?.data) {
            products = response.data;
        } else if (Array.isArray(response)) {
            products = response;
        }
    } catch (err) {
        console.error("Error al recuperar productos de cosmética:", err);
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="w-full py-12 bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-pink-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Cosmética</h2>
                        </div>
                        <p className="text-gray-600">Realza tu belleza natural</p>
                    </div>
                    <Link
                        href="/shop?categoryType=Cosmetica"
                        className="hidden md:block px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
                    >
                        Ver Todo
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product?._id} product={product} />
                    ))}
                </div>

                <div className="mt-6 md:hidden text-center">
                    <Link
                        href="/shop?categoryType=Cosmetica"
                        className="inline-block px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
                    >
                        Ver Todos los Productos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CosmeticsSection;
