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
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingState } from '../../components/ui/loading-state';
import { Badge } from '../../components/ui/badge';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useFormStore, FormType } from '../../lib/store/zustand/useFormStore';
import { useGetFormTypes, useGenerateForm, mockFormTypes } from '../../lib/api/services/form';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

const FormGeneratePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    formTypes, 
    selectedFormType, 
    setFormTypes, 
    selectFormType,
    isLoading,
    error,
    setLoading,
    setError
  } = useFormStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  
  const formTypesQuery = useGetFormTypes();
  const generateFormMutation = useGenerateForm(user?.id || '');
  
  useEffect(() => {
    if (formTypesQuery.isLoading) {
      setLoading(true);
    } else if (formTypesQuery.isError) {
      setError(formTypesQuery.error instanceof Error ? formTypesQuery.error.message : '获取表格类型失败');
      setFormTypes(mockFormTypes);
      setLoading(false);
    } else if (formTypesQuery.data) {
      setFormTypes(formTypesQuery.data);
      setLoading(false);
    } else {
      setFormTypes(mockFormTypes);
      setLoading(false);
    }
  }, [formTypesQuery.isLoading, formTypesQuery.isError, formTypesQuery.data]);
  
  const filteredFormTypes = selectedCategory === 'all' 
    ? formTypes 
    : formTypes.filter(type => type.category === selectedCategory);
  
  const categories = Array.from(new Set(formTypes.map(type => type.category)));
  
  const handleSelectFormType = (formTypeId: string) => {
    selectFormType(formTypeId);
  };
  
  const handleGenerateForm = async () => {
    if (!selectedFormType) {
      setError('请先选择一个表格类型');
      return;
    }
    
    if (!user?.id) {
      setError('用户未登录');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await generateFormMutation.mutateAsync({
        formType: selectedFormType,
      });
      
      router.push(`/forms/preview/${result.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : '生成表格失败');
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={t('forms.generate.title')}
        description={t('forms.generate.description')}
        actions={
          <Button 
            onClick={handleGenerateForm}
            disabled={!selectedFormType || isLoading}
          >
            {t('forms.generate.generateButton')}
          </Button>
        }
      />
      
      <SectionContainer>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            {t('forms.categories.all')}
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {t(`forms.categories.${category}`)}
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <LoadingState title={t('forms.generate.loading')} />
        ) : filteredFormTypes.length === 0 ? (
          <EmptyState
            title={t('forms.generate.noForms')}
            description={t('forms.generate.noFormsDescription')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFormTypes.map((formType) => (
              <Card 
                key={formType.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedFormType === formType.id 
                    ? 'border-primary-500 ring-2 ring-primary-200' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleSelectFormType(formType.id)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-lg">{formType.name}</h3>
                    <Badge variant="outline">
                      {t(`forms.categories.${formType.category}`)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4 flex-grow">
                    {formType.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="text-xs text-gray-400 mb-1">
                      {t('forms.generate.requiredFields')}:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formType.requiredFields.map(field => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {t(`forms.fields.${field}`)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </SectionContainer>
    </DashboardLayout>
  );
};

export default FormGeneratePage;
