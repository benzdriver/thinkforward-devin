import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { PageHeader } from '../../../components/layout/page-header';
import { SectionContainer } from '../../../components/layout/section-container';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Radio } from '../../../components/ui/radio';
import { Checkbox } from '../../../components/ui/checkbox';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { FormField } from '../../../components/form/form-field';
import { DatePicker } from '../../../components/form/date-picker';
import { ModeSwitcher } from '../../../components/profile/mode-switcher';
import { TabsSimple } from '../../../components/profile/tabs-simple';
import { useProfileStore } from '../../../lib/store/zustand/useProfileStore';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  dateOfBirth: z.date(),
  nationality: z.string().min(1, { message: 'Nationality is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  province: z.string().min(1, { message: 'Province is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
});

const educationSchema = z.object({
  highestDegree: z.enum(['highSchool', 'diploma', 'bachelor', 'master', 'phd', 'other']),
  fieldOfStudy: z.string().min(1, { message: 'Field of study is required' }),
  institution: z.string().min(1, { message: 'Institution is required' }),
  graduationYear: z.string().min(4, { message: 'Graduation year is required' }),
  otherEducation: z.string().optional(),
});

const workExperienceSchema = z.object({
  occupation: z.string().min(1, { message: 'Occupation is required' }),
  yearsOfExperience: z.string().min(1, { message: 'Years of experience is required' }),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  skills: z.string().optional(),
});

const languageSchema = z.object({
  englishProficiency: z.enum(['none', 'basic', 'intermediate', 'advanced', 'fluent', 'native']),
  frenchProficiency: z.enum(['none', 'basic', 'intermediate', 'advanced', 'fluent', 'native']),
  otherLanguages: z.string().optional(),
  englishTest: z.enum(['none', 'ielts', 'celpip', 'toefl']).optional(),
  englishTestScore: z.string().optional(),
  frenchTest: z.enum(['none', 'tef', 'tcf']).optional(),
  frenchTestScore: z.string().optional(),
});

const immigrationSchema = z.object({
  targetCountry: z.string().min(1, { message: 'Target country is required' }),
  targetProvince: z.string().optional(),
  immigrationPurpose: z.enum(['work', 'study', 'family', 'business', 'refugee', 'other']),
  hasJobOffer: z.boolean(),
  hasFamilyInTargetCountry: z.boolean(),
  preferredImmigrationProgram: z.string().optional(),
  additionalInformation: z.string().optional(),
});

const profileSchema = z.object({
  personalInfo: personalInfoSchema,
  education: educationSchema,
  workExperience: workExperienceSchema,
  language: languageSchema,
  immigration: immigrationSchema,
});

type ProfileFormData = z.infer<typeof profileSchema>;

const FormProfilePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personalInfo');
  const { profile, updatePersonalInfo, updateEducationInfo, updateWorkExperience, updateLanguageSkills, updateImmigrationInfo, completionPercentage } = useProfileStore();

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      personalInfo: {
        firstName: profile.personalInfo?.firstName || '',
        lastName: profile.personalInfo?.lastName || '',
        email: profile.personalInfo?.email || '',
        phone: profile.personalInfo?.phone || '',
        dateOfBirth: profile.personalInfo?.dateOfBirth ? new Date(profile.personalInfo.dateOfBirth) : new Date(),
        nationality: profile.personalInfo?.nationality || '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
      },
      education: {
        highestDegree: (profile.educationInfo?.highestDegree as any) || 'bachelor',
        fieldOfStudy: profile.educationInfo?.fieldOfStudy || '',
        institution: profile.educationInfo?.institution || '',
        graduationYear: profile.educationInfo?.graduationYear || '',
        otherEducation: '',
      },
      workExperience: {
        occupation: profile.workExperience?.occupation || '',
        yearsOfExperience: profile.workExperience?.yearsOfExperience?.toString() || '',
        currentEmployer: profile.workExperience?.currentEmployer || '',
        jobTitle: profile.workExperience?.jobTitle || '',
        skills: '',
      },
      language: {
        englishProficiency: (profile.languageSkills?.englishProficiency as any) || 'intermediate',
        frenchProficiency: (profile.languageSkills?.frenchProficiency as any) || 'none',
        otherLanguages: Array.isArray(profile.languageSkills?.otherLanguages)
          ? profile.languageSkills.otherLanguages.join(', ')
          : '',
        englishTest: 'none',
        englishTestScore: '',
        frenchTest: 'none',
        frenchTestScore: '',
      },
      immigration: {
        targetCountry: profile.immigrationInfo?.desiredCountry || 'Canada',
        targetProvince: profile.immigrationInfo?.desiredProvince || '',
        immigrationPurpose: 'work',
        hasJobOffer: profile.immigrationInfo?.hasJobOffer || false,
        hasFamilyInTargetCountry: profile.immigrationInfo?.hasFamilyInCountry || false,
        preferredImmigrationProgram: profile.immigrationInfo?.immigrationPath || '',
        additionalInformation: '',
      },
    },
  });

  const { control, handleSubmit, formState: { errors }, watch, setValue } = methods;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name?.startsWith('personalInfo')) {
        const personalInfo = value.personalInfo;
        if (personalInfo) {
          updatePersonalInfo({
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            dateOfBirth: personalInfo.dateOfBirth ? personalInfo.dateOfBirth.toISOString() : undefined,
            nationality: personalInfo.nationality
          });
        }
      } else if (name?.startsWith('education')) {
        const education = value.education;
        if (education) {
          updateEducationInfo({
            highestDegree: education.highestDegree,
            fieldOfStudy: education.fieldOfStudy,
            institution: education.institution,
            graduationYear: education.graduationYear
          });
        }
      } else if (name?.startsWith('workExperience')) {
        const workExp = value.workExperience;
        if (workExp) {
          updateWorkExperience({
            occupation: workExp.occupation,
            yearsOfExperience: parseInt(workExp.yearsOfExperience || '0') || 0,
            currentEmployer: workExp.currentEmployer,
            jobTitle: workExp.jobTitle
          });
        }
      } else if (name?.startsWith('language')) {
        const lang = value.language;
        if (lang) {
          updateLanguageSkills({
            englishProficiency: lang.englishProficiency,
            frenchProficiency: lang.frenchProficiency,
            otherLanguages: lang.otherLanguages ? [lang.otherLanguages] : []
          });
        }
      } else if (name?.startsWith('immigration')) {
        const immigration = value.immigration;
        if (immigration) {
          updateImmigrationInfo({
            desiredCountry: immigration.targetCountry,
            desiredProvince: immigration.targetProvince,
            immigrationPath: immigration.preferredImmigrationProgram,
            hasJobOffer: immigration.hasJobOffer,
            hasFamilyInCountry: immigration.hasFamilyInTargetCountry
          });
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, updatePersonalInfo, updateEducationInfo, updateWorkExperience, updateLanguageSkills, updateImmigrationInfo]);

  const onSubmit = (data: ProfileFormData) => {
    console.log('Form submitted:', data);
    
    updatePersonalInfo({
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      dateOfBirth: data.personalInfo.dateOfBirth.toISOString(),
      nationality: data.personalInfo.nationality
    });
    
    updateEducationInfo({
      highestDegree: data.education.highestDegree,
      fieldOfStudy: data.education.fieldOfStudy,
      institution: data.education.institution,
      graduationYear: data.education.graduationYear
    });
    
    updateWorkExperience({
      occupation: data.workExperience.occupation,
      yearsOfExperience: parseInt(data.workExperience.yearsOfExperience || '0') || 0,
      currentEmployer: data.workExperience.currentEmployer || '',
      jobTitle: data.workExperience.jobTitle || ''
    });
    
    updateLanguageSkills({
      englishProficiency: data.language.englishProficiency,
      frenchProficiency: data.language.frenchProficiency,
      otherLanguages: data.language.otherLanguages ? [data.language.otherLanguages] : []
    });
    
    updateImmigrationInfo({
      desiredCountry: data.immigration.targetCountry,
      desiredProvince: data.immigration.targetProvince || '',
      immigrationPath: data.immigration.preferredImmigrationProgram || '',
      hasJobOffer: data.immigration.hasJobOffer,
      hasFamilyInCountry: data.immigration.hasFamilyInTargetCountry
    });
    
    router.push('/dashboard');
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'personalInfo', label: t('profile.categories.personalInfo') as string },
      { id: 'education', label: t('profile.categories.educationInfo') as string },
      { id: 'workExperience', label: t('profile.categories.workExperience') as string },
      { id: 'language', label: t('profile.categories.languageSkills') as string },
      { id: 'immigration', label: t('profile.categories.immigrationInfo') as string },
    ];

    return (
      <TabsSimple
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId: string) => setActiveTab(tabId)}
      />
    );
  };

  const renderPersonalInfoForm = () => {
    return (
      <div className={`space-y-6 ${activeTab !== 'personalInfo' ? 'hidden' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="personalInfo.firstName"
            label={t('profile.form.firstName') as string}
            message={errors.personalInfo?.firstName?.message}
          >
            <Controller
              name="personalInfo.firstName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t('profile.form.firstNamePlaceholder') as string} />
              )}
            />
          </FormField>

          <FormField
            id="personalInfo.lastName"
            label={t('profile.form.lastName') as string}
            message={errors.personalInfo?.lastName?.message}
          >
            <Controller
              name="personalInfo.lastName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t('profile.form.lastNamePlaceholder') as string} />
              )}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="personalInfo.email"
            label={t('profile.form.email') as string}
            message={errors.personalInfo?.email?.message}
          >
            <Controller
              name="personalInfo.email"
              control={control}
              render={({ field }) => (
                <Input {...field} type="email" placeholder={t('profile.form.emailPlaceholder') as string} />
              )}
            />
          </FormField>

          <FormField
            id="personalInfo.phone"
            label={t('profile.form.phone') as string}
            message={errors.personalInfo?.phone?.message}
          >
            <Controller
              name="personalInfo.phone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t('profile.form.phonePlaceholder') as string} />
              )}
            />
          </FormField>
        </div>

        <FormField
          id="personalInfo.dateOfBirth"
          label={t('profile.form.dateOfBirth') as string}
          message={errors.personalInfo?.dateOfBirth?.message}
        >
          <Controller
            name="personalInfo.dateOfBirth"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  field.onChange(date);
                }}
                placeholder={t('profile.form.dateOfBirthPlaceholder') as string}
              />
            )}
          />
        </FormField>

        <FormField
          id="personalInfo.nationality"
          label={t('profile.form.nationality') as string}
          message={errors.personalInfo?.nationality?.message}
        >
          <Controller
            name="personalInfo.nationality"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.nationalityPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="personalInfo.address"
          label={t('profile.form.address') as string}
          message={errors.personalInfo?.address?.message}
        >
          <Controller
            name="personalInfo.address"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder={t('profile.form.addressPlaceholder') as string} />
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            id="personalInfo.city"
            label={t('profile.form.city') as string}
            message={errors.personalInfo?.city?.message}
          >
            <Controller
              name="personalInfo.city"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t('profile.form.cityPlaceholder') as string} />
              )}
            />
          </FormField>

          <FormField
            id="personalInfo.province"
            label={t('profile.form.province') as string}
            message={errors.personalInfo?.province?.message}
          >
            <Controller
              name="personalInfo.province"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t('profile.form.provincePlaceholder') as string} />
              )}
            />
          </FormField>

          <FormField
            id="personalInfo.postalCode"
            label={t('profile.form.postalCode') as string}
            message={errors.personalInfo?.postalCode?.message}
          >
            <Controller
              name="personalInfo.postalCode"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder={t('profile.form.postalCodePlaceholder') as string} />
              )}
            />
          </FormField>
        </div>

        <FormField
          id="personalInfo.country"
          label={t('profile.form.country') as string}
          message={errors.personalInfo?.country?.message}
        >
          <Controller
            name="personalInfo.country"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.countryPlaceholder') as string} />
            )}
          />
        </FormField>
      </div>
    );
  };

  const renderEducationForm = () => {
    const degreeOptions = [
      { value: 'highSchool', label: t('profile.form.highSchool') as string },
      { value: 'diploma', label: t('profile.form.diploma') as string },
      { value: 'bachelor', label: t('profile.form.bachelor') as string },
      { value: 'master', label: t('profile.form.master') as string },
      { value: 'phd', label: t('profile.form.phd') as string },
      { value: 'other', label: t('profile.form.other') as string },
    ];

    return (
      <div className={`space-y-6 ${activeTab !== 'education' ? 'hidden' : ''}`}>
        <FormField
          id="education.highestDegree"
          label={t('profile.form.highestDegree') as string}
          message={errors.education?.highestDegree?.message}
        >
          <Controller
            name="education.highestDegree"
            control={control}
            render={({ field }) => (
              <Select
                options={degreeOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('profile.form.selectDegree') as string}
              />
            )}
          />
        </FormField>

        <FormField
          id="education.fieldOfStudy"
          label={t('profile.form.fieldOfStudy') as string}
          message={errors.education?.fieldOfStudy?.message}
        >
          <Controller
            name="education.fieldOfStudy"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.fieldOfStudyPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="education.institution"
          label={t('profile.form.institution') as string}
          message={errors.education?.institution?.message}
        >
          <Controller
            name="education.institution"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.institutionPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="education.graduationYear"
          label={t('profile.form.graduationYear') as string}
          message={errors.education?.graduationYear?.message}
        >
          <Controller
            name="education.graduationYear"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.graduationYearPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="education.otherEducation"
          label={t('profile.form.otherEducation') as string}
          message={errors.education?.otherEducation?.message}
        >
          <Controller
            name="education.otherEducation"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder={t('profile.form.otherEducationPlaceholder') as string} />
            )}
          />
        </FormField>
      </div>
    );
  };

  const renderWorkExperienceForm = () => {
    return (
      <div className={`space-y-6 ${activeTab !== 'workExperience' ? 'hidden' : ''}`}>
        <FormField
          id="workExperience.occupation"
          label={t('profile.form.occupation') as string}
          message={errors.workExperience?.occupation?.message}
        >
          <Controller
            name="workExperience.occupation"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.occupationPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="workExperience.yearsOfExperience"
          label={t('profile.form.yearsOfExperience') as string}
          message={errors.workExperience?.yearsOfExperience?.message}
        >
          <Controller
            name="workExperience.yearsOfExperience"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.yearsOfExperiencePlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="workExperience.currentEmployer"
          label={t('profile.form.currentEmployer') as string}
          message={errors.workExperience?.currentEmployer?.message}
        >
          <Controller
            name="workExperience.currentEmployer"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.currentEmployerPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="workExperience.jobTitle"
          label={t('profile.form.jobTitle') as string}
          message={errors.workExperience?.jobTitle?.message}
        >
          <Controller
            name="workExperience.jobTitle"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.jobTitlePlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="workExperience.skills"
          label={t('profile.form.skills') as string}
          message={errors.workExperience?.skills?.message}
        >
          <Controller
            name="workExperience.skills"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder={t('profile.form.skillsPlaceholder') as string} />
            )}
          />
        </FormField>
      </div>
    );
  };

  const renderLanguageForm = () => {
    const proficiencyOptions = [
      { value: 'none', label: t('profile.form.none') as string },
      { value: 'basic', label: t('profile.form.basic') as string },
      { value: 'intermediate', label: t('profile.form.intermediate') as string },
      { value: 'advanced', label: t('profile.form.advanced') as string },
      { value: 'fluent', label: t('profile.form.fluent') as string },
      { value: 'native', label: t('profile.form.native') as string },
    ];

    const englishTestOptions = [
      { value: 'none', label: t('profile.form.noTest') as string },
      { value: 'ielts', label: t('profile.form.ielts') as string },
      { value: 'celpip', label: t('profile.form.celpip') as string },
      { value: 'toefl', label: t('profile.form.toefl') as string },
    ];

    const frenchTestOptions = [
      { value: 'none', label: t('profile.form.noTest') as string },
      { value: 'tef', label: t('profile.form.tef') as string },
      { value: 'tcf', label: t('profile.form.tcf') as string },
    ];

    return (
      <div className={`space-y-6 ${activeTab !== 'language' ? 'hidden' : ''}`}>
        <FormField
          id="language.englishProficiency"
          label={t('profile.form.englishProficiency') as string}
          message={errors.language?.englishProficiency?.message}
        >
          <Controller
            name="language.englishProficiency"
            control={control}
            render={({ field }) => (
              <Select
                options={proficiencyOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('profile.form.selectProficiency') as string}
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="language.englishTest"
            label={t('profile.form.englishTest') as string}
            message={errors.language?.englishTest?.message}
          >
            <Controller
              name="language.englishTest"
              control={control}
              render={({ field }) => (
                <Select
                  options={englishTestOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('profile.form.selectTest') as string}
                />
              )}
            />
          </FormField>

          {watch('language.englishTest') !== 'none' && (
            <FormField
              id="language.englishTestScore"
              label={t('profile.form.englishTestScore') as string}
              message={errors.language?.englishTestScore?.message}
            >
              <Controller
                name="language.englishTestScore"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('profile.form.testScorePlaceholder') as string} />
                )}
              />
            </FormField>
          )}
        </div>

        <FormField
          id="language.frenchProficiency"
          label={t('profile.form.frenchProficiency') as string}
          message={errors.language?.frenchProficiency?.message}
        >
          <Controller
            name="language.frenchProficiency"
            control={control}
            render={({ field }) => (
              <Select
                options={proficiencyOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('profile.form.selectProficiency') as string}
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            id="language.frenchTest"
            label={t('profile.form.frenchTest') as string}
            message={errors.language?.frenchTest?.message}
          >
            <Controller
              name="language.frenchTest"
              control={control}
              render={({ field }) => (
                <Select
                  options={frenchTestOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('profile.form.selectTest') as string}
                />
              )}
            />
          </FormField>

          {watch('language.frenchTest') !== 'none' && (
            <FormField
              id="language.frenchTestScore"
              label={t('profile.form.frenchTestScore') as string}
              message={errors.language?.frenchTestScore?.message}
            >
              <Controller
                name="language.frenchTestScore"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('profile.form.testScorePlaceholder') as string} />
                )}
              />
            </FormField>
          )}
        </div>

        <FormField
          id="language.otherLanguages"
          label={t('profile.form.otherLanguages') as string}
          message={errors.language?.otherLanguages?.message}
        >
          <Controller
            name="language.otherLanguages"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder={t('profile.form.otherLanguagesPlaceholder') as string} />
            )}
          />
        </FormField>
      </div>
    );
  };

  const renderImmigrationForm = () => {
    const purposeOptions = [
      { value: 'work', label: t('profile.form.work') as string },
      { value: 'study', label: t('profile.form.study') as string },
      { value: 'family', label: t('profile.form.family') as string },
      { value: 'business', label: t('profile.form.business') as string },
      { value: 'refugee', label: t('profile.form.refugee') as string },
      { value: 'other', label: t('profile.form.other') as string },
    ];

    return (
      <div className={`space-y-6 ${activeTab !== 'immigration' ? 'hidden' : ''}`}>
        <FormField
          id="immigration.targetCountry"
          label={t('profile.form.targetCountry') as string}
          message={errors.immigration?.targetCountry?.message}
        >
          <Controller
            name="immigration.targetCountry"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.targetCountryPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="immigration.targetProvince"
          label={t('profile.form.targetProvince') as string}
          message={errors.immigration?.targetProvince?.message}
        >
          <Controller
            name="immigration.targetProvince"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.targetProvincePlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="immigration.immigrationPurpose"
          label={t('profile.form.immigrationPurpose') as string}
          message={errors.immigration?.immigrationPurpose?.message}
        >
          <Controller
            name="immigration.immigrationPurpose"
            control={control}
            render={({ field }) => (
              <Select
                options={purposeOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={t('profile.form.selectPurpose') as string}
              />
            )}
          />
        </FormField>

        <div className="space-y-4">
          <FormField
            id="immigration.hasJobOffer"
            label={t('profile.form.hasJobOffer') as string}
            message={errors.immigration?.hasJobOffer?.message}
          >
            <Controller
              name="immigration.hasJobOffer"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    id="hasJobOffer"
                  />
                  <label htmlFor="hasJobOffer" className="text-sm">
                    {t('profile.form.hasJobOfferLabel') as string}
                  </label>
                </div>
              )}
            />
          </FormField>

          <FormField
            id="immigration.hasFamilyInTargetCountry"
            label={t('profile.form.hasFamilyInTargetCountry') as string}
            message={errors.immigration?.hasFamilyInTargetCountry?.message}
          >
            <Controller
              name="immigration.hasFamilyInTargetCountry"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    id="hasFamilyInTargetCountry"
                  />
                  <label htmlFor="hasFamilyInTargetCountry" className="text-sm">
                    {t('profile.form.hasFamilyInTargetCountryLabel') as string}
                  </label>
                </div>
              )}
            />
          </FormField>
        </div>

        <FormField
          id="immigration.preferredImmigrationProgram"
          label={t('profile.form.preferredImmigrationProgram') as string}
          message={errors.immigration?.preferredImmigrationProgram?.message}
        >
          <Controller
            name="immigration.preferredImmigrationProgram"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('profile.form.preferredImmigrationProgramPlaceholder') as string} />
            )}
          />
        </FormField>

        <FormField
          id="immigration.additionalInformation"
          label={t('profile.form.additionalInformation') as string}
          message={errors.immigration?.additionalInformation?.message}
        >
          <Controller
            name="immigration.additionalInformation"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder={t('profile.form.additionalInformationPlaceholder') as string} />
            )}
          />
        </FormField>
      </div>
    );
  };

  const renderFormNavigation = () => {
    const isFirstTab = activeTab === 'personalInfo';
    const isLastTab = activeTab === 'immigration';

    const tabOrder = ['personalInfo', 'education', 'workExperience', 'language', 'immigration'];
    const currentTabIndex = tabOrder.indexOf(activeTab);

    const handlePrevious = () => {
      if (currentTabIndex > 0) {
        setActiveTab(tabOrder[currentTabIndex - 1]);
      }
    };

    const handleNext = () => {
      if (currentTabIndex < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentTabIndex + 1]);
      }
    };

    return (
      <div className="flex justify-between mt-8">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={isFirstTab}
        >
          {t('profile.form.previous') as string}
        </Button>

        {isLastTab ? (
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
          >
            {t('profile.form.saveAndContinue') as string}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
          >
            {t('profile.form.next') as string}
          </Button>
        )}
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="space-y-6">
        <ModeSwitcher currentMode="form" className="mb-6" />
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">{t('profile.form.progress') as string}</h3>
          <Progress value={completionPercentage} className="mb-4" />
          <p className="text-sm text-gray-500 mb-4">
            {completionPercentage}% {t('profile.form.completed') as string}
          </p>
          
          <div className="space-y-2">
            {['personalInfo', 'education', 'workExperience', 'language', 'immigration'].map((section) => (
              <div 
                key={section}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${activeTab === section ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveTab(section)}
              >
                <span className="text-sm">
                  {t(`profile.categories.${section}`) as string}
                </span>
                {section === activeTab && (
                  <Badge variant="primary">
                    {t('profile.form.current') as string}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">{t('profile.form.actions') as string}</h3>
          
          <div className="space-y-3">

            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => router.push('/dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              {t('common.backToDashboard') as string}
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                methods.reset();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {t('profile.form.resetForm') as string}
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={t('profile.form.title') as string}
        description={t('profile.form.description') as string}
      />

      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              {renderTabs()}

              <div className="mt-6">
                <form>
                  {renderPersonalInfoForm()}
                  {renderEducationForm()}
                  {renderWorkExperienceForm()}
                  {renderLanguageForm()}
                  {renderImmigrationForm()}

                  {renderFormNavigation()}
                </form>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {renderSidebar()}
          </div>
        </div>
      </SectionContainer>
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

export default FormProfilePage;
