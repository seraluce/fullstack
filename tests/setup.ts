import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount React components after every test to keep the DOM clean.
afterEach(() => {
  cleanup();
});
