"use client";
import { fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import ProductCard from "../common/ProductCard";
import { Card, CardContent } from "../ui/card";
import SectionHeader from "../common/SectionHeader";

interface ProductsResponse {
    success: boolean;
    data: Product[];
    pagination?: {
        total: number;
    };
}

const FeaturedCollectionSection = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchData<ProductsResponse>("/products?perPage=8");

                // Extraer productos correctamente
                if (response?.success && response?.data) {
                    setProducts(response.data);
                } else if (Array.isArray(response)) {
                    setProducts(response.slice(0, 8));
                }
            } catch (error) {
                console.error("Error al cargar productos destacados:", error);
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
                icon={Sparkles}
                badgeText="Colección Especial"
                title="✨ Lo Más Buscado"
                description="Descubrí nuestros productos más populares en cosmética, accesorios y carteras"
                href="/shop"
                buttonText="Ver Todos"
            />

            {/* Productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {products?.length > 0 ? (
                    products?.map((product) => (
                        <ProductCard key={product?._id} product={product} />
                    ))
                ) : (
                    <>
                        {/* Categorías placeholder si NO hay productos */}
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-pink-100">
                            <CardContent className="p-6">
                                <div className="bg-pink-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">💄</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Cosmética</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Maquillaje, cuidado facial y más.
                                </p>
                                <Link href="/shop?search=cosmetica">
                                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                        Ver Productos
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-purple-100">
                            <CardContent className="p-6">
                                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">👜</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Carteras</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Elegancia y estilo en cada diseño.
                                </p>
                                <Link href="/shop?search=carteras">
                                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                                        Ver Productos
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-100">
                            <CardContent className="p-6">
                                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">💍</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Accesorios</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Complementá tu look con estilo.
                                </p>
                                <Link href="/shop?search=accesorios">
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                        Ver Productos
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-rose-100">
                            <CardContent className="p-6">
                                <div className="bg-rose-50 rounded-lg p-4 mb-4">
                                    <span className="text-4xl block text-center">🌸</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-center">Perfumes</h3>
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    Fragancias únicas para cada ocasión.
                                </p>
                                <Link href="/shop?search=perfumes">
                                    <Button className="w-full bg-rose-500 hover:bg-rose-600">
                                        Ver Productos
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Banner Promocional */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                            <Heart className="w-6 h-6" />
                            <h3 className="text-2xl font-bold">Comprá con Confianza</h3>
                        </div>
                        <p className="text-pink-100">
                            Productos originales, envíos a todo el país y atención personalizada.
                        </p>
                    </div>

                    <Link href="/shop">
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white text-pink-600 border-white hover:bg-pink-50 font-semibold"
                        >
                            Explorar Tienda
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Botón móvil */}
            <div className="mt-8 text-center md:hidden">
                <Link href="/shop">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                        Ver Todos los Productos
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default FeaturedCollectionSection;
