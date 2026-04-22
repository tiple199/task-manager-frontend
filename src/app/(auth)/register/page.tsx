import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Task Manager',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
