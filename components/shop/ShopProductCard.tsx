"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  slug: string;
  title: string;
  price: number;
  frontSrc: string;
  backSrc: string;
};

export function ShopProductCard({ slug, title, price, frontSrc, backSrc }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/shop/${slug}`}
      className="group block pb-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full overflow-hidden bg-stone-900" style={{ aspectRatio: "3 / 4" }}>
        <img
          src={frontSrc}
          alt={title}
          loading="lazy"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={backSrc}
          alt={`${title} - vista trasera`}
          loading="lazy"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="px-4 pt-3">
        <h3
          className="text-[12px] font-medium uppercase text-white"
          style={{ letterSpacing: "0.15em" }}
        >
          {title}
        </h3>
        <p className="mt-1 text-[12px] text-white/50">${price} USD</p>
      </div>
    </Link>
  );
}
