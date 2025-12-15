"use client";

import { Brand } from '@/types/type';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Tag } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

interface Props {
  brands: Brand[];
}

const HomeBrand = ({ brands }: Props) => {
  // Helper function to extract image URL
  const getImageUrl = (image: string | { url: string; publicId: string } | undefined): string | null => {
    if (!image) return null;
    if (typeof image === "string") return image || null;
    return image.url || null;
  };

  if (!brands || brands?.length === 0) {
    return null;
  }

  return (
    <div className='mt-5 border bg-white p-5 rounded-lg shadow-sm'>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-tiendaLVText mb-8">Nuestras Marcas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand) => (
            <Link key={brand._id} href={{ pathname: "/shop", query: { brand: brand?._id } }} className="flex flex-col items-center group">
              <div className="relative w-24 h-24 hover:scale-110 transition-transform">
                <Image
                  src={brand.image?.url || "/placeholder.png"}
                  alt={brand.name || 'marca'}
                  fill
                  className="object-contain"
                />
              </div>
              <p className='text-sm font-medium text-center line-clamp-1 mt-2 text-gray-700 group-hover:text-pink-600'>{brand?.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeBrand
