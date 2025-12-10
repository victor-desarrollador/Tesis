"use client";
import { fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ArrowRight, MapPin, Plane } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import ProductCard from "../common/ProductCard";
import { Card, CardContent } from "../ui/card";

interface ProductsResponse {
  products: Product[];
  total: number;
}

const BabyTravelSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response: ProductsResponse = await fetchData<ProductsResponse>(
          "/products"
        );

        // Filtrar productos (primeros 8)
        setProducts(response?.products?.slice(0, 8) || []);
      } catch (error) {
        console.error("Error al cargar productos de viaje:", error);
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
    <div className="py-12 bg-babyshopWhite p-5 mt-5 rounded-md border">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-babyshopSky" />
            <Badge
              variant={"outline"}
              className="text-babyshopSky border-babyshopSky"
            >
              Listo para Viajar
            </Badge>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Esenciales para Viajar con tu Bebé
          </h2>

          <p className="text-gray-600">
            Todo lo que necesitás para viajes cómodos y seguros con tu pequeño.
          </p>
        </div>

        <Link href={"/shop?category=travel"}>
          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2 hover:bg-babyshopSky hover:text-white hover:border-babyshopSky transition-colors"
          >
            Ver Todos los Productos
          </Button>
        </Link>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {products?.length > 0 ? (
          products?.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))
        ) : (
          <>
            {/* Productos placeholder si NO hay productos */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <Plane className="w-8 h-8 text-blue-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Cochecitos de Viaje</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Livianos y compactos, ideales para viajar.
                </p>
                <Link href="/shop?search=stroller">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Comprar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <MapPin className="w-8 h-8 text-green-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Butacas para Auto</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Seguridad y comodidad en cada viaje.
                </p>
                <Link href="/shop?search=car seat">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Comprar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <Plane className="w-8 h-8 text-purple-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Bolsos de Viaje</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Todo organizado para tus salidas con el bebé.
                </p>
                <Link href="/shop?search=diaper bag">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Comprar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <MapPin className="w-8 h-8 text-orange-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Porta Bebés</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Comodidad y manos libres durante el viaje.
                </p>
                <Link href="/shop?search=carrier">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Comprar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Banner Promocional */}
      <div className="bg-gradient-to-r from-babyshopSky to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Viajá Inteligente</h3>
            <p className="text-blue-100">
              Descubrí nuestra colección de productos diseñados para viajes sin estrés.
            </p>
          </div>

          <Link href="/shop?category=travel">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-babyshopSky border-white hover:bg-gray-100"
            >
              Ver Colección
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link href="/shop?category=travel">
          <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
            Ver Todos los Productos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BabyTravelSection;
