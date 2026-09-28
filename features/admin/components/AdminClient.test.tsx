import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { Toaster } from "sonner";
import { beforeEach, expect, test, vi } from "vitest";

import type { Me } from "@/features/auth/types/auth.types";
import type { AdminTeacherProfile } from "@/features/admin/types/admin";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/renderWithProviders";

import { AdminClient } from "./AdminClient";

const { replace } = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next/image", async () => {
  const React = await import("react");

  return {
    default: ({ alt }: { alt: string }) => React.createElement("img", { alt }),
  };
});

const API_URL = "http://localhost:4000";
const pendingTeachersUrl = `${API_URL}/admin/teachers?status=PENDING&page=1&limit=50`;

function buildMe(role: Me["role"]): Me {
  return {
    id: "user-1",
    email: "ada@example.com",
    name: "Ada Admin",
    role,
    profileImage: null,
    teacherProfile: null as unknown as Me["teacherProfile"],
  };
}

function pendingTeacher(): AdminTeacherProfile {
  return {
    id: "teacher-1",
    userId: "user-2",
    timezone: "Asia/Seoul",
    headline: "Spanish conversation",
    bio: "I help learners speak with confidence.",
    profileImageUrl: null,
    hourlyRate: 25,
    status: "PENDING",
    rejectionReason: null,
    averageRating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user-2",
      name: "Mina Park",
      email: "mina@example.com",
      profileImage: null,
    },
    teacherLanguages: [],
    teacherSpecialties: [],
  };
}

let queue = [pendingTeacher()];

function meHandler(user: Me | null) {
  return http.get(`${API_URL}/auth/me`, () => {
    if (!user) {
      return HttpResponse.json(
        { statusCode: 401, code: "UNAUTHORIZED", message: "Unauthorized" },
        { status: 401 },
      );
    }

    return HttpResponse.json({ user });
  });
}

function renderAdmin() {
  renderWithProviders(
    <>
      <AdminClient />
      <Toaster />
    </>,
  );
}

beforeEach(() => {
  queue = [pendingTeacher()];
  replace.mockReset();
  server.use(
    http.post(`${API_URL}/auth/refresh`, () =>
      HttpResponse.json(
        { statusCode: 401, code: "UNAUTHORIZED", message: "Unauthorized" },
        { status: 401 },
      ),
    ),
    meHandler(buildMe("ADMIN")),
    http.get(pendingTeachersUrl, () =>
      HttpResponse.json({
        items: queue,
        page: 1,
        limit: 50,
        totalCount: queue.length,
        hasNextPage: false,
        nextPage: null,
      }),
    ),
  );
});

test("sends people who are not admins away from the review queue", async () => {
  const blockedVisitors: Array<{ user: Me | null; destination: string }> = [
    {
      user: null,
      destination: "/login?callbackUrl=/admin",
    },
    {
      user: buildMe("STUDENT"),
      destination: "/",
    },
    {
      user: buildMe("TEACHER"),
      destination: "/",
    },
  ];

  for (const visitor of blockedVisitors) {
    replace.mockClear();
    server.use(meHandler(visitor.user));
    renderAdmin();

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(visitor.destination);
    });
    expect(
      screen.queryByRole("heading", { name: "Teacher profile review" }),
    ).not.toBeInTheDocument();

    cleanup();
  }
});

test("removes a teacher from the queue after approval", async () => {
  server.use(
    http.patch(`${API_URL}/admin/teachers/:id/approve`, async () => {
      await delay(150);
      queue = [];
      return HttpResponse.json({ id: "teacher-1", status: "APPROVED" });
    }),
  );

  const user = userEvent.setup();
  renderAdmin();

  expect(await screen.findByText("Mina Park")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Approve" }));

  expect(screen.getByRole("button", { name: "Approving..." })).toBeDisabled();

  expect(await screen.findByText("Teacher profile approved.")).toBeVisible();
  expect(screen.getByText("No pending teacher profiles.")).toBeVisible();
  expect(screen.queryByText("Mina Park")).not.toBeInTheDocument();
});

test("rejects a teacher only after a reason is written", async () => {
  const rejectRequests: unknown[] = [];

  server.use(
    http.patch(
      `${API_URL}/admin/teachers/:id/reject`,
      async ({ request }) => {
        rejectRequests.push(await request.json());
        await delay(150);
        queue = [];
        return HttpResponse.json({ id: "teacher-1", status: "REJECTED" });
      },
    ),
  );

  const user = userEvent.setup();
  renderAdmin();

  await screen.findByText("Mina Park");
  expect(screen.getByRole("button", { name: "Reject" })).toBeDisabled();
  expect(rejectRequests).toHaveLength(0);

  await user.type(
    screen.getByRole("textbox", { name: "Rejection reason" }),
    "Add a clearer headline.",
  );
  await user.click(screen.getByRole("button", { name: "Reject" }));

  expect(screen.getByRole("button", { name: "Rejecting..." })).toBeDisabled();

  expect(await screen.findByText("Teacher profile rejected.")).toBeVisible();
  expect(screen.getByText("No pending teacher profiles.")).toBeVisible();
  expect(rejectRequests).toEqual([
    { rejectionReason: "Add a clearer headline." },
  ]);
});
