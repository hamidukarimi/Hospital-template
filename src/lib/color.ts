/** Build soft card chrome from any DB hex color (no hardcoded palette limit). */
export const normalizeHex = (color?: string | null, fallback = "#4ba3dd") => {
  if (!color) return fallback;
  const value = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return fallback;
};

export const hexToRgb = (hex: string) => {
  const normalized = normalizeHex(hex);
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
};

export const rgba = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Mix color toward white (0 = color, 1 = white). */
export const mixWithWhite = (hex: string, amount: number) => {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * Math.min(1, Math.max(0, amount)));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

export const isInternalPath = (url?: string | null) => {
  if (!url || url === "#") return false;
  return url.startsWith("/") && !url.startsWith("//");
};
