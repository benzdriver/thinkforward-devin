import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

import { PageHeader } from '../components/layout/page-header';
import { SectionContainer } from '../components/layout/section-container';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
};

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: '基础版',
    description: 'pricing.basicDescription',
    price: {
      monthly: 99,
      yearly: 990,
    },
    features: [
      '基本功能访问',
      '用户管理',
      '标准客户支持',
      '基础数据分析',
    ],
    buttonVariant: 'outline',
  },
  {
    id: 'professional',
    name: '专业版',
    description: 'pricing.professionalDescription',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: [
      '所有基础版功能',
      '高级分析功能',
      '优先客户支持',
      '多用户管理',
      'API访问',
      '高级报表功能',
    ],
    popular: true,
    buttonVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: 'pricing.enterpriseDescription',
    price: {
      monthly: 399,
      yearly: 3990,
    },
    features: [
      '所有专业版功能',
      '专属客户经理',
      '自定义集成',
      '高级安全功能',
      '无限用户',
      '24/7全天候支持',
      '定制化解决方案',
    ],
    buttonVariant: 'secondary',
  },
];

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: 'pricing.faq1Question',
    answer: 'pricing.faq1Answer',
  },
  {
    question: 'pricing.faq2Question',
    answer: 'pricing.faq2Answer',
  },
  {
    question: 'pricing.faq3Question',
    answer: 'pricing.faq3Answer',
  },
  {
    question: 'pricing.faq4Question',
    answer: 'pricing.faq4Answer',
  },
  {
    question: 'pricing.faq5Question',
    answer: 'pricing.faq5Answer',
  },
];

const PricingPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');
  
  return (
    <>
      <Head>
        <title>{t('pricing.pageTitle') as string} | ThinkForward AI</title>
        <meta name="description" content={t('pricing.metaDescription') as string} />
      </Head>
      
      <main className="flex-1">
        {/* 英雄区域 */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('pricing.heroTitle', { defaultValue: '简单透明的价格方案' }) as string}</h1>
              <p className="text-xl mb-8">{t('pricing.heroSubtitle', { defaultValue: '选择最适合您需求的方案，随时可以升级或降级。' }) as string}</p>
            </div>
          </div>
        </div>
        
        {/* 价格计划 */}
        <SectionContainer>
          <div className="text-center mb-12">
            <PageHeader
              title={t('pricing.plansTitle', { defaultValue: '选择您的方案' }) as string}
              description={t('pricing.plansSubtitle', { defaultValue: '我们提供灵活的价格方案，满足不同规模和需求的客户' }) as string}
            />
            
            {/* 计费周期切换 */}
            <div className="flex justify-center mt-8 mb-12">
              <Tabs 
                defaultValue="monthly" 
                value={billingCycle}
                onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
              >
                <TabsList>
                  <TabsTrigger value="monthly">{t('pricing.monthly', { defaultValue: '月付' }) as string}</TabsTrigger>
                  <TabsTrigger value="yearly">{t('pricing.yearly', { defaultValue: '年付' }) as string}</TabsTrigger>
                </TabsList>
              </Tabs>
              {billingCycle === 'yearly' && (
                <Badge variant="success" className="ml-2">
                  {t('pricing.savePercent', { defaultValue: '节省16%' }) as string}
                </Badge>
              )}
            </div>
          </div>
          
          {/* 价格卡片 */}
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`p-6 flex flex-col ${plan.popular ? 'border-primary-500 shadow-lg relative' : ''}`}
                variant={plan.popular ? 'elevated' : 'default'}
                hover={true}
              >
                {plan.popular && (
                  <Badge variant="primary" className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    {t('pricing.mostPopular', { defaultValue: '最受欢迎' }) as string}
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{t(`pricing.${plan.id}Title`, { defaultValue: plan.name }) as string}</h3>
                  <p className="text-gray-600">{t(plan.description, { defaultValue: `${plan.name} plan description` }) as string}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {billingCycle === 'monthly' ? t('pricing.perMonth', { defaultValue: '/月' }) as string : t('pricing.perYear', { defaultValue: '/年' }) as string}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-success-600 text-sm mt-2">
                      {t('pricing.monthlyEquivalent', { price: Math.round(plan.price.yearly / 12), defaultValue: `相当于每月 $${Math.round(plan.price.yearly / 12)}` }) as string}
                    </p>
                  )}
                </div>
                
                <ul className="mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start mb-3">
                      <svg className="h-5 w-5 text-success-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t(feature, { defaultValue: `Feature ${index + 1}` }) as string}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant || 'primary'} 
                  size="lg" 
                  className="w-full mt-auto"
                >
                  {t('pricing.selectPlan', { defaultValue: '选择此方案' }) as string}
                </Button>
              </Card>
            ))}
          </div>
          
          {/* 企业定制 */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('pricing.customTitle', { defaultValue: '需要企业定制方案？' }) as string}</h3>
            <p className="text-lg mb-6 max-w-3xl mx-auto">{t('pricing.customDescription', { defaultValue: '我们提供灵活的企业级定制方案，满足您的特定需求。联系我们的销售团队了解更多。' }) as string}</p>
            <Button variant="primary" size="lg">
              {t('pricing.contactSales', { defaultValue: '联系销售团队' }) as string}
            </Button>
          </div>
        </SectionContainer>
        
        {/* 功能比较 */}
        <div className="bg-gray-50 py-16">
          <SectionContainer>
            <PageHeader
              title={t('pricing.comparisonTitle', { defaultValue: '功能比较' }) as string}
              description={t('pricing.comparisonSubtitle', { defaultValue: '查看不同方案之间的功能差异' }) as string}
            />
            
            <div className="overflow-x-auto">
              <table className="w-full mt-8 border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-4 px-6 text-left">{t('pricing.feature', { defaultValue: '功能' }) as string}</th>
                    <th className="py-4 px-6 text-center">{t('pricing.basicTitle', { defaultValue: '基础版' }) as string}</th>
                    <th className="py-4 px-6 text-center">{t('pricing.professionalTitle', { defaultValue: '专业版' }) as string}</th>
                    <th className="py-4 px-6 text-center">{t('pricing.enterpriseTitle', { defaultValue: '企业版' }) as string}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature1', { defaultValue: '基本功能访问' }) as string}</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature2', { defaultValue: '用户管理' }) as string}</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature3', { defaultValue: '高级分析功能' }) as string}</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature4', { defaultValue: '优先客户支持' }) as string}</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature5', { defaultValue: '专属客户经理' }) as string}</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature6', { defaultValue: '自定义集成' }) as string}</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionContainer>
        </div>
        
        {/* 常见问题 */}
        <SectionContainer>
          <PageHeader
            title={t('pricing.faqTitle', { defaultValue: '常见问题' }) as string}
            description={t('pricing.faqSubtitle', { defaultValue: '关于我们服务的常见问题解答' }) as string}
          />
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-8 border-b border-gray-200 pb-6 last:border-0">
                <h3 className="text-xl font-semibold mb-3">{t(faq.question, { defaultValue: `常见问题 ${index + 1}` }) as string}</h3>
                <p className="text-gray-600">{t(faq.answer, { defaultValue: `这是常见问题 ${index + 1} 的回答。` }) as string}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
        
        {/* 行动召唤 */}
        <div className="bg-primary-50 py-16">
          <SectionContainer>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('pricing.ctaTitle', { defaultValue: '准备好开始了吗？' }) as string}</h2>
              <p className="text-lg mb-8">{t('pricing.ctaText', { defaultValue: '选择适合您的方案，立即开始使用我们的服务。' }) as string}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary">
                  {t('pricing.startFreeTrial', { defaultValue: '开始免费试用' }) as string}
                </Button>
                <Button size="lg" variant="outline">
                  {t('pricing.contactSales', { defaultValue: '联系销售团队' }) as string}
                </Button>
              </div>
            </div>
          </SectionContainer>
        </div>
      </main>
    </>
  );
};

export default PricingPage;
