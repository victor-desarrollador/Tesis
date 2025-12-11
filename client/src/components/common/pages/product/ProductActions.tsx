"use client";
import { Product } from "@/types/type";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import WishlistButton from "./WishlistButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductActionsProps {
  product: Product;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [localLoading, setLocalLoading] = useState(false);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      if (quantity < product.stock) {
        setQuantity((prev) => prev + 1);
      } else {
        toast.error(`Solo hay ${product.stock} unidades disponibles`);
      }
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = async () => {
    setLocalLoading(true);
    try {
      // TODO: Implement cart functionality when store is ready
      toast.success(`${product.name} agregado al carrito (${quantity} unidades)`);
      console.log("Add to cart:", { productId: product._id, quantity });
    } catch (error) {
      toast.error("Error al agregar al carrito");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <>
      {/* Product name with wishlist button */}
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 line-clamp-2">
          {product?.name}
        </h1>
        <div className="flex items-center gap-2">
          <WishlistButton product={product} className="border border-gray-300 hover:border-pink-500 hover:bg-pink-50" />
        </div>
      </div>

      {/* Stock status */}
      {product?.stock > 0 ? (
        <p className="text-sm text-green-600 font-medium">
          ✓ En stock ({product.stock} disponibles)
        </p>
      ) : (
        <p className="text-sm text-red-600 font-medium">
          ✗ Agotado
        </p>
      )}

      {/* Quantity and Add to Cart */}
      <div>
        <p className="mb-2 font-medium text-gray-700">Cantidad</p>
        <div className="flex items-center gap-5">
          <div className="border border-gray-300 flex items-center gap-6 px-5 py-2 rounded-full">
            <button
              onClick={() => handleQuantityChange("decrease")}
              disabled={quantity <= 1}
              className="border-0 bg-transparent text-gray-700 hover:text-pink-600 hoverEffect disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={18} />
            </button>
            <span className="font-semibold text-base min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange("increase")}
              disabled={quantity >= product.stock}
              className="border-0 bg-transparent text-gray-700 hover:text-pink-600 hoverEffect disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={localLoading || product.stock === 0}
            variant="outline"
            className="flex-1 py-5 border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white text-base font-semibold hoverEffect disabled:opacity-50"
          >
            {localLoading ? "Agregando..." : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductActions;
