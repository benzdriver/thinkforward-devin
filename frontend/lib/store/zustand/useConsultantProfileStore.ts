import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ConsultantProfile {
  id: string;
  userId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  title: string;
  bio: string;
  shortBio: string;
  specialties: string[];
  languages: {
    language: string;
    proficiency: 'basic' | 'intermediate' | 'fluent' | 'native';
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    current: boolean;
    description?: string;
  }[];
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    location?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }[];
  skills: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
  services: {
    id: string;
    name: string;
    description: string;
    category: string;
    price?: number;
    pricingModel?: 'hourly' | 'fixed' | 'session';
    duration?: number; // 以分钟为单位
    isActive: boolean;
  }[];
  socialLinks: {
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'website' | 'other';
    url: string;
  }[];
  availability: {
    status: 'available' | 'limited' | 'unavailable';
    message?: string;
    acceptingNewClients: boolean;
    leadTime: number; // 预约提前天数
  };
  visibility: {
    profile: 'public' | 'clients_only' | 'private';
    contact: 'public' | 'clients_only' | 'private';
    availability: 'public' | 'clients_only' | 'private';
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultantProfileStats {
  viewCount: number;
  contactCount: number;
  bookingRate: number;
  completionRate: number;
  responseTime: number; // 以小时为单位
  popularServices: {
    serviceId: string;
    serviceName: string;
    bookingCount: number;
  }[];
  clientDemographics: {
    ageGroups: {
      range: string;
      percentage: number;
    }[];
    industries: {
      name: string;
      percentage: number;
    }[];
    locations: {
      name: string;
      percentage: number;
    }[];
  };
  monthlyStats: {
    month: string;
    views: number;
    contacts: number;
    bookings: number;
  }[];
}

interface ConsultantProfileState {
  profile: ConsultantProfile | null;
  stats: ConsultantProfileStats | null;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  editMode: boolean;
  
  setProfile: (profile: ConsultantProfile) => void;
  setStats: (stats: ConsultantProfileStats) => void;
  setActiveTab: (tab: string) => void;
  toggleEditMode: () => void;
  updateProfile: (updates: Partial<ConsultantProfile>) => void;
  addEducation: (education: Omit<ConsultantProfile['education'][0], 'id'>) => void;
  updateEducation: (id: string, updates: Partial<ConsultantProfile['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Omit<ConsultantProfile['experience'][0], 'id'>) => void;
  updateExperience: (id: string, updates: Partial<ConsultantProfile['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  addCertification: (certification: Omit<ConsultantProfile['certifications'][0], 'id'>) => void;
  updateCertification: (id: string, updates: Partial<ConsultantProfile['certifications'][0]>) => void;
  removeCertification: (id: string) => void;
  addService: (service: Omit<ConsultantProfile['services'][0], 'id'>) => void;
  updateService: (id: string, updates: Partial<ConsultantProfile['services'][0]>) => void;
  removeService: (id: string) => void;
  updateSkills: (skills: ConsultantProfile['skills']) => void;
  updateAvailability: (availability: ConsultantProfile['availability']) => void;
  updateVisibility: (visibility: ConsultantProfile['visibility']) => void;
  updateSocialLinks: (socialLinks: ConsultantProfile['socialLinks']) => void;
  resetState: () => void;
  
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState = {
  profile: null,
  stats: null,
  isLoading: false,
  error: null,
  activeTab: 'overview',
  editMode: false,
};

export const useConsultantProfileStore = create<ConsultantProfileState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setProfile: (profile) => set({ profile }),
        
        setStats: (stats) => set({ stats }),
        
        setActiveTab: (activeTab) => set({ activeTab }),
        
        toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
        
        updateProfile: (updates) => set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
        
        addEducation: (education) => set((state) => {
          if (!state.profile) return state;
          
          const newEducation = {
            ...education,
            id: `edu_${Date.now()}`,
          };
          
          return {
            profile: {
              ...state.profile,
              education: [...state.profile.education, newEducation],
            },
          };
        }),
        
        updateEducation: (id, updates) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              education: state.profile.education.map((edu) =>
                edu.id === id ? { ...edu, ...updates } : edu
              ),
            },
          };
        }),
        
        removeEducation: (id) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              education: state.profile.education.filter((edu) => edu.id !== id),
            },
          };
        }),
        
        addExperience: (experience) => set((state) => {
          if (!state.profile) return state;
          
          const newExperience = {
            ...experience,
            id: `exp_${Date.now()}`,
          };
          
          return {
            profile: {
              ...state.profile,
              experience: [...state.profile.experience, newExperience],
            },
          };
        }),
        
        updateExperience: (id, updates) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              experience: state.profile.experience.map((exp) =>
                exp.id === id ? { ...exp, ...updates } : exp
              ),
            },
          };
        }),
        
        removeExperience: (id) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              experience: state.profile.experience.filter((exp) => exp.id !== id),
            },
          };
        }),
        
        addCertification: (certification) => set((state) => {
          if (!state.profile) return state;
          
          const newCertification = {
            ...certification,
            id: `cert_${Date.now()}`,
          };
          
          return {
            profile: {
              ...state.profile,
              certifications: [...state.profile.certifications, newCertification],
            },
          };
        }),
        
        updateCertification: (id, updates) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              certifications: state.profile.certifications.map((cert) =>
                cert.id === id ? { ...cert, ...updates } : cert
              ),
            },
          };
        }),
        
        removeCertification: (id) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              certifications: state.profile.certifications.filter((cert) => cert.id !== id),
            },
          };
        }),
        
        addService: (service) => set((state) => {
          if (!state.profile) return state;
          
          const newService = {
            ...service,
            id: `svc_${Date.now()}`,
          };
          
          return {
            profile: {
              ...state.profile,
              services: [...state.profile.services, newService],
            },
          };
        }),
        
        updateService: (id, updates) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              services: state.profile.services.map((svc) =>
                svc.id === id ? { ...svc, ...updates } : svc
              ),
            },
          };
        }),
        
        removeService: (id) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              services: state.profile.services.filter((svc) => svc.id !== id),
            },
          };
        }),
        
        updateSkills: (skills) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              skills,
            },
          };
        }),
        
        updateAvailability: (availability) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              availability,
            },
          };
        }),
        
        updateVisibility: (visibility) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              visibility,
            },
          };
        }),
        
        updateSocialLinks: (socialLinks) => set((state) => {
          if (!state.profile) return state;
          
          return {
            profile: {
              ...state.profile,
              socialLinks,
            },
          };
        }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'consultant-profile-storage',
        partialize: (state) => ({
          activeTab: state.activeTab,
        }),
      }
    )
  )
);
