function resolveApiUrl() {
  // Browser calls stay on this host so auth cookies are visible to the page guard.
  // Server renders talk to the backend directly and forward the incoming Cookie header.
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
    return "/api/backend";
  }

  return process.env.NEXT_PUBLIC_API_URL!;
}

export const env = {
  get apiUrl() {
    return resolveApiUrl();
  },
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL!,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
};
