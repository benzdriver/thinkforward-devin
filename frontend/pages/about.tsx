import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { MainLayout } from '../components/layout/main-layout';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  console.log('About page getStaticProps called with locale:', locale);
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

const teamMembers = [
  {
    id: 1,
    name: 'Zhang Ming',
    role: 'Founder & CEO',
    bio: 'With 15 years of immigration consulting experience, has helped over 500 families successfully immigrate to Canada and Australia.',
    image: '/images/team/member1.jpg',
  },
  {
    id: 2,
    name: 'Li Hua',
    role: 'Chief Technology Officer',
    bio: 'Former Google AI researcher, focused on applying natural language processing and machine learning technologies to immigration services.',
    image: '/images/team/member2.jpg',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    role: 'Immigration Legal Advisor',
    bio: 'Member of the Canadian Immigration Lawyers Association, specializing in complex immigration cases and appeal procedures.',
    image: '/images/team/member3.jpg',
  },
  {
    id: 4,
    name: 'Michael Chen',
    role: 'Director of Client Success',
    bio: 'With 10 years of customer service experience, dedicated to ensuring each client receives the best immigration consulting experience.',
    image: '/images/team/member4.jpg',
  },
];

const AboutPage: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <MainLayout>
      <Head>
        <title>{t('about.pageTitle') || '关于我们'} | ThinkForward AI</title>
        <meta name="description" content={t('about.metaDescription') || 'ThinkForward AI是一家利用人工智能技术变革移民咨询服务的公司，致力于使移民流程更加便捷、高效和成功。'} />
      </Head>
      
      {/* Hero Section - Airportr style */}
      <section className="hero-section bg-primary-900 text-white">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title">{t('about.heroTitle') || '用AI变革移民咨询'}</h1>
            <p className="hero-subtitle">{t('about.heroSubtitle') || '我们的使命是让移民流程对每个人都更加便捷、高效和成功。'}</p>
            <Link href="/contact">
              <button className="btn btn-light">{t('about.contactUs') || '联系我们'}</button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('about.missionTitle') || '我们的故事'}</h2>
            <p className="section-subtitle">{t('about.missionSubtitle') || '我们如何开始以及我们的发展历程'}</p>
          </div>
          
          <div className="grid-cols-2">
            <div className="story-content">
              <p className="text-paragraph">
                {t('about.missionText1') || '在ThinkForward AI，我们相信每个人都应该获得清晰、个性化的移民指导。我们的使命是通过结合人类专业知识和前沿AI技术，使移民咨询服务民主化。'}
              </p>
              <p className="text-paragraph">
                {t('about.missionText2') || '我们致力于降低移民流程的复杂性、成本和不确定性，帮助个人和家庭充满信心和清晰地规划他们的移民之旅。'}
              </p>
              <p className="text-paragraph">
                {t('about.missionText3') || '我们的平台弥合了传统咨询服务和自助服务选项之间的差距，提供结合两者优势的混合方法。'}
              </p>
            </div>
            <div className="story-image">
              <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/about/mission.jpg" 
                  alt={t('about.missionImageAlt') || 'Our mission at ThinkForward AI'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('about.valuesTitle')}</h2>
            <p className="section-subtitle">{t('about.valuesSubtitle')}</p>
          </div>
          
          <div className="grid-cols-3">
            <div className="value-card">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="value-title">{t('about.value1Title')}</h3>
              <p className="value-text">{t('about.value1Text')}</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="value-title">{t('about.value2Title')}</h3>
              <p className="value-text">{t('about.value2Text')}</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="value-title">{t('about.value3Title')}</h3>
              <p className="value-text">{t('about.value3Text')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="section bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-12">
            <h2 className="section-title text-3xl font-bold text-primary-900 mb-4">{t('about.teamTitle') || 'Our Team'}</h2>
            <p className="section-subtitle text-lg text-gray-600 max-w-3xl mx-auto">{t('about.teamSubtitle') || 'The people behind ThinkForward AI'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card bg-white rounded-lg shadow-md p-6 text-center transition-transform hover:transform hover:scale-105">
                <div className="team-image mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary-900 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-lg border-2 border-blue-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                    <span>{member.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                </div>
                <h3 className="team-name text-xl font-semibold text-primary-900 mb-2">{member.name}</h3>
                <p className="team-role text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="team-bio text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact CTA Section */}
      <section className="section bg-primary-50">
        <div className="container">
          <div className="cta-content text-center">
            <h2 className="cta-title">{t('about.contactTitle')}</h2>
            <p className="cta-text">{t('about.contactText')}</p>
            <div className="cta-buttons">
              <Link href="/contact">
                <button className="btn btn-primary">{t('about.scheduleConsultation')}</button>
              </Link>
              <Link href="/services">
                <button className="btn btn-outline">{t('about.learnMore')}</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
