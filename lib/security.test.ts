import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import {
  getAdminPortalBasePath,
  isSafeRelativeRedirect,
  sanitizeRedirectPath,
  signAdminSessionToken,
  verifyAdminSessionToken,
} from "./security.ts";
import { hashPassword, verifyPassword } from "./password.ts";

const TEST_SECRET = "unit-test-hmac-secret-must-be-kept-out-of-prod-env";

test("signAdminSessionToken and verifyAdminSessionToken enforce integrity and expiry", async () => {
  const now = 1_800_000_000;
  const token = await signAdminSessionToken(
    {
      id: "b6fdf65f-ef5f-4d49-b5dc-dd0f965bce14",
      nik: "198905142014021001",
      instansi: "Dinsos",
      tingkat: "Kota",
      role: "admin",
      provinsi: "Kalimantan Barat",
      kota: "Pontianak",
      kecamatan: "Pontianak Selatan",
    },
    { secret: TEST_SECRET, nowSeconds: now, ttlSeconds: 300 }
  );

  const verified = await verifyAdminSessionToken(token, {
    secret: TEST_SECRET,
    nowSeconds: now + 60,
  });
  assert.ok(verified);
  assert.equal(verified.instansi, "dinsos");
  assert.equal(verified.tingkat, "kota");
  assert.equal(verified.kota, "Pontianak");

  // Tampered payload rejected
  const [payload, sig] = token.split(".");
  const tamperedPayload = Buffer.from(
    JSON.stringify({
      id: "b6fdf65f-ef5f-4d49-b5dc-dd0f965bce14",
      nik: "198905142014021001",
      instansi: "pusat",
      tingkat: "pusat",
      role: "admin",
      provinsi: null,
      kota: null,
      kecamatan: null,
      iat: now,
      exp: now + 300,
    })
  ).toString("base64url");
  assert.equal(
    await verifyAdminSessionToken(`${tamperedPayload}.${sig}`, {
      secret: TEST_SECRET,
      nowSeconds: now + 60,
    }),
    null
  );
  assert.equal(
    await verifyAdminSessionToken(`${payload}.tampered_sig`, {
      secret: TEST_SECRET,
      nowSeconds: now + 60,
    }),
    null
  );

  // Expired token rejected
  assert.equal(
    await verifyAdminSessionToken(token, { secret: TEST_SECRET, nowSeconds: now + 301 }),
    null
  );

  // Missing secret fails closed
  assert.equal(
    await verifyAdminSessionToken(token, { secret: "", nowSeconds: now + 60 }),
    null
  );

  // Legacy unsigned cookie rejected
  assert.equal(
    await verifyAdminSessionToken("dinsos_kota", { secret: TEST_SECRET, nowSeconds: now + 60 }),
    null
  );
});

test("getAdminPortalBasePath isolates agencies and tiers accurately", () => {
  assert.equal(getAdminPortalBasePath("dukcapil", "kota"), "/admin/dukcapil/kota/dashboard");
  assert.equal(
    getAdminPortalBasePath("dukcapil", "kecamatan"),
    "/admin/dukcapil/kecamatan/dashboard"
  );
  assert.equal(getAdminPortalBasePath("dinsos", "kota"), "/admin/dinsos/kota/dashboard");
  assert.equal(
    getAdminPortalBasePath("dinsos", "kecamatan"),
    "/admin/dinsos/kecamatan/dashboard"
  );
  assert.equal(getAdminPortalBasePath("dinsos", "provinsi"), "/admin/dashboard");
  assert.equal(getAdminPortalBasePath("pusat", "pusat"), "/admin/dashboard");
  assert.equal(getAdminPortalBasePath("unknown", "kecamatan"), "/admin/login");
});

test("password hashing uses salted scrypt and refuses empty hashes", () => {
  const hashedA = hashPassword("S3cur3!Pass");
  const hashedB = hashPassword("S3cur3!Pass");
  assert.ok(hashedA.startsWith("scrypt$"));
  assert.notEqual(hashedA, hashedB);

  assert.deepEqual(verifyPassword("S3cur3!Pass", hashedA), { valid: true, needsRehash: false });
  assert.deepEqual(verifyPassword("wrong", hashedA), { valid: false, needsRehash: false });

  // Legacy SHA-256 triggers rehash flag without hardcoding bypasses
  const legacySha = createHash("sha256").update("admin123").digest("hex");
  assert.deepEqual(verifyPassword("admin123", legacySha), { valid: true, needsRehash: true });
  assert.deepEqual(verifyPassword("wrong", legacySha), { valid: false, needsRehash: false });

  // Null/empty/garbage hashes fail closed
  assert.deepEqual(verifyPassword("admin123", null), { valid: false, needsRehash: false });
  assert.deepEqual(verifyPassword("admin123", ""), { valid: false, needsRehash: false });
  assert.deepEqual(verifyPassword("", ""), { valid: false, needsRehash: false });
});

test("redirect sanitizer rejects open redirects and control bytes", () => {
  assert.equal(isSafeRelativeRedirect("/dashboard"), true);
  assert.equal(isSafeRelativeRedirect("/dashboard/layanan-ktp/tracking?tab=1"), true);
  assert.equal(isSafeRelativeRedirect("https://evil.example/phish"), false);
  assert.equal(isSafeRelativeRedirect("//evil.example"), false);
  assert.equal(isSafeRelativeRedirect("/\\evil.example"), false);
  assert.equal(isSafeRelativeRedirect("/%2f/evil.example"), false);
  assert.equal(isSafeRelativeRedirect("/dashboard\r\nSet-Cookie: a=1"), false);
  assert.equal(sanitizeRedirectPath("//evil.example", "/dashboard"), "/dashboard");
});
