// Must be kept in sync with src/styles/themes/*.css — one entry per CSS file.
export interface ThemeEntry {
  key: string;
  color1: string; // --color-accent
  color2: string; // --color-accent-2 (or same as color1 if absent)
}

export const themes: ThemeEntry[] = [
  { key: "baby-blue-1",              color1: "#c4a0b2", color2: "#89b4d4" },
  { key: "baby-blue-2",              color1: "#c4a0b2", color2: "#7aa8c8" },
  { key: "baby-blue-3",              color1: "#c4a0b2", color2: "#a0c4e0" },
  { key: "ballet-pink",              color1: "#e8b4c0", color2: "#e8b4c0" },
  { key: "cool-seafoam",             color1: "#c4a0b2", color2: "#78a898" },
  { key: "cool-steel",               color1: "#c4a0b2", color2: "#6e8eb8" },
  { key: "cool-teal",                color1: "#c4a0b2", color2: "#68a0a0" },
  { key: "dusty-mauve",              color1: "#c8a0b0", color2: "#c8a0b0" },
  { key: "frosted-rose",             color1: "#f2c8d4", color2: "#f2c8d4" },
  { key: "mauve-gold",               color1: "#c4a0b2", color2: "#c8b478" },
  { key: "mauve-periwinkle",         color1: "#c4a0b2", color2: "#98a4cc" },
  { key: "mauve-pure",               color1: "#c4a0b2", color2: "#c4a0b2" },
  { key: "mauve-sage",               color1: "#c4a0b2", color2: "#8cb898" },
  { key: "mauve-tricolor",           color1: "#c4a0b2", color2: "#c8b478" },
  { key: "powder-petal",             color1: "#f5dde4", color2: "#f5dde4" },
  { key: "rose-mist",                color1: "#dbb8c4", color2: "#dbb8c4" },
  { key: "swapped-blue-1",           color1: "#89b4d4", color2: "#c4a0b2" },
  { key: "swapped-blue-2",           color1: "#7aa8c8", color2: "#c4a0b2" },
  { key: "swapped-blue-3",           color1: "#a0c4e0", color2: "#c4a0b2" },
  { key: "tri-amber-slate",          color1: "#c4a0b2", color2: "#c8a870" },
  { key: "tri-lavender-rose",        color1: "#c4a0b2", color2: "#a898c4" },
  { key: "tri-periwinkle-champagne", color1: "#c4a0b2", color2: "#8898c4" },
  { key: "tri-sage-gold",            color1: "#c4a0b2", color2: "#c8aa6e" },
  { key: "tri-teal-blush",           color1: "#c4a0b2", color2: "#7aa8a0" },
  { key: "warm-brass",               color1: "#c4a0b2", color2: "#b09040" },
  { key: "warm-copper",              color1: "#c4a0b2", color2: "#c07858" },
  { key: "warm-coral",               color1: "#c4a0b2", color2: "#c88870" },
];

export const DEFAULT_THEME = "baby-blue-3";
