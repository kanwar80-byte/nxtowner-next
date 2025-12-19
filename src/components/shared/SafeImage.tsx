"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function SafeImage(props: ImageProps) {
  const {
    src,
    alt,
    className,
    fill,
    width,
    height,
    sizes,
    priority,
    quality,
    ...rest
  } = props;

  // Sanitize src
  let initialSrc = typeof src === "string" ? src.trim() : src;
  if (!initialSrc || initialSrc === "") initialSrc = "/images/placeholder.svg";
  if (
    typeof initialSrc === "string" &&
    initialSrc.includes("images.unsplash.com/photo ")
  ) {
    initialSrc = initialSrc.replace(/\s+/g, "");
  }

  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onError={() => setImgSrc("/images/placeholder.svg")}
      {...rest}
    />
  );
}
