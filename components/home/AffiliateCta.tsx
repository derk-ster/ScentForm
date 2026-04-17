import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

export function AffiliateCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/30 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Affiliates · <span className="text-foreground">15%</span> commission
        </p>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/affiliate">Program</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
