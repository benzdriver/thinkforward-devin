import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

interface AssessmentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  questions: number;
}

const AssessmentStartPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const assessmentTypes: AssessmentType[] = [
    {
      id: 'comprehensive',
      title: t('assessment.types.comprehensive.title'),
      description: t('assessment.types.comprehensive.description'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-600"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      duration: t('assessment.types.comprehensive.duration'),
      questions: 25,
    },
    {
      id: 'express',
      title: t('assessment.types.express.title'),
      description: t('assessment.types.express.description'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-success-600"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      duration: t('assessment.types.express.duration'),
      questions: 10,
    },
    {
      id: 'targeted',
      title: t('assessment.types.targeted.title'),
      description: t('assessment.types.targeted.description'),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-warning-600"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      ),
      duration: t('assessment.types.targeted.duration'),
      questions: 15,
    },
  ];
  
  const faqs = [
    {
      question: t('assessment.faq.question1'),
      answer: t('assessment.faq.answer1'),
    },
    {
      question: t('assessment.faq.question2'),
      answer: t('assessment.faq.answer2'),
    },
    {
      question: t('assessment.faq.question3'),
      answer: t('assessment.faq.answer3'),
    },
    {
      question: t('assessment.faq.question4'),
      answer: t('assessment.faq.answer4'),
    },
    {
      question: t('assessment.faq.question5'),
      answer: t('assessment.faq.answer5'),
    },
  ];
  
  const handleTypeSelect = (id: string) => {
    setSelectedType(id);
  };
  
  const handleStartAssessment = () => {
    if (selectedType) {
      router.push(`/assessment/steps/1?type=${selectedType}`);
    }
  };
  
  return (
    <>
      <Head>
        <title>{t('assessment.startPage.title')} | ThinkForward AI</title>
        <meta name="description" content={t('assessment.startPage.metaDescription') as string} />
      </Head>
      
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title={t('assessment.startPage.title')}
            description={t('assessment.startPage.description')}
          />
          
          <SectionContainer className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assessmentTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedType === type.id
                      ? 'ring-2 ring-primary-500 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-3">{type.icon}</div>
                    <h3 className="text-lg font-semibold">{type.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {type.duration}
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      {type.questions} {t('assessment.questions')}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedType === type.id
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedType === type.id && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button
                variant="primary"
                size="lg"
                disabled={!selectedType}
                onClick={handleStartAssessment}
              >
                {t('assessment.startAssessment')}
              </Button>
              <p className="mt-2 text-sm text-gray-500">
                {t('assessment.startPage.disclaimer')}
              </p>
            </div>
          </SectionContainer>
          
          <SectionContainer>
            <h2 className="text-2xl font-bold mb-6">{t('assessment.howItWorks.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-primary-600 font-semibold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('assessment.howItWorks.step1.title')}</h3>
                <p className="text-gray-600">{t('assessment.howItWorks.step1.description')}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-primary-600 font-semibold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('assessment.howItWorks.step2.title')}</h3>
                <p className="text-gray-600">{t('assessment.howItWorks.step2.description')}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-primary-600 font-semibold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('assessment.howItWorks.step3.title')}</h3>
                <p className="text-gray-600">{t('assessment.howItWorks.step3.description')}</p>
              </div>
            </div>
          </SectionContainer>
          
          <SectionContainer className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('assessment.faq.title')}</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionContainer>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AssessmentStartPage;
