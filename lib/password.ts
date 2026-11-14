import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_PREFIX = "scrypt$";
const KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${SCRYPT_PREFIX}${salt}$${derived}`;
}

export function verifyPassword(
  password: string,
  storedHash: string | null | undefined
): { valid: boolean; needsRehash: boolean } {
  if (!storedHash || typeof storedHash !== "string") {
    return { valid: false, needsRehash: false };
  }

  if (storedHash.startsWith(SCRYPT_PREFIX)) {
    const parts = storedHash.split("$");
    if (parts.length !== 3 || !parts[1] || !parts[2]) {
      return { valid: false, needsRehash: false };
    }
    const [, salt, hashHex] = parts;
    if (!/^[a-f0-9]+$/i.test(hashHex)) {
      return { valid: false, needsRehash: false };
    }
    const expectedBuf = Buffer.from(hashHex, "hex");
    if (expectedBuf.length === 0) {
      return { valid: false, needsRehash: false };
    }
    const actualBuf = scryptSync(password, salt, expectedBuf.length);
    return {
      valid: actualBuf.length === expectedBuf.length && timingSafeEqual(actualBuf, expectedBuf),
      needsRehash: false,
    };
  }

  // Legacy compatibility for seeded 64-char SHA-256 hashes; callers rehash on success.
  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    const expectedBuf = Buffer.from(storedHash, "hex");
    const actualBuf = createHash("sha256").update(password).digest();
    const valid =
      actualBuf.length === expectedBuf.length && timingSafeEqual(actualBuf, expectedBuf);
    return { valid, needsRehash: valid };
  }

  return { valid: false, needsRehash: false };
}
