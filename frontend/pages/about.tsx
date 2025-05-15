import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
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

const teamMembersData = {
  en: [
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
      bio: 'Former Google AI researcher, focusing on applying natural language processing and machine learning technologies to immigration services.',
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
  ],
  zh: [
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
      name: '莎拉·约翰逊',
      role: '移民法律顾问',
      bio: '加拿大移民律师协会成员，专注于复杂移民案例和上诉程序。',
      image: '/images/team/member3.jpg',
    },
    {
      id: 4,
      name: '迈克尔·陈',
      role: '客户成功总监',
      bio: '拥有10年客户服务经验，致力于确保每位客户获得最佳移民咨询体验。',
      image: '/images/team/member4.jpg',
    },
  ],
  fr: [
    {
      id: 1,
      name: 'Zhang Ming',
      role: 'Fondateur et PDG',
      bio: 'Avec 15 ans d\'expérience en consultation d\'immigration, a aidé plus de 500 familles à immigrer avec succès au Canada et en Australie.',
      image: '/images/team/member1.jpg',
    },
    {
      id: 2,
      name: 'Li Hua',
      role: 'Directeur de la Technologie',
      bio: 'Ancien chercheur en IA chez Google, se concentrant sur l\'application du traitement du langage naturel et des technologies d\'apprentissage automatique aux services d\'immigration.',
      image: '/images/team/member2.jpg',
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Conseillère Juridique en Immigration',
      bio: 'Membre de l\'Association canadienne des avocats en immigration, spécialisée dans les cas d\'immigration complexes et les procédures d\'appel.',
      image: '/images/team/member3.jpg',
    },
    {
      id: 4,
      name: 'Michael Chen',
      role: 'Directeur du Succès Client',
      bio: 'Avec 10 ans d\'expérience en service client, dédié à garantir que chaque client reçoive la meilleure expérience de consultation en immigration.',
      image: '/images/team/member4.jpg',
    },
  ]
};

const AboutPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>{t('about.pageTitle') as string} | ThinkForward AI</title>
        <meta name="description" content={t('about.metaDescription') as string} />
      </Head>
      
      <main className="flex-1">
        {/* 英雄区域 */}
        <div className="relative text-white py-16">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/about/hero-background.jpg" 
              alt="Hero background" 
              layout="fill"
              objectFit="cover"
              priority
            />
            <div className="absolute inset-0 bg-primary-900/70"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
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
        <div 
          className="relative py-16"
          style={{ 
            backgroundImage: 'url(/images/about/light-blue-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          <SectionContainer className="relative z-10">
            <PageHeader
              title={t('about.missionTitle')}
              description={t('about.missionSubtitle')}
              className="text-white"
            />
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div 
                className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.85)', 
                  backdropFilter: 'blur(12px)',
                  padding: '2rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
                }}
              >
                <p className="text-lg mb-6 text-gray-800">
                  {t('about.missionText1')}
                </p>
                <p className="text-lg mb-6 text-gray-800">
                  {t('about.missionText2')}
                </p>
                <p className="text-lg text-gray-800">
                  {t('about.missionText3')}
                </p>
              </div>
              <div className="relative h-80 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                <Image 
                  src="/images/about/mission.jpg" 
                  alt={t('about.missionImageAlt')}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              </div>
            </div>
          </SectionContainer>
        </div>
        
        {/* 我们的价值观 */}
        <div className="bg-gradient-to-b from-white to-primary-50 py-16">
          <SectionContainer>
            <PageHeader
              title={t('about.valuesTitle')}
              description={t('about.valuesSubtitle')}
            />
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card variant="glass" hover={true} className="p-8 transform transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center mb-6 shadow-colored">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('about.value1Title')}</h3>
                <p className="text-neutral-600">{t('about.value1Text')}</p>
              </Card>
              
              <Card variant="glass" hover={true} className="p-8 transform transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-accent text-white rounded-full flex items-center justify-center mb-6 shadow-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('about.value2Title')}</h3>
                <p className="text-neutral-600">{t('about.value2Text')}</p>
              </Card>
              
              <Card variant="glass" hover={true} className="p-8 transform transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-blue-purple text-white rounded-full flex items-center justify-center mb-6 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('about.value3Title')}</h3>
                <p className="text-neutral-600">{t('about.value3Text')}</p>
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
            {teamMembersData[(router.locale as keyof typeof teamMembersData) || 'en'].map((member) => (
              <Card key={member.id} variant="glass" hover={true} className="p-6 text-center transform transition-all duration-300 hover:-translate-y-2">
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
                <p className="text-neutral-600 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </SectionContainer>
        
        {/* 联系我们 */}
        <div className="bg-gradient-to-b from-primary-50 to-white py-16">
          <SectionContainer>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-gradient-primary">{t('about.contactTitle')}</h2>
              <p className="text-lg mb-8 text-neutral-700">{t('about.contactText')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary" rounded="full" className="transform transition-all duration-300 hover:-translate-y-1">
                  {t('about.scheduleConsultation')}
                </Button>
                <Button size="lg" variant="glass" rounded="full" className="transform transition-all duration-300 hover:-translate-y-1">
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
