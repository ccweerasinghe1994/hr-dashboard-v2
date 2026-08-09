import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
} from "node:crypto";
import { legalIdentifierKey } from "@/env/server";

function masterKey() {
  const key = Buffer.from(legalIdentifierKey(), "base64");
  if (key.length !== 32) {
    throw new Error(
      "LEGAL_IDENTIFIER_ENCRYPTION_KEY must be a base64-encoded 32-byte key.",
    );
  }
  return key;
}

function encryptionKey() {
  return Buffer.from(
    hkdfSync(
      "sha256",
      masterKey(),
      Buffer.alloc(0),
      "legal-id/encryption/v1",
      32,
    ),
  );
}

function lookupKey() {
  return Buffer.from(
    hkdfSync("sha256", masterKey(), Buffer.alloc(0), "legal-id/lookup/v1", 32),
  );
}

export function normalizeIdentifier(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toUpperCase();
}

export function protectTaxIdentifier(value: string) {
  const normalized = normalizeIdentifier(value);
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), nonce);
  const encrypted = Buffer.concat([
    cipher.update(value.normalize("NFKC").trim(), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: [
      "v1",
      nonce.toString("base64url"),
      tag.toString("base64url"),
      encrypted.toString("base64url"),
    ].join("."),
    hash: createHmac("sha256", lookupKey()).update(normalized).digest("hex"),
    lastFour: normalized.slice(-4),
  };
}

export function revealTaxIdentifier(ciphertext: string) {
  const [version, nonce, tag, encrypted] = ciphertext.split(".");
  if (version !== "v1" || !nonce || !tag || !encrypted) {
    throw new Error("Unsupported legal identifier ciphertext.");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(nonce, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function maskTaxIdentifier(lastFour: string | null) {
  return lastFour ? `••••${lastFour}` : null;
}
