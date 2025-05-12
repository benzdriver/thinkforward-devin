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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
      console.error('Password reset error:', error);
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
          <h1 className="text-3xl font-bold mb-4">{t('auth.resetPassword') as string}</h1>
          <p className="text-lg opacity-80 mb-8">{t('auth.forgotPasswordMessage') as string}</p>
        </div>
      }
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{t('auth.forgotPassword') as string}</h2>
          <p className="text-neutral-600 mt-2">{t('auth.forgotPasswordDescription') as string}</p>
        </div>
        
        {error && (
          <Alert 
            variant="error" 
            className="mb-6"
            title={t('auth.resetError') as string}
            onDismiss={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        
        {success ? (
          <div className="text-center py-8">
            <Alert 
              variant="success" 
              className="mb-6"
              title={t('auth.resetEmailSent') as string}
            >
              {t('auth.resetEmailSentDescription') as string}
            </Alert>
            
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/auth/login')}
            >
              {t('auth.backToLogin') as string}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') as string : t('auth.sendResetLink') as string}
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-600">
                {t('auth.rememberedPassword') as string}{' '}
                <Link
                  href="/auth/login"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  {t('auth.login') as string}
                </Link>
              </p>
            </div>
          </form>
        )}
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
