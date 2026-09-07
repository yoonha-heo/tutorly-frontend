import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tutorly",
  description: "Find and book tutors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            {children}
            <Toaster richColors position="bottom-center" />
            <Toaster
              id="chat-notifications"
              position="top-right"
              visibleToasts={3}
              toastOptions={{ unstyled: true }}
            />
          </GoogleOAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
