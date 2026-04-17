import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Scentform cart before checkout.",
};

export default function CartPage() {
  return <CartView />;
}
