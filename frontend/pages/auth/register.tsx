import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

import { AuthLayout } from '../../components/layout/auth-layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert } from '../../components/ui/alert';
import { useAuth } from '../../lib/auth/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { register: registerUser, error, resetError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    resetError();
    
    try {
      await registerUser(data.email, data.password, data.name);
      router.push('/auth/login?registered=true');
    } catch (error) {
      console.error('Registration error:', error);
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
          <h1 className="text-3xl font-bold mb-4">{t('auth.createAccount') as string}</h1>
          <p className="text-lg opacity-80 mb-8">{t('auth.registerMessage') as string}</p>
        </div>
      }
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{t('auth.register') as string}</h2>
          <p className="text-neutral-600 mt-2">{t('auth.registerDescription') as string}</p>
        </div>
        
        {error && (
          <Alert 
            variant="error" 
            className="mb-6"
            title={t('auth.registerError') as string}
            onDismiss={resetError}
          >
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                {t('auth.name') as string}
              </label>
              <Input
                id="name"
                type="text"
                placeholder={t('auth.namePlaceholder') as string}
                {...register('name')}
                error={errors.name?.message}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
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
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                {t('auth.password') as string}
              </label>
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                {t('auth.confirmPassword') as string}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('auth.confirmPasswordPlaceholder') as string}
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="agreeTerms"
                type="checkbox"
                className="h-4 w-4 border-secondary-300 text-primary focus:ring-primary-400"
                {...register('agreeTerms')}
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-neutral-700">
                {t('auth.agreeTerms') as string}{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                  {t('common.terms') as string}
                </Link>{' '}
                {t('common.and') as string}{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                  {t('common.privacy') as string}
                </Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-1 text-sm text-destructive">{errors.agreeTerms.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') as string : t('auth.register') as string}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-600">
              {t('auth.haveAccount') as string}{' '}
              <Link
                href="/auth/login"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                {t('auth.login') as string}
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
