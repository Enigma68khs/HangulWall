import type { GridCell } from "@/lib/text-layout";

export type PatternType = "collage" | "poster" | "ceramic" | "minhwa";
export type TextureClass = "fibrous" | "speckled" | "glaze" | "woven";
export type DecorativeIcon = "dot" | "line" | "bloom" | "diamond" | "none";

export type TileVariant = {
  seed: number;
  bgColor: string;
  bgAccent: string;
  glazeColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  patternType: PatternType;
  textureClass: TextureClass;
  rotation: number;
  shadow: string;
  decorativeIcon: DecorativeIcon;
  borderStyle: "solid" | "double";
  insetShadow: string;
  animationLag: number;
  ornamentScale: number;
};

const palettes = [
  {
    bg: "#C65A3F",
    accent: "#E8C9AA",
    text: "#FFF9F1",
    border: "rgba(255, 244, 226, 0.34)",
  },
  {
    bg: "#234A58",
    accent: "#A7C9C8",
    text: "#F4EEDF",
    border: "rgba(170, 212, 214, 0.35)",
  },
  {
    bg: "#6D7D46",
    accent: "#E0D0A8",
    text: "#FBF7EA",
    border: "rgba(233, 220, 172, 0.32)",
  },
  {
    bg: "#A0493B",
    accent: "#F3D9BA",
    text: "#FFF6EA",
    border: "rgba(255, 235, 209, 0.34)",
  },
  {
    bg: "#845B88",
    accent: "#E7D8EB",
    text: "#FFF9FF",
    border: "rgba(237, 221, 240, 0.32)",
  },
  {
    bg: "#B58D4F",
    accent: "#F7E5BA",
    text: "#2B2016",
    border: "rgba(255, 240, 195, 0.36)",
  },
  {
    bg: "#374033",
    accent: "#C6D2B0",
    text: "#F6F2E8",
    border: "rgba(214, 225, 188, 0.26)",
  },
  {
    bg: "#C96E5A",
    accent: "#F4D9D0",
    text: "#FFF8F4",
    border: "rgba(255, 232, 221, 0.36)",
  },
];

const patternTypes: PatternType[] = ["collage", "poster", "ceramic", "minhwa"];
const textureClasses: TextureClass[] = ["fibrous", "speckled", "glaze", "woven"];
const decorativeIcons: DecorativeIcon[] = ["dot", "line", "bloom", "diamond", "none"];

function hashChar(char: string, index: number) {
  return Array.from(char).reduce(
    (sum, letter, offset) => sum + letter.charCodeAt(0) * (offset + 1),
    index * 31 + 17
  );
}

function positiveMod(input: number, divisor: number) {
  return ((input % divisor) + divisor) % divisor;
}

export function createTileVariants(cells: GridCell[]): TileVariant[] {
  return cells.map((cell, index) => {
    const seed = cell.isBlank ? index * 13 + 7 : hashChar(cell.char, index);
    const palette = palettes[positiveMod(seed, palettes.length)];
    const patternType = patternTypes[positiveMod(seed + index, patternTypes.length)];
    const textureClass =
      textureClasses[positiveMod(seed * 3 + index, textureClasses.length)];
    const decorativeIcon =
      decorativeIcons[positiveMod(seed + index * 5, decorativeIcons.length)];
    const rotation = cell.isBlank ? 0 : (positiveMod(seed, 11) - 5) * 0.8;
    const depth = 24 + positiveMod(seed, 18);
    const animationLag = positiveMod(seed * 7 + index * 11, 5) * 0.03;

    return {
      seed,
      bgColor: cell.isBlank ? "rgba(255,255,255,0.03)" : palette.bg,
      bgAccent: cell.isBlank ? "rgba(255,255,255,0.02)" : palette.accent,
      glazeColor: cell.isBlank
        ? "rgba(255,255,255,0.04)"
        : `color-mix(in srgb, ${palette.accent} 68%, white 32%)`,
      textColor: cell.isBlank ? "transparent" : palette.text,
      borderColor: cell.isBlank ? "rgba(255,255,255,0.04)" : palette.border,
      borderRadius: cell.isBlank ? 18 : 14 + positiveMod(seed, 18),
      patternType,
      textureClass,
      rotation,
      shadow: cell.isBlank
        ? "0 10px 30px rgba(0, 0, 0, 0.06)"
        : `0 ${Math.round(depth * 0.55)}px ${depth}px rgba(0, 0, 0, 0.24)`,
      decorativeIcon: cell.isBlank ? "none" : decorativeIcon,
      borderStyle: positiveMod(seed, 4) === 0 ? "double" : "solid",
      insetShadow: cell.isBlank
        ? "inset 0 1px 0 rgba(255,255,255,0.03)"
        : `inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -12px 18px rgba(0,0,0,0.08)`,
      animationLag,
      ornamentScale: 0.85 + positiveMod(seed, 5) * 0.08,
    };
  });
}
