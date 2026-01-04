"use client";

import Image from "next/image";
import { useState } from "react";

type HeroGalleryProps = {
  heroImageUrl?: string | null;
  galleryUrls?: string[];
  title?: string;
};

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

export default function HeroGallery({
  heroImageUrl,
  galleryUrls = [],
  title,
}: HeroGalleryProps) {
  // Build combined image array: hero first, then gallery (excluding hero if duplicate)
  const allImages: string[] = [];
  
  if (heroImageUrl) {
    allImages.push(heroImageUrl);
  }
  
  // Add gallery images, avoiding duplicates
  galleryUrls.forEach((url) => {
    if (url && url !== heroImageUrl && !allImages.includes(url)) {
      allImages.push(url);
    }
  });

  // If no images at all, show placeholder
  const hasImages = allImages.length > 0;
  const displayImages = hasImages ? allImages : [PLACEHOLDER_IMAGE];
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = displayImages[selectedIndex];

  // If only placeholder, don't show thumbnails
  const showThumbnails = hasImages && displayImages.length > 1;

  return (
    <div className="w-full mb-6">
      {/* Main Image */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 rounded-lg overflow-hidden mb-3">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title ? `${title} - Image ${selectedIndex + 1}` : "Listing image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority={selectedIndex === 0}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 text-slate-500">
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-slate-200 hover:border-slate-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

