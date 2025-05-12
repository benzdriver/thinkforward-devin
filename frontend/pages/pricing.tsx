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
    name: 'Basic',
    description: 'pricing.basicDescription',
    price: {
      monthly: 99,
      yearly: 990,
    },
    features: [
      'pricing.basicFeature1',
      'pricing.basicFeature2',
      'pricing.basicFeature3',
      'pricing.basicFeature4',
    ],
    buttonVariant: 'outline',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'pricing.professionalDescription',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: [
      'pricing.professionalFeature1',
      'pricing.professionalFeature2',
      'pricing.professionalFeature3',
      'pricing.professionalFeature4',
      'pricing.professionalFeature5',
      'pricing.professionalFeature6',
    ],
    popular: true,
    buttonVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'pricing.enterpriseDescription',
    price: {
      monthly: 399,
      yearly: 3990,
    },
    features: [
      'pricing.enterpriseFeature1',
      'pricing.enterpriseFeature2',
      'pricing.enterpriseFeature3',
      'pricing.enterpriseFeature4',
      'pricing.enterpriseFeature5',
      'pricing.enterpriseFeature6',
      'pricing.enterpriseFeature7',
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('pricing.heroTitle')}</h1>
              <p className="text-xl mb-8">{t('pricing.heroSubtitle')}</p>
            </div>
          </div>
        </div>
        
        {/* 价格计划 */}
        <SectionContainer>
          <div className="text-center mb-12">
            <PageHeader
              title={t('pricing.plansTitle')}
              description={t('pricing.plansSubtitle')}
            />
            
            {/* 计费周期切换 */}
            <div className="flex justify-center mt-8 mb-12">
              <Tabs 
                defaultValue="monthly" 
                value={billingCycle}
                onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
              >
                <TabsList>
                  <TabsTrigger value="monthly">{t('pricing.monthly')}</TabsTrigger>
                  <TabsTrigger value="yearly">{t('pricing.yearly')}</TabsTrigger>
                </TabsList>
              </Tabs>
              {billingCycle === 'yearly' && (
                <Badge variant="success" className="ml-2">
                  {t('pricing.savePercent')}
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
                    {t('pricing.mostPopular')}
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{t(`pricing.${plan.id}Title`)}</h3>
                  <p className="text-gray-600">{t(plan.description)}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {billingCycle === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-success-600 text-sm mt-2">
                      {t('pricing.monthlyEquivalent', { price: Math.round(plan.price.yearly / 12) })}
                    </p>
                  )}
                </div>
                
                <ul className="mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start mb-3">
                      <svg className="h-5 w-5 text-success-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant || 'primary'} 
                  size="lg" 
                  className="w-full mt-auto"
                >
                  {t('pricing.selectPlan')}
                </Button>
              </Card>
            ))}
          </div>
          
          {/* 企业定制 */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('pricing.customTitle')}</h3>
            <p className="text-lg mb-6 max-w-3xl mx-auto">{t('pricing.customDescription')}</p>
            <Button variant="primary" size="lg">
              {t('pricing.contactSales')}
            </Button>
          </div>
        </SectionContainer>
        
        {/* 功能比较 */}
        <div className="bg-gray-50 py-16">
          <SectionContainer>
            <PageHeader
              title={t('pricing.comparisonTitle')}
              description={t('pricing.comparisonSubtitle')}
            />
            
            <div className="overflow-x-auto">
              <table className="w-full mt-8 border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-4 px-6 text-left">{t('pricing.feature')}</th>
                    <th className="py-4 px-6 text-center">{t('pricing.basicTitle')}</th>
                    <th className="py-4 px-6 text-center">{t('pricing.professionalTitle')}</th>
                    <th className="py-4 px-6 text-center">{t('pricing.enterpriseTitle')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature1')}</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature2')}</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature3')}</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature4')}</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">✓</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature5')}</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">—</td>
                    <td className="py-4 px-6 text-center">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">{t('pricing.comparisonFeature6')}</td>
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
            title={t('pricing.faqTitle')}
            description={t('pricing.faqSubtitle')}
          />
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-8 border-b border-gray-200 pb-6 last:border-0">
                <h3 className="text-xl font-semibold mb-3">{t(faq.question)}</h3>
                <p className="text-gray-600">{t(faq.answer)}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
        
        {/* 行动召唤 */}
        <div className="bg-primary-50 py-16">
          <SectionContainer>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('pricing.ctaTitle')}</h2>
              <p className="text-lg mb-8">{t('pricing.ctaText')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="primary">
                  {t('pricing.startFreeTrial')}
                </Button>
                <Button size="lg" variant="outline">
                  {t('pricing.contactSales')}
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
