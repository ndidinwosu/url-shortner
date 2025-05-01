import React from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  widths?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveImage({
  src,
  alt,
  className = "",
  widths,
}: ResponsiveImageProps) {
  // If widths are provided, create the srcSet
  const srcSet = widths
    ? Object.entries(widths)
        .filter(([breakpoint]) => breakpoint !== "default")
        .map(([, width]) => `${src}?w=${width} ${width}w`)
        .join(", ")
    : undefined;

  // If widths are provided, set sizes attribute based on breakpoints
  const sizes = widths
    ? Object.entries(widths)
        .filter(([breakpoint]) => breakpoint !== "default")
        .map(([breakpoint, width]) =>
          breakpoint === "default"
            ? `${width}px`
            : `(min-width: ${breakpoint}) ${width}px`
        )
        .join(", ")
    : undefined;

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto ${className}`}
      loading="lazy"
      srcSet={srcSet}
      sizes={sizes}
    />
  );
}
