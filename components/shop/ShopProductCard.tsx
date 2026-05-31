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
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-900">
        <img
          src={frontSrc}
          alt={title}
          loading="lazy"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-300 ease-out md:p-6 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />
        <img
          src={backSrc}
          alt={`${title} - vista trasera`}
          loading="lazy"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-300 ease-out md:p-6 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="mt-3 flex flex-col gap-0.5">
        <h3 className="text-xs font-medium text-stone-100">{title}</h3>
        <span className="text-xs text-stone-400">${price} USD</span>
      </div>
    </Link>
  );
}
