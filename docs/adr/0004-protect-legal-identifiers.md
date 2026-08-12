# Encrypt and minimize sensitive legal identifiers

Tax identifiers are encrypted at the application boundary, exposed only through masked data-transfer objects, and excluded from logs, errors, and audit snapshots; a keyed hash is stored only when uniqueness checks require it. Tenant owners may set or replace a tax identifier but no application API returns its plaintext. Registration numbers remain visible to authorized owners and are not encrypted unless their later classification requires it, avoiding unnecessary key-management complexity for generally public identifiers.
