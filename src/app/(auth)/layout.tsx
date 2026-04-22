import { PublicOnlyRoute } from '@/components/auth/RouteGuard';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicOnlyRoute>
      <div className="auth-bg flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-[-10%] left-[-5%] h-72 w-72 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-[-10%] right-[-5%] h-96 w-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)' }}
        />

        <div className="relative w-full max-w-[440px] animate-slide-up">
          {/* Branding */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl gradient-brand mb-3 shadow-[0_4px_14px_rgba(99,102,241,0.5)]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold gradient-text tracking-tight">TaskManager</h1>
            <p className="mt-1 text-sm text-slate-500">Organize your work, accomplish more</p>
          </div>

          {children}
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
