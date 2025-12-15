"use client";
import { Product } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DiscountBadge from "./DiscountBadge";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  // Helper function to get the first image URL
  const getFirstImageUrl = (): string | null => {
    // Handle if product has 'images' array (new backend format)
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') return firstImage || null;
      if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
        return firstImage.url || null;
      }
    }
    // Fallback to 'image' if it exists (old format)
    if (product?.image) {
      if (typeof product.image === 'string') return product.image || null;
      if (typeof product.image === 'object' && 'url' in product.image) {
        return (product.image as any).url || null;
      }
    }
    return null;
  };

  const [imageError, setImageError] = React.useState(false);
  const imageUrl = getFirstImageUrl();

  return (
    <div className="border border-gray-200 rounded-lg group overflow-hidden w-full relative bg-white transition-shadow duration-300 hover:shadow-lg">
      <Link
        href={`/product/${product?._id}`}
        className="overflow-hidden relative block bg-gray-50"
      >
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt="productImage"
            width={500}
            height={500}
            loading="eager"
            priority
            className="w-full h-48 sm:h-60 object-contain p-4 group-hover:scale-110 hoverEffect transition-transform duration-300 ease-in-out mix-blend-multiply"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 sm:h-60 bg-gray-50 flex items-center justify-center">
            {/* Show a placeholder if image missing or error */}
            <div className="text-4xl opacity-50">🛍️</div>
          </div>
        )}
        <DiscountBadge
          price={product?.price}
          comparePrice={product?.comparePrice}
          discountPercentage={product?.discountPercentage}
          className="absolute top-2 left-2 shadow-sm"
        />
      </Link>
      {/* Wishlist button */}
      <hr className="border-gray-100" />
      <div className="p-4 bg-white flex flex-col flex-1 gap-2"> {/* Added flex-1 to push footer down */}
        <h2 className="font-semibold text-gray-800 line-clamp-2 text-sm min-h-[40px] leading-tight"> {/* Fixed height for 2 lines */}
          {product?.name}
        </h2>

        <div className="flex items-center justify-between mt-auto"> {/* mt-auto to push price to bottom of content area */}
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 truncate max-w-[100px]">
              {product?.brand?.name || product?.category?.name}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="font-bold text-lg text-tiendaLVPrimary">
                <PriceFormatter amount={product?.price} />
              </p>
              {/* Optional: Add compare price if needed */}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
