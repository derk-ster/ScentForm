"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccountStore } from "@/store/account-store";
import * as account from "@/lib/account/account-service";

/**
 * After registration, user must choose where saved products live.
 * Cart always stays in local browser storage (`cart-store`).
 */
export function SyncChoiceDialog() {
  const session = useAccountStore((s) => s.session);
  const refresh = useAccountStore((s) => s.refresh);
  const open = Boolean(session?.pendingSyncChoice);

  const choose = async (pref: "device" | "account") => {
    await account.updateSyncPreference(pref);
    await refresh();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Save preferences
          </DialogTitle>
          <DialogDescription className="text-left text-sm leading-relaxed">
            Choose where your <strong>saved products</strong> are stored. Your
            cart stays on this browser either way. Real sync across devices needs
            a backend — this demo stores account data in your browser for the
            signed-in email.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-[52px] flex-col gap-1 py-3"
            onClick={() => void choose("device")}
          >
            <span className="font-medium">This device only</span>
            <span className="text-center text-[11px] font-normal text-muted-foreground">
              Saved list stays in local storage on this machine.
            </span>
          </Button>
          <Button
            type="button"
            className="h-auto min-h-[52px] flex-col gap-1 py-3"
            onClick={() => void choose("account")}
          >
            <span className="font-medium">Save to account</span>
            <span className="text-center text-[11px] font-normal text-primary-foreground/90">
              Tied to your email in this browser (prototype).
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
