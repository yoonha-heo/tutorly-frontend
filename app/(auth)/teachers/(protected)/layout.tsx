import { AuthGuard } from "@/features/auth/components/AuthGaurd";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: Props) {
  return <AuthGuard loginPath="/teachers/login">{children}</AuthGuard>;
}
