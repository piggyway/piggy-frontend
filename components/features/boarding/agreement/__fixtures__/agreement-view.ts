import type {
  AgreementCustomerFieldSpecs,
  AgreementTemplateContent,
  AgreementView,
  FieldSpec,
  LeafBlock,
} from "@/lib/types/agreement";
import templateV1 from "./agreement-template-v1.json";

/** A fresh copy of the backend v1 template content, safe to edit in a test. */
export function agreementTemplateV1(): AgreementTemplateContent {
  return structuredClone(templateV1) as unknown as AgreementTemplateContent;
}

function leafBlocks(content: AgreementTemplateContent): LeafBlock[] {
  return content.sections.flatMap((section) =>
    section.blocks.flatMap((block) =>
      block.kind === "subsection" ? block.blocks : [block]
    )
  );
}

/**
 * The `fields` of the public GET for a template, derived the way the backend
 * `customerFieldSpecs` does: header owner fields, then field, photo consent
 * and schedule field blocks in document order, customer audience only.
 */
export function customerFieldSpecs(
  content: AgreementTemplateContent
): AgreementCustomerFieldSpecs {
  const agreement: FieldSpec[] = [...content.header.owner_fields];
  const pet: FieldSpec[] = [];
  let photoConsent: FieldSpec | null = null;
  const acknowledgments: AgreementCustomerFieldSpecs["acknowledgments"] = [];

  for (const block of leafBlocks(content)) {
    if (block.kind === "field") {
      agreement.push(block.field);
    } else if (block.kind === "photo_consent") {
      photoConsent ??= block.field;
      agreement.push(block.field);
    } else if (block.kind === "schedule") {
      for (const line of block.lines) {
        if (!("paper" in line)) agreement.push(line);
      }
    } else if (block.kind === "pet_table") {
      for (const row of block.rows) {
        if ("field" in row) pet.push(row.field);
      }
    } else if (block.kind === "acknowledgments") {
      acknowledgments.push(...block.items);
    }
  }

  return {
    agreement: agreement.filter(
      (field) => field.audience === "customer" && field !== photoConsent
    ),
    pet: pet.filter((field) => field.audience === "customer"),
    acknowledgments,
    photo_consent:
      photoConsent && photoConsent.audience === "customer"
        ? photoConsent
        : null,
  };
}

/** The public GET body of an open agreement on the given template. */
export function buildAgreementView(
  overrides: Partial<AgreementView> = {},
  template: AgreementTemplateContent = agreementTemplateV1()
): AgreementView {
  return {
    status: "viewed",
    template_version: "v1",
    read_only: false,
    signed_at: null,
    pdf_available: false,
    download_url: null,
    booking: {
      reference: "PB-TEST-0001",
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      phone: "0400 000 000",
      drop_off_date: "2026-08-30",
      drop_off_time: "09:00",
      pick_up_date: "2026-09-02",
      pick_up_time: "17:00",
      nights: 3,
    },
    admin_fields: {
      agreed_daily_rate: "95.00",
      deposit_paid: "50.00",
      balance_due: "235.00",
      admin_extra_terms: null,
    },
    answers: {
      owner_address: "1 Anderson St",
      emergency_name: "Grace Hopper",
      emergency_phone: "0400 111 222",
    },
    fields: customerFieldSpecs(template),
    pets: [
      {
        id: 7,
        name: "Nibbles",
        type: "Guinea pig",
        breed: "Abyssinian",
        age: "2",
        sex: "Female",
        weight: "900g",
        desexed: "No",
        vet_contact: null,
        feeding_routine: null,
        medical_notes: "Booking form notes",
        answers: { medical_notes: "Vitamin C drops" },
      },
      {
        id: 9,
        name: "Pip",
        type: "Guinea pig",
        breed: null,
        age: "1",
        sex: "Male",
        weight: null,
        desexed: "Yes",
        vet_contact: null,
        feeding_routine: null,
        medical_notes: null,
        answers: {},
      },
    ],
    template,
    html: null,
    ...overrides,
  };
}
