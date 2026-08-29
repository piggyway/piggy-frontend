/**
 * Boarding Agreement Types
 *
 * Wire shapes of the public signing endpoints, kept in snake_case on purpose:
 * `editable_fields` and `editable_pet_fields` name backend columns, and the
 * sign request body is strict, so a camelCase layer here would only add a
 * mapping that has to be re-derived on every submit.
 */

export type AgreementStatus = "draft" | "sent" | "viewed" | "signed" | "void";

export type AgreementPhotoConsent = "public" | "private_only" | "none";

export type AgreementSignatureType = "drawn" | "typed";

export interface AgreementBlock {
  title: string | null;
  paragraphs: string[];
  bullets: string[];
  fieldLabels: string[];
}

export interface AgreementSection extends AgreementBlock {
  number: number;
  title: string;
  subsections: AgreementBlock[];
}

export interface AgreementProvider {
  businessName: string;
  operatedBy: string;
  phone: string;
  email: string;
  address: string;
}

export interface AgreementHeader {
  documentTitle: string;
  title: string;
  subtitle: string;
  importantTitle: string;
  importantText: string;
  ownerBlockTitle: string;
  ownerFieldLabels: string[];
  serviceProviderBlockTitle: string;
  agreementDateLabel: string;
  footer: string;
}

export interface AgreementRateRow {
  pigs: number;
  rate: number;
}

export interface AgreementPhotoConsentOption {
  value: AgreementPhotoConsent;
  text: string;
}

export interface AgreementAcknowledgment {
  key: string;
  column: string;
  text: string;
}

export interface AgreementSchedule {
  key: string;
  title: string;
  intro: string[];
  fieldLabels: string[];
}

export interface AgreementMedicationConfirmation {
  key: string;
  text: string;
}

export interface AgreementTemplate {
  version: string;
  currency: string;
  rateUnit: string;
  provider: AgreementProvider;
  header: AgreementHeader;
  sections: AgreementSection[];
  rateTableColumnLabels: [string, string];
  rateTable: AgreementRateRow[];
  photoConsentOptions: AgreementPhotoConsentOption[];
  acknowledgmentsSectionNumber: number;
  acknowledgmentsSectionTitle: string;
  acknowledgments: AgreementAcknowledgment[];
  signatureLabels: string[];
  schedules: AgreementSchedule[];
  medicationConfirmationsTitle: string;
  medicationConfirmations: AgreementMedicationConfirmation[];
  medicationSignatureLabels: string[];
}

export interface AgreementBookingSummary {
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  drop_off_date: string;
  drop_off_time: string;
  pick_up_date: string;
  pick_up_time: string;
  nights: number;
}

export interface AgreementAdminFields {
  agreed_daily_rate: string | null;
  deposit_paid: string | null;
  balance_due: string | null;
  admin_extra_terms: string | null;
}

export interface AgreementCustomerFields {
  owner_address: string | null;
  emergency_name: string | null;
  emergency_relationship: string | null;
  emergency_phone: string | null;
  emergency_email: string | null;
  emergency_spend_limit: string | null;
  hay_preference: string | null;
  water_preference: string | null;
  medication_details: string | null;
  photo_consent: AgreementPhotoConsent | null;
  ack_legal_owner: boolean;
  ack_info_accurate: boolean;
  ack_health_disclosed: boolean;
  ack_fees_agreed: boolean;
  ack_emergency_authority: boolean;
  ack_vet_cost_responsibility: boolean;
  electronic_signing_consent: boolean;
}

export interface AgreementPet {
  id: number;
  name: string;
  type: string;
  breed: string | null;
  age: string | null;
  sex: string | null;
  weight: string | null;
  desexed: string | null;
  vet_contact: string | null;
  feeding_routine: string | null;
  medical_notes: string | null;
  health_conditions: string | null;
  behaviour_bonding: string | null;
  other_notes: string | null;
}

export interface AgreementView {
  status: AgreementStatus;
  template_version: string;
  read_only: boolean;
  signed_at: string | null;
  pdf_available: boolean;
  download_url: string | null;
  editable_fields: string[];
  editable_pet_fields: string[];
  booking: AgreementBookingSummary;
  admin_fields: AgreementAdminFields;
  customer_fields: AgreementCustomerFields;
  pets: AgreementPet[];
  template: AgreementTemplate;
  html: string | null;
}

export interface SignAgreementPetPayload {
  id: number;
  health_conditions?: string | null;
  behaviour_bonding?: string | null;
  other_notes?: string | null;
  medical_notes?: string | null;
}

export interface SignAgreementPayload {
  owner_address?: string | null;
  emergency_name?: string | null;
  emergency_relationship?: string | null;
  emergency_phone?: string | null;
  emergency_email?: string | null;
  emergency_spend_limit?: string | null;
  hay_preference?: string | null;
  water_preference?: string | null;
  medication_details?: string | null;
  photo_consent: AgreementPhotoConsent;
  ack_legal_owner: boolean;
  ack_info_accurate: boolean;
  ack_health_disclosed: boolean;
  ack_fees_agreed: boolean;
  ack_emergency_authority: boolean;
  ack_vet_cost_responsibility: boolean;
  electronic_signing_consent: boolean;
  signature_type: AgreementSignatureType;
  signature_data: string;
  pets?: SignAgreementPetPayload[];
}

export interface SignAgreementResult {
  status: "signed";
  signed_at: string;
  download_url: string;
}
