import { z } from "zod";

const requiredText = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

function isLocale(value: string) {
  try {
    return new Intl.Locale(value).toString() === value;
  } catch {
    return false;
  }
}

function isTimezone(value: string) {
  try {
    Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export const localeSchema = z
  .string()
  .trim()
  .refine(isLocale, "Enter a valid BCP 47 locale, such as en-US.");

export const timezoneSchema = z
  .string()
  .trim()
  .refine(isTimezone, "Select a valid IANA timezone.");

export const tenantSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Slug must be at least 3 characters.")
  .max(48, "Slug must be 48 characters or fewer.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens.",
  );

export const bootstrapSchema = z.object({
  bootstrapSecret: requiredText("Bootstrap secret", 256),
  ownerName: requiredText("Owner name", 100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters.")
    .max(128, "Password must be 128 characters or fewer."),
  tenantName: requiredText("Organization name", 120),
  tenantSlug: tenantSlugSchema,
  locale: localeSchema,
  timezone: timezoneSchema,
});

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const updateTenantSchema = z.object({
  name: requiredText("Organization name", 120),
  locale: localeSchema,
  timezone: timezoneSchema,
});

export const legalEntitySchema = z.object({
  legalName: requiredText("Legal name", 180),
  displayName: z.string().trim().max(120).optional().default(""),
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, "Enter a two-letter ISO country code."),
  registrationNumber: z.string().trim().max(80).optional().default(""),
  taxIdentifier: z.string().trim().max(80).optional().default(""),
  currencyCode: z
    .string()
    .trim()
    .toUpperCase()
    .refine(
      (value) => value === "" || /^[A-Z]{3}$/.test(value),
      "Enter a three-letter ISO currency code.",
    ),
  effectiveDate: z.iso.date("Enter a valid effective date."),
  reason: requiredText("Change reason", 300),
});

export const legalEntityIdSchema = z.uuid("Invalid legal entity identifier.");
