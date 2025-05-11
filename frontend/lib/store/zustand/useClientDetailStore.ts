import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ClientDetail {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  tags: string[];
  source: string;
  assignedConsultantId: string;
  lastContactDate: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth?: string;
  nationality?: string;
  occupation?: string;
  education?: {
    level: string;
    institution: string;
    major?: string;
    graduationYear?: number;
  }[];
  languages?: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  immigrationStatus?: string;
  immigrationGoals?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientNote {
  id: string;
  clientId: string;
  consultantId: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDocument {
  id: string;
  clientId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientAppointment {
  id: string;
  clientId: string;
  consultantId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'video' | 'phone';
  location?: string;
  videoLink?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientCase {
  id: string;
  clientId: string;
  consultantId: string;
  title: string;
  description: string;
  type: string;
  status: 'open' | 'in-progress' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  progress: number;
  tasks: {
    id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientActivity {
  id: string;
  clientId: string;
  consultantId: string;
  type: 'note' | 'document' | 'appointment' | 'case' | 'email' | 'call' | 'message';
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface ClientDetailState {
  client: ClientDetail | null;
  notes: ClientNote[];
  documents: ClientDocument[];
  appointments: ClientAppointment[];
  cases: ClientCase[];
  activities: ClientActivity[];
  activeTab: 'overview' | 'notes' | 'documents' | 'appointments' | 'cases' | 'activities';
  isLoading: {
    client: boolean;
    notes: boolean;
    documents: boolean;
    appointments: boolean;
    cases: boolean;
    activities: boolean;
  };
  error: {
    client: string | null;
    notes: string | null;
    documents: string | null;
    appointments: string | null;
    cases: string | null;
    activities: string | null;
  };
  pagination: {
    notes: { page: number; limit: number; total: number };
    documents: { page: number; limit: number; total: number };
    appointments: { page: number; limit: number; total: number };
    cases: { page: number; limit: number; total: number };
    activities: { page: number; limit: number; total: number };
  };
  filters: {
    documents: { category: string | null; status: string | null };
    appointments: { status: string | null; startDate: string | null; endDate: string | null };
    cases: { status: string | null };
    activities: { type: string | null; startDate: string | null; endDate: string | null };
  };
  
  setClient: (client: ClientDetail) => void;
  setNotes: (notes: ClientNote[]) => void;
  setDocuments: (documents: ClientDocument[]) => void;
  setAppointments: (appointments: ClientAppointment[]) => void;
  setCases: (cases: ClientCase[]) => void;
  setActivities: (activities: ClientActivity[]) => void;
  setActiveTab: (tab: ClientDetailState['activeTab']) => void;
  setLoading: (key: keyof ClientDetailState['isLoading'], isLoading: boolean) => void;
  setError: (key: keyof ClientDetailState['error'], error: string | null) => void;
  setPagination: <K extends keyof ClientDetailState['pagination']>(
    key: K,
    pagination: Partial<ClientDetailState['pagination'][K]>
  ) => void;
  setFilters: <K extends keyof ClientDetailState['filters']>(
    key: K,
    filters: Partial<ClientDetailState['filters'][K]>
  ) => void;
  
  addNote: (note: ClientNote) => void;
  updateNote: (noteId: string, updates: Partial<ClientNote>) => void;
  deleteNote: (noteId: string) => void;
  
  addDocument: (document: ClientDocument) => void;
  updateDocument: (documentId: string, updates: Partial<ClientDocument>) => void;
  deleteDocument: (documentId: string) => void;
  
  addAppointment: (appointment: ClientAppointment) => void;
  updateAppointment: (appointmentId: string, updates: Partial<ClientAppointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
  
  addCase: (clientCase: ClientCase) => void;
  updateCase: (caseId: string, updates: Partial<ClientCase>) => void;
  deleteCase: (caseId: string) => void;
  
  resetState: () => void;
}

const initialState = {
  client: null,
  notes: [],
  documents: [],
  appointments: [],
  cases: [],
  activities: [],
  activeTab: 'overview' as const,
  isLoading: {
    client: false,
    notes: false,
    documents: false,
    appointments: false,
    cases: false,
    activities: false,
  },
  error: {
    client: null,
    notes: null,
    documents: null,
    appointments: null,
    cases: null,
    activities: null,
  },
  pagination: {
    notes: { page: 1, limit: 20, total: 0 },
    documents: { page: 1, limit: 20, total: 0 },
    appointments: { page: 1, limit: 20, total: 0 },
    cases: { page: 1, limit: 20, total: 0 },
    activities: { page: 1, limit: 20, total: 0 },
  },
  filters: {
    documents: { category: null, status: null },
    appointments: { status: null, startDate: null, endDate: null },
    cases: { status: null },
    activities: { type: null, startDate: null, endDate: null },
  },
};

export const useClientDetailStore = create<ClientDetailState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setClient: (client) => set({ client }),
        
        setNotes: (notes) => set({ notes }),
        
        setDocuments: (documents) => set({ documents }),
        
        setAppointments: (appointments) => set({ appointments }),
        
        setCases: (cases) => set({ cases }),
        
        setActivities: (activities) => set({ activities }),
        
        setActiveTab: (activeTab) => set({ activeTab }),
        
        setLoading: (key, isLoading) => set((state) => ({
          isLoading: {
            ...state.isLoading,
            [key]: isLoading,
          },
        })),
        
        setError: (key, error) => set((state) => ({
          error: {
            ...state.error,
            [key]: error,
          },
        })),
        
        setPagination: (key, pagination) => set((state) => ({
          pagination: {
            ...state.pagination,
            [key]: {
              ...state.pagination[key],
              ...pagination,
            },
          },
        })),
        
        setFilters: (key, filters) => set((state) => ({
          filters: {
            ...state.filters,
            [key]: {
              ...state.filters[key],
              ...filters,
            },
          },
        })),
        
        addNote: (note) => set((state) => ({
          notes: [note, ...state.notes],
          pagination: {
            ...state.pagination,
            notes: {
              ...state.pagination.notes,
              total: state.pagination.notes.total + 1,
            },
          },
        })),
        
        updateNote: (noteId, updates) => set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId ? { ...note, ...updates } : note
          ),
        })),
        
        deleteNote: (noteId) => set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
          pagination: {
            ...state.pagination,
            notes: {
              ...state.pagination.notes,
              total: state.pagination.notes.total - 1,
            },
          },
        })),
        
        addDocument: (document) => set((state) => ({
          documents: [document, ...state.documents],
          pagination: {
            ...state.pagination,
            documents: {
              ...state.pagination.documents,
              total: state.pagination.documents.total + 1,
            },
          },
        })),
        
        updateDocument: (documentId, updates) => set((state) => ({
          documents: state.documents.map((document) =>
            document.id === documentId ? { ...document, ...updates } : document
          ),
        })),
        
        deleteDocument: (documentId) => set((state) => ({
          documents: state.documents.filter((document) => document.id !== documentId),
          pagination: {
            ...state.pagination,
            documents: {
              ...state.pagination.documents,
              total: state.pagination.documents.total - 1,
            },
          },
        })),
        
        addAppointment: (appointment) => set((state) => ({
          appointments: [appointment, ...state.appointments],
          pagination: {
            ...state.pagination,
            appointments: {
              ...state.pagination.appointments,
              total: state.pagination.appointments.total + 1,
            },
          },
        })),
        
        updateAppointment: (appointmentId, updates) => set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, ...updates } : appointment
          ),
        })),
        
        deleteAppointment: (appointmentId) => set((state) => ({
          appointments: state.appointments.filter((appointment) => appointment.id !== appointmentId),
          pagination: {
            ...state.pagination,
            appointments: {
              ...state.pagination.appointments,
              total: state.pagination.appointments.total - 1,
            },
          },
        })),
        
        addCase: (clientCase) => set((state) => ({
          cases: [clientCase, ...state.cases],
          pagination: {
            ...state.pagination,
            cases: {
              ...state.pagination.cases,
              total: state.pagination.cases.total + 1,
            },
          },
        })),
        
        updateCase: (caseId, updates) => set((state) => ({
          cases: state.cases.map((clientCase) =>
            clientCase.id === caseId ? { ...clientCase, ...updates } : clientCase
          ),
        })),
        
        deleteCase: (caseId) => set((state) => ({
          cases: state.cases.filter((clientCase) => clientCase.id !== caseId),
          pagination: {
            ...state.pagination,
            cases: {
              ...state.pagination.cases,
              total: state.pagination.cases.total - 1,
            },
          },
        })),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'client-detail-storage',
        partialize: (state) => ({
          activeTab: state.activeTab,
          pagination: {
            notes: { page: state.pagination.notes.page, limit: state.pagination.notes.limit },
            documents: { page: state.pagination.documents.page, limit: state.pagination.documents.limit },
            appointments: { page: state.pagination.appointments.page, limit: state.pagination.appointments.limit },
            cases: { page: state.pagination.cases.page, limit: state.pagination.cases.limit },
            activities: { page: state.pagination.activities.page, limit: state.pagination.activities.limit },
          },
          filters: state.filters,
        }),
      }
    )
  )
);
