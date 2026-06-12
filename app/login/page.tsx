"use client";

import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  return (
    <main>
      <h1>Login</h1>

      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const idToken = credentialResponse.credential;

          if (!idToken) {
            console.error("Google idToken not found");
            return;
          }

          const res = await fetch("http://localhost:4000/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ idToken }),
          });

          const data = await res.json();

          console.log("Tutorly login success", data);
        }}
        onError={() => {
          console.log("Google Login Failed");
        }}
      />
    </main>
  );
}
