import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/Reveal";

export function EmailCaptureBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Drops & restocks</p>
        <form className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="home-email">
            Email
          </label>
          <Input
            id="home-email"
            type="email"
            required
            placeholder="Email"
            className="sm:w-56"
          />
          <Button type="submit" size="sm">
            Join
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
