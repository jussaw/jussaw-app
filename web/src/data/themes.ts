// Must be kept in sync with src/styles/themes/*.css — one entry per CSS file.
export interface ThemeEntry {
  key: string;
  label: string;   // display name (tooltip + aria-label)
  bg: string;      // --color-bg (icon left half)
  color1: string;  // --color-accent (icon upper-right)
  color2: string;  // --color-accent-2 (icon lower-right)
}

export const themes: ThemeEntry[] = [
  // ── Dark themes (positions 0–17, rows 1–3) ────────────────────────
  // Pure black originals — CSS colors unchanged, pinned to 0–2
  { key: "baby-blue-3",     label: "Midnight Mauve",   bg: "#000000", color1: "#c4a0b2", color2: "#a0c4e0" },
  { key: "dusty-mauve",     label: "Onyx Dust",         bg: "#000000", color1: "#c8a0b0", color2: "#9c7888" },
  { key: "mauve-pure",      label: "Void Rose",         bg: "#000000", color1: "#c4a0b2", color2: "#987888" },
  // New dark themes
  { key: "ember-noir",      label: "Ember Noir",        bg: "#0d0805", color1: "#e8844a", color2: "#c8a020" },
  { key: "arctic-pulse",    label: "Arctic Pulse",      bg: "#050a12", color1: "#40c8f0", color2: "#2090b8" },
  { key: "crimson-noir",    label: "Crimson Noir",      bg: "#080003", color1: "#c83050", color2: "#e8907a" },
  { key: "forest-specter",  label: "Forest Specter",    bg: "#050c08", color1: "#58a868", color2: "#8cc870" },
  { key: "neon-dusk",       label: "Neon Dusk",         bg: "#08060f", color1: "#9060e8", color2: "#d040a0" },
  { key: "golden-obsidian", label: "Golden Obsidian",   bg: "#0c0a02", color1: "#d4a820", color2: "#e8d090" },
  { key: "amethyst-night",  label: "Amethyst Night",    bg: "#0a0812", color1: "#9870d0", color2: "#c0a0e8" },
  { key: "jade-abyss",      label: "Jade Abyss",        bg: "#040e10", color1: "#3ab890", color2: "#60d8b8" },
  { key: "iron-rose",       label: "Iron Rose",         bg: "#0e080a", color1: "#d06080", color2: "#e8a0b8" },
  { key: "copper-circuit",  label: "Copper Circuit",    bg: "#0c0604", color1: "#c87840", color2: "#e8b060" },
  { key: "sapphire-deep",   label: "Sapphire Deep",     bg: "#02040e", color1: "#4870d0", color2: "#90b0f0" },
  { key: "coral-abyss",     label: "Coral Abyss",       bg: "#0e0806", color1: "#e06840", color2: "#f0a878" },
  { key: "moonstone",       label: "Moonstone",         bg: "#060810", color1: "#c0c8e0", color2: "#8090b0" },
  { key: "chlorophyll",     label: "Chlorophyll",       bg: "#04080a", color1: "#78d040", color2: "#c0e860" },
  { key: "plasma",          label: "Plasma",            bg: "#05020e", color1: "#e03890", color2: "#4090f0" },

  // ── Light themes (positions 18–35, rows 4–6) ──────────────────────
  { key: "sage-cream",       label: "Sage Cream",       bg: "#f8f6f0", color1: "#6a8c50", color2: "#4a6c38" },
  { key: "blush-porcelain",  label: "Blush Porcelain",  bg: "#fef8f8", color1: "#c06080", color2: "#904858" },
  { key: "sky-linen",        label: "Sky Linen",        bg: "#f6f8fc", color1: "#4878c0", color2: "#305898" },
  { key: "honey-stone",      label: "Honey Stone",      bg: "#fffbf0", color1: "#c88020", color2: "#987018" },
  { key: "lavender-field",   label: "Lavender Field",   bg: "#f8f6fe", color1: "#7858c0", color2: "#5840a0" },
  { key: "mint-clay",        label: "Mint & Clay",      bg: "#f4faf6", color1: "#b85840", color2: "#904030" },
  { key: "seafoam-glass",    label: "Seafoam Glass",    bg: "#f4fbfa", color1: "#3898a0", color2: "#207880" },
  { key: "peach-marble",     label: "Peach Marble",     bg: "#fff6f2", color1: "#d06848", color2: "#b04828" },
  { key: "indigo-parchment", label: "Indigo Parchment", bg: "#faf8f4", color1: "#4848a0", color2: "#303078" },
  { key: "cherry-blossom",   label: "Cherry Blossom",   bg: "#fef8fa", color1: "#c83868", color2: "#a02850" },
  { key: "forest-mist",      label: "Forest Mist",      bg: "#f4f8f2", color1: "#3a6840", color2: "#285030" },
  { key: "gold-dust",        label: "Gold Dust",        bg: "#fffcf4", color1: "#b89020", color2: "#887010" },
  { key: "azure-shore",      label: "Azure Shore",      bg: "#f4f8fc", color1: "#3068c0", color2: "#1848a0" },
  { key: "rose-quartz",      label: "Rose Quartz",      bg: "#fef6f8", color1: "#b84870", color2: "#883858" },
  { key: "citrus-zest",      label: "Citrus Zest",      bg: "#fefaf4", color1: "#d07020", color2: "#b05010" },
  { key: "violet-dusk",      label: "Violet Dusk",      bg: "#f8f4fe", color1: "#6840a8", color2: "#502888" },
  { key: "nordic-ice",       label: "Nordic Ice",       bg: "#f4f6f8", color1: "#485870", color2: "#384858" },
  { key: "papaya-cream",     label: "Papaya Cream",     bg: "#fff8f2", color1: "#e07840", color2: "#c05828" },
];

export const DEFAULT_THEME = "baby-blue-3";
