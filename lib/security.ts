export const ADMIN_SESSION_COOKIE = "govhub_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export interface AdminSessionPayload {
  id: string;
  nik: string;
  instansi: string;
  tingkat: string;
  role: string;
  provinsi: string | null;
  kota: string | null;
  kecamatan: string | null;
  iat: number;
  exp: number;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function resolveSessionSecret(secretOverride?: string): string {
  const raw =
    secretOverride ??
    process.env.ADMIN_SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "";
  return raw.trim();
}

async function deriveHmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  // Domain separation ensures derived signing key differs from any fallback service secret.
  const digest = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(`govhub-admin-session-v1:${secret}`)
  );
  return crypto.subtle.importKey(
    "raw",
    digest,
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

/** Resolves the single authoritative admin portal base route from staff claims. */
export function getAdminPortalBasePath(
  instansi: string | null | undefined,
  tingkat: string | null | undefined
): string {
  const normalizedInstansi = (instansi ?? "").trim().toLowerCase();
  const normalizedTingkat = (tingkat ?? "").trim().toLowerCase();

  if (
    normalizedInstansi === "pusat" ||
    normalizedTingkat === "pusat" ||
    normalizedTingkat === "provinsi"
  ) {
    return "/admin/dashboard";
  }

  if (normalizedInstansi === "dukcapil" && normalizedTingkat === "kota") {
    return "/admin/dukcapil/kota/dashboard";
  }
  if (normalizedInstansi === "dukcapil" && normalizedTingkat === "kecamatan") {
    return "/admin/dukcapil/kecamatan/dashboard";
  }
  if (normalizedInstansi === "dinsos" && normalizedTingkat === "kota") {
    return "/admin/dinsos/kota/dashboard";
  }
  if (normalizedInstansi === "dinsos" && normalizedTingkat === "kecamatan") {
    return "/admin/dinsos/kecamatan/dashboard";
  }

  return "/admin/login";
}

export async function signAdminSessionToken(
  claims: Omit<AdminSessionPayload, "iat" | "exp">,
  options?: { secret?: string; ttlSeconds?: number; nowSeconds?: number }
): Promise<string> {
  const secret = resolveSessionSecret(options?.secret);
  if (!secret) {
    throw new Error("Admin session signing secret is not configured");
  }

  const basePath = getAdminPortalBasePath(claims.instansi, claims.tingkat);
  if (basePath === "/admin/login") {
    throw new Error("Invalid admin instansi/tingkat claims");
  }

  const now = options?.nowSeconds ?? Math.floor(Date.now() / 1000);
  const ttl = options?.ttlSeconds ?? ADMIN_SESSION_TTL_SECONDS;
  const payload: AdminSessionPayload = {
    ...claims,
    instansi: claims.instansi.trim().toLowerCase(),
    tingkat: claims.tingkat.trim().toLowerCase(),
    role: claims.role.trim().toLowerCase(),
    iat: now,
    exp: now + ttl,
  };

  const encodedPayload = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await deriveHmacKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(encodedPayload));
  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSessionToken(
  token: string | null | undefined,
  options?: { secret?: string; nowSeconds?: number }
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const secret = resolveSessionSecret(options?.secret);
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const [encodedPayload, encodedSignature] = parts;
  const sigBytes = fromBase64Url(encodedSignature);
  const payloadBytes = fromBase64Url(encodedPayload);
  if (!sigBytes || !payloadBytes) return null;

  try {
    const key = await deriveHmacKey(secret, "verify");
    const validSig = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      textEncoder.encode(encodedPayload)
    );
    if (!validSig) return null;

    const parsed = JSON.parse(textDecoder.decode(payloadBytes)) as Partial<AdminSessionPayload>;
    if (
      !parsed ||
      typeof parsed.id !== "string" ||
      !parsed.id ||
      typeof parsed.nik !== "string" ||
      !parsed.nik ||
      typeof parsed.instansi !== "string" ||
      typeof parsed.tingkat !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.exp !== "number" ||
      typeof parsed.iat !== "number"
    ) {
      return null;
    }

    const now = options?.nowSeconds ?? Math.floor(Date.now() / 1000);
    if (parsed.exp <= now) return null;

    if (getAdminPortalBasePath(parsed.instansi, parsed.tingkat) === "/admin/login") {
      return null;
    }

    return {
      id: parsed.id,
      nik: parsed.nik,
      instansi: parsed.instansi,
      tingkat: parsed.tingkat,
      role: parsed.role,
      provinsi: typeof parsed.provinsi === "string" ? parsed.provinsi : null,
      kota: typeof parsed.kota === "string" ? parsed.kota : null,
      kecamatan: typeof parsed.kecamatan === "string" ? parsed.kecamatan : null,
      iat: parsed.iat,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

/** Validates same-origin relative redirect paths against open-redirect and header-injection vectors. */
export function isSafeRelativeRedirect(target: string | null | undefined): target is string {
  if (!target || typeof target !== "string" || target.length > 2048) return false;
  if (/[\x00-\x1f\x7f\\]/.test(target)) return false;
  if (!target.startsWith("/") || target.startsWith("//")) return false;

  let decoded: string;
  try {
    decoded = decodeURIComponent(target);
  } catch {
    return false;
  }

  if (/[\x00-\x1f\x7f\\]/.test(decoded)) return false;
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return false;

  try {
    const parsed = new URL(target, "http://govhub.local");
    return (
      parsed.origin === "http://govhub.local" &&
      parsed.pathname.startsWith("/") &&
      !parsed.pathname.startsWith("//")
    );
  } catch {
    return false;
  }
}

export function sanitizeRedirectPath(
  target: string | null | undefined,
  fallback = "/dashboard"
): string {
  return isSafeRelativeRedirect(target) ? target : fallback;
}
