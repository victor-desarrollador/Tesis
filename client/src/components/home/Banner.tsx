import { fetchData } from "@/lib/api";
import { Banners } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Banner = async () => {
  let banners: Banners[] = [];

  // Helper function to extract image URL
  const getImageUrl = (image: string | { url: string; publicId: string } | undefined): string | null => {
    if (!image) return null;
    if (typeof image === "string") return image || null;
    return image.url || null;
  };

  try {
    // Disable cache to always get fresh data from database
    const data = await fetchData<Banners[]>("/banners", {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    banners = data;
  } catch (error) {
    console.error("error", error);
  }
  const imageOne = banners[0];
  const imageTwo = banners[1];

  if (banners?.length === 0) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Banner Principal (Izquierda) */}
      <div className="md:col-span-3 relative group overflow-hidden rounded-lg bg-gray-100 shadow-sm">
        {getImageUrl(imageOne?.image) ? (
          <Image
            src={getImageUrl(imageOne?.image)!}
            alt={imageOne?.title || "banner"}
            width={800}
            height={500}
            priority
            className="w-full h-72 md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-72 md:h-[400px] bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <span className="text-6xl">🛍️</span>
          </div>
        )}
        {/* Overlay con gradiente para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Contenido del banner */}
        <div className="absolute inset-0 flex flex-col gap-3 items-center justify-center text-white px-4">
          <p className="font-bold text-sm md:text-base uppercase tracking-wider">
            {imageOne?.name}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold max-w-2xl text-center capitalize leading-tight">
            {imageOne?.title}
          </h2>
          <Link
            href={"/shop"}
            className="mt-4 capitalize bg-white rounded-full font-semibold text-gray-900 hover:bg-pink-500 hover:text-white px-8 py-3 text-base transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Comprar Ahora
          </Link>
        </div>
      </div>

      {/* Banner Secundario (Derecha) */}
      <div className="relative group overflow-hidden rounded-lg bg-gray-100 shadow-sm">
        {getImageUrl(imageTwo?.image) ? (
          <Image
            src={getImageUrl(imageTwo?.image)!}
            alt={imageTwo?.title || "banner"}
            width={400}
            height={500}
            className="w-full h-72 md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-72 md:h-[400px] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <span className="text-6xl">💄</span>
          </div>
        )}
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Contenido del banner - CENTRADO */}
        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-white px-4">
          <p className="font-bold text-xs md:text-sm uppercase tracking-wider">
            {imageTwo?.name}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold max-w-xs text-center capitalize leading-tight">
            {imageTwo?.title}
          </h2>
          <Link
            href={"/shop"}
            className="mt-3 capitalize bg-white rounded-full font-semibold text-gray-900 hover:bg-purple-500 hover:text-white px-6 py-2 text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver Más
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
