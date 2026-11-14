const WIB_TIMEZONE = "Asia/Jakarta";

/** Masks 16-digit NIK/KK for UI and SSR payloads while preserving non-identifiable edges. */
export function maskNik(nik: string | null | undefined): string {
  const clean = (nik ?? "").trim();
  if (!clean) return "-";
  if (clean.length >= 8) {
    return `${clean.slice(0, 4)}********${clean.slice(-4)}`;
  }
  if (clean.length >= 4) {
    return `****${clean.slice(-4)}`;
  }
  return "-";
}

export function formatWibDate(
  value: string | Date | null | undefined,
  month: "short" | "long" = "short"
): string {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month,
    year: "numeric",
    timeZone: WIB_TIMEZONE,
  });
}

export function formatWibTime(value: string | Date | null | undefined): string {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: WIB_TIMEZONE,
  })} WIB`;
}

export function formatWibDateTime(
  value: string | Date | null | undefined,
  separator = "\n"
): string {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${formatWibDate(date, "short")}${separator}${formatWibTime(date)}`;
}

export function normalizeRegionName(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^(kota|kabupaten|kab\.?|kecamatan|kec\.?)\s+/i, "")
    .trim();
}
