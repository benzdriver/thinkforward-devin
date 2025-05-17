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
    <MainLayout>
      <Head>
        <title>{t('pricing.pageTitle') || '价格方案'} | ThinkForward AI</title>
        <meta name="description" content={t('pricing.metaDescription') || '查看ThinkForward AI的价格方案，选择最适合您需求的方案。'} />
      </Head>
      
      {/* Hero Section - Airportr style */}
      <section className="hero-section bg-primary-900 text-white">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title">{t('pricing.heroTitle') || '简单透明的价格方案'}</h1>
            <p className="hero-subtitle">{t('pricing.heroSubtitle') || '选择最适合您需求的方案，随时可以升级或降级。'}</p>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('pricing.plansTitle') || '选择您的方案'}</h2>
            <p className="section-subtitle">{t('pricing.plansSubtitle') || '我们提供灵活的价格方案，满足不同规模和需求的客户'}</p>
          </div>
          
          {/* Billing Toggle */}
          <div className="billing-toggle">
            <div className="toggle-container">
              <button 
                className={`toggle-button ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                {t('pricing.monthly') || '月付'}
              </button>
              <button 
                className={`toggle-button ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                {t('pricing.yearly') || '年付'}
                {billingCycle === 'yearly' && (
                  <span className="save-badge">{t('pricing.savePercent') || '节省16%'}</span>
                )}
              </button>
            </div>
          </div>
          
          {/* Pricing Cards */}
          <div className="pricing-cards">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-badge">
                    {t('pricing.mostPopular') || '最受欢迎'}
                  </div>
                )}
                
                <div className="card-header">
                  <h3 className="plan-name">{t(`pricing.${plan.id}Title`) || plan.name}</h3>
                  <p className="plan-description">{t(plan.description) || `${plan.name} plan description`}</p>
                </div>
                
                <div className="price-container">
                  <div className="price">
                    <span className="amount">${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                    <span className="period">
                      {billingCycle === 'monthly' ? t('pricing.perMonth') || '/月' : t('pricing.perYear') || '/年'}
                    </span>
                  </div>
                  
                  {billingCycle === 'yearly' && (
                    <p className="yearly-savings">
                      {t('pricing.monthlyEquivalent', { price: Math.round(plan.price.yearly / 12) }) || `相当于每月 $${Math.round(plan.price.yearly / 12)}`}
                    </p>
                  )}
                </div>
                
                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t(feature) || `Feature ${index + 1}`}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="card-footer">
                  <button className={`btn ${plan.buttonVariant === 'primary' ? 'btn-primary' : plan.buttonVariant === 'secondary' ? 'btn-secondary' : 'btn-outline'}`}>
                    {t('pricing.selectPlan') || '选择此方案'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enterprise Custom */}
          <div className="enterprise-cta">
            <h3 className="enterprise-title">{t('pricing.customTitle') || '需要企业定制方案？'}</h3>
            <p className="enterprise-description">{t('pricing.customDescription') || '我们提供灵活的企业级定制方案，满足您的特定需求。联系我们的销售团队了解更多。'}</p>
            <button className="btn btn-primary">
              {t('pricing.contactSales') || '联系销售团队'}
            </button>
          </div>
        </div>
      </section>
      
      {/* Feature Comparison */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('pricing.comparisonTitle') || '功能比较'}</h2>
            <p className="section-subtitle">{t('pricing.comparisonSubtitle') || '查看不同方案之间的功能差异'}</p>
          </div>
          
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="feature-column">{t('pricing.feature') || '功能'}</th>
                  <th>{t('pricing.basicTitle') || '基础版'}</th>
                  <th>{t('pricing.professionalTitle') || '专业版'}</th>
                  <th>{t('pricing.enterpriseTitle') || '企业版'}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="feature-name">{t('pricing.comparisonFeature1') || '基本功能访问'}</td>
                  <td className="has-feature">✓</td>
                  <td className="has-feature">✓</td>
                  <td className="has-feature">✓</td>
                </tr>
                <tr>
                  <td className="feature-name">{t('pricing.comparisonFeature2') || '用户管理'}</td>
                  <td className="has-feature">✓</td>
                  <td className="has-feature">✓</td>
                  <td className="has-feature">✓</td>
                </tr>
                <tr>
                  <td className="feature-name">{t('pricing.comparisonFeature3') || '高级分析功能'}</td>
                  <td className="no-feature">—</td>
                  <td className="has-feature">✓</td>
                  <td className="has-feature">✓</td>
                </tr>
                <tr>
                  <td className="feature-name">{t('pricing.comparisonFeature4') || '优先客户支持'}</td>
                  <td className="no-feature">—</td>
                  <td className="has-feature">✓</td>
                  <td className="has-feature">✓</td>
                </tr>
                <tr>
                  <td className="feature-name">{t('pricing.comparisonFeature5') || '专属客户经理'}</td>
                  <td className="no-feature">—</td>
                  <td className="no-feature">—</td>
                  <td className="has-feature">✓</td>
                </tr>
                <tr>
                  <td className="feature-name">{t('pricing.comparisonFeature6') || '自定义集成'}</td>
                  <td className="no-feature">—</td>
                  <td className="no-feature">—</td>
                  <td className="has-feature">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('pricing.faqTitle') || '常见问题'}</h2>
            <p className="section-subtitle">{t('pricing.faqSubtitle') || '关于我们服务的常见问题解答'}</p>
          </div>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{t(faq.question) || `常见问题 ${index + 1}`}</h3>
                <p className="faq-answer">{t(faq.answer) || `这是常见问题 ${index + 1} 的回答。`}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-primary-50">
        <div className="container">
          <div className="cta-content text-center">
            <h2 className="cta-title">{t('pricing.ctaTitle') || '准备好开始了吗？'}</h2>
            <p className="cta-text">{t('pricing.ctaText') || '选择适合您的方案，立即开始使用我们的服务。'}</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                {t('pricing.startFreeTrial') || '开始免费试用'}
              </button>
              <button className="btn btn-outline">
                {t('pricing.contactSales') || '联系销售团队'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PricingPage;
