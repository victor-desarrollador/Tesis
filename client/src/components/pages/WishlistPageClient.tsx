"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useWishlistStore, useUserStore } from "@/lib/store";
import ProductCard from "@/components/common/ProductCard";
import { Loader2, Heart } from "lucide-react";
import { Product } from "@/types/type";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const WishlistPageClient = () => {
    const { wishlistItems, isLoading } = useWishlistStore();
    const { authUser, verifyAuth } = useUserStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Force verify auth/store sync on mount if needed
        // Assuming Header does global sync, but local safety is good
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <Container className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-tiendaLVSecondary" />
            </Container>
        );
    }

    return (
        <Container className="py-8">
            <PageBreadcrumb
                items={[{ label: "Perfil", href: "/user/profile" }]}
                currentPage="Lista de Deseos"
            />
            <h1 className="text-3xl font-bold mb-6">Mi Lista de Deseos</h1>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-md border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <Heart className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Tu lista de deseos está vacía</h3>
                    <p className="text-gray-500 mb-8 text-center max-w-sm">
                        Guarda los artículos que más te gusten para no perderlos de vista.
                    </p>
                    <Link href="/shop">
                        <Button className="rounded-full px-8 bg-tiendaLVAccent hover:bg-tiendaLVAccent/90">
                            Ir a la Tienda
                        </Button>
                    </Link>
                </div>
            )}
        </Container>
    );
};

export default WishlistPageClient;
