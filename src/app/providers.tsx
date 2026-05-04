'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from '@/features/auth/store';
import { authApi } from '@/features/auth/api';
import { getToken } from '@/lib/auth';


const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

function AuthInitializer() {
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Restore user profile after page reload if token exists
    if (getToken()?.accessToken && isAuthenticated) {
      authApi.getProfile()
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          // Token invalid / expired — interceptor will handle redirect
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
