import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
} from "node:crypto";

export function normalizeIdentifier(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toUpperCase();
}

export function maskTaxIdentifier(lastFour: string | null) {
  return lastFour ? `\u2022\u2022\u2022\u2022${lastFour}` : null;
}

export function createLegalIdentifierProtector(masterKeyMaterial: Uint8Array) {
  const masterKey = Buffer.from(masterKeyMaterial);
  if (masterKey.length !== 32) {
    throw new Error("Legal identifier key material must contain 32 bytes.");
  }

  const encryptionKey = Buffer.from(
    hkdfSync(
      "sha256",
      masterKey,
      Buffer.alloc(0),
      "legal-id/encryption/v1",
      32,
    ),
  );
  const lookupKey = Buffer.from(
    hkdfSync("sha256", masterKey, Buffer.alloc(0), "legal-id/lookup/v1", 32),
  );

  function protectTaxIdentifier(value: string) {
    const normalized = normalizeIdentifier(value);
    const nonce = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", encryptionKey, nonce);
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
      hash: createHmac("sha256", lookupKey).update(normalized).digest("hex"),
      lastFour: normalized.slice(-4),
    };
  }

  function revealTaxIdentifier(ciphertext: string) {
    const parts = ciphertext.split(".");
    if (parts.length !== 4) {
      throw new Error("Unsupported legal identifier ciphertext.");
    }
    const [version, nonce, tag, encrypted] = parts;
    const encodedParts = [nonce, tag, encrypted];
    if (
      version !== "v1" ||
      encodedParts.some(
        (part) =>
          !part ||
          !/^[A-Za-z0-9_-]+$/.test(part) ||
          Buffer.from(part, "base64url").toString("base64url") !== part,
      )
    ) {
      throw new Error("Unsupported legal identifier ciphertext.");
    }
    const nonceBytes = Buffer.from(nonce, "base64url");
    const tagBytes = Buffer.from(tag, "base64url");
    if (nonceBytes.length !== 12 || tagBytes.length !== 16) {
      throw new Error("Unsupported legal identifier ciphertext.");
    }
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey, nonceBytes);
    decipher.setAuthTag(tagBytes);
    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  }

  return { protectTaxIdentifier, revealTaxIdentifier };
}
