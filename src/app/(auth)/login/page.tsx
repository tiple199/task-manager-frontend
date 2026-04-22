import { LoginForm } from '@/features/auth/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Task Manager',
};

export default function LoginPage() {
  return <LoginForm />;
}
