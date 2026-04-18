import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl">This page drifted off-skin</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The route does not exist in this build, or the handle changed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {/*
          Full document navigation: recovers after a bad dev compile, service-worker,
          or client-router glitch where <Link> would stay on a broken / RSC payload.
        */}
        <Button asChild>
          <a href="/">Back to home</a>
        </Button>
        <Button asChild variant="outline">
          <a href="/shop">Shop all</a>
        </Button>
      </div>
    </div>
  );
}
