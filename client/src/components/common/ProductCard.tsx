import { Product } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DiscountBadge from "./DiscountBadge";
import PriceContainer from "./PriceContainer";
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
        return product.image.url || null;
      }
    }
    return null;
  };

  const imageUrl = getFirstImageUrl();

  return (
    <div className="border rounded-md group overflow-hidden w-full relative">
      <Link
        href={`/product/${product?._id}`}
        className="p-2 overflow-hidden relative block"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="productImage"
            width={500}
            height={500}
            loading="eager"
            priority
            className="w-full h-32 object-cover group-hover:scale-110 hoverEffect"
          />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
            <span className="text-4xl">🛍️</span>
          </div>
        )}
        <DiscountBadge
          price={product?.price}
          comparePrice={product?.comparePrice}
          discountPercentage={product?.discountPercentage}
          className="absolute top-4 left-2"
        />
      </Link>
      {/* Wishlist button */}
      <hr />
      <div className="px-4 py-2 space-y-1">
        <p className="uppercase text-xs font-medium text-gray-500">
          {product?.category?.name}
        </p>
        <p className="line-clamp-2 text-sm h-10">{product?.name}</p>
        <PriceContainer
          price={product?.price}
          comparePrice={product?.comparePrice}
          discountPercentage={product?.discountPercentage}
        />
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
