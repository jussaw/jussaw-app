// Must be kept in sync with src/styles/themes/*.css — one entry per CSS file.
export interface ThemeEntry {
  key: string;
  color1: string; // --color-accent
  color2: string; // --color-accent-2 (or same as color1 if absent)
}

export const themes: ThemeEntry[] = [
  { key: "baby-blue-3",              color1: "#c4a0b2", color2: "#a0c4e0" },
  { key: "baby-blue-1",              color1: "#c4a0b2", color2: "#89b4d4" },
  { key: "baby-blue-2",              color1: "#c4a0b2", color2: "#7aa8c8" },
  { key: "ballet-pink",              color1: "#a83060", color2: "#a83060" },
  { key: "cool-seafoam",             color1: "#c4a0b2", color2: "#78a898" },
  { key: "cool-steel",               color1: "#c4a0b2", color2: "#6e8eb8" },
  { key: "cool-teal",                color1: "#c4a0b2", color2: "#68a0a0" },
  { key: "dusty-mauve",              color1: "#c8a0b0", color2: "#c8a0b0" },
  { key: "frosted-rose",             color1: "#b03868", color2: "#b03868" },
  { key: "mauve-gold",               color1: "#7a5808", color2: "#7a5808" },
  { key: "mauve-periwinkle",         color1: "#c4a0b2", color2: "#98a4cc" },
  { key: "mauve-pure",               color1: "#c4a0b2", color2: "#c4a0b2" },
  { key: "mauve-sage",               color1: "#507058", color2: "#3a6848" },
  { key: "mauve-tricolor",           color1: "#c4a0b2", color2: "#c8b478" },
  { key: "powder-petal",             color1: "#c04070", color2: "#c04070" },
  { key: "rose-mist",                color1: "#904060", color2: "#904060" },
  { key: "swapped-blue-1",           color1: "#89b4d4", color2: "#c4a0b2" },
  { key: "swapped-blue-2",           color1: "#7aa8c8", color2: "#c4a0b2" },
  { key: "swapped-blue-3",           color1: "#a0c4e0", color2: "#c4a0b2" },
  { key: "tri-amber-slate",          color1: "#c4a0b2", color2: "#c8a870" },
  { key: "tri-lavender-rose",        color1: "#c4a0b2", color2: "#a898c4" },
  { key: "tri-periwinkle-champagne", color1: "#4050a8", color2: "#3858a0" },
  { key: "tri-sage-gold",            color1: "#4e5e28", color2: "#6a4e10" },
  { key: "tri-teal-blush",           color1: "#2a6858", color2: "#2a6858" },
  { key: "warm-brass",               color1: "#6e5006", color2: "#6e5006" },
  { key: "warm-copper",              color1: "#7a3818", color2: "#7a3818" },
  { key: "warm-coral",               color1: "#8c3820", color2: "#8c3820" },
];

export const DEFAULT_THEME = "baby-blue-3";
