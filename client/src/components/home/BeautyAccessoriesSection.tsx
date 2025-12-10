"use client";
import { useState, useEffect } from "react";
import { fetchData } from "@/lib/api";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/type";
import ProductCard from "../common/ProductCard";
import SectionHeader from "../common/SectionHeader";

interface ProductsResponse {
    success: boolean;
    data: Product[];
    pagination?: {
        total: number;
    };
}

const BeautyAccessoriesSection = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchData<ProductsResponse>("/products?perPage=8&sortOrder=desc");

                // Extract products correctly
                if (response?.success && response?.data) {
                    setProducts(response.data);
                } else if (Array.isArray(response)) {
                    setProducts(response.slice(0, 8));
                }
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-1/4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 bg-white p-5 mt-5 rounded-lg border shadow-sm">
            <SectionHeader
                icon={Heart}
                badgeText="Tendencias & Estilo"
                title="💅 Belleza & Accesorios"
                description="Productos de calidad que realzan tu belleza y estilo personal"
                href="/shop"
                buttonText="Ver Todo"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <>
                        {/* Placeholder products when no products found */}
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-pink-100">
                            <CardContent className="p-6">
                                <div className="bg-pink-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">💄</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Maquillaje</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Labiales, bases, sombras y más
                                </p>
                                <Link href="/shop?search=maquillaje">
                                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                        Comprar Ahora
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-purple-100">
                            <CardContent className="p-6">
                                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">✨</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Cuidado Facial</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Cremas, serums y tratamientos
                                </p>
                                <Link href="/shop?search=facial">
                                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                                        Comprar Ahora
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-100">
                            <CardContent className="p-6">
                                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">💍</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Joyería</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Aretes, collares y pulseras
                                </p>
                                <Link href="/shop?search=joyeria">
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                        Comprar Ahora
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-amber-100">
                            <CardContent className="p-6">
                                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">👜</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Bolsos</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Carteras, mochilas y clutches
                                </p>
                                <Link href="/shop?search=bolsos">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600">
                                        Comprar Ahora
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Promotional Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5" />
                            <h3 className="text-xl font-bold">Cuidado de la Piel</h3>
                        </div>
                        <p className="text-pink-100 mb-4">
                            Productos premium para una piel radiante y saludable
                        </p>
                        <Link href="/shop?search=skincare">
                            <Button
                                variant="outline"
                                className="bg-white text-pink-500 border-white hover:bg-pink-50"
                            >
                                Ver Productos
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="w-5 h-5" />
                            <h3 className="text-xl font-bold">Accesorios Premium</h3>
                        </div>
                        <p className="text-purple-100 mb-4">
                            Complementos elegantes para completar tu look perfecto
                        </p>
                        <Link href="/shop?search=accesorios">
                            <Button
                                variant="outline"
                                className="bg-white text-purple-500 border-white hover:bg-purple-50"
                            >
                                Explorar
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
                </div>
            </div>

            <div className="mt-8 text-center md:hidden">
                <Link href="/shop">
                    <Button className="w-full bg-rose-500 hover:bg-rose-600">
                        Ver Todos los Productos
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default BeautyAccessoriesSection;
