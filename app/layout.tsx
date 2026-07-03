import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
          </GoogleOAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
