import AuthForm from "@/components/auth/AuthForm";
import { GuestGuard } from "@/components/auth/GuestGuard";

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
