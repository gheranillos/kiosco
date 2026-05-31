export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];

export const PRODUCT_FITS = [
  { id: "regular", label: "Regular" },
  { id: "boxy", label: "Boxy / Oversize" },
] as const;

export type ProductFit = (typeof PRODUCT_FITS)[number]["id"];

export function cartLineId(
  slug: string,
  size: string,
  fit: ProductFit,
  options?: { hoodie?: boolean }
) {
  if (options?.hoodie) return `${slug}__${size}`;
  return `${slug}__${size}__${fit}`;
}

export function fitLabel(fit: ProductFit) {
  return PRODUCT_FITS.find((f) => f.id === fit)?.label ?? fit;
}
