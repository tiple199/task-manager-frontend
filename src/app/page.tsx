import { redirect } from 'next/navigation';

export default function Home() {
  // Directly redirect to dashboard
  // The dashboard route or login route will handle the actual Auth guards
  redirect('/dashboard');
}
