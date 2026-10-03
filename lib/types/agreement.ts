/**
 * Boarding Agreement Types
 *
 * Wire shapes of the public signing endpoints, kept in snake_case on purpose:
 * the template content and the answers are keyed by template field keys, and
 * the sign request body is strict, so a camelCase layer here would only add a
 * mapping that has to be re-derived on every submit. The template types
 * mirror the backend block model one to one.
 */

export type AgreementStatus = "draft" | "sent" | "viewed" | "signed" | "void";

export type AgreementSignatureType = "drawn" | "typed";

export type FieldType =
  | "text"
  | "textarea"
  | "tel"
  | "email"
  | "decimal"
  | "date"
  | "radio"
  | "checkbox";

export type FieldAudience = "customer" | "admin" | "computed" | "paper";

export type FieldRequiredAt = "send" | "sign";

export type FieldFormat = "money" | "money_per_unit";

export interface FieldOption {
  value: string;
  text: string;
}

export interface FieldSpec {
  key: string;
  label: string;
  input_label?: string;
  type: FieldType;
  audience: FieldAudience;
  required_at: FieldRequiredAt | null;
  admin_editable?: boolean;
  options?: FieldOption[];
  source?: string;
  default_from?: string;
  max_length?: number;
  format?: FieldFormat;
}

export interface AckItem {
  key: string;
  text: string;
  required: boolean;
}

export type PetTableRow =
  | { label: string; source: string }
  | { label: string; field: FieldSpec };

export type SignatureRole =
  | "owner_name"
  | "owner_signature"
  | "signed_at"
  | "provider_name"
  | "provider_signature"
  | "provider_signed_at";

export interface SignatureRow {
  role: SignatureRole;
  label: string;
}

export type ScheduleLine = FieldSpec | { paper: string };

export interface PaperCheckItem {
  key: string;
  text: string;
}

export interface PaperChecks {
  title: string;
  note: string;
  items: PaperCheckItem[];
}

export type ParagraphBlock = { kind: "paragraph"; text: string };
export type BulletsBlock = { kind: "bullets"; items: string[] };
export type FieldBlock = { kind: "field"; field: FieldSpec };
export type PetTableBlock = { kind: "pet_table"; rows: PetTableRow[] };
export type RateTableBlock = { kind: "rate_table" };
export type PhotoConsentBlock = { kind: "photo_consent"; field: FieldSpec };
export type AcknowledgmentsBlock = {
  kind: "acknowledgments";
  items: AckItem[];
};
export type SignatureBlock = { kind: "signature"; rows: SignatureRow[] };
export type ScheduleBlock = {
  kind: "schedule";
  title: string;
  intro: string[];
  lines: ScheduleLine[];
  paper_checks: PaperChecks | null;
};

export type LeafBlock =
  | ParagraphBlock
  | BulletsBlock
  | FieldBlock
  | PetTableBlock
  | RateTableBlock
  | PhotoConsentBlock
  | AcknowledgmentsBlock
  | SignatureBlock
  | ScheduleBlock;

export type SubsectionBlock = {
  kind: "subsection";
  title: string | null;
  blocks: LeafBlock[];
};

export type TemplateBlock = LeafBlock | SubsectionBlock;

export type SectionNumber = "auto" | "none" | number;

export interface TemplateSection {
  key: string;
  title: string | null;
  number: SectionNumber;
  blocks: TemplateBlock[];
}

export interface RateTableRow {
  pigs: number;
  rate: number;
}

export interface TemplateMeta {
  currency: string;
  rate_unit: string;
  rate_table: RateTableRow[];
  rate_table_column_labels: [string, string];
}

export interface TemplateProvider {
  business_name: string;
  operated_by: string;
  phone: string;
  email: string;
  address: string;
}

export interface TemplateHeader {
  document_title: string;
  title: string;
  subtitle: string;
  important_title: string;
  important_text: string;
  owner_block_title: string;
  owner_fields: FieldSpec[];
  provider_block_title: string;
  agreement_date_label: string;
  footer: string;
}

export interface AgreementTemplateContent {
  schema: 1;
  meta: TemplateMeta;
  provider: TemplateProvider;
  header: TemplateHeader;
  sections: TemplateSection[];
}

export type AnswerValue = string | boolean | null;

export type AgreementAnswerValues = Record<string, AnswerValue>;

export interface AgreementCustomerFieldSpecs {
  agreement: FieldSpec[];
  pet: FieldSpec[];
  acknowledgments: AckItem[];
  photo_consent: FieldSpec | null;
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
  answers: AgreementAnswerValues;
}

export interface AgreementView {
  status: AgreementStatus;
  template_version: string;
  read_only: boolean;
  signed_at: string | null;
  pdf_available: boolean;
  download_url: string | null;
  booking: AgreementBookingSummary;
  admin_fields: AgreementAdminFields;
  answers: AgreementAnswerValues;
  fields: AgreementCustomerFieldSpecs;
  pets: AgreementPet[];
  template: AgreementTemplateContent;
  html: string | null;
}

export interface SignAgreementPayload {
  answers: AgreementAnswerValues;
  pets: Record<string, AgreementAnswerValues>;
  signature_type: AgreementSignatureType;
  signature_data: string;
}

export interface SignAgreementResult {
  status: "signed";
  signed_at: string;
  download_url: string;
}
