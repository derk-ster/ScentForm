"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ACCENT_OPTIONS,
  type AccentId,
  applyAccentToDocument,
  readStoredAccent,
  writeStoredAccent,
} from "@/lib/theme/accent";

export function AccentPaletteMenu({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [value, setValue] = React.useState<AccentId | "default">("default");

  React.useEffect(() => {
    setMounted(true);
    const stored = readStoredAccent();
    setValue(stored ?? "default");
  }, []);

  const onChange = (next: string) => {
    if (next === "default") {
      writeStoredAccent(null);
      applyAccentToDocument(null);
      setValue("default");
      return;
    }
    const id = next as AccentId;
    writeStoredAccent(id);
    applyAccentToDocument(id);
    setValue(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={className}
          aria-label="Accent color"
          title={mounted ? "Accent color" : undefined}
        >
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[15rem]">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Premium accent
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={mounted ? value : "default"}
          onValueChange={onChange}
        >
          <DropdownMenuRadioItem value="default" className="text-sm">
            Default
          </DropdownMenuRadioItem>
          {ACCENT_OPTIONS.map((o) => (
            <DropdownMenuRadioItem key={o.id} value={o.id} className="text-sm">
              <span className="block font-medium leading-tight whitespace-nowrap">
                {o.label}
              </span>
              <span className="mt-1 block text-[10px] font-normal leading-snug text-muted-foreground">
                {o.hint}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
