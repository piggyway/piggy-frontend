import { describe, expect, it } from "vitest";

import { profileValidators } from "@/lib/validators/profile";

describe("profileValidators", () => {
  it.each([
    ["", "First name is required"],
    [" ", "First name is required"],
    ["A", "First name must be at least 2 characters"],
    ["a".repeat(51), "First name must not exceed 50 characters"],
    ["Al", ""],
    ["a".repeat(50), ""],
  ])("validates first name %j", (value, expected) => {
    expect(profileValidators.firstName(value)).toBe(expected);
  });

  it.each([
    ["", "Last name is required"],
    [" ", "Last name is required"],
    ["D", "Last name must be at least 2 characters"],
    ["d".repeat(51), "Last name must not exceed 50 characters"],
    ["Do", ""],
    ["d".repeat(50), ""],
  ])("validates last name %j", (value, expected) => {
    expect(profileValidators.lastName(value)).toBe(expected);
  });

  it.each([
    ["", ""],
    ["123", "Phone number must be at least 10 digits"],
    ["123456789a", "Please enter a valid phone number"],
    ["+61 (03) 1234-5678", ""],
    ["1234567890", ""],
  ])("validates phone %j", (value, expected) => {
    expect(profileValidators.phone(value)).toBe(expected);
  });

  it.each([
    ["", "Email is required"],
    [" ", "Email is required"],
    ["test", "Please enter a valid email address"],
    ["a@b", "Please enter a valid email address"],
    ["a@b.com", ""],
  ])("validates email %j", (value, expected) => {
    expect(profileValidators.email(value)).toBe(expected);
  });
});
