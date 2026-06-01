"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  slug: string;
  title: string;
  price: number;
  frontSrc: string;
  backSrc: string;
  soldOut?: boolean;
};

export function ShopProductCard({
  slug,
  title,
  price,
  frontSrc,
  backSrc,
  soldOut = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/shop/${slug}`}
      className="group block"
      onMouseEnter={() => !soldOut && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-stone-100 ${
          soldOut ? "opacity-75" : ""
        }`}
      >
        {soldOut ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-stone-100 md:left-3 md:top-3">
            Sin stock
          </span>
        ) : null}
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
        <h3 className="text-xs font-medium text-stone-900">{title}</h3>
        <span className={`text-xs ${soldOut ? "text-stone-400" : "text-stone-500"}`}>
          {soldOut ? "Agotado" : `$${price} USD`}
        </span>
      </div>
    </Link>
  );
}
