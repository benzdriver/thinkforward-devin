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

const teamMembers = [
  {
    id: 1,
    name: '张明',
    role: '创始人兼首席执行官',
    bio: '拥有15年移民咨询经验，曾帮助超过500个家庭成功移民加拿大和澳大利亚。',
    image: '/images/team/member1.jpg',
  },
  {
    id: 2,
    name: '李华',
    role: '首席技术官',
    bio: '前谷歌AI研究员，专注于自然语言处理和机器学习技术在移民服务中的应用。',
    image: '/images/team/member2.jpg',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    role: '移民法律顾问',
    bio: '加拿大移民律师协会成员，专注于复杂移民案例和上诉程序。',
    image: '/images/team/member3.jpg',
  },
  {
    id: 4,
    name: 'Michael Chen',
    role: '客户成功总监',
    bio: '拥有10年客户服务经验，致力于确保每位客户获得最佳移民咨询体验。',
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
            <h2 className="section-title">{t('about.storyTitle') || '我们的故事'}</h2>
            <p className="section-subtitle">{t('about.storySubtitle') || '我们如何开始以及我们的发展历程'}</p>
          </div>
          
          <div className="grid-cols-2">
            <div className="story-content">
              <p className="text-paragraph">
                {t('about.storyText1') || '在ThinkForward AI，我们相信每个人都应该获得清晰、个性化的移民指导。我们的使命是通过结合人类专业知识和前沿AI技术，使移民咨询服务民主化。'}
              </p>
              <p className="text-paragraph">
                {t('about.storyText2') || '我们致力于降低移民流程的复杂性、成本和不确定性，帮助个人和家庭充满信心和清晰地规划他们的移民之旅。'}
              </p>
              <p className="text-paragraph">
                {t('about.storyText3') || '我们的平台弥合了传统咨询服务和自助服务选项之间的差距，提供结合两者优势的混合方法。'}
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <span>{t('about.imagePlaceholder') || '图片占位符'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('about.valuesTitle') || '我们的价值观'}</h2>
            <p className="section-subtitle">{t('about.valuesSubtitle') || '指导我们工作的原则'}</p>
          </div>
          
          <div className="grid-cols-3">
            <div className="value-card">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="value-title">{t('about.value1Title') || '信任与透明'}</h3>
              <p className="value-text">{t('about.value1Text') || '我们相信通过透明的流程、清晰的沟通和诚实的指导在移民旅程的每一步建立信任。'}</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="value-title">{t('about.value2Title') || '创新与可及性'}</h3>
              <p className="value-text">{t('about.value2Text') || '我们致力于利用技术使移民服务更加便捷、经济实惠和高效，让每个人都能获得帮助。'}</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="value-title">{t('about.value3Title') || '以人为本的方法'}</h3>
              <p className="value-text">{t('about.value3Text') || '虽然我们拥抱AI，但我们从不忽视人的因素。我们的技术增强而非取代专家顾问的个人接触。'}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('about.teamTitle') || '我们的团队'}</h2>
            <p className="section-subtitle">{t('about.teamSubtitle') || '我们背后的专业人士'}</p>
          </div>
          
          <div className="grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <div className="image-placeholder">
                    <span>{member.name.substring(0, 2)}</span>
                  </div>
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact CTA Section */}
      <section className="section bg-primary-50">
        <div className="container">
          <div className="cta-content text-center">
            <h2 className="cta-title">{t('about.contactTitle') || '联系我们'}</h2>
            <p className="cta-text">{t('about.contactText') || '准备好开始您的移民之旅了吗？与我们的专家顾问预约咨询，了解ThinkForward AI如何帮助您实现移民目标。'}</p>
            <div className="cta-buttons">
              <Link href="/contact">
                <button className="btn btn-primary">{t('about.scheduleConsultation') || '预约咨询'}</button>
              </Link>
              <Link href="/services">
                <button className="btn btn-outline">{t('about.learnMore') || '了解更多'}</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
