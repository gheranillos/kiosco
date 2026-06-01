import type { ProductFit } from "@/lib/shop-options";

export type SizeGuideRow = {
  size: string;
  chest: number;
  waist: number;
  length: number;
  sleeve: number;
};

export const SIZE_GUIDES: Record<
  ProductFit,
  { title: string; rows: SizeGuideRow[] }
> = {
  regular: {
    title: "Regular",
    rows: [
      { size: "S", chest: 51, waist: 51, length: 61, sleeve: 17 },
      { size: "M", chest: 58, waist: 60, length: 71, sleeve: 20 },
      { size: "L", chest: 60, waist: 62, length: 71, sleeve: 24 },
      { size: "XL", chest: 63, waist: 65, length: 71, sleeve: 27 },
      { size: "XXL", chest: 68, waist: 70, length: 76, sleeve: 30 },
    ],
  },
  boxy: {
    title: "Boxy / Oversize",
    rows: [
      { size: "S", chest: 48, waist: 48, length: 48, sleeve: 18 },
      { size: "M", chest: 51, waist: 51, length: 51, sleeve: 20 },
      { size: "L", chest: 58, waist: 58, length: 58, sleeve: 22 },
      { size: "XL", chest: 65, waist: 65, length: 65, sleeve: 25 },
    ],
  },
};
