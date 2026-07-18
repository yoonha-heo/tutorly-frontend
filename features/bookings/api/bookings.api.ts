import { env } from "@/config/env";

export type LessonType = "STANDARD";

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED"
  | "EXPIRED";

export type Booking = {
  id: string;
  teacherId: string;
  studentId: string;
  availabilityId: string;
  lessonType: LessonType;
  lessonStartAt: string;
  lessonEndAt: string;
  price: number;
  status: BookingStatus;
  paymentExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    timezone: string;
    headline: string;
    profileImageUrl: string | null;
    hourlyRate: number;
    user: {
      id: string;
      name: string;
    };
  };
};

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

export async function getMyBookings(): Promise<Booking[]> {
  const response = await fetch(`${env.apiUrl}/bookings/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my bookings");
  }

  return response.json();
}
