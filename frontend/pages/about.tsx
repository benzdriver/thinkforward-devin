import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { PageHeader } from '../components/layout/page-header';
import { SectionContainer } from '../components/layout/section-container';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar } from '../components/ui/avatar';

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
    <>
      <Head>
        <title>{t('about.pageTitle') as string} | ThinkForward AI</title>
        <meta name="description" content={t('about.metaDescription') as string} />
      </Head>
      
      <main className="flex-1">
        {/* 英雄区域 */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.heroTitle')}</h1>
              <p className="text-xl mb-8">{t('about.heroSubtitle')}</p>
              <Button size="lg" variant="secondary">
                {t('about.contactUs')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* 我们的使命 */}
        <SectionContainer>
          <PageHeader
            title={t('about.missionTitle')}
            description={t('about.missionSubtitle')}
          />
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6">
                {t('about.missionText1')}
              </p>
              <p className="text-lg mb-6">
                {t('about.missionText2')}
              </p>
              <p className="text-lg">
                {t('about.missionText3')}
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">{t('about.imagePlaceholder')}</span>
              </div>
              {/* <Image 
                src="/images/about/mission.jpg" 
                alt={t('about.missionImageAlt')}
                layout="fill"
                objectFit="cover"
              /> */}
            </div>
          </div>
        </SectionContainer>
        
        {/* 我们的价值观 */}
        <div className="bg-gray-50 py-16">
          <SectionContainer>
            <PageHeader
              title={t('about.valuesTitle')}
              description={t('about.valuesSubtitle')}
            />
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('about.value1Title')}</h3>
                <p className="text-gray-600">{t('about.value1Text')}</p>
              </Card>
              
              <Card className="p-8">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('about.value2Title')}</h3>
                <p className="text-gray-600">{t('about.value2Text')}</p>
              </Card>
              
              <Card className="p-8">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('about.value3Title')}</h3>
                <p className="text-gray-600">{t('about.value3Text')}</p>
              </Card>
            </div>
          </SectionContainer>
        </div>
        
        {/* 我们的团队 */}
        <SectionContainer>
          <PageHeader
            title={t('about.teamTitle')}
            description={t('about.teamSubtitle')}
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-6 text-center">
                <div className="mb-4 mx-auto">
                  <Avatar
                    size="xl"
                    src={member.image}
                    alt={member.name}
                    fallback={member.name.substring(0, 2)}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary-600 mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </SectionContainer>
        
        {/* 联系我们 */}
        <div className="bg-primary-50 py-16">
          <SectionContainer>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('about.contactTitle')}</h2>
              <p className="text-lg mb-8">{t('about.contactText')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary">
                  {t('about.scheduleConsultation')}
                </Button>
                <Button size="lg" variant="outline">
                  {t('about.learnMore')}
                </Button>
              </div>
            </div>
          </SectionContainer>
        </div>
      </main>
    </>
  );
};

export default AboutPage;
