"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

type Flight = {
  id: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

type CartFlyContextValue = {
  setCartAnchor: (el: HTMLElement | null) => void;
  playFrom: (origin: HTMLElement | null) => void;
};

const CartFlyContext = createContext<CartFlyContextValue | null>(null);

const noopCartFly: CartFlyContextValue = {
  setCartAnchor: () => {},
  playFrom: () => {},
};

/**
 * Returns no-op implementations when used outside the provider so a stray
 * import never takes down the whole app (white screen on add-to-cart).
 */
export function useCartFly(): CartFlyContextValue {
  const ctx = useContext(CartFlyContext);
  return ctx ?? noopCartFly;
}

function FlyingHeart({
  flight,
  onRemove,
}: {
  flight: Flight;
  onRemove: (id: number) => void;
}) {
  const { x0, y0, x1, y1, id } = flight;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const arcLift = -Math.min(110, 44 + Math.hypot(dx, dy) * 0.14);
  const box = 32;
  const half = box / 2;

  useEffect(() => {
    const t = window.setTimeout(() => onRemove(id), 920);
    return () => window.clearTimeout(t);
  }, [id, onRemove]);

  return (
    <motion.div
      className="pointer-events-none fixed z-[300] flex items-center justify-center text-primary drop-shadow-md"
      style={{ width: box, height: box }}
      initial={{
        left: x0 - half,
        top: y0 - half,
        scale: 0.22,
        opacity: 1,
      }}
      animate={{
        left: [x0 - half, x0 - half, x1 - half],
        top: [y0 - half, y0 - half + arcLift, y1 - half],
        scale: [0.22, 1.08, 0.62],
        opacity: [1, 1, 0.95],
      }}
      transition={{
        duration: 0.88,
        times: [0, 0.15, 1],
        // String easings only: nested bezier arrays have triggered WAAPI / runtime issues.
        ease: ["easeOut", "easeIn"],
      }}
    >
      <Heart
        className="h-7 w-7 fill-primary text-primary"
        strokeWidth={1.35}
        aria-hidden
      />
    </motion.div>
  );
}

export function CartFlyAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setCartAnchor = useCallback((el: HTMLElement | null) => {
    anchorRef.current = el;
  }, []);

  const dismiss = useCallback((id: number) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const playFrom = useCallback(
    (origin: HTMLElement | null) => {
      if (!origin || reducedMotion) return;
      const anchor = anchorRef.current;
      if (!anchor) return;

      try {
        const from = origin.getBoundingClientRect();
        const to = anchor.getBoundingClientRect();
        const x0 = from.left + from.width / 2;
        const y0 = from.top + from.height / 2;
        const x1 = to.left + to.width / 2;
        const y1 = to.top + to.height / 2;

        if (
          ![x0, y0, x1, y1].every((n) => Number.isFinite(n)) ||
          (from.width === 0 && from.height === 0)
        ) {
          return;
        }

        idRef.current += 1;
        const id = idRef.current;

        setFlights((prev) => [...prev, { id, x0, y0, x1, y1 }]);
      } catch {
        /* layout / DOM edge cases — never break checkout UI */
      }
    },
    [reducedMotion],
  );

  const value = useMemo(
    () => ({ setCartAnchor, playFrom }),
    [setCartAnchor, playFrom],
  );

  const portal =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <>
            {flights.map((f) => (
              <FlyingHeart key={f.id} flight={f} onRemove={dismiss} />
            ))}
          </>,
          document.body,
        )
      : null;

  return (
    <CartFlyContext.Provider value={value}>
      {children}
      {portal}
    </CartFlyContext.Provider>
  );
}
