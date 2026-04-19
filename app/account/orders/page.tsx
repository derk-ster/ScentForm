import type { Metadata } from "next";
import { OrdersClient } from "@/components/account/OrdersClient";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your ALLURA 7 order history.",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
