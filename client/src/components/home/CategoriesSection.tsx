import { fetchData } from "@/lib/api";
import { Category } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

interface CategoriesResponse {
  categories: Category[];
}

const CategoriesSection = async () => {
  let categories: Category[] = [];
  let error: string | null = null;

  // Helper function to extract image URL
  const getImageUrl = (image: string | { url: string; publicId: string } | undefined): string | null => {
    if (!image) return null;
    if (typeof image === "string") return image || null;
    return image.url || null;
  };

  try {
    const data = await fetchData<CategoriesResponse>("/categories");
    categories = data?.categories || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
    console.log("error", error);
  }

  // Separar categorías padre e hijas
  const parentCategories = categories.filter(cat => !cat.parent);
  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  // Emojis para cada categoría principal
  const categoryIcons: Record<string, string> = {
    "Perfumería": "🌸",
    "Maquillaje": "💄",
    "Cuidado de Piel": "✨",
    "Cabello": "💇",
    "Cuidado Diario": "🧴",
    "Carteras y Bolsos": "👜",
    "Joyería y Accesorios": "💍",
    "Otros": "🎁"
  };

  return (
    <div className="hidden md:inline-flex flex-col bg-white h-full p-5 border rounded-lg shadow-sm overflow-y-auto">
      <div className="mb-4">
        <h2 className="font-bold text-xl text-gray-800 mb-2">Categorías</h2>
        <p className="text-xs text-gray-500">Explora nuestro catálogo</p>
      </div>

      {/* Categorías Principales con Subcategorías */}
      <div className="space-y-4">
        {parentCategories.map((parent) => {
          const subcategories = getSubcategories(parent._id);
          const icon = categoryIcons[parent.name] || "📦";

          return (
            <div key={parent._id} className="border-b border-gray-100 pb-4 last:border-0">
              {/* Categoría Padre */}
              <Link
                href={{
                  pathname: "/shop",
                  query: { category: parent._id },
                }}
                className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all group mb-2"
              >
                <span className="text-xl">{icon}</span>
                <p className="font-semibold text-sm flex-1">{parent.name}</p>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 transition-colors" />
              </Link>

              {/* Subcategorías */}
              {subcategories.length > 0 && (
                <div className="ml-8 space-y-1">
                  {subcategories.slice(0, 4).map((sub) => (
                    <Link
                      key={sub._id}
                      href={{
                        pathname: "/shop",
                        query: { category: sub._id },
                      }}
                      className="block text-xs text-gray-600 hover:text-pink-600 hover:bg-pink-50 p-1.5 rounded transition-all"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  {subcategories.length > 4 && (
                    <Link
                      href={{
                        pathname: "/shop",
                        query: { category: parent._id },
                      }}
                      className="block text-xs text-pink-500 hover:text-pink-700 p-1.5 font-medium"
                    >
                      Ver todas →
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Promoción Especial */}
      <div className="mt-6 bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
        <p className="font-semibold text-sm text-gray-800 mb-1">🎁 Envío Gratis</p>
        <p className="text-xs text-gray-600 mb-3">En compras superiores a $100.000</p>
        <Link
          href="/shop"
          className="text-xs text-pink-600 hover:text-pink-700 font-medium hover:underline"
        >
          Ver productos →
        </Link>
      </div>
    </div>
  );
};

export default CategoriesSection;
