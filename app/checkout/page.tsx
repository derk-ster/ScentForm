import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Scentform order — shipping, contact, and payment.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
