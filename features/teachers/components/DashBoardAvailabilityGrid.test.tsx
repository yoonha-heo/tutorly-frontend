import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { beforeEach, expect, test, vi } from "vitest";

import type { MyAvailability } from "@/features/teachers/types/teachers";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/renderWithProviders";
import { formatAvailabilityTime } from "@/utils/localDateTime";

import { DashboardAvailabilityGrid } from "./DashBoardAvailabilityGrid";

const API_URL = "http://localhost:4000";

function slotTodayAtTwo(): MyAvailability {
  const start = new Date();
  start.setHours(14, 0, 0, 0);
  const end = new Date(start);
  end.setHours(15, 0, 0, 0);

  return {
    id: "slot-1",
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    isOpen: true,
    blocks: [],
  };
}

const slot = slotTodayAtTwo();
const openLabel = `${formatAvailabilityTime(slot.startAt)} — on`;
const closedLabel = `${formatAvailabilityTime(slot.startAt)} — off`;

let slots = [slot];

function slotButton(name: string) {
  const buttons = screen.getAllByRole("button", { name });
  return buttons[0];
}

beforeEach(() => {
  slots = [{ ...slot }];
  server.use(
    http.get(`${API_URL}/availabilities/me`, () => HttpResponse.json(slots)),
  );
});

async function closeTheOpenSlot() {
  const user = userEvent.setup();
  renderWithProviders(<DashboardAvailabilityGrid />);

  const [openSlot] = await screen.findAllByRole("button", { name: openLabel });
  await user.click(openSlot);

  expect(slotButton(closedLabel)).toBeVisible();
  expect(screen.getByText("1 unsaved change.")).toBeVisible();

  return user;
}

test("saves a closed slot and shows that the schedule is up to date", async () => {
  const savedItems: unknown[] = [];

  server.use(
    http.patch(`${API_URL}/availabilities`, async ({ request }) => {
      const body = (await request.json()) as {
        items: Array<{ id: string; isOpen: boolean }>;
      };
      savedItems.push(body.items);
      await delay(150);
      slots = slots.map((item) =>
        item.id === "slot-1" ? { ...item, isOpen: false } : item,
      );
      return HttpResponse.json({ updatedCount: body.items.length });
    }),
  );

  const user = await closeTheOpenSlot();

  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();

  expect(await screen.findByText("All changes are saved.")).toBeVisible();
  expect(slotButton(closedLabel)).toBeVisible();
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
  expect(savedItems).toEqual([[{ id: "slot-1", isOpen: false }]]);
});

test("keeps the change available to save again when saving fails", async () => {
  const consoleError = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);
  let saveAttempts = 0;

  server.use(
    http.patch(`${API_URL}/availabilities`, () => {
      saveAttempts += 1;
      return HttpResponse.json(
        {
          statusCode: 400,
          code: "AVAILABILITY_UPDATE_FAILED",
          message: "Could not update availability.",
        },
        { status: 400 },
      );
    }),
  );

  const user = await closeTheOpenSlot();

  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(
    await screen.findByText("Failed to save changes. Please try again."),
  ).toBeVisible();
  expect(screen.getByText("1 unsaved change.")).toBeVisible();
  expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();

  await user.click(screen.getByRole("button", { name: "Save changes" }));

  expect(saveAttempts).toBe(2);
  expect(slotButton(closedLabel)).toBeVisible();

  consoleError.mockRestore();
});
