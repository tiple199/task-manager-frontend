import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | Task Manager',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
