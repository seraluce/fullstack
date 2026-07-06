import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { CounterDemo } from "@/components/counter-demo";
import { useCounterStore } from "@/store/counter-store";
import en from "../../messages/en.json";

function renderWithI18n(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("CounterDemo", () => {
  it("renders the current count", () => {
    useCounterStore.setState({ count: 5 });
    renderWithI18n(<CounterDemo />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("increments on click", () => {
    useCounterStore.setState({ count: 0 });
    renderWithI18n(<CounterDemo />);
    fireEvent.click(screen.getByRole("button", { name: /^increment$/i }));
    expect(useCounterStore.getState().count).toBe(1);
  });

  it("resets on click", () => {
    useCounterStore.setState({ count: 9 });
    renderWithI18n(<CounterDemo />);
    fireEvent.click(screen.getByRole("button", { name: /^reset$/i }));
    expect(useCounterStore.getState().count).toBe(0);
  });
});
