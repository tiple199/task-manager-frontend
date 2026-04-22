'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { authApi } from '../api';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Mail, User, Lock, KeyRound, Eye, EyeOff, RefreshCw } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type EmailValues = z.infer<typeof emailSchema>;

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be exactly 6 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    getValues: getEmailValues,
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: detailsErrors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSendOtp = async (data: EmailValues) => {
    setIsLoading(true);
    try {
      const res = await authApi.sendOtp(data.email);
      toast.success(res.message || 'OTP sent successfully!');
      setCountdown(60);
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      toast.success(res.message || 'Registration successful! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isLoadingResend) return;
    setIsLoadingResend(true);
    try {
      const email = getEmailValues('email');
      const res = await authApi.sendOtp(email);
      toast.success(res.message || 'OTP resent successfully!');
      setCountdown(60);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoadingResend(false);
    }
  };

  return (
    <Card>
      {/* Step indicator */}
      <div className="flex items-center px-7 pt-5 gap-2">
        <div className={cn(
          'h-1.5 flex-1 rounded-full transition-all duration-500',
          step >= 1 ? 'bg-indigo-500' : 'bg-slate-200'
        )} />
        <div className={cn(
          'h-1.5 flex-1 rounded-full transition-all duration-500',
          step >= 2 ? 'bg-indigo-500' : 'bg-slate-200'
        )} />
      </div>

      <CardHeader className="text-center pt-4">
        <CardTitle>
          {step === 1 ? 'Create account' : 'Complete profile'}
        </CardTitle>
        <CardDescription>
          {step === 1 ? 'Enter your email to get started' : 'Fill in your details to finish registration'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 1 ? (
          <form onSubmit={handleSubmitEmail(onSendOtp)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  {...registerEmail('email')}
                  error={emailErrors.email?.message}
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Send Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmitDetails(onRegister)} className="space-y-4 animate-slide-up">
            <input type="hidden" {...registerDetails('email')} value={getEmailValues('email')} />

            {/* OTP */}
            <div className="space-y-1.5">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="otp"
                  placeholder="6-digit code"
                  className="pl-10 tracking-widest text-center font-mono"
                  {...registerDetails('otp')}
                  error={detailsErrors.otp?.message}
                  disabled={isLoading}
                  maxLength={6}
                />
              </div>
              <div className="flex justify-between items-center text-xs pt-0.5">
                <p className="text-slate-400">
                  Sent to <span className="font-semibold text-slate-600">{getEmailValues('email')}</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ml-1.5 text-indigo-500 hover:text-indigo-600 hover:underline transition-colors"
                  >
                    Change
                  </button>
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isLoadingResend}
                  className={cn(
                    'flex items-center gap-1 font-semibold transition-all',
                    countdown > 0 || isLoadingResend
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-indigo-600 hover:text-indigo-500'
                  )}
                >
                  {isLoadingResend ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="pl-10"
                  {...registerDetails('fullName')}
                  error={detailsErrors.fullName?.message}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...registerDetails('password')}
                  error={detailsErrors.password?.message}
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...registerDetails('confirmPassword')}
                  error={detailsErrors.confirmPassword?.message}
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-1" size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
