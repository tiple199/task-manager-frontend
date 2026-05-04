'use client';

import { ProtectedRoute } from '@/components/auth/RouteGuard';
import React from 'react';
import { useAuthStore } from '@/features/auth/store';
import { Button } from '@/components/ui/button';
import { authApi } from '@/features/auth/api';
import { getToken } from '@/lib/auth';
import { LogOut, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Topbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    const token = getToken();
    if (token?.refreshToken) {
      try {
        await authApi.logout(token.refreshToken);
      } catch (err) {
        console.error('Logout error', err);
      }
    }
    logout();
    router.push('/login');
  };

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-brand shadow-[0_2px_8px_rgba(99,102,241,0.4)] group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.5)] transition-shadow">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text tracking-tight">TaskManager</span>
          </Link>

          {/* Right: User + logout */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-slate-100 pr-3 pl-1 py-1">
              <div className="h-7 w-7 rounded-full gradient-brand flex items-center justify-center shadow-sm">
                <span className="text-[11px] font-bold text-white">{initials}</span>
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[180px] truncate">
                {user?.email || 'User'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-slate-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="dashboard-bg flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-slate-400">
              © {new Date().getFullYear()} TaskManager · Built with ❤️ by Tiple
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
