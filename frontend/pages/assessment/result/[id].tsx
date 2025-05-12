import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { PageHeader } from '../../../components/layout/page-header';
import { SectionContainer } from '../../../components/layout/section-container';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { Tabs } from '../../../components/ui/tabs';
import { Accordion } from '../../../components/ui/accordion';

const mockAssessmentResult = {
  id: 'preview',
  score: 78,
  date: '2025-05-10',
  eligibility: 'high',
  recommendedPathways: [
    {
      id: 'express-entry',
      name: 'Express Entry',
      score: 450,
      maxScore: 600,
      eligibility: 'high',
      description: 'assessment.results.pathways.expressEntry.description',
      requirements: 'assessment.results.pathways.expressEntry.requirements',
      timeframe: '6-12',
      nextSteps: [
        'assessment.results.pathways.expressEntry.nextSteps.1',
        'assessment.results.pathways.expressEntry.nextSteps.2',
        'assessment.results.pathways.expressEntry.nextSteps.3',
      ],
    },
    {
      id: 'pnp',
      name: 'Provincial Nominee Program',
      score: 65,
      maxScore: 100,
      eligibility: 'medium',
      description: 'assessment.results.pathways.pnp.description',
      requirements: 'assessment.results.pathways.pnp.requirements',
      timeframe: '12-18',
      nextSteps: [
        'assessment.results.pathways.pnp.nextSteps.1',
        'assessment.results.pathways.pnp.nextSteps.2',
        'assessment.results.pathways.pnp.nextSteps.3',
      ],
    },
    {
      id: 'startup-visa',
      name: 'Start-up Visa Program',
      score: 55,
      maxScore: 100,
      eligibility: 'low',
      description: 'assessment.results.pathways.startupVisa.description',
      requirements: 'assessment.results.pathways.startupVisa.requirements',
      timeframe: '18-24',
      nextSteps: [
        'assessment.results.pathways.startupVisa.nextSteps.1',
        'assessment.results.pathways.startupVisa.nextSteps.2',
        'assessment.results.pathways.startupVisa.nextSteps.3',
      ],
    },
  ],
  scoreBreakdown: [
    {
      category: 'age',
      score: 20,
      maxScore: 25,
      details: 'assessment.results.breakdown.age',
    },
    {
      category: 'education',
      score: 22,
      maxScore: 25,
      details: 'assessment.results.breakdown.education',
    },
    {
      category: 'workExperience',
      score: 12,
      maxScore: 15,
      details: 'assessment.results.breakdown.workExperience',
    },
    {
      category: 'language',
      score: 18,
      maxScore: 25,
      details: 'assessment.results.breakdown.language',
    },
    {
      category: 'adaptability',
      score: 6,
      maxScore: 10,
      details: 'assessment.results.breakdown.adaptability',
    },
  ],
  faqs: [
    {
      question: 'assessment.results.faqs.timeframe.question',
      answer: 'assessment.results.faqs.timeframe.answer',
    },
    {
      question: 'assessment.results.faqs.improve.question',
      answer: 'assessment.results.faqs.improve.answer',
    },
    {
      question: 'assessment.results.faqs.consultant.question',
      answer: 'assessment.results.faqs.consultant.answer',
    },
  ],
};

