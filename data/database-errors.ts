export function isConstraintConflict(error: unknown) {
  let current = error;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object") return false;
    const code = "code" in current ? String(current.code) : "";
    if (code === "23505" || code === "23P01") return true;
    current = "cause" in current ? current.cause : undefined;
  }
  return false;
}
