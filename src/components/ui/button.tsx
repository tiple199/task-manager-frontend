import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default:
        'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_2px_10px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.45)] hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]',
      outline:
        'border border-slate-200 bg-white/80 hover:bg-slate-50 text-slate-700 hover:border-indigo-300 hover:text-indigo-700 active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:scale-[0.98]',
      destructive:
        'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_2px_8px_rgba(239,68,68,0.30)] hover:shadow-[0_4px_14px_rgba(239,68,68,0.40)] active:scale-[0.98]',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-[0.98]',
    };

    const sizes = {
      default: 'h-10 px-5 py-2 text-sm rounded-lg',
      sm:      'h-8  px-3 py-1.5 text-xs rounded-md',
      lg:      'h-12 px-8 py-2.5 text-base rounded-xl',
      icon:    'h-9  w-9 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
