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
      <SectionHeader
        icon={Tag}
        badgeText="Marcas Premium"
        title="🏷️ Marcas que Amamos"
        description="Descubrí las mejores marcas de cosmética y accesorios"
        href="/shop"
        buttonText="Ver Todas"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {brands?.map((brand) => (
          <Link key={brand?._id} href={{
            pathname: "/shop", query: { brand: brand?._id }
          }} className='flex flex-col items-center justify-center group hover:bg-pink-50 p-3 rounded-lg transition-all'>
            {getImageUrl(brand?.image) ? (
              <Image
                src={getImageUrl(brand?.image)!}
                alt={brand?.name || 'marca'}
                width={250}
                height={250}
                className='w-32 h-32 object-contain group-hover:scale-110 transition-transform'
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🏷️</span>
              </div>
            )}
            <p className='text-sm font-medium text-center line-clamp-1 mt-2 text-gray-700 group-hover:text-pink-600'>{brand?.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HomeBrand
