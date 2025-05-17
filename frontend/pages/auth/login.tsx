import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Head from 'next/head';
import { MainLayout } from '../../components/layout/main-layout';
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
    <MainLayout>
      <Head>
        <title>{t('auth.login') || '登录'} | ThinkForward AI</title>
        <meta name="description" content={t('auth.loginDescription') || '登录到您的ThinkForward AI账户'} />
      </Head>
      
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-sidebar">
              <div className="auth-sidebar-content">
                <h1 className="auth-welcome">{t('auth.welcomeBack') || '欢迎回来'}</h1>
                <p className="auth-message">{t('auth.loginMessage') || '登录您的账户以继续您的移民之旅'}</p>
              </div>
            </div>
            
            <div className="auth-form-container">
              <div className="auth-form-header">
                <h2 className="auth-form-title">{t('auth.login') || '登录'}</h2>
                <p className="auth-form-subtitle">{t('auth.loginDescription') || '输入您的凭据以访问您的账户'}</p>
              </div>
              
              {error && (
                <div className="alert alert-error">
                  <div className="alert-content">
                    <h4 className="alert-title">{t('auth.loginError') || '登录错误'}</h4>
                    <p className="alert-message">{error}</p>
                  </div>
                  <button className="alert-close" onClick={resetError}>×</button>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    {t('auth.email') || '电子邮件'}
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder={t('auth.emailPlaceholder') || '输入您的电子邮件'}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <div className="form-label-group">
                    <label htmlFor="password" className="form-label">
                      {t('auth.password') || '密码'}
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="form-link"
                    >
                      {t('auth.forgotPassword') || '忘记密码？'}
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder={t('auth.passwordPlaceholder') || '输入您的密码'}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="form-error">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="form-checkbox">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="checkbox"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="rememberMe" className="checkbox-label">
                    {t('auth.rememberMe') || '记住我'}
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.loading') || '加载中...' : t('auth.login') || '登录'}
                </button>
                
                <div className="auth-footer">
                  <p className="auth-footer-text">
                    {t('auth.noAccount') || '还没有账户？'}{' '}
                    <Link
                      href="/auth/register"
                      className="auth-footer-link"
                    >
                      {t('auth.register') || '注册'}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
