"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import { RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  title?: string;
};

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const ZOOM_STEP = 0.5;
const DOUBLE_CLICK_SCALE = 2.5;

export function ImageLightbox({
  open,
  onOpenChange,
  src,
  alt,
  title,
}: Props) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragRef = React.useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  React.useEffect(() => {
    if (!open) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setIsDragging(false);
      dragRef.current = null;
    }
  }, [open]);

  const clampOffset = React.useCallback(
    (next: { x: number; y: number }, nextScale: number) => {
      const el = viewportRef.current;
      if (!el) return next;
      const rect = el.getBoundingClientRect();
      const maxX = (rect.width * (nextScale - 1)) / 2;
      const maxY = (rect.height * (nextScale - 1)) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, next.x)),
        y: Math.max(-maxY, Math.min(maxY, next.y)),
      };
    },
    [],
  );

  const applyZoom = React.useCallback(
    (nextScale: number, cursor?: { cx: number; cy: number }) => {
      const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      if (clamped <= MIN_SCALE) {
        setScale(MIN_SCALE);
        setOffset({ x: 0, y: 0 });
        return;
      }
      setScale((prevScale) => {
        setOffset((prev) => {
          if (cursor && viewportRef.current) {
            const rect = viewportRef.current.getBoundingClientRect();
            const cx = cursor.cx - rect.left - rect.width / 2;
            const cy = cursor.cy - rect.top - rect.height / 2;
            const ratio = clamped / prevScale;
            return clampOffset(
              {
                x: cx - (cx - prev.x) * ratio,
                y: cy - (cy - prev.y) * ratio,
              },
              clamped,
            );
          }
          return clampOffset(prev, clamped);
        });
        return clamped;
      });
    },
    [clampOffset],
  );

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el || !open) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      applyZoom(scale + delta, { cx: e.clientX, cy: e.clientY });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [open, scale, applyZoom]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
      moved: false,
    };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 3) drag.moved = true;
    setOffset(
      clampOffset(
        { x: drag.origX + dx, y: drag.origY + dy },
        scale,
      ),
    );
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      try {
        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      applyZoom(1);
    } else {
      applyZoom(DOUBLE_CLICK_SCALE, { cx: e.clientX, cy: e.clientY });
    }
  };

  const onContentPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          onPointerDown={onContentPointerDown}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none focus-visible:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Title className="sr-only">
            {title ?? alt}
          </DialogPrimitive.Title>

          <DialogPrimitive.Close
            aria-label="Close image zoom"
            className="group absolute right-5 top-5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-xl ring-1 ring-black/20 backdrop-blur transition duration-200 hover:scale-105 hover:border-white/50 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-black/0"
          >
            <X className="h-5 w-5 transition-transform duration-300 ease-out group-hover:rotate-90" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div
            className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 select-none rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/70 backdrop-blur"
          >
            Scroll or double-click to zoom · drag to pan
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/60 p-1 text-white shadow-xl backdrop-blur">
            <button
              type="button"
              onClick={() => applyZoom(scale - ZOOM_STEP)}
              disabled={scale <= MIN_SCALE}
              aria-label="Zoom out"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-40"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="min-w-[3.25rem] text-center text-xs tabular-nums text-white/90">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => applyZoom(scale + ZOOM_STEP)}
              disabled={scale >= MAX_SCALE}
              aria-label="Zoom in"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-40"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyZoom(1)}
              disabled={scale === 1 && offset.x === 0 && offset.y === 0}
              aria-label="Reset zoom"
              className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs transition hover:bg-white/15 disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={onDoubleClick}
            style={{
              cursor:
                scale > 1
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "zoom-in",
              touchAction: "none",
            }}
            className="relative aspect-[3/4] h-auto max-h-[85vh] w-full max-w-[min(92vw,56rem)] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                transformOrigin: "center center",
                transition: isDragging
                  ? "none"
                  : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                priority
                draggable={false}
                className="pointer-events-none select-none object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
