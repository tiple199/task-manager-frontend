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
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data: ForgotValues) => {
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(data.email);
      toast.success(res.message || 'Password reset link sent!');
      setSentEmail(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Check your inbox</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              We sent a reset link to{' '}
              <span className="font-semibold text-slate-700">{sentEmail}</span>.
              {' '}Please check your email.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Mail className="h-6 w-6 text-indigo-600" />
        </div>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>
          No worries! Enter your email and we'll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                {...register('email')}
                error={errors.email?.message}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
