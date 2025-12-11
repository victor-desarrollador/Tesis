"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useWishlistStore, useUserStore } from "@/lib/store";
import ProductCard from "@/components/common/ProductCard";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/type";

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
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
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
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">No tienes productos en tu lista de deseos.</p>
                </div>
            )}
        </Container>
    );
};

export default WishlistPageClient;
