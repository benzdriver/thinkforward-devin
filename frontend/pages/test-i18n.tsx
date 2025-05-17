import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  console.log('getStaticProps called with locale:', locale);
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

const TestI18nPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  
  console.log('Current locale:', i18n.language);
  console.log('Available namespaces:', i18n.options.ns);
  console.log('Loaded namespaces:', i18n.options.defaultNS);
  
  return (
    <div style={{ padding: '2rem' }}>
      <Head>
        <title>I18n Test Page</title>
      </Head>
      
      <h1>I18n Test Page</h1>
      <p>Current locale: {i18n.language}</p>
      
      <h2>Basic Translations</h2>
      <ul>
        <li>App Name: {t('app.name')}</li>
        <li>App Tagline: {t('app.tagline')}</li>
        <li>Login: {t('auth.login')}</li>
        <li>Register: {t('auth.register')}</li>
      </ul>
      
      <h2>Hardcoded Text (For Comparison)</h2>
      <ul>
        <li>App Name: ThinkForward AI</li>
        <li>App Tagline: Your AI-powered immigration assistant</li>
        <li>Login: Login</li>
        <li>Register: Register</li>
      </ul>
      
      <div style={{ marginTop: '2rem' }}>
        <Link href="/">
          <button style={{ padding: '0.5rem 1rem', background: 'blue', color: 'white', border: 'none', borderRadius: '0.25rem' }}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TestI18nPage;
