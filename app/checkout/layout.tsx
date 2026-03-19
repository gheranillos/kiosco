import { redirect } from "next/navigation";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/#preregistro");
  return children;
}

