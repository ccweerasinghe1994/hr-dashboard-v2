import { describe, expect, test } from "bun:test";
import {
  createLegalIdentifierProtector,
  maskTaxIdentifier,
  normalizeIdentifier,
} from "@/lib/security/legal-identifiers-core";

const protector = createLegalIdentifierProtector(Buffer.alloc(32, 0x2a));

describe("legal identifier normalization", () => {
  test.each([
    ["  gb-12/34.56  ", "GB123456"],
    ["\uFF41\uFF42\uFF23-\uFF11\uFF12\uFF13", "ABC123"],
    ["\u00E5land-\u00F6123", "\u00C5LAND\u00D6123"],
    [" -- / . ", ""],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeIdentifier(input)).toBe(expected);
  });
});

describe("legal identifier masking", () => {
  test.each([
    [null, null],
    ["", null],
    ["1234", "\u2022\u2022\u2022\u20221234"],
  ])("masks last four value %s", (lastFour, expected) => {
    expect(maskTaxIdentifier(lastFour)).toBe(expected);
  });
});

describe("legal identifier protection", () => {
  test("round trips encrypted plaintext", () => {
    const protectedIdentifier = protector.protectTaxIdentifier("GB-12/3456");

    expect(protector.revealTaxIdentifier(protectedIdentifier.ciphertext)).toBe(
      "GB-12/3456",
    );
  });

  test("randomizes repeated encryption", () => {
    const first = protector.protectTaxIdentifier("GB-12/3456");
    const second = protector.protectTaxIdentifier("GB-12/3456");

    expect(first.ciphertext).not.toBe(second.ciphertext);
  });

  test("derives the last four normalized characters", () => {
    expect(
      protector.protectTaxIdentifier(" gb-\uFF11\uFF12/3456 ").lastFour,
    ).toBe("3456");
  });

  test("produces a keyed lookup hash", () => {
    expect(protector.protectTaxIdentifier("GB-12/3456").hash).toMatch(
      /^[0-9a-f]{64}$/,
    );
  });

  test("hashes equivalent normalized values deterministically", () => {
    const first = protector.protectTaxIdentifier(" gb-12/3456 ");
    const equivalent = protector.protectTaxIdentifier(
      "\uFF27\uFF22 \uFF11\uFF12\uFF13\uFF14\uFF15\uFF16",
    );

    expect(first.hash).toBe(equivalent.hash);
  });

  test("rejects unsupported ciphertext versions", () => {
    expect(() =>
      protector.revealTaxIdentifier("v2.nonce.tag.ciphertext"),
    ).toThrow("Unsupported legal identifier ciphertext.");
  });

  test("rejects tampered ciphertext", () => {
    const protectedIdentifier = protector.protectTaxIdentifier("GB-12/3456");
    const [version, nonce, tag, encrypted] =
      protectedIdentifier.ciphertext.split(".");
    const tamperedCiphertext = `${encrypted.startsWith("A") ? "B" : "A"}${encrypted.slice(1)}`;

    expect(() =>
      protector.revealTaxIdentifier(
        [version, nonce, tag, tamperedCiphertext].join("."),
      ),
    ).toThrow();
  });

  test.each([
    (ciphertext: string) => `${ciphertext}.tampered`,
    (ciphertext: string) => `${ciphertext}!`,
  ])("rejects malformed ciphertext encoding", (tamper) => {
    const { ciphertext } = protector.protectTaxIdentifier("GB-12/3456");

    expect(() => protector.revealTaxIdentifier(tamper(ciphertext))).toThrow(
      "Unsupported legal identifier ciphertext.",
    );
  });

  test("rejects key material with the wrong length", () => {
    expect(() => createLegalIdentifierProtector(Buffer.alloc(31))).toThrow(
      "Legal identifier key material must contain 32 bytes.",
    );
  });
});
