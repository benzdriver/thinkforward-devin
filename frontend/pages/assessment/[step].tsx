import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { FormField } from '../../components/form/form-field';
import { Input } from '../../components/ui/input';
import { Radio } from '../../components/ui/radio';
import { Checkbox } from '../../components/ui/checkbox';
import { Select } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Alert } from '../../components/ui/alert';

const mockQuestions = {
  personal: [
    {
      id: 'age',
      type: 'number',
      question: 'assessment.questions.age',
      required: true,
    },
    {
      id: 'maritalStatus',
      type: 'select',
      question: 'assessment.questions.maritalStatus',
      options: [
        { value: 'single', label: 'assessment.options.single' },
        { value: 'married', label: 'assessment.options.married' },
        { value: 'commonLaw', label: 'assessment.options.commonLaw' },
        { value: 'divorced', label: 'assessment.options.divorced' },
        { value: 'widowed', label: 'assessment.options.widowed' },
      ],
      required: true,
    },
  ],
  education: [
    {
      id: 'highestEducation',
      type: 'select',
      question: 'assessment.questions.highestEducation',
      options: [
        { value: 'highSchool', label: 'assessment.options.highSchool' },
        { value: 'certificate', label: 'assessment.options.certificate' },
        { value: 'diploma', label: 'assessment.options.diploma' },
        { value: 'bachelors', label: 'assessment.options.bachelors' },
        { value: 'masters', label: 'assessment.options.masters' },
        { value: 'doctorate', label: 'assessment.options.doctorate' },
      ],
      required: true,
    },
    {
      id: 'studyField',
      type: 'text',
      question: 'assessment.questions.studyField',
      required: true,
    },
  ],
  workExperience: [
    {
      id: 'yearsOfExperience',
      type: 'number',
      question: 'assessment.questions.yearsOfExperience',
      required: true,
    },
    {
      id: 'occupation',
      type: 'text',
      question: 'assessment.questions.occupation',
      required: true,
    },
    {
      id: 'hasCanadianExperience',
      type: 'radio',
      question: 'assessment.questions.hasCanadianExperience',
      options: [
        { value: 'yes', label: 'assessment.options.yes' },
        { value: 'no', label: 'assessment.options.no' },
      ],
      required: true,
    },
  ],
  language: [
    {
      id: 'englishProficiency',
      type: 'select',
      question: 'assessment.questions.englishProficiency',
      options: [
        { value: 'none', label: 'assessment.options.none' },
        { value: 'basic', label: 'assessment.options.basic' },
        { value: 'intermediate', label: 'assessment.options.intermediate' },
        { value: 'advanced', label: 'assessment.options.advanced' },
        { value: 'fluent', label: 'assessment.options.fluent' },
        { value: 'native', label: 'assessment.options.native' },
      ],
      required: true,
    },
    {
      id: 'frenchProficiency',
      type: 'select',
      question: 'assessment.questions.frenchProficiency',
      options: [
        { value: 'none', label: 'assessment.options.none' },
        { value: 'basic', label: 'assessment.options.basic' },
        { value: 'intermediate', label: 'assessment.options.intermediate' },
        { value: 'advanced', label: 'assessment.options.advanced' },
        { value: 'fluent', label: 'assessment.options.fluent' },
        { value: 'native', label: 'assessment.options.native' },
      ],
      required: false,
    },
    {
      id: 'languageTest',
      type: 'checkbox',
      question: 'assessment.questions.languageTest',
      options: [
        { value: 'ielts', label: 'assessment.options.ielts' },
        { value: 'celpip', label: 'assessment.options.celpip' },
        { value: 'tef', label: 'assessment.options.tef' },
        { value: 'tcf', label: 'assessment.options.tcf' },
        { value: 'none', label: 'assessment.options.noTest' },
      ],
      required: true,
    },
  ],
  adaptability: [
    {
      id: 'familyInCanada',
      type: 'radio',
      question: 'assessment.questions.familyInCanada',
      options: [
        { value: 'yes', label: 'assessment.options.yes' },
        { value: 'no', label: 'assessment.options.no' },
      ],
      required: true,
    },
    {
      id: 'previousVisits',
      type: 'radio',
      question: 'assessment.questions.previousVisits',
      options: [
        { value: 'yes', label: 'assessment.options.yes' },
        { value: 'no', label: 'assessment.options.no' },
      ],
      required: true,
    },
    {
      id: 'additionalInfo',
      type: 'textarea',
      question: 'assessment.questions.additionalInfo',
      required: false,
    },
  ],
};

const steps = ['personal', 'education', 'workExperience', 'language', 'adaptability'];

