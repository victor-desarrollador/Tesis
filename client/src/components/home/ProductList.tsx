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

const ProductList = async () => {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const response = await fetchData<ProductsResponse>("/products?perPage=10");

    // The backend returns { success: true, data: [...] }
    if (response?.success && response?.data) {
      products = response.data;
    } else if (Array.isArray(response)) {
      // Fallback if response is directly an array
      products = response;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Error desconocido";
    console.error("Error al recuperar productos:", err);
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border mt-3 text-center shadow-sm">
        <div className="max-w-md mx-auto">
          <span className="text-6xl mb-4 block">🛍️</span>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            No hay productos disponibles
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-2">
              Error: {error}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Agrega productos desde el panel de administración
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border mt-3 rounded-lg shadow-sm p-5">
      <SectionHeader
        icon={Sparkles}
        badgeText="Nuevos Productos"
        title="✨ Productos Destacados"
        description={`${products.length} ${products.length === 1 ? 'producto' : 'productos'} disponibles`}
        href="/shop"
        buttonText="Ver Todos"
      />

      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
