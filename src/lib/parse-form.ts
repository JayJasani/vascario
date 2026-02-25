/**
 * Null-safe form parsing utilities.
 * Handles FormData.get() returning null/undefined and prevents breakage.
 */

/** Safely get string from FormData, returns "" if null/undefined. */
export function getString(formData: FormData, key: string): string {
    const val = formData.get(key);
    return typeof val === "string" ? val.trim() : "";
}

/** Safely get string or null (for optional fields). */
export function getStringOrNull(formData: FormData, key: string): string | null {
    const val = formData.get(key);
    if (val == null) return null;
    const s = typeof val === "string" ? val.trim() : String(val).trim();
    return s === "" ? null : s;
}

/** Safely parse float, returns NaN if invalid. */
export function getFloat(formData: FormData, key: string): number {
    const val = formData.get(key);
    if (val == null) return NaN;
    const s = typeof val === "string" ? val.trim() : String(val).trim();
    return s === "" ? NaN : parseFloat(s);
}

/** Safely parse float or null (for optional numeric fields). */
export function getFloatOrNull(formData: FormData, key: string): number | null {
    const val = formData.get(key);
    if (val == null) return null;
    const s = typeof val === "string" ? val.trim() : String(val).trim();
    if (s === "") return null;
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
}

/** Safely get comma-separated string as trimmed array. Returns [] if null/empty. */
export function getStringArray(formData: FormData, key: string): string[] {
    const val = formData.get(key);
    if (val == null) return [];
    const s = typeof val === "string" ? val : String(val);
    return s.split(",").map((x) => x.trim()).filter(Boolean);
}

/** Safely get sizes from form (getAll or comma string). Returns [] if empty. */
export function getSizes(formData: FormData): string[] {
    const sizesRaw = formData.getAll("sizes");
    if (Array.isArray(sizesRaw) && sizesRaw.length > 0) {
        return (sizesRaw as string[]).map((s) => String(s).trim()).filter(Boolean);
    }
    const commaVal = formData.get("sizes");
    if (commaVal == null) return [];
    const s = typeof commaVal === "string" ? commaVal : String(commaVal);
    return s.split(",").map((x) => x.trim()).filter(Boolean);
}

/** Check if checkbox/radio is "on". */
export function getBoolean(formData: FormData, key: string): boolean {
    return formData.get(key) === "on";
}

/** Validate non-empty string id. Returns false if null/undefined/empty. */
export function isValidId(id: string | null | undefined): id is string {
    return typeof id === "string" && id.trim().length > 0;
}
