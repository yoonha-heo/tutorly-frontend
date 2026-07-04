import AuthForm from "@/features/auth/components/AuthForm";
import { GuestGuard } from "@/features/auth/components/GuestGuard";

export default function TeacherLoginPage() {
  return (
    <GuestGuard>
      <AuthForm
        title="Become a tutor"
        description="Sign in with Google to create your tutor account."
        role="TEACHER"
      />
    </GuestGuard>
  );
}
