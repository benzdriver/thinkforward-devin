import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ValidationResult {
  fieldPath: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code: string;
}

export interface FormType {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredFields: string[];
  templateId: string;
}

export interface Form {
  id: string;
  userId: string;
  formType: string;
  formData: Record<string, any>;
  status: 'generating' | 'completed' | 'error';
  validationResults: ValidationResult[];
  generatedDate: string;
  lastUpdated: string;
  downloadUrl?: string;
  version: number;
}

interface FormState {
  forms: Form[];
  formTypes: FormType[];
  selectedFormType: string | null;
  currentForm: Form | null;
  isLoading: boolean;
  error: string | null;
  
  setForms: (forms: Form[]) => void;
  setFormTypes: (formTypes: FormType[]) => void;
  selectFormType: (formTypeId: string) => void;
  setCurrentForm: (form: Form | null) => void;
  addForm: (form: Form) => void;
  updateForm: (formId: string, updates: Partial<Form>) => void;
  updateFormField: (formId: string, fieldPath: string, value: any) => void;
  removeForm: (formId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const initialState = {
  forms: [],
  formTypes: [],
  selectedFormType: null,
  currentForm: null,
  isLoading: false,
  error: null,
};

export const useFormStore = create<FormState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setForms: (forms) => set({ forms }),
        
        setFormTypes: (formTypes) => set({ formTypes }),
        
        selectFormType: (formTypeId) => set({ selectedFormType: formTypeId }),
        
        setCurrentForm: (form) => set({ currentForm: form }),
        
        addForm: (form) => set((state) => ({ 
          forms: [...state.forms, form] 
        })),
        
        updateForm: (formId, updates) => set((state) => ({
          forms: state.forms.map((form) => 
            form.id === formId ? { ...form, ...updates } : form
          ),
          currentForm: state.currentForm?.id === formId 
            ? { ...state.currentForm, ...updates } 
            : state.currentForm
        })),
        
        updateFormField: (formId, fieldPath, value) => set((state) => {
          const updateFormData = (form: Form) => {
            const newFormData = { ...form.formData };
            
            const pathParts = fieldPath.split('.');
            let current = newFormData;
            
            for (let i = 0; i < pathParts.length - 1; i++) {
              const part = pathParts[i];
              if (!current[part]) {
                current[part] = {};
              }
              current = current[part];
            }
            
            const lastPart = pathParts[pathParts.length - 1];
            current[lastPart] = value;
            
            return newFormData;
          };
          
          return {
            forms: state.forms.map((form) => 
              form.id === formId 
                ? { 
                    ...form, 
                    formData: updateFormData(form),
                    lastUpdated: new Date().toISOString()
                  } 
                : form
            ),
            currentForm: state.currentForm?.id === formId 
              ? { 
                  ...state.currentForm, 
                  formData: updateFormData(state.currentForm),
                  lastUpdated: new Date().toISOString()
                } 
              : state.currentForm
          };
        }),
        
        removeForm: (formId) => set((state) => ({
          forms: state.forms.filter((form) => form.id !== formId),
          currentForm: state.currentForm?.id === formId ? null : state.currentForm
        })),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'form-storage',
        partialize: (state) => ({
          forms: state.forms,
          formTypes: state.formTypes,
        }),
      }
    )
  )
);
