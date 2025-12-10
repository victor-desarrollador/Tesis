"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { Product } from "@/types/type";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCartStore, useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  className?: string;
}
const AddToCartButton = ({ product, className }: Props) => {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useUserStore();
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Por favor, inicia sesión para añadir al carrito");
      router.push("/auth/signin");
      return;
    }
    setLocalLoading(true);
    try {
      await addToCart(product, 1);
      toast.success("Añadido al carrito con éxito", {
        description: `Nombre: ${product?.name}`,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Error al añadir al carrito. Por favor, intenta de nuevo.");
    } finally {
      setLocalLoading(false);
    }
  };
  return (
    <Button
      onClick={handleAddToCart}
      variant="outline"
      disabled={localLoading} // Only use localLoading
      className={cn("rounded-full px-6 mt-1", className)}
    >
      {localLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Agregando...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al carrito
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
