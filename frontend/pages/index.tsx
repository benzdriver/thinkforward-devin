import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { MainLayout } from '../components/layout/main-layout';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <MainLayout>
      <Head>
        <title>{t('app.name')} | {t('app.tagline')}</title>
        <meta name="description" content={t('app.tagline') || 'Your AI-powered immigration assistant'} />
      </Head>
      
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{t('assessment.startPage.title')}</h1>
            <h2 className="hero-subtitle">{t('app.tagline')}</h2>
            <p className="hero-description">{t('assessment.startPage.description')}</p>
            
            <div className="cta-buttons">
              <Link href="/assessment/start">
                <button className="btn btn-primary">{t('assessment.startAssessment')}</button>
              </Link>
              <Link href="/about">
                <button className="btn btn-secondary">{t('about.learnMore')}</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">{t('assessment.howItWorks.title')}</h2>
          <p className="section-subtitle">{t('assessment.startPage.description')}</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="feature-title">{t('assessment.howItWorks.step1.title')}</h3>
              <p className="feature-description">{t('assessment.howItWorks.step1.description')}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h3 className="feature-title">{t('home.feature2Title')}</h3>
              <p className="feature-description">{t('home.feature2Description')}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="feature-title">{t('home.feature3Title')}</h3>
              <p className="feature-description">{t('home.feature3Description')}</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">{t('home.servicesTitle')}</h2>
          <p className="section-subtitle">{t('home.servicesSubtitle')}</p>
          
          <div className="services-grid">
            <div className="service-card">
              <h3 className="service-title">{t('home.service1Title')}</h3>
              <p className="service-description">{t('home.service1Description')}</p>
              <Link href="/services/express-entry">
                <button className="btn btn-outline">{t('common.learnMore')}</button>
              </Link>
            </div>
            
            <div className="service-card">
              <h3 className="service-title">{t('home.service2Title')}</h3>
              <p className="service-description">{t('home.service2Description')}</p>
              <Link href="/services/pnp">
                <button className="btn btn-outline">{t('common.learnMore')}</button>
              </Link>
            </div>
            
            <div className="service-card">
              <h3 className="service-title">{t('home.service3Title')}</h3>
              <p className="service-description">{t('home.service3Description')}</p>
              <Link href="/services/consultation">
                <button className="btn btn-outline">{t('common.learnMore')}</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t('home.testimonialsTitle')}</h2>
          <p className="section-subtitle">{t('home.testimonialsSubtitle')}</p>
          
          <div className="testimonials-grid">
            {/* Testimonials will be added here */}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
