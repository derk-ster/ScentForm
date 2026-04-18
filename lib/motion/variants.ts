import type { Variants } from "framer-motion";

/** Keep opacity at 1 so content is never hidden if `whileInView` fails to fire. */
export const fadeUp: Variants = {
  hidden: { opacity: 1, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};
