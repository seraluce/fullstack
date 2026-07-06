import { describe, it, expect, beforeEach } from "vitest";
import { useCounterStore } from "@/store/counter-store";

describe("counter-store", () => {
  beforeEach(() => {
    // Reset store state between tests.
    useCounterStore.setState({ count: 0 });
  });

  it("starts at zero", () => {
    expect(useCounterStore.getState().count).toBe(0);
  });

  it("increments the count", () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().increment();
    expect(useCounterStore.getState().count).toBe(2);
  });

  it("decrements the count", () => {
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(-1);
  });

  it("resets the count to zero", () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().increment();
    useCounterStore.getState().reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
