import { Droplets, Factory, Leaf, Recycle, Truck } from "lucide-react";

const baseItems = [
  { label: "USA made", icon: Factory },
  { label: "Cruelty-free", icon: Leaf },
  { label: "Phthalate-free", icon: Droplets },
  { label: "Recycle-friendly", icon: Recycle },
  { label: "Tracked shipping", icon: Truck },
];

/** Repeat labels so the marquee track reads full before loop. */
function expandedItems() {
  return [...baseItems, ...baseItems, ...baseItems];
}

export function TrustBar() {
  const segment = expandedItems();
  return (
    <section className="border-y border-border/50 bg-card/30 py-3">
      <div
        className="trust-marquee relative mx-auto max-w-6xl overflow-hidden px-0 sm:px-6 lg:px-8"
        aria-label="Trust and shipping highlights"
      >
        <div className="trust-marquee-inner flex w-max">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-x-10 px-6 sm:gap-x-14 sm:px-8"
              aria-hidden={dup === 1 || undefined}
            >
              {segment.map((item, idx) => (
                <div
                  key={`${dup}-${item.label}-${idx}`}
                  className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground"
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
