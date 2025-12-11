"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
    images: string[];
}

const ProductImageGallery = ({ images }: Props) => {
    const [selectedImage, setSelectedImage] = useState(images[0] || "");

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🛍️</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-100 bg-white">
                <Image
                    src={selectedImage}
                    alt="Product image"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-2"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 bg-white transition-all",
                                selectedImage === img
                                    ? "border-pink-500 ring-2 ring-pink-200"
                                    : "border-transparent hover:border-pink-300"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`Product thumbnail ${idx + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;
