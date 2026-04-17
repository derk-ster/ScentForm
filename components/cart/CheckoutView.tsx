"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/utils/money";
import { useCartStore } from "@/store/cart-store";
import { getProductByHandle } from "@/lib/data/catalog";
import type { Product, ProductVariant } from "@/types/catalog";

const SHIPPING_FLAT_CENTS = 0;
const TAX_RATE = 0.0825;

function makeOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SF-${ts}-${rand}`;
}

export function CheckoutView() {
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotalCents());
  const [placed, setPlaced] = useState<{ id: string; email: string } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postal: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
  });

  const resolved = useMemo(() => {
    const out: {
      line: (typeof lines)[number];
      product: Product;
      variant: ProductVariant;
    }[] = [];
    for (const line of lines) {
      const product = getProductByHandle(line.productHandle);
      if (!product) continue;
      const variant = product.variants.find((v) => v.id === line.variantId);
      if (!variant) continue;
      out.push({ line, product, variant });
    }
    return out;
  }, [lines]);

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax + SHIPPING_FLAT_CENTS;

  const update = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || resolved.length === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 650));
    const id = makeOrderId();
    setPlaced({ id, email: form.email });
    clear();
    setSubmitting(false);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary/30 bg-card/40 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-3xl">Order confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks for your order. A confirmation is on its way to{" "}
            <span className="text-foreground">{placed.email || "your inbox"}</span>
            .
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Order number
          </p>
          <p className="mt-1 font-display text-lg">{placed.id}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop">Keep shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account/orders">View orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
          <h1 className="font-display text-3xl">Nothing to check out</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your cart is empty — add something first.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop">Shop all</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cart">Back to cart</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/cart" className="hover:text-foreground">
          Cart
        </Link>
        <span>›</span>
        <span className="text-foreground">Checkout</span>
      </div>
      <h1 className="mt-2 font-display text-3xl">Checkout</h1>
      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        Secure — all fields encrypted in transit.
      </p>

      <form
        onSubmit={handlePlaceOrder}
        className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-8">
          <section className="rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
            <h2 className="font-display text-xl">Contact</h2>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@email.com"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
            <h2 className="font-display text-xl">Shipping address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={update("firstName")}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={update("lastName")}
                />
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="address1">Address</Label>
                <Input
                  id="address1"
                  required
                  autoComplete="address-line1"
                  value={form.address1}
                  onChange={update("address1")}
                  placeholder="Street address"
                />
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="address2">Apt, suite (optional)</Label>
                <Input
                  id="address2"
                  autoComplete="address-line2"
                  value={form.address2}
                  onChange={update("address2")}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  required
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={update("city")}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="state">State / Region</Label>
                <Input
                  id="state"
                  required
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={update("state")}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="postal">ZIP / Postal code</Label>
                <Input
                  id="postal"
                  required
                  autoComplete="postal-code"
                  value={form.postal}
                  onChange={update("postal")}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  required
                  autoComplete="country-name"
                  value={form.country}
                  onChange={update("country")}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Payment</h2>
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                <Lock className="h-3 w-3" />
                Encrypted
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="cardName">Name on card</Label>
                <Input
                  id="cardName"
                  required
                  autoComplete="cc-name"
                  value={form.cardName}
                  onChange={update("cardName")}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={form.cardNumber}
                  onChange={update("cardNumber")}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="cardExp">Expiration</Label>
                  <Input
                    id="cardExp"
                    required
                    autoComplete="cc-exp"
                    value={form.cardExp}
                    onChange={update("cardExp")}
                    placeholder="MM / YY"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={form.cardCvc}
                    onChange={update("cardCvc")}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-border/70 bg-card/40 p-6">
            <h2 className="font-display text-xl">Order summary</h2>
            <ul className="mt-4 divide-y divide-border/50">
              {resolved.map(({ line, product, variant }) => (
                <li key={line.variantId} className="flex gap-3 py-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {product.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {variant.concentrationLabel} · {variant.sizeLabel}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatMoney(
                      variant.priceCents * line.quantity,
                      variant.currencyCode,
                    )}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatMoney(subtotal, "USD")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>
                  {SHIPPING_FLAT_CENTS === 0
                    ? "Free"
                    : formatMoney(SHIPPING_FLAT_CENTS, "USD")}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Estimated tax</dt>
                <dd>{formatMoney(tax, "USD")}</dd>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-3 text-base">
                <dt>Total</dt>
                <dd className="font-display text-lg">
                  {formatMoney(total, "USD")}
                </dd>
              </div>
            </dl>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full"
            >
              {submitting
                ? "Placing order…"
                : `Place order · ${formatMoney(total, "USD")}`}
            </Button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              By placing your order, you agree to our{" "}
              <Link
                href="/policies/terms-of-service"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/policies/privacy-policy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
