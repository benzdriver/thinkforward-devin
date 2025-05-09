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

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { token } = router.query;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
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
          <p className="text-lg opacity-80 mb-8">{t('auth.resetPasswordMessage') as string}</p>
        </div>
      }
    >
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{t('auth.resetPassword') as string}</h2>
          <p className="text-neutral-600 mt-2">{t('auth.resetPasswordDescription') as string}</p>
        </div>
        
        {!token && (
          <Alert 
            variant="error" 
            className="mb-6"
            title={t('auth.invalidToken') as string}
          >
            {t('auth.invalidTokenDescription') as string}
          </Alert>
        )}
        
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
              title={t('auth.passwordResetSuccess') as string}
            >
              {t('auth.passwordResetSuccessDescription') as string}
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
          token && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  {t('auth.newPassword') as string}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.newPasswordPlaceholder') as string}
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
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading') as string : t('auth.resetPassword') as string}
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
          )
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
