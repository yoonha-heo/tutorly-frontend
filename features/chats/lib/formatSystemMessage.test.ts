import { expect, test } from "vitest";

import { formatSystemMessage } from "./formatSystemMessage";

test("renders a lesson instant in the browser timezone", () => {
  const instant = "2026-10-06T01:00:00.000Z";
  const localTime = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(instant));

  expect(formatSystemMessage(`Lesson cancelled.\n${instant}`)).toBe(
    `Lesson cancelled.\n${localTime}`,
  );
});

test("leaves ordinary system text unchanged", () => {
  expect(formatSystemMessage("Lesson cancelled.")).toBe("Lesson cancelled.");
});
