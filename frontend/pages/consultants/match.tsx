import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingState } from '../../components/ui/loading-state';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useConsultantStore, Consultant, MatchResult, ConsultantFilters } from '../../lib/store/zustand/useConsultantStore';
import { useGetConsultants, useMatchConsultants, mockConsultants, mockMatchResults } from '../../lib/api/services/consultant';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

const ConsultantMatchPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    consultants, 
    matchResults, 
    selectedConsultantId,
    filters,
    setConsultants, 
    setMatchResults,
    selectConsultant,
    setFilters,
    isLoading,
    error,
    setLoading,
    setError
  } = useConsultantStore();
  
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'experience' | 'price'>('match');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ConsultantFilters>(filters);
  
  const consultantsQuery = useGetConsultants(filters);
  const matchResultsQuery = useMatchConsultants(user?.id || '');
  
  useEffect(() => {
    if (consultantsQuery.isLoading || matchResultsQuery.isLoading) {
      setLoading(true);
    } else if (consultantsQuery.isError) {
      setError(consultantsQuery.error instanceof Error ? consultantsQuery.error.message : '获取顾问列表失败');
      setConsultants(mockConsultants);
      setMatchResults(mockMatchResults);
      setLoading(false);
    } else if (consultantsQuery.data && matchResultsQuery.data) {
      setConsultants(consultantsQuery.data);
      setMatchResults(matchResultsQuery.data);
      setLoading(false);
    } else {
      setConsultants(mockConsultants);
      setMatchResults(mockMatchResults);
      setLoading(false);
    }
  }, [consultantsQuery.isLoading, consultantsQuery.isError, consultantsQuery.data, matchResultsQuery.data]);
  
  const consultantsWithMatch = consultants.map(consultant => {
    const matchResult = matchResults.find(result => result.consultantId === consultant.id);
    return {
      ...consultant,
      matchScore: matchResult?.score || 0,
      matchReasons: matchResult?.matchReasons || [],
    };
  });
  
  const sortedConsultants = [...consultantsWithMatch].sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return b.matchScore - a.matchScore;
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience - a.experience;
      case 'price':
        return a.price.hourly - b.price.hourly;
      default:
        return 0;
    }
  });
  
  const handleSelectConsultant = (consultantId: string) => {
    selectConsultant(consultantId);
    router.push(`/consultants/book/${consultantId}`);
  };
  
  const handleApplyFilters = () => {
    setFilters(localFilters);
    setShowFilters(false);
  };
  
  const handleResetFilters = () => {
    setLocalFilters({});
  };
  
  const renderMatchScore = (score: number) => {
    let color = 'bg-gray-200';
    if (score >= 90) color = 'bg-green-500';
    else if (score >= 70) color = 'bg-green-400';
    else if (score >= 50) color = 'bg-yellow-400';
    else if (score >= 30) color = 'bg-orange-400';
    else color = 'bg-red-400';
    
    return (
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: color }}>
          {score}%
        </div>
      </div>
    );
  };
  
  const renderConsultantCard = (consultant: Consultant & { matchScore: number; matchReasons: MatchResult['matchReasons'] }) => {
    return (
      <Card key={consultant.id} className="p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 flex flex-col items-center">
          {renderMatchScore(consultant.matchScore)}
          <div className="mt-2 text-sm text-center">
            {t('consultants.match.matchScore')}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-medium">{consultant.name}</h3>
              <p className="text-gray-600">{consultant.title}{consultant.company ? ` · ${consultant.company}` : ''}</p>
            </div>
            
            <div className="flex items-center mt-2 md:mt-0">
              <div className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 font-medium">{consultant.rating}</span>
                <span className="ml-1 text-gray-500">({consultant.reviewCount})</span>
              </div>
              
              <div className="text-gray-600">
                {t('consultants.match.experience', { years: consultant.experience })}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {consultant.specialties.map(specialty => (
                <Badge key={specialty} variant="outline">
                  {t(`consultants.specialties.${specialty}`)}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {consultant.languages.map(language => (
                <Badge key={language} variant="secondary">
                  {t(`consultants.languages.${language}`)}
                </Badge>
              ))}
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-2">{consultant.bio}</p>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-2 md:mb-0">
              <div className="text-lg font-medium">
                {consultant.price.hourly} {consultant.price.currency}/{t('consultants.match.hour')}
              </div>
              <div className="text-sm text-gray-500">
                {t('consultants.match.successRate')}: {consultant.successRate}%
              </div>
            </div>
            
            <Button onClick={() => handleSelectConsultant(consultant.id)}>
              {t('consultants.match.bookConsultation')}
            </Button>
          </div>
          
          {consultant.matchReasons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-2">{t('consultants.match.whyMatch')}</h4>
              <ul className="text-sm text-gray-600">
                {consultant.matchReasons.map((reason, index) => (
                  <li key={index} className="mb-1 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{reason.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    );
  };
  
  const renderFilters = () => {
    return (
      <Card className={`p-6 mb-6 ${showFilters ? 'block' : 'hidden'}`}>
        <h3 className="text-lg font-medium mb-4">{t('consultants.filters.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('consultants.filters.specialties')}
            </label>
            <Select
              value={localFilters.specialties?.[0] || ''}
              onChange={(value) => setLocalFilters({
                ...localFilters,
                specialties: value ? [value] : undefined,
              })}
              options={[
                { value: '', label: t('consultants.filters.allSpecialties') },
                { value: 'express-entry', label: t('consultants.specialties.express-entry') },
                { value: 'skilled-worker', label: t('consultants.specialties.skilled-worker') },
                { value: 'family-sponsorship', label: t('consultants.specialties.family-sponsorship') },
                { value: 'business-immigration', label: t('consultants.specialties.business-immigration') },
                { value: 'refugee-claims', label: t('consultants.specialties.refugee-claims') },
                { value: 'appeals', label: t('consultants.specialties.appeals') }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('consultants.filters.languages')}
            </label>
            <Select
              value={localFilters.languages?.[0] || ''}
              onChange={(value) => setLocalFilters({
                ...localFilters,
                languages: value ? [value] : undefined,
              })}
              options={[
                { value: '', label: t('consultants.filters.allLanguages') },
                { value: 'zh', label: t('consultants.languages.zh') },
                { value: 'en', label: t('consultants.languages.en') },
                { value: 'fr', label: t('consultants.languages.fr') }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('consultants.filters.minRating')}
            </label>
            <Select
              value={localFilters.minRating?.toString() || ''}
              onChange={(value) => setLocalFilters({
                ...localFilters,
                minRating: value ? parseInt(value) : undefined,
              })}
              options={[
                { value: '', label: t('consultants.filters.anyRating') },
                { value: '5', label: `5 ${t('consultants.filters.stars')}` },
                { value: '4', label: `4+ ${t('consultants.filters.stars')}` },
                { value: '3', label: `3+ ${t('consultants.filters.stars')}` }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('consultants.filters.minExperience')}
            </label>
            <Select
              value={localFilters.minExperience?.toString() || ''}
              onChange={(value) => setLocalFilters({
                ...localFilters,
                minExperience: value ? parseInt(value) : undefined,
              })}
              options={[
                { value: '', label: t('consultants.filters.anyExperience') },
                { value: '10', label: `10+ ${t('consultants.filters.years')}` },
                { value: '5', label: `5+ ${t('consultants.filters.years')}` },
                { value: '3', label: `3+ ${t('consultants.filters.years')}` },
                { value: '1', label: `1+ ${t('consultants.filters.years')}` }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('consultants.filters.maxPrice')}
            </label>
            <Select
              value={localFilters.maxPrice?.toString() || ''}
              onChange={(value) => setLocalFilters({
                ...localFilters,
                maxPrice: value ? parseInt(value) : undefined,
              })}
              options={[
                { value: '', label: t('consultants.filters.anyPrice') },
                { value: '100', label: '≤ 100 CAD' },
                { value: '150', label: '≤ 150 CAD' },
                { value: '200', label: '≤ 200 CAD' },
                { value: '300', label: '≤ 300 CAD' }
              ]}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleResetFilters}>
            {t('consultants.filters.reset')}
          </Button>
          <Button onClick={handleApplyFilters}>
            {t('consultants.filters.apply')}
          </Button>
        </div>
      </Card>
    );
  };
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={t('consultants.match.title')}
        description={t('consultants.match.description')}
      />
      
      <SectionContainer>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 md:mb-0"
          >
            {showFilters ? t('consultants.filters.hideFilters') : t('consultants.filters.showFilters')}
          </Button>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm">{t('consultants.match.sortBy')}:</span>
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value as 'match' | 'rating' | 'experience' | 'price')}
              className="w-40"
              options={[
                { value: 'match', label: t('consultants.match.sortMatch') },
                { value: 'rating', label: t('consultants.match.sortRating') },
                { value: 'experience', label: t('consultants.match.sortExperience') },
                { value: 'price', label: t('consultants.match.sortPrice') }
              ]}
            />
          </div>
        </div>
        
        {renderFilters()}
        
        {isLoading ? (
          <LoadingState title={t('consultants.match.loading')} />
        ) : sortedConsultants.length === 0 ? (
          <EmptyState
            title={t('consultants.match.noConsultants')}
            description={t('consultants.match.noConsultantsDescription')}
          />
        ) : (
          <div className="space-y-6">
            {sortedConsultants.map(consultant => renderConsultantCard(consultant))}
          </div>
        )}
      </SectionContainer>
    </DashboardLayout>
  );
};

export default ConsultantMatchPage;
