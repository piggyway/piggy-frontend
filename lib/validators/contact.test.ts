import { describe, expect, it } from "vitest";
import { z } from "zod";

import { contactSchema } from "@/lib/validators/contact";

const validContact = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  subject: "Order question",
  message: "When will my order ship?",
};

function getMessages(input: unknown): string[] {
  const result = contactSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.message);
}

describe("contactSchema", () => {
  it("returns the validated contact data", () => {
    expect(contactSchema.parse(validContact)).toEqual(validContact);
  });

  it.each([
    ["firstName", "", "First name is required"],
    ["lastName", "", "Last name is required"],
    ["email", "invalid", "Invalid email address"],
    ["subject", "", "Subject is required"],
    ["subject", "a".repeat(201), "Subject too long"],
    ["message", "", "Message is required"],
    ["message", "a".repeat(5001), "Message too long"],
  ] as const)("rejects invalid %s", (field, value, message) => {
    expect(getMessages({ ...validContact, [field]: value })).toContain(message);
  });

  it.each(["firstName", "lastName", "email", "subject", "message"] as const)(
    "rejects missing %s with a ZodError",
    (field) => {
      const input: Partial<typeof validContact> = { ...validContact };
      delete input[field];

      expect(() => contactSchema.parse(input)).toThrow(z.ZodError);
    }
  );

  it("rejects null input with a ZodError", () => {
    expect(() => contactSchema.parse(null)).toThrow(z.ZodError);
  });

  it("accepts values at both maximum boundaries", () => {
    const result = contactSchema.parse({
      ...validContact,
      subject: "s".repeat(200),
      message: "m".repeat(5000),
    });

    expect(result.subject).toHaveLength(200);
    expect(result.message).toHaveLength(5000);
  });
});
