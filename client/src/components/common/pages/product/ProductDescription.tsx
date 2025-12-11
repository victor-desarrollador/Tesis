"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/type";
import { useState } from "react";

interface Props {
  product: Product;
}

const ProductDescription = ({ product }: Props) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="w-full">
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="description"
      >
        <TabsList className="grid w-full grid-cols-4 bg-white h-16 border border-gray-200 rounded-xl p-1">
          <TabsTrigger
            value="description"
            className="py-2 text-gray-700 hover:text-pink-600 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg transition-all font-medium"
          >
            Descripción
          </TabsTrigger>
          <TabsTrigger
            value="brand"
            className="py-2 text-gray-700 hover:text-pink-600 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg transition-all font-medium"
          >
            Sobre la marca
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="py-2 text-gray-700 hover:text-pink-600 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg transition-all font-medium"
          >
            Reseñas ({product?.ratings?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="py-2 text-gray-700 hover:text-pink-600 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg transition-all font-medium"
          >
            Preguntas
          </TabsTrigger>
        </TabsList>

        <div className="mt-5 p-5 border border-gray-200 rounded-xl bg-gray-50">
          <TabsContent value="description">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Descripción del producto
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product?.description ||
                "No hay descripción disponible para este producto."}
            </p>
          </TabsContent>

          <TabsContent value="brand">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Sobre la marca
            </h3>
            {product?.brand ? (
              <div className="space-y-3">
                <p className="text-xl font-bold text-pink-600">
                  {product.brand.name}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {product.brand.name} es una marca reconocida por su calidad y compromiso
                  con la excelencia. Cada producto es cuidadosamente seleccionado para
                  garantizar la mejor experiencia para nuestros clientes.
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                No hay información de marca disponible.
              </p>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Reseñas de los clientes
            </h3>
            {product?.ratings && product.ratings.length > 0 ? (
              <div className="space-y-4">
                {/* Aquí irían las reseñas cuando estén implementadas */}
                <p className="text-gray-600">
                  Este producto tiene {product.ratings.length} reseña(s).
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-2">
                  No hay reseñas disponibles para este producto.
                </p>
                <p className="text-sm text-gray-500">
                  ¡Sé el primero en dejar una reseña!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Preguntas frecuentes
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                ¿Tienes preguntas sobre este producto? ¡Pregúntanos y te responderemos
                lo antes posible!
              </p>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  💬 Envía tu pregunta y nuestro equipo te responderá en menos de 24 horas.
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProductDescription;
