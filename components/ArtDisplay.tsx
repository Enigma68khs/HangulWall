"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HangulTile } from "@/components/HangulTile";
import type { TileVariant } from "@/lib/tile-generator";
import type { GridCell } from "@/lib/text-layout";

type ArtDisplayProps = {
  cells: GridCell[];
  rows: GridCell[][];
  variants: TileVariant[];
  columns: number;
  tileSize: number;
  speed: number;
  isExhibitionMode: boolean;
};

export function ArtDisplay({
  cells,
  rows,
  variants,
  columns,
  tileSize,
  speed,
  isExhibitionMode,
}: ArtDisplayProps) {
  const gap = Math.max(10, Math.round(tileSize * 0.12));
  const framePadding = isExhibitionMode ? 38 : 34;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollAreaRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [rows, columns, tileSize, speed]);

  return (
    <section
      className={`relative flex min-h-[720px] flex-1 items-center justify-center overflow-hidden rounded-[36px] border border-white/10 ${
        isExhibitionMode
          ? "w-full bg-[#050505]"
          : "bg-[linear-gradient(145deg,rgba(17,17,17,0.94),rgba(42,29,22,0.88))] shadow-[0_45px_120px_rgba(0,0,0,0.38)]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(246,214,176,0.15),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(159,97,65,0.2),transparent_24%),linear-gradient(90deg,rgba(255,255,255,0.04),transparent_18%,transparent_82%,rgba(255,255,255,0.04))]" />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/8 blur-sm" />

      {!isExhibitionMode && (
        <div className="absolute left-6 top-6 z-20 flex items-center gap-3 text-stone-300/75">
          <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.4em]">
            Vertical panel
          </span>
          <span className="text-xs tracking-[0.2em] text-stone-400">
            kinetic hangul installation
          </span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 flex aspect-[9/19] w-full max-w-[620px] items-center justify-center rounded-[42px] border p-3 sm:p-5 ${
          isExhibitionMode
            ? "h-[calc(100vh-148px)] max-h-[1120px] min-h-[520px] border-white/10 bg-[linear-gradient(180deg,rgba(22,18,15,0.96),rgba(10,10,10,0.98))]"
            : "h-[92vh] max-h-[1240px] border-white/12 bg-[linear-gradient(180deg,rgba(30,23,20,0.96),rgba(10,10,10,0.98))]"
        }`}
      >
        <div className="display-bezel absolute inset-[12px] rounded-[34px] border border-[#d7b697]/12" />
        <div className="display-frame-shadow absolute inset-[8px] rounded-[38px]" />
        <div className="display-pillar absolute inset-y-[7%] left-[7%] w-[1px] bg-white/8" />
        <div className="display-pillar absolute inset-y-[7%] right-[7%] w-[1px] bg-white/8" />
        <div className="pointer-events-none absolute inset-[26px] rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.14))]" />
        <div className="display-screen-glow absolute inset-[30px] rounded-[26px]" />
        {!isExhibitionMode && <div className="display-stand" />}

        <div
          ref={scrollAreaRef}
          className="relative z-10 flex h-full w-full flex-col justify-end overflow-y-auto overflow-x-hidden rounded-[28px] exhibition-grid exhibition-scroll"
          style={{ gap: `${gap}px`, padding: `${framePadding}px` }}
        >
          {rows.map((row, rowIndex) => {
            const rowStartIndex = rows
              .slice(0, rowIndex)
              .reduce((sum, currentRow) => sum + currentRow.length, 0);

            return (
              <div
                key={`row-${rowIndex}`}
                className="grid justify-start"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, ${tileSize}px))`,
                  gap: `${gap}px`,
                }}
              >
                {row.map((cell, columnIndex) => {
                  const index = rowStartIndex + columnIndex;

                  return (
                    <HangulTile
                      key={`${cell.char}-${index}-${variants[index]?.seed}`}
                      char={cell.char}
                      index={index}
                      styleVariant={variants[index]}
                      animationDelay={index * 0.043 + (index % columns) * 0.012}
                      isBlank={cell.isBlank}
                      tileSize={tileSize}
                      speed={speed}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
