import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Task Manager',
};

// In Next.js 14 App Router, dynamic route params are passed as props
export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return <ResetPasswordForm token={params.token} />;
}
