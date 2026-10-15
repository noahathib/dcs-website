import type { CSSProperties, ImgHTMLAttributes } from "react";
import { IMAGE_SIZES } from "@/data/imageSizes";

export const imgSrc = (name: string) => `img/${name}.webp`;

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { name: string; alt: string; priority?: boolean };

/** Local WebP from public/img with intrinsic size attributes to avoid layout shift. */
export function Img({ name, alt, priority, ...rest }: Props) {
  const size = IMAGE_SIZES[name];
  return (
    <img
      src={imgSrc(name)}
      alt={alt}
      width={size?.[0]}
      height={size?.[1]}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
      {...rest}
    />
  );
}

/** A real concrete sample photo used as a texture strip. Decorative unless labelled. */
export function Strip({ img, className = "", style, label }: { img: string; className?: string; style?: CSSProperties; label?: string }) {
  return (
    <span
      className={`strip ${className}`}
      style={{ backgroundImage: `url(${imgSrc(img)})`, ...style }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
