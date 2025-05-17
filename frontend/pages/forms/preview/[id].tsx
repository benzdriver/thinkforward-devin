import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { PageHeader } from '../../../components/layout/page-header';
import { SectionContainer } from '../../../components/layout/section-container';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Alert } from '../../../components/ui/alert';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { LoadingState } from '../../../components/ui/loading-state';
import { FormField } from '../../../components/form/form-field';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useFormStore, ValidationResult, Form } from '../../../lib/store/zustand/useFormStore';
import { useGetForm, useUpdateFormField, useDownloadForm, mockFormTemplate } from '../../../lib/api/services/form';

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
      formId: params?.id || '',
    },
  };
};

interface FormPreviewPageProps {
  formId: string;
}

const FormPreviewPage: React.FC<FormPreviewPageProps> = ({ formId }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    forms, 
    currentForm, 
    setCurrentForm, 
    updateFormField,
    isLoading,
    error,
    setLoading,
    setError
  } = useFormStore();
  
  const [activeTab, setActiveTab] = useState('form');
  const [editMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationResult[]>([]);
  
  const formQuery = useGetForm(user?.id || '', formId);
  const updateFieldMutation = useUpdateFormField(user?.id || '', formId);
  const downloadFormQuery = useDownloadForm(user?.id || '', formId);
  
  useEffect(() => {
    if (formQuery.isLoading) {
      setLoading(true);
    } else if (formQuery.isError) {
      setError(formQuery.error instanceof Error ? formQuery.error.message : '获取表格详情失败');
      
      const mockForm: Form = {
        id: formId,
        userId: user?.id || '',
        formType: 'imm0008',
        formData: mockFormTemplate.imm0008,
        status: 'completed',
        validationResults: [],
        generatedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: 1,
      };
      
      setCurrentForm(mockForm);
      setLoading(false);
    } else if (formQuery.data) {
      setCurrentForm(formQuery.data);
      setValidationErrors(formQuery.data.validationResults);
      setLoading(false);
    }
  }, [formQuery.isLoading, formQuery.isError, formQuery.data]);
  
  const handleFieldChange = async (fieldPath: string, value: any) => {
    if (!editMode) return;
    
    updateFormField(formId, fieldPath, value);
    
    try {
      const result = await updateFieldMutation.mutateAsync({ fieldPath, value });
      
      if (result.validationResult) {
        setValidationErrors(prev => {
          const filtered = prev.filter(item => item.fieldPath !== fieldPath);
          if (result.validationResult.message) {
            return [...filtered, result.validationResult];
          }
          return filtered;
        });
      }
    } catch (error) {
      console.error('更新字段失败', error);
    }
  };
  
  const handleDownload = () => {
    if (downloadFormQuery.data?.downloadUrl) {
      window.open(downloadFormQuery.data.downloadUrl, '_blank');
    } else {
      setError('下载链接不可用');
    }
  };
  
  const handleBackToList = () => {
    router.push('/forms/generate');
  };
  
  const renderFormField = (fieldPath: string, label: string, type: string, options?: any) => {
    if (!currentForm) return null;
    
    const getNestedValue = (obj: any, path: string) => {
      const parts = path.split('.');
      let current = obj;
      
      for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
      }
      
      return current;
    };
    
    const value = getNestedValue(currentForm.formData, fieldPath);
    const fieldError = validationErrors.find(err => err.fieldPath === fieldPath);
    
    switch (type) {
      case 'text':
        return (
          <FormField
            id={fieldPath}
            label={t(`forms.fields.${label}`)}
            message={fieldError?.message}
            messageVariant={fieldError?.severity}
          >
            <Input
              value={value || ''}
              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
              disabled={!editMode}
            />
          </FormField>
        );
        
      case 'textarea':
        return (
          <FormField
            id={fieldPath}
            label={t(`forms.fields.${label}`)}
            message={fieldError?.message}
            messageVariant={fieldError?.severity}
          >
            <Textarea
              value={value || ''}
              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
              disabled={!editMode}
            />
          </FormField>
        );
        
      case 'select':
        return (
          <FormField
            id={fieldPath}
            label={t(`forms.fields.${label}`)}
            message={fieldError?.message}
            messageVariant={fieldError?.severity}
          >
            <Select
              value={value || ''}
              onChange={(value) => handleFieldChange(fieldPath, value)}
              disabled={!editMode}
              options={[
                { value: '', label: t('forms.select.placeholder') as string },
                ...(options?.map((option: string) => ({
                  value: option,
                  label: t(`forms.options.${option}`) as string
                })) || [])
              ]}
            />
          </FormField>
        );
        
      case 'checkbox':
        return (
          <FormField
            id={fieldPath}
            label=""
            message={fieldError?.message}
            messageVariant={fieldError?.severity}
          >
            <div className="flex items-center">
              <Checkbox
                id={fieldPath}
                checked={value || false}
                onChange={(e) => handleFieldChange(fieldPath, e.target.checked)}
                disabled={!editMode}
              />
              <label htmlFor={fieldPath} className="ml-2 text-sm">
                {t(`forms.fields.${label}`)}
              </label>
            </div>
          </FormField>
        );
        
      default:
        return null;
    }
  };
  
  const renderFormSection = (section: string, fields: { path: string; label: string; type: string; options?: any[] }[]) => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{t(`forms.sections.${section}`)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.path} className="col-span-1">
              {renderFormField(field.path, field.label, field.type, field.options)}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderValidationSummary = () => {
    if (validationErrors.length === 0) return null;
    
    const errors = validationErrors.filter(err => err.severity === 'error');
    const warnings = validationErrors.filter(err => err.severity === 'warning');
    const infos = validationErrors.filter(err => err.severity === 'info');
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('forms.preview.validationSummary')}</h3>
        
        {errors.length > 0 && (
          <div className="mb-3">
            <h4 className="text-red-600 font-medium text-sm mb-1">{t('forms.preview.errors')}</h4>
            <ul className="list-disc pl-5">
              {errors.map((err, index) => (
                <li key={index} className="text-sm text-red-600">
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {warnings.length > 0 && (
          <div className="mb-3">
            <h4 className="text-amber-600 font-medium text-sm mb-1">{t('forms.preview.warnings')}</h4>
            <ul className="list-disc pl-5">
              {warnings.map((err, index) => (
                <li key={index} className="text-sm text-amber-600">
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {infos.length > 0 && (
          <div>
            <h4 className="text-blue-600 font-medium text-sm mb-1">{t('forms.preview.infos')}</h4>
            <ul className="list-disc pl-5">
              {infos.map((err, index) => (
                <li key={index} className="text-sm text-blue-600">
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={currentForm ? t('forms.preview.title', { formName: currentForm.formType }) : t('forms.preview.loading')}
        description={t('forms.preview.description')}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={handleBackToList}
            >
              {t('forms.preview.backToList')}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? t('forms.preview.viewMode') : t('forms.preview.editMode')}
            </Button>
            
            <Button 
              onClick={handleDownload}
              disabled={isLoading || !currentForm}
            >
              {t('forms.preview.download')}
            </Button>
          </div>
        }
      />
      
      <SectionContainer>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        {isLoading ? (
          <LoadingState title={t('forms.preview.loading')} />
        ) : currentForm ? (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between">
              <div>
                <Badge variant={currentForm.status === 'completed' ? 'success' : currentForm.status === 'error' ? 'destructive' : 'info'}>
                  {t(`forms.status.${currentForm.status}`)}
                </Badge>
                <span className="ml-2 text-sm text-gray-500">
                  {t('forms.preview.lastUpdated')}: {new Date(currentForm.lastUpdated).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  {t('forms.preview.version')}: {currentForm.version}
                </span>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="form">{t('forms.preview.formTab')}</TabsTrigger>
                <TabsTrigger value="validation">{t('forms.preview.validationTab')}</TabsTrigger>
                <TabsTrigger value="pdf">{t('forms.preview.pdfTab')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="pt-4">
                <Card className="p-6">
                  {currentForm.formType === 'imm0008' && (
                    <>
                      {renderFormSection('personalInfo', [
                        { path: 'personalInfo.firstName', label: 'firstName', type: 'text' },
                        { path: 'personalInfo.lastName', label: 'lastName', type: 'text' },
                        { path: 'personalInfo.dateOfBirth', label: 'dateOfBirth', type: 'text' },
                        { path: 'personalInfo.placeOfBirth', label: 'placeOfBirth', type: 'text' },
                        { path: 'personalInfo.citizenship', label: 'citizenship', type: 'text' },
                        { path: 'personalInfo.gender', label: 'gender', type: 'select', options: ['male', 'female', 'other'] },
                        { path: 'personalInfo.maritalStatus', label: 'maritalStatus', type: 'select', options: ['single', 'married', 'divorced', 'widowed'] },
                      ])}
                      
                      {renderFormSection('contactInfo', [
                        { path: 'contactInfo.address', label: 'address', type: 'textarea' },
                        { path: 'contactInfo.city', label: 'city', type: 'text' },
                        { path: 'contactInfo.country', label: 'country', type: 'text' },
                        { path: 'contactInfo.postalCode', label: 'postalCode', type: 'text' },
                        { path: 'contactInfo.email', label: 'email', type: 'text' },
                        { path: 'contactInfo.phone', label: 'phone', type: 'text' },
                      ])}
                      
                      {renderFormSection('passportInfo', [
                        { path: 'passportInfo.passportNumber', label: 'passportNumber', type: 'text' },
                        { path: 'passportInfo.issueDate', label: 'issueDate', type: 'text' },
                        { path: 'passportInfo.expiryDate', label: 'expiryDate', type: 'text' },
                        { path: 'passportInfo.issueCountry', label: 'issueCountry', type: 'text' },
                      ])}
                    </>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="validation" className="pt-4">
                <Card className="p-6">
                  {renderValidationSummary()}
                  
                  {validationErrors.length === 0 && (
                    <div className="text-center py-8">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-12 w-12 text-green-500 mx-auto mb-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-green-600 mb-2">
                        {t('forms.preview.validationSuccess')}
                      </h3>
                      <p className="text-gray-500">
                        {t('forms.preview.validationSuccessDesc')}
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="pdf" className="pt-4">
                <Card className="p-6">
                  <div className="text-center py-8">
                    {downloadFormQuery.data?.downloadUrl ? (
                      <div className="h-[600px] border rounded">
                        <iframe 
                          src={downloadFormQuery.data.downloadUrl} 
                          className="w-full h-full" 
                          title={`${currentForm.formType} PDF`}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-12 w-12 text-gray-400 mx-auto mb-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        <h3 className="text-lg font-medium mb-2">
                          {t('forms.preview.pdfNotAvailable')}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {t('forms.preview.pdfNotAvailableDesc')}
                        </p>
                        <Button onClick={handleDownload}>
                          {t('forms.preview.generatePdf')}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {t('forms.preview.formNotFound')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('forms.preview.formNotFoundDesc')}
            </p>
            <Button onClick={handleBackToList}>
              {t('forms.preview.backToList')}
            </Button>
          </div>
        )}
      </SectionContainer>
    </DashboardLayout>
  );
};

export default FormPreviewPage;
