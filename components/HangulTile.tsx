"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { TileVariant } from "@/lib/tile-generator";

type HangulTileProps = {
  char: string;
  index: number;
  styleVariant: TileVariant;
  animationDelay: number;
  isBlank: boolean;
  tileSize: number;
  speed: number;
};

const decorativeMap: Record<TileVariant["decorativeIcon"], string> = {
  dot: "●",
  line: "─",
  bloom: "✿",
  diamond: "◆",
  none: "",
};

export function HangulTile({
  char,
  styleVariant,
  animationDelay,
  isBlank,
  tileSize,
  speed,
}: HangulTileProps) {
  const style = {
    "--tile-bg": styleVariant.bgColor,
    "--tile-bg-alt": styleVariant.bgAccent,
    "--tile-glaze": styleVariant.glazeColor,
    "--tile-text": styleVariant.textColor,
    "--tile-border": styleVariant.borderColor,
    "--tile-shadow": styleVariant.shadow,
    "--tile-inset-shadow": styleVariant.insetShadow,
    "--tile-rotation": `${styleVariant.rotation}deg`,
    "--tile-ornament-scale": `${styleVariant.ornamentScale}`,
  } as CSSProperties;

  if (isBlank) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 0.18, y: 0 }}
        transition={{
          delay: (animationDelay + styleVariant.animationLag * 0.5) / speed,
          duration: 0.65 / speed,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="blank-cell"
        style={{ width: tileSize, height: tileSize }}
      />
    );
  }

  return (
    <motion.div
      initial={{
        y: -520,
        opacity: 0,
        rotate: styleVariant.rotation - 7,
        scale: 0.92,
      }}
      animate={{
        y: 0,
        opacity: 1,
        rotate: styleVariant.rotation,
        scale: 1,
      }}
      transition={{
        delay: (animationDelay + styleVariant.animationLag) / speed,
        type: "spring",
        damping: 11,
        stiffness: 94 * speed,
        mass: 1.02,
        bounce: 0.28,
      }}
      className="tile-shell"
      style={{ width: tileSize, height: tileSize }}
    >
      <div
        className={`hangul-tile pattern-${styleVariant.patternType} texture-${styleVariant.textureClass}`}
        style={{
          ...style,
          borderRadius: `${styleVariant.borderRadius}px`,
          borderStyle: styleVariant.borderStyle,
        }}
      >
        <span className="tile-surface tile-surface-top" />
        <span className="tile-surface tile-surface-grain" />
        <span className="tile-surface tile-surface-mark" />
        {styleVariant.decorativeIcon !== "none" && (
          <span className="tile-decoration tile-decoration-a">
            {decorativeMap[styleVariant.decorativeIcon]}
          </span>
        )}
        <span className="tile-decoration tile-decoration-b">
          {styleVariant.patternType === "ceramic"
            ? "◌"
            : styleVariant.patternType === "minhwa"
              ? "∴"
              : "·"}
        </span>
        <span className="tile-decoration tile-decoration-c" />
        <span className="tile-char">{char}</span>
      </div>
    </motion.div>
  );
}
