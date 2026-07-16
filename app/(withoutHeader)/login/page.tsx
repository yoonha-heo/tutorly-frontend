import AuthForm from "@/components/auth/AuthForm";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthForm
        title="Welcome back"
        description="Sign in with Google to start booking lessons."
        role="STUDENT"
      />
    </GuestGuard>
  );
}
