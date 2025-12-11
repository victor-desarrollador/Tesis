"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { Product } from "@/types/type";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
    product: Product;
}

const BuyNowButton = ({ product }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCartStore();
    const router = useRouter();

    const handleBuyNow = async () => {
        setIsLoading(true);
        try {
            await addToCart(product, 1);
            toast.success("Producto añadido. Yendo al checkout...");
            router.push("/user/checkout");
        } catch (error) {
            console.error("Error buying now:", error);
            toast.error("Error al procesar la compra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleBuyNow}
            disabled={isLoading || product.stock === 0}
            className="w-full py-6 text-base bg-pink-500 hover:bg-pink-600 text-white font-semibold flex items-center justify-center gap-2"
        >
            {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
            Comprar Ahora
        </Button>
    );
};

export default BuyNowButton;