const AssessmentResult = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  
  const result = mockAssessmentResult;
  
  const [activeTab, setActiveTab] = useState('pathways');
  
  const getEligibilityColor = (eligibility: string) => {
    switch (eligibility) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  const renderScoreCard = () => {
    return (
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {t('assessment.results.overallScore')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('assessment.results.scoreDescription')}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{result.score}</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={
                    result.eligibility === 'high'
                      ? '#22c55e'
                      : result.eligibility === 'medium'
                      ? '#f59e0b'
                      : '#ef4444'
                  }
                  strokeWidth="3"
                  strokeDasharray={`${result.score}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <Badge
              variant={getEligibilityColor(result.eligibility) as any}
              className="mt-2"
            >
              {t(`assessment.results.eligibility.${result.eligibility}`)}
            </Badge>
          </div>
        </div>
      </Card>
    );
  };
  
  const renderPathways = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          {t('assessment.results.recommendedPathways')}
        </h3>
        
        {result.recommendedPathways.map((pathway) => (
          <Card key={pathway.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="mb-4 md:mb-0 md:flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="text-lg font-semibold mr-2">{pathway.name}</h4>
                  <Badge
                    variant={getEligibilityColor(pathway.eligibility) as any}
                  >
                    {t(`assessment.results.eligibility.${pathway.eligibility}`)}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{t(pathway.description)}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>
                      {t('assessment.results.score')}: {pathway.score}/
                      {pathway.maxScore}
                    </span>
                    <span>
                      {Math.round((pathway.score / pathway.maxScore) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(pathway.score / pathway.maxScore) * 100}
                    variant={getEligibilityColor(pathway.eligibility) as any}
                  />
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">
                    {t('assessment.results.requirements')}
                  </h5>
                  <p className="text-gray-600">{t(pathway.requirements)}</p>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">
                    {t('assessment.results.timeframe')}
                  </h5>
                  <p className="text-gray-600">
                    {t('assessment.results.months', {
                      timeframe: pathway.timeframe,
                    })}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">
                    {t('assessment.results.nextSteps')}
                  </h5>
                  <ul className="list-disc pl-5 text-gray-600">
                    {pathway.nextSteps.map((step, index) => (
                      <li key={index}>{t(step)}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="md:ml-6 md:w-48 flex flex-col">
                <Button
                  onClick={() => router.push(`/pathways/${pathway.id}`)}
                  className="mb-2"
                >
                  {t('assessment.results.explorePathway')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/consultants/match?pathway=${pathway.id}`)
                  }
                >
                  {t('assessment.results.findConsultant')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderScoreBreakdown = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          {t('assessment.results.scoreBreakdown')}
        </h3>
        
        <Card className="p-6">
          <div className="space-y-6">
            {result.scoreBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">
                      {t(`assessment.categories.${item.category}`)}
                    </h4>
                    <p className="text-sm text-gray-500">{t(item.details)}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">
                      {item.score}/{item.maxScore}
                    </span>
                  </div>
                </div>
                <Progress
                  value={(item.score / item.maxScore) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };
  
  const renderFAQs = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          {t('assessment.results.faqs.title')}
        </h3>
        
        <Card className="p-6">
          <Accordion type="single" collapsible>
            {result.faqs.map((faq, index) => (
              <Accordion.Item key={index} value={`item-${index}`}>
                <Accordion.Trigger>{t(faq.question)}</Accordion.Trigger>
                <Accordion.Content>
                  <p className="text-gray-600">{t(faq.answer)}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageHeader
          title={t('assessment.results.title')}
          description={t('assessment.results.description')}
        />
        
        <SectionContainer>
          {renderScoreCard()}
          
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <Tabs.List>
              <Tabs.Trigger value="pathways">
                {t('assessment.results.tabs.pathways')}
              </Tabs.Trigger>
              <Tabs.Trigger value="breakdown">
                {t('assessment.results.tabs.breakdown')}
              </Tabs.Trigger>
              <Tabs.Trigger value="faqs">
                {t('assessment.results.tabs.faqs')}
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
          
          {activeTab === 'pathways' && renderPathways()}
          {activeTab === 'breakdown' && renderScoreBreakdown()}
          {activeTab === 'faqs' && renderFAQs()}
          
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/assessment/start')}
            >
              {t('assessment.results.retakeAssessment')}
            </Button>
            <Button onClick={() => router.push('/dashboard')}>
              {t('assessment.results.backToDashboard')}
            </Button>
          </div>
        </SectionContainer>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const { id } = query;
  
  if (id !== 'preview') {
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default AssessmentResult;
