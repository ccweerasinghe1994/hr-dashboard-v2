import type postgres from "postgres";

function quotedIdentifier(value: string) {
  if (!/^[a-z][a-z0-9_]*$/.test(value)) {
    throw new Error(`Unsafe PostgreSQL identifier: ${value}`);
  }
  return `"${value}"`;
}

function quotedLiteral(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

export function forcedAuditFailure(
  admin: postgres.Sql,
  triggerName: string,
  errorMessage: string,
) {
  const triggerIdentifier = quotedIdentifier(triggerName);
  const functionIdentifier = quotedIdentifier(`${triggerName}_function`);

  async function disable() {
    await admin.unsafe(
      `drop trigger if exists ${triggerIdentifier} on audit_event`,
    );
    await admin.unsafe(`drop function if exists ${functionIdentifier}()`);
  }

  async function enable() {
    await disable();
    await admin.unsafe(`create function ${functionIdentifier}()
      returns trigger language plpgsql as $$
      begin
        raise exception ${quotedLiteral(errorMessage)};
      end
      $$`);
    await admin.unsafe(`create trigger ${triggerIdentifier}
      before insert on audit_event
      for each row execute function ${functionIdentifier}()`);
  }

  return { disable, enable };
}
