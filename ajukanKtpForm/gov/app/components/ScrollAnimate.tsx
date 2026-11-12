"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface ScrollAnimateProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  className?: string;
}

export default function ScrollAnimate({
  children,
  direction = "up",
  duration = 0.6,
  delay = 0,
  className = "",
}: ScrollAnimateProps) {
// hitung posisi awal animasi berdasarkan arah (up/down/left/right)
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 20, x: 0 };
      case "down":
        return { y: -20, x: 0 };
      case "left":
        return { x: 20, y: 0 };
      case "right":
        return { x: -20, y: 0 };
      default:
        return { y: 20, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.05 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}