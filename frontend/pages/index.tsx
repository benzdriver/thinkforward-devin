import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function Home() {
  const { t } = useTranslation('common');
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                {t('common.welcomeToThinkForward')}
              </h1>
              <p className="text-xl text-neutral-700 mb-8">
                {t('common.homeDescription')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-8">
                  <Link href="/login">{t('common.getStarted')}</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50 px-8">
                  <Link href="/about">{t('common.learnMore')}</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">{t('common.signUp')}</h3>
                <p className="text-neutral-600 mb-6">{t('common.signUpDescription')}</p>
                <div className="space-y-4">
                  <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                    <Link href="/register">{t('common.createAccount')}</Link>
                  </Button>
                  <div className="text-center">
                    <span className="text-neutral-500">{t('common.alreadyHaveAccount')} </span>
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                      {t('common.signIn')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('common.features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-secondary-50 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('common.feature1Title')}</h3>
              <p className="text-neutral-600">{t('common.feature1Description')}</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-secondary-50 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('common.feature2Title')}</h3>
              <p className="text-neutral-600">{t('common.feature2Description')}</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-secondary-50 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('common.feature3Title')}</h3>
              <p className="text-neutral-600">{t('common.feature3Description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="bg-primary-600 rounded-xl h-64 md:h-80 flex items-center justify-center text-white text-4xl font-bold">
                ThinkForward
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">{t('common.aboutUs')}</h2>
              <p className="text-lg text-neutral-700 mb-6">
                {t('common.aboutUsDescription')}
              </p>
              <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                <Link href="/about">{t('common.learnMoreAboutUs')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('common.readyToStart')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('common.ctaDescription')}
          </p>
          <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-100 px-8">
            <Link href="/register">{t('common.getStartedNow')}</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
