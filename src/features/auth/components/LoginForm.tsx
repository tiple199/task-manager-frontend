'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { authApi } from '../api';
import { useAuthStore } from '../store';
import { setToken } from '@/lib/auth';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email: data.email, password: data.password });
      const tokenObj = res.data?.accessToken;
      if (tokenObj) {
        setToken({ accessToken: tokenObj.accessToken, refreshToken: tokenObj.refreshToken });
        setUser({ userId: 'temp', email: data.email });
        toast.success(res.message || 'Login successful!');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Login failed';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to continue to your workspace</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register('password')}
                error={errors.password?.message}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-1" size="lg" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="mt-5 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                setIsLoading(true);
                try {
                  const res = await authApi.googleLogin(credentialResponse.credential);
                  setToken({ accessToken: res.token, refreshToken: '' });
                  setUser(res.user);
                  toast.success(res.message || 'Google login successful!');
                } catch (err: any) {
                  const errorMsg = err.response?.data?.message || 'Google login failed';
                  toast.error(errorMsg);
                } finally {
                  setIsLoading(false);
                }
              }
            }}
            onError={() => toast.error('Google login Failed')}
            useOneTap
          />
        </div>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign up for free
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
