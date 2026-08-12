import "server-only";

import { legalIdentifierKey } from "@/env/server";
import { createLegalIdentifierProtector } from "./legal-identifiers-core";

export {
  maskTaxIdentifier,
  normalizeIdentifier,
} from "./legal-identifiers-core";

function configuredProtector() {
  const key = Buffer.from(legalIdentifierKey(), "base64");
  if (key.length !== 32) {
    throw new Error(
      "LEGAL_IDENTIFIER_ENCRYPTION_KEY must be a base64-encoded 32-byte key.",
    );
  }
  return createLegalIdentifierProtector(key);
}

export function protectTaxIdentifier(value: string) {
  return configuredProtector().protectTaxIdentifier(value);
}

export function revealTaxIdentifier(ciphertext: string) {
  return configuredProtector().revealTaxIdentifier(ciphertext);
}
