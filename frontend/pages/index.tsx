import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

import { SectionContainer } from '../components/layout/section-container';
import { Button } from '../components/ui/button';

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
    <>
      <Head>
        <title>{t('app.name')} | {t('app.tagline')}</title>
        <meta name="description" content={t('app.tagline').toString()} />
      </Head>
      
      <main className="flex-1">
        {/* 英雄区域 */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('app.name')}</h1>
              <p className="text-xl mb-8">{t('app.tagline')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary" className="bg-white text-primary-900 hover:bg-neutral-100">
                  <Link href="/auth/login">{t('auth.login')}</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  <Link href="/auth/register">{t('auth.register')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 功能亮点 */}
        <SectionContainer margin="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">功能亮点</h2>
            <p className="text-xl text-neutral-600">让我们帮助您实现移民目标</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 text-primary-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">智能评估</h3>
              <p className="text-neutral-600">利用AI技术分析您的资格并推荐最佳移民路径</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-secondary-100 text-secondary-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">文档管理</h3>
              <p className="text-neutral-600">轻松管理所有移民文档，获取智能提示和建议</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-success-100 text-success-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">专家咨询</h3>
              <p className="text-neutral-600">与经验丰富的移民顾问连接，获取专业指导</p>
            </div>
          </div>
        </SectionContainer>
        
        {/* 如何工作 */}
        <div className="bg-neutral-50 py-16">
          <SectionContainer>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">如何工作</h2>
              <p className="text-xl text-neutral-600">简单三步，开启您的移民之旅</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 h-full">
                  <div className="absolute -top-4 -left-4 bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-semibold mb-2">完成评估</h3>
                  <p className="text-neutral-600">回答关于您的教育、工作经验和语言技能的问题</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 h-full">
                  <div className="absolute -top-4 -left-4 bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-semibold mb-2">查看结果</h3>
                  <p className="text-neutral-600">获取量身定制的移民路径建议和资格分数</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 h-full">
                  <div className="absolute -top-4 -left-4 bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-semibold mb-2">开始行动</h3>
                  <p className="text-neutral-600">利用我们的工具管理文档和表格，推进您的申请</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" variant="primary">
                <Link href="/assessment/start">{t('assessment.startAssessment')}</Link>
              </Button>
            </div>
          </SectionContainer>
        </div>
        
        {/* 行动召唤 */}
        <div className="bg-primary-50 py-16">
          <SectionContainer>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">准备好开始您的移民之旅了吗？</h2>
              <p className="text-lg mb-8">立即创建您的账户，探索ThinkForward AI如何帮助您实现移民目标。</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary">
                  <Link href="/auth/register">{t('auth.register')}</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="/contact">联系我们</Link>
                </Button>
              </div>
            </div>
          </SectionContainer>
        </div>
      </main>
    </>
  );
};

export default HomePage;
