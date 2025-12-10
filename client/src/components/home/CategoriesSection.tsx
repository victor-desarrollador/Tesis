import { fetchData } from "@/lib/api";
import { Category } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoriesResponse {
  categories: Category[];
}

const CategoriesSection = async () => {
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    const data = await fetchData<CategoriesResponse>("/categories");
    categories = data?.categories;
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
    console.log("error", error);
  }

  // Filter categories into Featured and Hot Categories
  const featuredCategories = categories.filter(
    (category) => category.categoryType === "Featured"
  );
  const hotCategories = categories.filter(
    (category) => category.categoryType === "Hot Categories"
  );

  return (
    <div className="hidden md:inline-flex flex-col bg-babyshopWhite h-full p-5 border rounded-md">
      <p className="font-semibold text-lg mb-3">Categorias Destacadas</p>
      <div className="mb-6">
        {featuredCategories.length > 0 ? (
          featuredCategories?.map((item) => (
            <Link
              key={item?._id}
              href={{
                pathname: "/shop",
                query: { category: item?._id },
              }}
              className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-3 rounded-md hoverEffect"
            >
              <Image
                src={item?.image}
                alt="categoryImage"
                width={50}
                height={50}
                className="w-7"
              />
              <p>{item?.name}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No featured categories available</p>
        )}
      </div>
      {/* Hot Categories Section */}
      <p className="font-semibold text-lg mb-3">Categorias Hot</p>
      <div>
        {hotCategories.length > 0 ? (
          hotCategories.map((item) => (
            <Link
              href={{
                pathname: "/shop",
                query: { category: item._id },
              }}
              key={item._id}
              className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-3 rounded-md hoverEffect"
            >
              <Image
                src={item.image}
                alt="categoryImage"
                width={50}
                height={50}
                className="w-7"
              />
              <p>{item.name}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No hot categories disponibles</p>
        )}
      </div>

      {/* Quick Links Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-semibold text-lg mb-3">Enlaces Rápidos</p>
        <div className="space-y-2">
          <Link
            href="/shop"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">🛍️</span>
            <p>Todos los Productos</p>
          </Link>
          <Link
            href="/shop?sortOrder=desc"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">🆕</span>
            <p>Nuevos Llegados</p>
          </Link>
          <Link
            href="/shop?priceRange=0-50"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">💰</span>
            <p>Menos de $50</p>
          </Link>
          <Link
            href="/user/orders"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">📦</span>
            <p>Mis Pedidos</p>
          </Link>
        </div>
      </div>

      {/* Customer Support Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-semibold text-lg mb-3">Soporte al Cliente</p>
        <div className="space-y-2">
          <Link
            href="/help"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">❓</span>
            <p>Centro de Ayuda</p>
          </Link>
          <Link
            href="/help/shipping"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">🚚</span>
            <p>Información de Envío</p>
          </Link>
          <Link
            href="/help/returns"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">↩️</span>
            <p>Devoluciones & Cambios</p>
          </Link>
          <Link
            href="/help/contact"
            className="flex items-center gap-2 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-sm"
          >
            <span className="text-babyshopSky">📞</span>
            <p>Contactar</p>
          </Link>
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-semibold text-lg mb-3">Ofertas Especiales</p>
        <div className="bg-gradient-to-r from-babyshopSky/10 to-babyshopSky/5 p-3 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-babyshopSky">🎉</span>
            <p className="font-medium text-sm">Envío Gratis</p>
          </div>
          <p className="text-xs text-gray-600 mb-2">En pedidos superiores a $75</p>
          <Link
            href="/shop"
            className="text-xs text-babyshopSky hover:underline font-medium"
          >
            Comprar Ahora →
          </Link>
        </div>
      </div>

      {/* Age Groups Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-semibold text-lg mb-3">Shop por Edad</p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/shop?search=newborn"
            className="flex flex-col items-center gap-1 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-xs"
          >
            <span className="text-lg">👶</span>
            <p>0-6 Meses</p>
          </Link>
          <Link
            href="/shop?search=infant"
            className="flex flex-col items-center gap-1 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-xs"
          >
            <span className="text-lg">🍼</span>
            <p>6-12 Meses</p>
          </Link>
          <Link
            href="/shop?search=toddler"
            className="flex flex-col items-center gap-1 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-xs"
          >
            <span className="text-lg">🚼</span>
            <p>1-2 Años</p>
          </Link>
          <Link
            href="/shop?search=kids"
            className="flex flex-col items-center gap-1 hover:text-babyshopSky hover:bg-babyshopSky/10 p-2 rounded-md hoverEffect text-xs"
          >
            <span className="text-lg">👧</span>
            <p>2+ Años</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
