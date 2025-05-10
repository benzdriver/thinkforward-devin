import { GetServerSideProps } from 'next';
import { useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { FormField } from '../../components/form/form-field';

interface ImmigrationPathway {
  id: string;
  name: string;
  category: string;
  eligibility: 'high' | 'medium' | 'low';
  score: number;
  maxScore: number;
  processingTime: string;
  description: string;
  requirements: string[];
  benefits: string[];
  steps: string[];
}

const mockPathways: ImmigrationPathway[] = [
  {
    id: 'express-entry',
    name: 'Express Entry',
    category: 'skilled',
    eligibility: 'high',
    score: 450,
    maxScore: 600,
    processingTime: '6-12',
    description: 'pathways.expressEntry.description',
    requirements: [
      'pathways.expressEntry.requirements.education',
      'pathways.expressEntry.requirements.experience',
      'pathways.expressEntry.requirements.language',
    ],
    benefits: [
      'pathways.expressEntry.benefits.processing',
      'pathways.expressEntry.benefits.permanent',
      'pathways.expressEntry.benefits.family',
    ],
    steps: [
      'pathways.expressEntry.steps.profile',
      'pathways.expressEntry.steps.pool',
      'pathways.expressEntry.steps.invitation',
      'pathways.expressEntry.steps.application',
    ],
  },
  {
    id: 'pnp',
    name: 'Provincial Nominee Program',
    category: 'provincial',
    eligibility: 'medium',
    score: 65,
    maxScore: 100,
    processingTime: '12-18',
    description: 'pathways.pnp.description',
    requirements: [
      'pathways.pnp.requirements.skills',
      'pathways.pnp.requirements.intention',
      'pathways.pnp.requirements.criteria',
    ],
    benefits: [
      'pathways.pnp.benefits.targeted',
      'pathways.pnp.benefits.boost',
      'pathways.pnp.benefits.regional',
    ],
    steps: [
      'pathways.pnp.steps.research',
      'pathways.pnp.steps.application',
      'pathways.pnp.steps.nomination',
      'pathways.pnp.steps.federal',
    ],
  },
  {
    id: 'startup-visa',
    name: 'Start-up Visa Program',
    category: 'business',
    eligibility: 'medium',
    score: 70,
    maxScore: 100,
    processingTime: '18-24',
    description: 'pathways.startupVisa.description',
    requirements: [
      'pathways.startupVisa.requirements.business',
      'pathways.startupVisa.requirements.support',
      'pathways.startupVisa.requirements.language',
    ],
    benefits: [
      'pathways.startupVisa.benefits.entrepreneur',
      'pathways.startupVisa.benefits.family',
      'pathways.startupVisa.benefits.permanent',
    ],
    steps: [
      'pathways.startupVisa.steps.idea',
      'pathways.startupVisa.steps.support',
      'pathways.startupVisa.steps.application',
      'pathways.startupVisa.steps.arrival',
    ],
  },
  {
    id: 'family-sponsorship',
    name: 'Family Sponsorship',
    category: 'family',
    eligibility: 'high',
    score: 85,
    maxScore: 100,
    processingTime: '12-24',
    description: 'pathways.familySponsorship.description',
    requirements: [
      'pathways.familySponsorship.requirements.relationship',
      'pathways.familySponsorship.requirements.financial',
      'pathways.familySponsorship.requirements.sponsor',
    ],
    benefits: [
      'pathways.familySponsorship.benefits.reunification',
      'pathways.familySponsorship.benefits.support',
      'pathways.familySponsorship.benefits.permanent',
    ],
    steps: [
      'pathways.familySponsorship.steps.eligibility',
      'pathways.familySponsorship.steps.application',
      'pathways.familySponsorship.steps.processing',
      'pathways.familySponsorship.steps.arrival',
    ],
  },
  {
    id: 'canadian-experience',
    name: 'Canadian Experience Class',
    category: 'skilled',
    eligibility: 'high',
    score: 460,
    maxScore: 600,
    processingTime: '4-8',
    description: 'pathways.canadianExperience.description',
    requirements: [
      'pathways.canadianExperience.requirements.experience',
      'pathways.canadianExperience.requirements.language',
      'pathways.canadianExperience.requirements.residence',
    ],
    benefits: [
      'pathways.canadianExperience.benefits.faster',
      'pathways.canadianExperience.benefits.established',
      'pathways.canadianExperience.benefits.permanent',
    ],
    steps: [
      'pathways.canadianExperience.steps.experience',
      'pathways.canadianExperience.steps.profile',
      'pathways.canadianExperience.steps.invitation',
      'pathways.canadianExperience.steps.application',
    ],
  },
  {
    id: 'self-employed',
    name: 'Self-Employed Persons Program',
    category: 'business',
    eligibility: 'low',
    score: 55,
    maxScore: 100,
    processingTime: '24-36',
    description: 'pathways.selfEmployed.description',
    requirements: [
      'pathways.selfEmployed.requirements.experience',
      'pathways.selfEmployed.requirements.intention',
      'pathways.selfEmployed.requirements.contribution',
    ],
    benefits: [
      'pathways.selfEmployed.benefits.autonomy',
      'pathways.selfEmployed.benefits.cultural',
      'pathways.selfEmployed.benefits.permanent',
    ],
    steps: [
      'pathways.selfEmployed.steps.assessment',
      'pathways.selfEmployed.steps.application',
      'pathways.selfEmployed.steps.interview',
      'pathways.selfEmployed.steps.arrival',
    ],
  },
];

const pathwayCategories = [
  { value: 'all', label: 'pathways.categories.all' },
  { value: 'skilled', label: 'pathways.categories.skilled' },
  { value: 'business', label: 'pathways.categories.business' },
  { value: 'family', label: 'pathways.categories.family' },
  { value: 'provincial', label: 'pathways.categories.provincial' },
];

const eligibilityLevels = [
  { value: 'all', label: 'pathways.eligibility.all' },
  { value: 'high', label: 'pathways.eligibility.high' },
  { value: 'medium', label: 'pathways.eligibility.medium' },
  { value: 'low', label: 'pathways.eligibility.low' },
];

const processingTimes = [
  { value: 'all', label: 'pathways.processingTime.all' },
  { value: 'short', label: 'pathways.processingTime.short' },
  { value: 'medium', label: 'pathways.processingTime.medium' },
  { value: 'long', label: 'pathways.processingTime.long' },
];

const PathwaySelect = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEligibility, setSelectedEligibility] = useState('all');
  const [selectedProcessingTime, setSelectedProcessingTime] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
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
  
  const getProcessingTimeCategory = (time: string) => {
    const [min] = time.split('-').map(Number);
    if (min <= 8) return 'short';
    if (min <= 18) return 'medium';
    return 'long';
  };
  
  const filteredPathways: ImmigrationPathway[] = mockPathways.filter((pathway) => {
    if (
      searchTerm &&
      !pathway.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t(pathway.description).toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    if (selectedCategory !== 'all' && pathway.category !== selectedCategory) {
      return false;
    }
    
    if (selectedEligibility !== 'all' && pathway.eligibility !== selectedEligibility) {
      return false;
    }
    
    if (
      selectedProcessingTime !== 'all' &&
      getProcessingTimeCategory(pathway.processingTime) !== selectedProcessingTime
    ) {
      return false;
    }
    
    if (activeTab !== 'all' && pathway.category !== activeTab) {
      return false;
    }
    
    return true;
  });
  
  const renderFilters = () => {
    const categoryOptions = pathwayCategories.map(category => ({
      value: category.value,
      label: t(category.label) as string
    }));
    
    const eligibilityOptions = eligibilityLevels.map(level => ({
      value: level.value,
      label: t(level.label) as string
    }));
    
    const processingTimeOptions = processingTimes.map(time => ({
      value: time.value,
      label: t(time.label) as string
    }));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <FormField 
          id="search-filter" 
          label={t('pathways.filters.search') as string}
        >
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('pathways.filters.searchPlaceholder') as string}
          />
        </FormField>
        
        <FormField 
          id="category-filter" 
          label={t('pathways.filters.category') as string}
        >
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
          />
        </FormField>
        
        <FormField 
          id="eligibility-filter" 
          label={t('pathways.filters.eligibility') as string}
        >
          <Select
            options={eligibilityOptions}
            value={selectedEligibility}
            onChange={(value) => setSelectedEligibility(value)}
          />
        </FormField>
        
        <FormField 
          id="processing-time-filter" 
          label={t('pathways.filters.processingTime') as string}
        >
          <Select
            options={processingTimeOptions}
            value={selectedProcessingTime}
            onChange={(value) => setSelectedProcessingTime(value)}
          />
        </FormField>
      </div>
    );
  };
  
  const renderCategoryTabs = () => {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">{t('pathways.categories.all')}</TabsTrigger>
          <TabsTrigger value="skilled">
            {t('pathways.categories.skilled')}
          </TabsTrigger>
          <TabsTrigger value="business">
            {t('pathways.categories.business')}
          </TabsTrigger>
          <TabsTrigger value="family">
            {t('pathways.categories.family')}
          </TabsTrigger>
          <TabsTrigger value="provincial">
            {t('pathways.categories.provincial')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  };
  
  const renderPathwayCard = (pathway: ImmigrationPathway) => {
    return (
      <Card key={pathway.id} className="p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="mb-4 md:mb-0 md:flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-semibold mr-2">{pathway.name}</h3>
              <Badge variant={getEligibilityColor(pathway.eligibility)}>
                {t(`pathways.eligibility.${pathway.eligibility}`) as string}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-4">{t(pathway.description) as string}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>
                  {t('pathways.score') as string}: {pathway.score}/{pathway.maxScore}
                </span>
                <span>
                  {Math.round((pathway.score / pathway.maxScore) * 100)}%
                </span>
              </div>
              <Progress
                value={(pathway.score / pathway.maxScore) * 100}
                variant={getEligibilityColor(pathway.eligibility)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">{t('pathways.requirements') as string}</h4>
                <ul className="list-disc pl-5 text-gray-600">
                  {pathway.requirements.map((req, index) => (
                    <li key={index}>{t(req) as string}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">{t('pathways.benefits') as string}</h4>
                <ul className="list-disc pl-5 text-gray-600">
                  {pathway.benefits.map((benefit, index) => (
                    <li key={index}>{t(benefit) as string}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">{t('pathways.processingTime') as string}</h4>
                <p className="text-gray-600">
                  {t('pathways.months', { timeframe: pathway.processingTime }) as string}
                </p>
                
                <h4 className="font-medium mb-2 mt-4">{t('pathways.category') as string}</h4>
                <p className="text-gray-600">
                  {t(`pathways.categories.${pathway.category}`) as string}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">{t('pathways.steps') as string}</h4>
              <ol className="list-decimal pl-5 text-gray-600">
                {pathway.steps.map((step, index) => (
                  <li key={index}>{t(step) as string}</li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="md:ml-6 md:w-48 flex flex-col">
            <Button
              onClick={() => router.push(`/pathways/${pathway.id}`)}
              className="mb-2"
            >
              {t('pathways.viewDetails') as string}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/pathways/${pathway.id}/apply`)}
              className="mb-2"
            >
              {t('pathways.applyNow') as string}
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                router.push(`/consultants/match?pathway=${pathway.id}`)
              }
            >
              {t('pathways.findConsultant') as string}
            </Button>
          </div>
        </div>
      </Card>
    );
  };
  
  const renderNoResults = () => {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">
          {t('pathways.noResults.title')}
        </h3>
        <p className="text-gray-600 mb-4">
          {t('pathways.noResults.description')}
        </p>
        <Button onClick={() => {
          setSearchTerm('');
          setSelectedCategory('all');
          setSelectedEligibility('all');
          setSelectedProcessingTime('all');
          setActiveTab('all');
        }}>
          {t('pathways.noResults.reset')}
        </Button>
      </Card>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader
          title={t('pathways.title')}
          description={t('pathways.description')}
        />
        
        <SectionContainer>
          {renderFilters()}
          {renderCategoryTabs()}
          
          {filteredPathways.length > 0 ? (
            filteredPathways.map((pathway) => renderPathwayCard(pathway))
          ) : (
            renderNoResults()
          )}
          
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/assessment/start')}
            >
              {t('pathways.takeAssessment')}
            </Button>
            <Button onClick={() => router.push('/dashboard')}>
              {t('pathways.backToDashboard')}
            </Button>
          </div>
        </SectionContainer>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default PathwaySelect;
