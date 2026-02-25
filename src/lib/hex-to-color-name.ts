import { GetColorName } from "hex-color-to-color-name";

const HEX_COLOR = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
/** Format: hex::name — e.g. "#000000::Black". Legacy: just hex. */
const COLOR_DELIMITER = "::";

export interface ParsedColor {
  hex: string;
  displayName: string;
}

/**
 * Parses a color value which may be "hex::name" (admin-provided name) or plain hex/name.
 * Returns { hex, displayName } for use in product detail.
 */
export function parseColorEntry(value: string): ParsedColor {
  if (!value?.trim()) return { hex: "", displayName: "" };
  const v = value.trim();
  if (v.includes(COLOR_DELIMITER)) {
    const [hexPart, namePart] = v.split(COLOR_DELIMITER, 2);
    const hex = hexPart?.trim() ?? "";
    const name = namePart?.trim() ?? "";
    const displayName = name || (hex ? GetColorName(hex) : "");
    return { hex, displayName };
  }
  const hex = HEX_COLOR.test(v) ? v : "";
  const displayName = hex ? GetColorName(v) : v;
  return { hex: hex || v, displayName };
}

/**
 * Returns a human-readable color name for display. If the value is hex::name,
 * uses the name; if hex, converts to closest color name; otherwise returns as-is.
 */
export function getColorDisplayName(value: string): string {
  return parseColorEntry(value).displayName || value;
}

/**
 * Serializes hex and optional name for storage. Use when saving from admin.
 */
export function serializeColor(hex: string, name?: string): string {
  const trimmed = name?.trim();
  return trimmed ? `${hex}${COLOR_DELIMITER}${trimmed}` : hex;
}
