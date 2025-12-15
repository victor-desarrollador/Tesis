"use client";

import { fetchData } from "@/lib/api";
import { Banners } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = () => {
  const [banners, setBanners] = useState<Banners[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to extract image URL
  const getImageUrl = (image: string | { url: string; publicId: string } | undefined): string | null => {
    if (!image) return null;
    if (typeof image === "string") return image || null;
    return image.url || null;
  };

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchData<Banners[]>("/banners");
        setBanners(data || []);
      } catch (error) {
        console.error("Error loading banners:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBanners();
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-r from-pink-100 to-purple-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl opacity-20">🛍️</span>
        </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl opacity-20">🛍️</span>
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-gray-100 overflow-hidden group">
      {/* Banner Image */}
      {getImageUrl(currentBanner?.image) ? (
        <Image
          src={getImageUrl(currentBanner?.image)!}
          alt={currentBanner?.title || "banner"}
          fill
          priority
          className="object-cover object-center transition-transform duration-1000"
          key={currentIndex}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
          <span className="text-9xl opacity-20">🛍️</span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent md:from-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-xl text-white space-y-6">
            <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-pink-200">
              {currentBanner?.name || "Nueva Colección"}
            </p>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              {currentBanner?.title || "Descubre tu belleza única"}
            </h2>

            <div className="pt-4">
              <Link
                href={"/shop"}
                className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Comprar Ahora
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
                }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
