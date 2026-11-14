/**
 * Pure date/schedule parsers and storage/media URL sanitizers shared across services and tests.
 */

export function parseScheduleToIso(waktuStr?: string): string | null {
  if (!waktuStr || !waktuStr.trim()) return null;
  const raw = waktuStr.trim();

  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw)) {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  const isoLocalMatch = raw.match(
    /^(\d{4}-\d{2}-\d{2})(?:[T\s]+(\d{1,2}:\d{2})(?::(\d{2}))?)?$/
  );
  if (isoLocalMatch) {
    const datePart = isoLocalMatch[1];
    const timePart = isoLocalMatch[2]
      ? isoLocalMatch[2].padStart(5, "0")
      : "09:00";
    const secPart = isoLocalMatch[3] || "00";
    const parsed = new Date(`${datePart}T${timePart}:${secPart}+07:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  try {
    const cleaned = raw
      .replace(/(\d+)(st|nd|rd|th)/i, "$1")
      .replace(/\s*WIB/i, "")
      .trim();

    const match = cleaned.match(/^(.*?)\s+(\d{1,2}:\d{2})\s*(?:-\s*\d{1,2}:\d{2})?$/);
    if (match) {
      const combined = new Date(`${match[1]} ${match[2].padStart(5, "0")} +07:00`);
      if (!Number.isNaN(combined.getTime())) {
        return combined.toISOString();
      }
    }

    const fallback = new Date(`${cleaned} +07:00`);
    return Number.isNaN(fallback.getTime()) ? null : fallback.toISOString();
  } catch {
    return null;
  }
}

export function sanitizeDocumentUrl(url?: string): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim().slice(0, 1024);
  if (!trimmed) return null;

  if (/^[0-9a-f-]{36}\/[^\s?#]+$/i.test(trimmed) || trimmed.startsWith("govhub-documents/")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Tolak skema tidak aman
  }
  return null;
}

export function sanitizeDocumentOrPhotoRef(val?: string | null): string | null {
  if (!val || typeof val !== "string") return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  if (
    /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(trimmed) &&
    trimmed.length <= 2_500_000
  ) {
    return trimmed;
  }
  if (/^[0-9a-f-]{36}\/[^\s?#]+$/i.test(trimmed) || trimmed.startsWith("govhub-documents/")) {
    return trimmed.slice(0, 1024);
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") {
      return parsed.toString().slice(0, 1024);
    }
  } catch {
    // ignore
  }
  return null;
}
