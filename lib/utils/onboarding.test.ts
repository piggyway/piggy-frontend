// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { onboardingStorage } from "./onboarding";

describe("onboardingStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("reports no status before onboarding has started", () => {
    expect(onboardingStorage.getStatus()).toBeNull();
  });

  it("marks the profile step complete and stamps the completion time", () => {
    onboardingStorage.setProfileCompleted();

    const status = onboardingStorage.getStatus();
    expect(status).toMatchObject({
      profileCompleted: true,
      addressCompleted: false,
    });
    expect(Number.isNaN(Date.parse(status!.completedAt!))).toBe(false);
  });

  it("preserves an already completed address step when the profile completes", () => {
    localStorage.setItem(
      "onboardingStatus",
      JSON.stringify({ profileCompleted: false, addressCompleted: true })
    );

    onboardingStorage.setProfileCompleted();

    expect(onboardingStorage.getStatus()).toMatchObject({
      profileCompleted: true,
      addressCompleted: true,
    });
  });

  it("clears the stored status", () => {
    onboardingStorage.setProfileCompleted();
    expect(onboardingStorage.getStatus()).not.toBeNull();

    onboardingStorage.clearStatus();

    expect(onboardingStorage.getStatus()).toBeNull();
    expect(localStorage.getItem("onboardingStatus")).toBeNull();
  });
});
