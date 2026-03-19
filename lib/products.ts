export type Product = {
  slug: string;
  title: string;
  caption: string;
  description: string;
  price: number;
  images: string[];
};

export const products: Product[] = [
  {
    slug: "mom-im-an-artist",
    title: "Mom im an artist",
    caption: "Ser artista no es una carrera, es una forma de existir.",
    description:
      "Drop #001. Arte, textura y construcción pensadas para outsiders. Pieza limitada.",
    price: 39,
    images: ["/tshirt1.jpg", "/tshirt1.jpg", "/tshirt1.jpg"],
  },
  {
    slug: "fuck-i-want-to-creative",
    title: "Fuck i want to creative",
    caption: "Muestra detalles del arte, textura y construcción de la pieza.",
    description:
      "Una pieza para los que crean sin permiso. Fit cómodo y detalles que se sienten.",
    price: 39,
    images: ["/tshirt2.jpg", "/tshirt2.jpg", "/tshirt2.jpg"],
  },
  {
    slug: "created-not-aproved",
    title: "Created not aproved",
    caption: "Las piezas que cambian la cultura nunca pasan por aprobación.",
    description:
      "Hecha para romper lo normal. Diseño directo, statement fuerte, drop limitado.",
    price: 39,
    images: ["/tshirt3.jpg", "/tshirt3.jpg", "/tshirt3.jpg"],
  },
  {
    slug: "normal-never-built-anything",
    title: "Normal never built anything",
    caption: "Lo normal nunca ha construido nada.",
    description:
      "Para los que no encajan. Materiales y print para durar. Sin restock.",
    price: 39,
    images: ["/tshirt4.jpg", "/tshirt4.jpg", "/tshirt4.jpg"],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

