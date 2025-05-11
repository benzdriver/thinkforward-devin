import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { Form, FormType, ValidationResult } from '../../store/zustand/useFormStore';

export const useGetFormTypes = () => {
  return useQuery({
    queryKey: ['formTypes'],
    queryFn: async () => {
      const response = await apiClient.get<FormType[]>('/forms/types');
      return response.data;
    },
  });
};

export const useGetForms = (userId: string) => {
  return useQuery({
    queryKey: ['forms', userId],
    queryFn: async () => {
      const response = await apiClient.get<Form[]>(`/forms/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useGetForm = (userId: string, formId: string) => {
  return useQuery({
    queryKey: ['forms', userId, formId],
    queryFn: async () => {
      const response = await apiClient.get<Form>(`/forms/${userId}/${formId}`);
      return response.data;
    },
    enabled: !!userId && !!formId,
  });
};

export const useGenerateForm = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ formType, options }: { formType: string; options?: Record<string, any> }) => {
      const response = await apiClient.post<Form>(`/forms/${userId}/generate`, {
        formType,
        options,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', userId] });
    },
  });
};

export const useUpdateForm = (userId: string, formId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: Record<string, any>) => {
      const response = await apiClient.put<Form>(`/forms/${userId}/${formId}`, {
        formData,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', userId, formId] });
      queryClient.invalidateQueries({ queryKey: ['forms', userId] });
    },
  });
};

export const useUpdateFormField = (userId: string, formId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ fieldPath, value }: { fieldPath: string; value: any }) => {
      const response = await apiClient.patch<{ success: boolean; validationResult: ValidationResult; updatedFormData: Record<string, any> }>(`/forms/${userId}/${formId}/field`, {
        fieldPath,
        value,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', userId, formId] });
    },
  });
};

export const useDownloadForm = (userId: string, formId: string) => {
  return useQuery({
    queryKey: ['forms', userId, formId, 'download'],
    queryFn: async () => {
      const response = await apiClient.get<{ downloadUrl: string }>(`/forms/${userId}/${formId}/download`);
      return response.data;
    },
    enabled: !!userId && !!formId,
  });
};

export const mockFormTypes: FormType[] = [
  {
    id: 'imm0008',
    name: 'IMM 0008 - 通用申请表',
    description: '加拿大移民申请的基础表格，几乎所有移民类别都需要填写',
    category: 'express-entry',
    requiredFields: ['personalInfo', 'contactInfo', 'passportInfo'],
    templateId: 'tpl-imm0008',
  },
  {
    id: 'imm5406',
    name: 'IMM 5406 - 附加家庭信息表',
    description: '提供有关申请人家庭成员的详细信息',
    category: 'family',
    requiredFields: ['familyMembers', 'dependents'],
    templateId: 'tpl-imm5406',
  },
  {
    id: 'imm5257',
    name: 'IMM 5257 - 访问签证申请表',
    description: '用于申请临时居民签证（访问签证）',
    category: 'visitor',
    requiredFields: ['travelInfo', 'purposeOfVisit'],
    templateId: 'tpl-imm5257',
  },
  {
    id: 'imm5645',
    name: 'IMM 5645 - 家庭关系表',
    description: '详细说明申请人的家庭关系',
    category: 'family',
    requiredFields: ['familyRelationships'],
    templateId: 'tpl-imm5645',
  },
  {
    id: 'imm5707',
    name: 'IMM 5707 - 家庭信息表',
    description: '提供申请人家庭背景的详细信息',
    category: 'family',
    requiredFields: ['familyBackground'],
    templateId: 'tpl-imm5707',
  },
];

export const mockFormTemplate = {
  imm0008: {
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      citizenship: '',
      gender: '',
      maritalStatus: '',
    },
    contactInfo: {
      address: '',
      city: '',
      country: '',
      postalCode: '',
      email: '',
      phone: '',
    },
    passportInfo: {
      passportNumber: '',
      issueDate: '',
      expiryDate: '',
      issueCountry: '',
    },
    immigrationHistory: {
      previousApplications: [],
      refusals: [],
      deportations: [],
    },
    educationHistory: [],
    employmentHistory: [],
    languageProficiency: {
      english: {
        speaking: '',
        listening: '',
        reading: '',
        writing: '',
      },
      french: {
        speaking: '',
        listening: '',
        reading: '',
        writing: '',
      },
    },
  },
};
