export type Product = {
  slug: string;
  title: string;
  caption: string;
  image: string;
  description: string;
  price: number;
  images: string[];
  /** false = mostrar "Sin stock" y desactivar compra */
  inStock?: boolean;
};

export const products: Product[] = [
  {
    slug: "mom-im-an-artist",
    title: "Mom im an artist",
    caption: "Ser artista no es una carrera, es una forma de existir.",
    image: "/shirt1front.png",
    description:
      "Drop #001. Arte, textura y construcción pensadas para outsiders. Pieza limitada.",
    price: 25,
    images: [
      "/shirt1front.png",
      "/shirt1back.png",
      "/KSCO%201.1.png",
      "/KSCO%201.2.png",
      "/KSCO%201.3.png",
    ],
  },
  {
    slug: "fuck-i-want-to-creative",
    title: "Fuck i want to be creative",
    caption:
      "Por qué debemos ser normal si lo mejor es romper el esquema",
    image: "/shirt2front.png",
    description:
      "Una pieza para los que crean sin permiso. Fit cómodo y detalles que se sienten.",
    price: 25,
    images: [
      "/shirt2front.png",
      "/shirt2back.png",
      "/KSCO%202.1.png",
      "/KSCO%202.2.png",
      "/KSCO%202.3.png",
    ],
  },
  {
    slug: "created-not-aproved",
    title: "Created not aproved",
    caption: "Las piezas que cambian la cultura nunca pasan por aprobación.",
    image: "/shirt3front.png",
    description:
      "Hecha para romper lo normal. Diseño directo, statement fuerte, drop limitado.",
    price: 25,
    images: [
      "/shirt3front.png",
      "/shirt3back.png",
      "/KSCO%204.1.png",
      "/KSCO%204.2.png",
      "/KSCO%204.3.png",
    ],
  },
  {
    slug: "normal-never-built-anything",
    title: "Normal never built anything",
    caption: "Lo normal nunca ha construido nada.",
    image: "/shirt4front.png",
    description:
      "Para los que no encajan. Materiales y print para durar. Sin restock.",
    price: 25,
    images: ["/shirt4front.png", "/shirt4back.png"],
  },
  {
    slug: "outsiders-only",
    title: "Outsiders only",
    caption: "Para los que no encajan en lo normal.",
    image: "/hoodie1.png",
    description:
      "Hoodie del Drop #001. Construcción gruesa, fit relajado y print pensado para los que no piden permiso.",
    price: 35,
    images: ["/hoodie1.png", "/hoodie1back.png"],
    inStock: false,
  },
  {
    slug: "creme-normal",
    title: "Creme normal",
    caption: "Hecho por los que no esperaron a que les abrieran la puerta.",
    image: "/hoodie2.png",
    description:
      "Hoodie pesado, abrigado y con peso de declaración. Edición limitada del Drop #001.",
    price: 35,
    images: ["/hoodie2.png", "/hoodie2back.png"],
    inStock: false,
  },
  {
    slug: "black-normal",
    title: "black normal",
    caption: "Si llegaste tarde a lo normal, llegaste justo a tiempo.",
    image: "/hoodie3.png",
    description:
      "Hoodie del Drop #001. Statement directo, sin sobrediseño. Para outsiders, no para masas.",
    price: 35,
    images: ["/hoodie3.png", "/hoodie3back.png"],
    inStock: false,
  },
];

export function isInStock(product: Pick<Product, "slug" | "inStock"> | string): boolean {
  const p =
    typeof product === "string" ? products.find((x) => x.slug === product) : product;
  if (!p) return true;
  return p.inStock !== false;
}

const HOODIE_SLUGS = new Set([
  "outsiders-only",
  "creme-normal",
  "black-normal",
]);

export function isHoodie(product: Pick<Product, "slug"> | string): boolean {
  const slug = typeof product === "string" ? product : product.slug;
  return HOODIE_SLUGS.has(slug);
}

export function getProductBySlug(slug: string) {
  const normalized = normalizeSlug(slug);
  return products.find((p) => p.slug === normalized);
}

export function normalizeSlug(input: string) {
  try {
    return decodeURIComponent(input)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  } catch {
    return input.trim().toLowerCase().replace(/\s+/g, "-");
  }
}

