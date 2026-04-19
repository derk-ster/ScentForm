"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useAccountStore } from "@/store/account-store";
import * as account from "@/lib/account/account-service";

type Props = {
  handle: string;
  className?: string;
  size?: "sm" | "md";
};

export function SaveProductHeart({ handle, className, size = "sm" }: Props) {
  const session = useAccountStore((s) => s.session);
  const hydrated = useAccountStore((s) => s.hydrated);
  const refresh = useAccountStore((s) => s.refresh);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!hydrated || !session?.syncPreference) {
      setSaved(false);
      return;
    }
    void account.isSaved(handle).then(setSaved);
  }, [handle, session, hydrated]);

  if (!hydrated || !session) return null;

  if (!session.syncPreference) {
    return (
      <Button
        type="button"
        size="icon"
        variant="secondary"
        disabled
        className={cn(
          "rounded-full border border-border/60 bg-background/85 shadow-sm backdrop-blur",
          size === "md" ? "h-10 w-10" : "h-8 w-8",
          className,
        )}
        title="Choose save location from your account page first"
        aria-label="Save unavailable until sync choice is complete"
      >
        <Heart className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
      </Button>
    );
  }

  const iconClass = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      disabled={busy}
      className={cn(
        "rounded-full border border-border/60 bg-background/85 shadow-sm backdrop-blur transition-colors",
        saved ? "border-primary/50 text-primary" : "text-muted-foreground",
        size === "md" ? "h-10 w-10" : "h-8 w-8",
        className,
      )}
      title={saved ? "Remove from saved" : "Save product"}
      aria-label={saved ? "Remove from saved" : "Save product"}
      aria-pressed={saved}
      onClick={async () => {
        setBusy(true);
        try {
          const next = await account.toggleSavedHandle(handle);
          setSaved(next);
          await refresh();
        } finally {
          setBusy(false);
        }
      }}
    >
      <Heart
        className={cn(iconClass, saved ? "fill-current" : "")}
        aria-hidden
      />
    </Button>
  );
}
