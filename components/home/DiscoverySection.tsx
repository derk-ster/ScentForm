import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

const links = [
  { label: "Clean", href: "/shop?mood=clean" },
  { label: "Warm", href: "/shop?mood=warm" },
  { label: "Date", href: "/shop?mood=date" },
  { label: "Weekend", href: "/shop?mood=weekend" },
  { label: "Citrus", href: "/shop?note=citrus" },
  { label: "Woods", href: "/shop?note=woods" },
  { label: "Vanilla", href: "/shop?note=vanilla" },
  { label: "Aquatic", href: "/shop?note=aquatic" },
];

export function DiscoverySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg">Browse</h2>
        <div className="flex flex-wrap gap-2">
          {links.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-border hover:text-foreground"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
