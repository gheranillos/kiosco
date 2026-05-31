"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  PRODUCT_FITS,
  PRODUCT_SIZES,
  type ProductFit,
  type ProductSize,
} from "@/lib/shop-options";

type ProductSelectionValue = {
  size: ProductSize;
  fit: ProductFit;
  setSize: (size: ProductSize) => void;
  setFit: (fit: ProductFit) => void;
};

const ProductSelectionContext = createContext<ProductSelectionValue | null>(null);

export function ProductSelectionProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState<ProductSize>("M");
  const [fit, setFit] = useState<ProductFit>("regular");

  const value = useMemo(
    () => ({ size, fit, setSize, setFit }),
    [size, fit]
  );

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  );
}

export function useProductSelection() {
  const ctx = useContext(ProductSelectionContext);
  if (!ctx) {
    throw new Error("useProductSelection must be used within ProductSelectionProvider");
  }
  return ctx;
}

export { PRODUCT_SIZES, PRODUCT_FITS };
