# Keep tenant routing identity stable

The globally unique tenant slug is immutable after bootstrap even though the tenant display name, default locale, and default timezone remain editable and audited. A nullable requested data region is system-managed and hidden from customer settings until storage placement is actually enforceable, avoiding broken routing keys and misleading residency claims.
