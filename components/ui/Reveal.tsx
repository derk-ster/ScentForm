"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "variants"> & {
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  as?: "div" | "section" | "article" | "header" | "footer" | "aside";
};

export function Reveal({
  children,
  delay = 0,
  y = 18,
  duration = 0.55,
  amount = 0.18,
  once = true,
  className,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div className={className} {...rest}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
