"use client";

import Image from "next/image";
import type { ImageGalleryProps } from "@/entities/types";

export function ImageGallery({
  images,
  exerciseName,
}: Omit<ImageGalleryProps, "onImageClick">) {
  if (images.length <= 1) return null;


  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">Gallery</h3>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square w-full overflow-hidden rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors"
          >
            <Image
              src={image.image}
              alt={`${exerciseName} - Image ${index + 1}`}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 25vw, 15vw"
              unoptimized={currentImage.image?.includes("wger.de")}
            />
            {image.is_main && (
              <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Main
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
