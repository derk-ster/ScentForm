import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Scentform support for orders, products, and partnerships.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl">Contact</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Questions about an order, a product, or a partnership? Send a note and
        we'll get back within one business day.
      </p>
      <ContactForm />
    </div>
  );
}
