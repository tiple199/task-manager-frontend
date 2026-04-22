import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={cn(
            'flex h-11 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900',
            'placeholder:text-slate-400',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            error
              ? 'border-rose-400 focus:ring-rose-400/50 focus:border-rose-400 bg-rose-50/40'
              : 'border-slate-200 hover:border-slate-300',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-500 animate-slide-down">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
