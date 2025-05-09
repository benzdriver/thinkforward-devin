import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'next-i18next';
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
        <div className="flex flex-col justify-center items-center h-full p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('auth.welcomeBack') as string}</h1>
          <p className="text-lg opacity-80 mb-8">{t('auth.loginMessage') as string}</p>
        </div>
      }
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{t('auth.login') as string}</h2>
          <p className="text-neutral-600 mt-2">{t('auth.loginDescription') as string}</p>
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
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t('auth.email') as string}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder') as string}
                {...register('email')}
                error={errors.email?.message}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  {t('auth.password') as string}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  {t('auth.forgotPassword') as string}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder') as string}
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
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-neutral-700">
                {t('auth.rememberMe') as string}
              </label>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') as string : t('auth.login') as string}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-600">
              {t('auth.noAccount') as string}{' '}
              <Link
                href="/auth/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                {t('auth.register') as string}
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
