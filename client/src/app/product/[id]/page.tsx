import { payment } from "@/assets/image";
import BackToHome from "@/components/common/BackToHome";
import Container from "@/components/common/Container";
import DiscountBadge from "@/components/common/DiscountBadge";
import ProductActions from "@/components/common/pages/product/ProductActions";
import ProductDescription from "@/components/common/pages/product/ProductDescription";
import ProductImageGallery from "@/components/common/pages/product/ProductImageGallery";
import PriceFormatter from "@/components/common/PriceFormatter";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/api";
import { Product } from "@/types/type";
import { Box, Eye, FileQuestion, Share2, Star, Truck } from "lucide-react";
import Image from "next/image";
import React from "react";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // Disable cache to get fresh data
  const response = await fetchData<{ success: boolean; data: Product }>(`/products/${id}`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  const product = response.data;

  // Helper function to extract all valid image URLs
  const getImages = (): string[] => {
    const images: string[] = [];

    // Check 'images' array
    if (product?.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => {
        if (typeof img === 'string') {
          if (img) images.push(img);
        } else if (img && typeof img === 'object' && 'url' in img) {
          if (img.url) images.push(img.url);
        }
      });
    }

    // Check legacy 'image' field if no images found
    if (images.length === 0 && product?.image) {
      if (typeof product.image === 'string') {
        if (product.image) images.push(product.image);
      } else if (typeof product.image === 'object' && 'url' in (product.image as any)) {
        if ((product.image as any).url) images.push((product.image as any).url);
      }
    }

    return images;
  };

  // Calculate prices logic:
  // 1. If discountPercentage exists (>0), apply it to the current price.
  // 2. Else if comparePrice exists (>price), use price as final and comparePrice as previous.
  // 3. Else, regular price.

  const hasPercentageDiscount = product?.discountPercentage && product.discountPercentage > 0;

  const finalPrice = hasPercentageDiscount
    ? product.price * (1 - (product.discountPercentage / 100))
    : product.price;

  const previousPrice = hasPercentageDiscount
    ? product.price
    : (product?.comparePrice && product.comparePrice > product.price ? product.comparePrice : null);

  const images = getImages();

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col gap-2 items-center justify-center p-10">
        <h2 className="text-lg">
          No se encontraron productos con <span className="font-medium">#id</span>{" "}
          <span className="font-semibold text-pink-600 underline">{id}</span>
        </h2>
        <BackToHome />
      </div>
    );
  }

  return (
    <div className="pt-5 mx-4">
      <Container>
        <div className="max-w-screen-xl bg-white shadow-sm border border-gray-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-10 p-5 md:p-10">
          {/* Product Image Gallery */}
          <ProductImageGallery images={images} />

          {/* Product Details */}
          <div className="space-y-5">
            <DiscountBadge
              price={finalPrice}
              comparePrice={previousPrice || undefined}
              discountPercentage={product?.discountPercentage}
              className="w-14"
            />
            <ProductActions product={product} />

            {/* Price view */}
            <div className="flex items-center gap-5 justify-between">
              <div className="flex items-center gap-2">
                {previousPrice ? (
                  <>
                    <PriceFormatter
                      amount={previousPrice}
                      className="text-gray-400 line-through font-medium text-lg"
                    />
                    <PriceFormatter
                      amount={finalPrice}
                      className="text-2xl font-bold text-pink-600"
                    />
                  </>
                ) : (
                  <PriceFormatter
                    amount={finalPrice}
                    className="text-2xl font-bold text-pink-600"
                  />
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                </div>
                <p className="text-sm text-gray-600">({product?.ratings?.length || 0} reviews)</p>
              </div>
            </div>

            {/* User view */}
            <p className="flex items-center gap-1 text-sm text-gray-600">
              <Eye className="text-pink-500" size={18} />
              <span className="font-semibold text-gray-900">29</span>{" "}
              <span>personas viendo este producto ahora</span>
            </p>

            <Button className="w-full py-6 text-base bg-pink-500 hover:bg-pink-600 text-white font-semibold">
              Comprar Ahora
            </Button>

            <div className="flex items-center gap-5 justify-between border-b border-gray-200 pb-5">
              <button className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <FileQuestion size={20} /> <p>Pregunta</p>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors">
                <Share2 size={20} /> <p>Compartir</p>
              </button>
            </div>

            {/* Delivery part */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck size={30} className="text-pink-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    Entrega estimada:{" "}
                    <span className="text-sm text-gray-600">
                      08 - 15 Dic, 2025
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Box size={30} className="text-pink-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    Envío gratuito y devolución:{" "}
                    <span className="text-sm text-gray-600">
                      En todos los pedidos por encima de $200.00
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 flex flex-col items-center justify-center p-5 rounded-lg">
              <Image
                src={payment}
                alt="Métodos de pago"
                width={320}
                height={80}
                style={{ height: 'auto' }}
                className="w-72 sm:w-80 mb-2"
              />
              <p className="text-sm text-gray-600 text-center">
                Garantía de seguridad en el pago
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl bg-white shadow-sm border border-gray-200 rounded-xl p-5 md:p-10 mt-5">
          <ProductDescription product={product} />
        </div>
      </Container>
    </div>
  );
};

export default SingleProductPage;
