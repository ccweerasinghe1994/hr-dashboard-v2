import { maskTaxIdentifier } from "@/lib/security/legal-identifiers-core";

type LegalEntityConfigurationState = Readonly<{
  legalName: string;
  displayName: string | null;
  countryCode: string;
  registrationNumber: string | null;
  currencyCode: string | null;
  status: "active" | "inactive";
  validFrom: string;
  validTo: string | null;
  taxIdentifierLastFour: string | null;
}>;

export type LegalEntitySummaryDto = Readonly<{
  id: string;
  legalName: string;
  displayName: string | null;
  countryCode: string;
  registrationNumber: string | null;
  maskedTaxIdentifier: string | null;
  currencyCode: string | null;
  status: "active" | "inactive";
  validFrom: string;
  validTo: string | null;
}>;

export function toLegalEntitySummary(
  configuration: LegalEntityConfigurationState &
    Readonly<{ legalEntityId: string }>,
): LegalEntitySummaryDto {
  return {
    id: configuration.legalEntityId,
    legalName: configuration.legalName,
    displayName: configuration.displayName,
    countryCode: configuration.countryCode,
    registrationNumber: configuration.registrationNumber,
    maskedTaxIdentifier: maskTaxIdentifier(configuration.taxIdentifierLastFour),
    currencyCode: configuration.currencyCode,
    status: configuration.status,
    validFrom: configuration.validFrom,
    validTo: configuration.validTo,
  };
}

export function toLegalEntityAuditSnapshot(
  configuration: LegalEntityConfigurationState,
) {
  return {
    legalName: configuration.legalName,
    displayName: configuration.displayName,
    countryCode: configuration.countryCode,
    registrationNumber: configuration.registrationNumber,
    currencyCode: configuration.currencyCode,
    status: configuration.status,
    validFrom: configuration.validFrom,
    validTo: configuration.validTo,
    hasTaxIdentifier: Boolean(configuration.taxIdentifierLastFour),
  };
}
