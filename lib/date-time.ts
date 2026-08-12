export type TenantDateTimeDefaults = Readonly<{
  locale: string;
  timezone: string;
}>;

export function createTenantDateTimeFormatter({
  locale,
  timezone,
}: TenantDateTimeDefaults) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
