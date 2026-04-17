import { Droplets, Factory, Leaf, Recycle, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { label: "USA made", icon: Factory },
  { label: "Cruelty-free", icon: Leaf },
  { label: "Phthalate-free", icon: Droplets },
  { label: "Recycle-friendly", icon: Recycle },
  { label: "Tracked shipping", icon: Truck },
];

export function TrustBar() {
  return (
    <section className="border-y border-border/50 bg-card/30 py-4">
      <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 sm:px-6 lg:px-8">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <item.icon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
