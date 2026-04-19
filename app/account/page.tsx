import type { Metadata } from "next";
import { AccountHomeClient } from "@/components/account/AccountHomeClient";

export const metadata: Metadata = {
  title: "Account",
  description: "ALLURA 7 account — saved products and orders (local demo).",
};

export default function AccountPage() {
  return <AccountHomeClient />;
}
