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
    <MainLayout>
      <Head>
        <title>{t('auth.register') || '注册'} | ThinkForward AI</title>
        <meta name="description" content={t('auth.registerDescription') || '创建您的ThinkForward AI账户'} />
      </Head>
      
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-sidebar">
              <div className="auth-sidebar-content">
                <h1 className="auth-welcome">{t('auth.createAccount') || '创建账户'}</h1>
                <p className="auth-message">{t('auth.registerMessage') || '注册一个账户以开始您的移民之旅'}</p>
              </div>
            </div>
            
            <div className="auth-form-container">
              <div className="auth-form-header">
                <h2 className="auth-form-title">{t('auth.register') || '注册'}</h2>
                <p className="auth-form-subtitle">{t('auth.registerDescription') || '填写以下信息创建您的账户'}</p>
              </div>
              
              {error && (
                <div className="alert alert-error">
                  <div className="alert-content">
                    <h4 className="alert-title">{t('auth.registerError') || '注册错误'}</h4>
                    <p className="alert-message">{error}</p>
                  </div>
                  <button className="alert-close" onClick={resetError}>×</button>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    {t('auth.name') || '姓名'}
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    placeholder={t('auth.namePlaceholder') || '输入您的姓名'}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="form-error">{errors.name.message}</p>
                  )}
                </div>
                
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
                  <label htmlFor="password" className="form-label">
                    {t('auth.password') || '密码'}
                  </label>
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
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('auth.confirmPassword') || '确认密码'}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder={t('auth.confirmPasswordPlaceholder') || '再次输入您的密码'}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="form-error">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="form-checkbox">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    className="checkbox"
                    {...register('agreeTerms')}
                  />
                  <label htmlFor="agreeTerms" className="checkbox-label">
                    {t('auth.agreeToTerms') || '我同意'}{' '}
                    <Link href="/terms" className="form-link">
                      {t('common.terms') || '服务条款'}
                    </Link>{' '}
                    {t('common.and') || '和'}{' '}
                    <Link href="/privacy" className="form-link">
                      {t('common.privacy') || '隐私政策'}
                    </Link>
                  </label>
                  {errors.agreeTerms && (
                    <p className="form-error">{errors.agreeTerms.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.loading') || '加载中...' : t('auth.register') || '注册'}
                </button>
                
                <div className="auth-footer">
                  <p className="auth-footer-text">
                    {t('auth.haveAccount') || '已有账户？'}{' '}
                    <Link
                      href="/auth/login"
                      className="auth-footer-link"
                    >
                      {t('auth.login') || '登录'}
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
