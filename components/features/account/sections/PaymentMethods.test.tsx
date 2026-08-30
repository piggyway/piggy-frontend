// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PaymentMethods } from "./PaymentMethods";

afterEach(() => {
  cleanup();
});

describe("PaymentMethods", () => {
  it("states that saved payment methods are not available yet", () => {
    render(<PaymentMethods />);

    expect(
      screen.getByRole("heading", {
        name: /saved payment methods are not available yet/i,
      })
    ).toBeTruthy();
    expect(screen.getByText(/never stored in your account/i)).toBeTruthy();
  });

  it("renders no card entries and no add-method action", () => {
    const { container } = render(<PaymentMethods />);

    expect(screen.queryByText(/••••/)).toBeNull();
    expect(screen.queryByText(/^Expires/)).toBeNull();
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });
});
