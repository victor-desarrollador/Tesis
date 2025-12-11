import { fetchData } from "@/lib/api";
import { Category } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Sparkles, TrendingUp, Tag, Gift } from "lucide-react";

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
    categories = data?.categories;
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
    console.log("error", error);
  }

  // Filter categories by type (using Spanish enum values)
  const destacados = categories.filter(
    (category) => category.categoryType === "Destacados"
  );
  const masVendidos = categories.filter(
    (category) => category.categoryType === "Más vendidos"
  );
  const ofertas = categories.filter(
    (category) => category.categoryType === "Ofertas"
  );

  return (
    <div className="hidden md:inline-flex flex-col bg-white h-full p-5 border rounded-lg shadow-sm">
      {/* Destacados Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <p className="font-semibold text-lg text-gray-800">Destacados</p>
        </div>
        {destacados.length > 0 ? (
          destacados.map((item) => (
            <Link
              key={item?._id}
              href={{
                pathname: "/shop",
                query: { category: item?._id },
              }}
              className="flex items-center gap-3 hover:text-pink-600 hover:bg-pink-50 p-3 rounded-md transition-all duration-200 group"
            >
              {getImageUrl(item?.image) ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-pink-300 transition-all">
                  <Image
                    src={getImageUrl(item?.image)!}
                    alt={item?.name || "categoría"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-pink-500 text-lg">💄</span>
                </div>
              )}
              <p className="text-sm font-medium">{item?.name}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No hay categorías destacadas</p>
        )}
      </div>

      {/* Más Vendidos Section */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <p className="font-semibold text-lg text-gray-800">Más Vendidos</p>
        </div>
        {masVendidos.length > 0 ? (
          masVendidos.map((item) => (
            <Link
              href={{
                pathname: "/shop",
                query: { category: item._id },
              }}
              key={item._id}
              className="flex items-center gap-3 hover:text-purple-600 hover:bg-purple-50 p-3 rounded-md transition-all duration-200 group"
            >
              {getImageUrl(item.image) ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-purple-300 transition-all">
                  <Image
                    src={getImageUrl(item.image)!}
                    alt={item.name || "categoría"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-500 text-lg">🛍️</span>
                </div>
              )}
              <p className="text-sm font-medium">{item.name}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No hay categorías disponibles</p>
        )}
      </div>

      {/* Ofertas Section */}
      {ofertas.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-red-500" />
            <p className="font-semibold text-lg text-gray-800">Ofertas</p>
          </div>
          {ofertas.map((item) => (
            <Link
              href={{
                pathname: "/shop",
                query: { category: item._id },
              }}
              key={item._id}
              className="flex items-center gap-3 hover:text-red-600 hover:bg-red-50 p-3 rounded-md transition-all duration-200 group"
            >
              {getImageUrl(item.image) ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-red-300 transition-all">
                  <Image
                    src={getImageUrl(item.image)!}
                    alt={item.name || "categoría"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-500 text-lg">🏷️</span>
                </div>
              )}
              <p className="text-sm font-medium">{item.name}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Enlaces Rápidos */}
      <div className="mb-6">
        <p className="font-semibold text-lg mb-3 text-gray-800">Enlaces Rápidos</p>
        <div className="space-y-1">
          <Link
            href="/shop"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-pink-500">💄</span>
            <p>Toda la Cosmética</p>
          </Link>
          <Link
            href="/shop?sortOrder=desc"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-pink-500">✨</span>
            <p>Nuevos Productos</p>
          </Link>
          <Link
            href="/shop?discount=true"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-pink-500">🏷️</span>
            <p>En Descuento</p>
          </Link>
          <Link
            href="/user/orders"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-pink-500">📦</span>
            <p>Mis Pedidos</p>
          </Link>
        </div>
      </div>

      {/* Categorías Principales */}
      <div className="mb-6 pb-6 border-t border-gray-100 pt-6">
        <p className="font-semibold text-lg mb-3 text-gray-800">Categorías</p>
        <div className="space-y-1">
          <Link
            href="/shop?search=cosmetica"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-lg">💅</span>
            <p>Cosmética</p>
          </Link>
          <Link
            href="/shop?search=accesorios"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-lg">👜</span>
            <p>Accesorios</p>
          </Link>
          <Link
            href="/shop?search=carteras"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-lg">👛</span>
            <p>Carteras</p>
          </Link>
          <Link
            href="/shop?search=perfumes"
            className="flex items-center gap-2 hover:text-pink-600 hover:bg-pink-50 p-2 rounded-md transition-all text-sm"
          >
            <span className="text-lg">🌸</span>
            <p>Perfumes</p>
          </Link>
        </div>
      </div>

      {/* Promoción Especial */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-pink-500" />
          <p className="font-semibold text-sm text-gray-800">Envío Gratis</p>
        </div>
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