const AssessmentStep = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { step } = router.query;
  
  const currentStepIndex = steps.indexOf(step as string);
  const currentStep = step as string;
  
  if (currentStepIndex === -1) {
    if (typeof window !== 'undefined') {
      router.push('/assessment/start');
    }
    return null;
  }
  
  const questions = mockQuestions[currentStep as keyof typeof mockQuestions] || [];
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    questions.forEach((question) => {
      if (question.required && !formData[question.id]) {
        newErrors[question.id] = t('assessment.errors.required');
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateForm()) {
      console.log('Form data for step', currentStep, formData);
      
      if (currentStepIndex === steps.length - 1) {
        router.push('/assessment/result/preview');
      } else {
        router.push(`/assessment/${steps[currentStepIndex + 1]}`);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      router.push(`/assessment/${steps[currentStepIndex - 1]}`);
    } else {
      router.push('/assessment/start');
    }
  };
  
  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <FormField
            id={question.id}
            key={question.id}
            label={t(question.question)}
            message={errors[question.id]}
            required={question.required}
          >
            <Input
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </FormField>
        );
        
      case 'number':
        return (
          <FormField
            id={question.id}
            key={question.id}
            label={t(question.question)}
            message={errors[question.id]}
            required={question.required}
          >
            <Input
              id={question.id}
              type="number"
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </FormField>
        );
        
      case 'select':
        return (
          <FormField
            id={question.id}
            key={question.id}
            label={t(question.question)}
            message={errors[question.id]}
            required={question.required}
          >
            <Select
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(value) => handleInputChange(question.id, value)}
              options={question.options.map((option: any) => ({
                value: option.value,
                label: t(option.label),
              }))}
              placeholder={t('assessment.placeholders.select') as string}
            />
          </FormField>
        );
        
      case 'radio':
        return (
          <FormField
            id={question.id}
            key={question.id}
            label={t(question.question)}
            message={errors[question.id]}
            required={question.required}
          >
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Radio
                    id={`${question.id}-${option.value}`}
                    name={question.id}
                    value={option.value}
                    checked={formData[question.id] === option.value}
                    onChange={() => handleInputChange(question.id, option.value)}
                  />
                  <label htmlFor={`${question.id}-${option.value}`}>
                    {t(option.label)}
                  </label>
                </div>
              ))}
            </div>
          </FormField>
        );
        
      case 'checkbox':
        return (
          <FormField
            id={question.id}
            key={question.id}
            label={t(question.question)}
            message={errors[question.id]}
            required={question.required}
          >
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option.value}`}
                    checked={
                      Array.isArray(formData[question.id]) &&
                      formData[question.id]?.includes(option.value)
                    }
                    onChange={(checked) => {
                      const currentValues = Array.isArray(formData[question.id])
                        ? [...formData[question.id]]
                        : [];
                      
                      if (checked) {
                        handleInputChange(question.id, [...currentValues, option.value]);
                      } else {
                        handleInputChange(
                          question.id,
                          currentValues.filter((v) => v !== option.value)
                        );
                      }
                    }}
                  />
                  <label htmlFor={`${question.id}-${option.value}`}>
                    {t(option.label)}
                  </label>
                </div>
              ))}
            </div>
          </FormField>
        );
        
      case 'textarea':
        return (
          <FormField
            id={question.id}
            key={question.id}
            label={t(question.question)}
            message={errors[question.id]}
            required={question.required}
          >
            <Textarea
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              rows={4}
            />
          </FormField>
        );
        
      default:
        return null;
    }
  };
  
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageHeader
          title={t(`assessment.steps.${currentStep}.title`)}
          description={t(`assessment.steps.${currentStep}.description`)}
        />
        
        <SectionContainer>
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                {t('assessment.progress', {
                  current: currentStepIndex + 1,
                  total: steps.length,
                })}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
          
          <Card className="p-6">
            <form>
              <div className="space-y-6">
                {questions.map(renderQuestion)}
                
                {Object.keys(errors).length > 0 && (
                  <Alert variant="error" className="mt-4">
                    {t('assessment.errors.pleaseFixErrors')}
                  </Alert>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    type="button"
                  >
                    {t('common.previous')}
                  </Button>
                  <Button onClick={handleNext} type="button">
                    {currentStepIndex === steps.length - 1
                      ? t('assessment.viewResults')
                      : t('common.next')}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </SectionContainer>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const { step } = query;
  
  if (!step || !steps.includes(step as string)) {
    return {
      redirect: {
        destination: '/assessment/start',
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default AssessmentStep;
