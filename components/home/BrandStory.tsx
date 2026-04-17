import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

export function BrandStory() {
  return (
    <section className="border-y border-border/50 bg-card/15 py-10">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="max-w-xl text-sm text-muted-foreground">
          Clear notes, real specs, multiple concentrations — pick what fits your day.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/about">About</Link>
        </Button>
      </Reveal>
    </section>
  );
}
