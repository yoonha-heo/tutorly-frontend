import { env } from "@/config/env";

export type LessonType = "STANDARD";

export type CreateBookingData = {
  availabilityId: string;
  lessonType: LessonType;
};

export async function createBooking(data: CreateBookingData) {
  const response = await fetch(`${env.apiUrl}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  return response.json();
}
