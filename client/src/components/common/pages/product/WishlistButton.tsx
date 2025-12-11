"use client";

import { useWishlistStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Product } from "@/types/type";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  className?: string;
  product?: Product; // Made optional to avoid breaking other usages initially, but should be required
}

const WishlistButton = ({ className, product }: Props) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const [isLoading, setIsLoading] = useState(false);

  // If no product provided, render nothing or disabled button (fail-safe)
  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        toast.success("Eliminado de favoritos");
      } else {
        await addToWishlist(product);
        toast.success("Agregado a favoritos");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full transition-all duration-300",
        "hover:bg-pink-50 hover:scale-110",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isWishlisted && "bg-pink-50",
        className
      )}
      aria-label={isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        size={20}
        className={cn(
          "transition-all duration-300",
          isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-600",
          isLoading && "animate-pulse"
        )}
      />
    </button>
  );
};

export default WishlistButton;
