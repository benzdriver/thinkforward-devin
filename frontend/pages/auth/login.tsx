import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

import { AuthLayout } from '../../components/layout/auth-layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert } from '../../components/ui/alert';
import { useAuth } from '../../lib/auth/AuthContext';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { login, error, resetError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const returnUrl = router.query.returnUrl as string || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    // resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    resetError();
    
    try {
      await login(data.email, data.password);
      router.push(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthLayout
      variant="default"
      contentPosition="left"
      sidebarVariant="default"
      sidebarContent={
        <div className="flex flex-col justify-center items-center h-full p-8 text-center" 
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
          <h1 className="text-3xl font-bold mb-4" 
              style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Welcome Back
          </h1>
          <p className="text-lg opacity-80 mb-8" 
             style={{ fontSize: '1.125rem', opacity: 0.8, marginBottom: '2rem' }}>
            Sign in to continue to your account
          </p>
        </div>
      }
    >
      <div className="w-full">
        <div className="mb-8" style={{ marginBottom: '2rem' }}>
          <h2 className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Login</h2>
          <p className="text-neutral-600 mt-2" style={{ color: '#6B7280', marginTop: '0.5rem' }}>Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <Alert 
            variant="error" 
            className="mb-6"
            title={t('auth.loginError') as string}
            onDismiss={resetError}
          >
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" 
                     style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
                error={errors.email?.message}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1" 
                   style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <label htmlFor="password" className="block text-sm font-medium"
                       style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500 }}>
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                  style={{ fontSize: '0.875rem', color: '#4A6CF7', textDecoration: 'none' }}
                >
                  Forgot Password
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 border-secondary-300 text-primary focus:ring-primary-400"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-neutral-700"
                     style={{ marginLeft: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>
                Remember Me
              </label>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              backgroundColor: '#4A6CF7', 
              color: 'white', 
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isSubmitting ? "Loading..." : "Login"}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-600" style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
                style={{ color: '#4A6CF7', fontWeight: 500, textDecoration: 'none' }}
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
