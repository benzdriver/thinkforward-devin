import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainLayout } from '../components/layout/main-layout';

export default function ServicesPage() {
  const { t } = useTranslation('common');

  return (
    <MainLayout>
      <Head>
        <title>{t('services.title')?.toString() || 'Services'} | ThinkForward AI</title>
        <meta name="description" content={t('services.metaDescription')?.toString() || 'Immigration services offered by ThinkForward AI'} />
      </Head>

      {/* Hero Section */}
      <section className="hero-section bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('services.heroTitle')}</h1>
            <p className="text-xl mb-8">{t('services.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.overviewTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('services.overviewDescription')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Express Entry Service */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{t('services.expressEntry.title')}</h3>
              <p className="text-gray-600 mb-4 text-center">{t('services.expressEntry.description')}</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.expressEntry.benefit1')}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.expressEntry.benefit2')}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.expressEntry.benefit3')}</span>
                </li>
              </ul>
              <div className="text-center">
                <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                  {'Learn More'}
                </Link>
              </div>
            </div>

            {/* Provincial Nominee Programs */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5L15 7h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm15-8h-2m-4 0H9m6 4H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{t('services.provincialPrograms.title')}</h3>
              <p className="text-gray-600 mb-4 text-center">{t('services.provincialPrograms.description')}</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.provincialPrograms.benefit1')}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.provincialPrograms.benefit2')}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.provincialPrograms.benefit3')}</span>
                </li>
              </ul>
              <div className="text-center">
                <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                  {'Learn More'}
                </Link>
              </div>
            </div>

            {/* Immigration Consultation */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{t('services.consultation.title')}</h3>
              <p className="text-gray-600 mb-4 text-center">{t('services.consultation.description')}</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.consultation.benefit1')}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.consultation.benefit2')}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('services.consultation.benefit3')}</span>
                </li>
              </ul>
              <div className="text-center">
                <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                  {'Learn More'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.howItWorks.title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('services.howItWorks.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">{t('services.howItWorks.step1.title')}</h3>
              <p className="text-gray-600">{t('services.howItWorks.step1.description')}</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">{t('services.howItWorks.step2.title')}</h3>
              <p className="text-gray-600">{t('services.howItWorks.step2.description')}</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">{t('services.howItWorks.step3.title')}</h3>
              <p className="text-gray-600">{t('services.howItWorks.step3.description')}</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto text-white text-2xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">{t('services.howItWorks.step4.title')}</h3>
              <p className="text-gray-600">{t('services.howItWorks.step4.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('services.testimonials.title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('services.testimonials.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {t('services.testimonials.testimonial1.initials')}
                </div>
                <div>
                  <h4 className="font-semibold">{t('services.testimonials.testimonial1.name')}</h4>
                  <p className="text-sm text-gray-500">{t('services.testimonials.testimonial1.location')}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t('services.testimonials.testimonial1.quote')}"</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {t('services.testimonials.testimonial2.initials')}
                </div>
                <div>
                  <h4 className="font-semibold">{t('services.testimonials.testimonial2.name')}</h4>
                  <p className="text-sm text-gray-500">{t('services.testimonials.testimonial2.location')}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t('services.testimonials.testimonial2.quote')}"</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {t('services.testimonials.testimonial3.initials')}
                </div>
                <div>
                  <h4 className="font-semibold">{t('services.testimonials.testimonial3.name')}</h4>
                  <p className="text-sm text-gray-500">{t('services.testimonials.testimonial3.location')}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t('services.testimonials.testimonial3.quote')}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('services.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">{t('services.cta.description')}</p>
          <Link href="/contact" className="inline-block bg-white text-blue-900 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors text-lg">
            {t('services.cta.buttonText') || 'Contact Us'}
          </Link>
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
