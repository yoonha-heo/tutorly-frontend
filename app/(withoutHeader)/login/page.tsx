import AuthForm from "@/features/auth/components/AuthForm";
import { GuestGuard } from "@/components/GuestGuard";

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
