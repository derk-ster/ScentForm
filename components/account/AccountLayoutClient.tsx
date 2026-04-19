"use client";

import type { ReactNode } from "react";
import { SyncChoiceDialog } from "@/components/account/SyncChoiceDialog";

export function AccountLayoutClient({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SyncChoiceDialog />
    </>
  );
}
