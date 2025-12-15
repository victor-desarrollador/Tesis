import { fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import React from "react";
import ProductCard from "../common/ProductCard";
import { ShoppingBag } from "lucide-react";
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

const BagsSection = async () => {
    let products: Product[] = [];

    try {
        const response = await fetchData<ProductsResponse>("/products?categoryType=Carteras&perPage=8");

        if (response?.success && response?.data) {
            products = response.data;
        } else if (Array.isArray(response)) {
            products = response;
        }
    } catch (err) {
        console.error("Error al recuperar carteras:", err);
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="w-full py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="w-6 h-6 text-purple-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Carteras</h2>
                        </div>
                        <p className="text-gray-600">Estilo y elegancia en cada detalle</p>
                    </div>
                    <Link
                        href="/shop?categoryType=Carteras"
                        className="hidden md:block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
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
                        href="/shop?categoryType=Carteras"
                        className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                        Ver Todas las Carteras
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BagsSection;
