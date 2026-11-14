import assert from "node:assert/strict";
import { test } from "node:test";
import { formatWibDate, maskNik, normalizeRegionName } from "./format.ts";
import {
  parseScheduleToIso,
  sanitizeDocumentOrPhotoRef,
  sanitizeDocumentUrl,
} from "./validators.ts";

test("parseScheduleToIso interprets bare dates and UI slot strings in WIB (+07:00)", () => {
  assert.equal(parseScheduleToIso("2026-11-20 08:30"), "2026-11-20T01:30:00.000Z");
  assert.equal(
    parseScheduleToIso("November 12th, 2026 08:30 - 10:00 WIB"),
    "2026-11-12T01:30:00.000Z"
  );
  assert.equal(parseScheduleToIso("2026-11-12T08:30:00Z"), "2026-11-12T08:30:00.000Z");
  assert.equal(parseScheduleToIso("not-a-date"), null);
});

test("document URL and photo sanitizers accept private storage paths and HTTPS but block unsafe schemes", () => {
  const uuidPath = "7d196223-e46d-48f2-8d70-e60ad33bdb81/ktp/kk.pdf";
  assert.equal(sanitizeDocumentUrl(uuidPath), uuidPath);
  assert.equal(sanitizeDocumentUrl("https://cdn.example.go.id/doc.pdf"), "https://cdn.example.go.id/doc.pdf");
  assert.equal(sanitizeDocumentUrl("javascript:alert(1)"), null);
  assert.equal(sanitizeDocumentUrl("http://insecure.example/doc.pdf"), null);
  assert.equal(sanitizeDocumentUrl("data:text/html,<script>alert(1)</script>"), null);

  assert.equal(sanitizeDocumentOrPhotoRef(uuidPath), uuidPath);
  assert.equal(sanitizeDocumentOrPhotoRef("data:image/jpeg;base64,/9j/4AAQ"), "data:image/jpeg;base64,/9j/4AAQ");
  assert.equal(sanitizeDocumentOrPhotoRef("data:image/svg+xml;base64,PHN2Zz4="), null);
});

test("maskNik, formatWibDate, and normalizeRegionName handle edge cases cleanly", () => {
  assert.equal(maskNik("6171011203900001"), "6171********0001");
  assert.equal(maskNik(null), "-");
  assert.equal(formatWibDate("2026-11-12T20:00:00.000Z", "short"), "13 Nov 2026");
  assert.equal(normalizeRegionName("Kecamatan Pontianak Kota"), "pontianak kota");
  assert.equal(normalizeRegionName("Kota Singkawang"), "singkawang");
});
