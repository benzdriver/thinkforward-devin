import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProfileData = {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
    passportNumber?: string;
    email?: string;
    phone?: string;
  };
  educationInfo?: {
    highestDegree?: string;
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: string;
  };
  workExperience?: {
    occupation?: string;
    yearsOfExperience?: number;
    currentEmployer?: string;
    jobTitle?: string;
  };
  languageSkills?: {
    englishProficiency?: string;
    frenchProficiency?: string;
    otherLanguages?: string[];
  };
  immigrationInfo?: {
    desiredCountry?: string;
    desiredProvince?: string;
    immigrationPath?: string;
    hasJobOffer?: boolean;
    hasFamilyInCountry?: boolean;
  };
};

export type ProfileState = {
  profile: ProfileData;
  isComplete: boolean;
  completionPercentage: number;
  lastUpdated: string | null;
};

export type ProfileActions = {
  updatePersonalInfo: (data: Partial<ProfileData['personalInfo']>) => void;
  updateEducationInfo: (data: Partial<ProfileData['educationInfo']>) => void;
  updateWorkExperience: (data: Partial<ProfileData['workExperience']>) => void;
  updateLanguageSkills: (data: Partial<ProfileData['languageSkills']>) => void;
  updateImmigrationInfo: (data: Partial<ProfileData['immigrationInfo']>) => void;
  resetProfile: () => void;
  calculateCompletionStatus: () => void;
};

export type ProfileStore = ProfileState & ProfileActions;

const calculateCompletion = (profile: Partial<ProfileData>): number => {
  const sections = [
    'personalInfo',
    'educationInfo',
    'workExperience',
    'languageSkills',
    'immigrationInfo',
  ];
  
  let totalFields = 0;
  let completedFields = 0;
  
  sections.forEach(section => {
    if (profile[section as keyof ProfileData]) {
      const sectionData = profile[section as keyof ProfileData] as Record<string, any>;
      const sectionFields = Object.keys(sectionData);
      
      totalFields += sectionFields.length;
      completedFields += sectionFields.filter(field => {
        const value = sectionData[field];
        return value !== undefined && value !== null && value !== '';
      }).length;
    }
  });
  
  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: { personalInfo: {} },
      isComplete: false,
      completionPercentage: 0,
      lastUpdated: null,
      
      updatePersonalInfo: (data) => {
        set((state) => ({
          ...state,
          profile: {
            ...state.profile,
            personalInfo: {
              ...state.profile.personalInfo,
              ...data,
            },
          },
          lastUpdated: new Date().toISOString(),
        }));
        get().calculateCompletionStatus();
      },
      
      updateEducationInfo: (data) => {
        set((state) => ({
          ...state,
          profile: {
            ...state.profile,
            educationInfo: {
              ...state.profile.educationInfo,
              ...data,
            },
          },
          lastUpdated: new Date().toISOString(),
        }));
        get().calculateCompletionStatus();
      },
      
      updateWorkExperience: (data) => {
        set((state) => ({
          ...state,
          profile: {
            ...state.profile,
            workExperience: {
              ...state.profile.workExperience,
              ...data,
            },
          },
          lastUpdated: new Date().toISOString(),
        }));
        get().calculateCompletionStatus();
      },
      
      updateLanguageSkills: (data) => {
        set((state) => ({
          ...state,
          profile: {
            ...state.profile,
            languageSkills: {
              ...state.profile.languageSkills,
              ...data,
            },
          },
          lastUpdated: new Date().toISOString(),
        }));
        get().calculateCompletionStatus();
      },
      
      updateImmigrationInfo: (data) => {
        set((state) => ({
          ...state,
          profile: {
            ...state.profile,
            immigrationInfo: {
              ...state.profile.immigrationInfo,
              ...data,
            },
          },
          lastUpdated: new Date().toISOString(),
        }));
        get().calculateCompletionStatus();
      },
      
      resetProfile: () => {
        set({
          profile: { personalInfo: {} },
          isComplete: false,
          completionPercentage: 0,
          lastUpdated: new Date().toISOString(),
        });
      },
      
      calculateCompletionStatus: () => {
        const { profile } = get();
        const completionPercentage = calculateCompletion(profile);
        const isComplete = completionPercentage === 100;
        
        set({
          completionPercentage,
          isComplete,
        });
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);
