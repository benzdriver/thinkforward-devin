import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Consultant {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  title: string;
  specializations: string[];
  languages: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }[];
  bio: string;
  experience: number; // 年数
  rating: number;
  reviewCount: number;
  availability: {
    availableDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    availableHours: {
      start: string; // 格式: "HH:MM"
      end: string; // 格式: "HH:MM"
    };
    timezone: string;
  };
  status: 'active' | 'away' | 'offline';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  activeClients: number;
  pendingAppointments: number;
  completedCases: number;
  averageRating: number;
  recentActivity: {
    type: 'message' | 'appointment' | 'document' | 'case_update';
    timestamp: string;
    description: string;
    relatedId: string;
    relatedType: 'client' | 'case' | 'appointment';
  }[];
  upcomingAppointments: {
    id: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    startTime: string;
    endTime: string;
    type: string;
    status: 'scheduled' | 'confirmed' | 'cancelled';
  }[];
  pendingTasks: {
    id: string;
    title: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    relatedId?: string;
    relatedType?: 'client' | 'case';
  }[];
}

interface ConsultantDashboardState {
  consultant: Consultant | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  setConsultant: (consultant: Consultant) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  updateConsultantStatus: (status: 'active' | 'away' | 'offline') => void;
  markTaskAsInProgress: (taskId: string) => void;
  markTaskAsCompleted: (taskId: string) => void;
  resetState: () => void;
}

const initialState = {
  consultant: null,
  stats: null,
  isLoading: false,
  error: null,
};

export const useConsultantDashboardStore = create<ConsultantDashboardState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setConsultant: (consultant) => set({ consultant }),
        
        setStats: (stats) => set({ stats }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        updateConsultantStatus: (status) => set((state) => ({
          consultant: state.consultant 
            ? { ...state.consultant, status, updatedAt: new Date().toISOString() } 
            : null,
        })),
        
        markTaskAsInProgress: (taskId) => set((state) => {
          if (!state.stats) return { stats: null };
          
          const updatedTasks = state.stats.pendingTasks.map((task) =>
            task.id === taskId ? { ...task, status: 'in_progress' as const } : task
          );
          
          return {
            stats: {
              ...state.stats,
              pendingTasks: updatedTasks,
            },
          };
        }),
        
        markTaskAsCompleted: (taskId) => set((state) => {
          if (!state.stats) return { stats: null };
          
          const updatedTasks = state.stats.pendingTasks.map((task) =>
            task.id === taskId ? { ...task, status: 'completed' as const } : task
          );
          
          return {
            stats: {
              ...state.stats,
              pendingTasks: updatedTasks,
            },
          };
        }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'consultant-dashboard-storage',
        partialize: (state) => ({
          consultant: state.consultant,
          stats: state.stats,
        }),
      }
    )
  )
);
