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
      console.error("Error al añadir al carrito:", error);
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
      className={cn(
        "w-full rounded-full border-gray-300 hover:bg-black hover:text-white transition-all duration-300 group-hover:border-black",
        className
      )}
    >
      {localLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline ml-2">Agregando...</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Agregar al carrito</span>
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
