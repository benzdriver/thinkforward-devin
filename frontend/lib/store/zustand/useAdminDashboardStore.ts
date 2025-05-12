import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useAdminDashboardData } from '../../api/services/admin-dashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'consultant' | 'client';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  activeConsultants: number;
  consultantGrowth: number;
  completedAssessments: number;
  assessmentGrowth: number;
  totalSessions: number;
  sessionGrowth: number;
  averageRating: number;
  revenueThisMonth: number;
  revenueGrowth: number;
}

export interface SystemHealthMetric {
  name: string;
  description: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  threshold: number;
  details?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  lastChecked: string;
  metrics: SystemHealthMetric[];
}

export interface SystemActivity {
  id: string;
  type: 'user' | 'system' | 'security';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface AdminDashboardState {
  stats: DashboardStats | null;
  users: User[] | null;
  recentActivities: SystemActivity[] | null;
  systemHealth: SystemHealth | null;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  
  setStats: (stats: DashboardStats) => void;
  setUsers: (users: User[]) => void;
  setRecentActivities: (activities: SystemActivity[]) => void;
  setSystemHealth: (health: SystemHealth) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDashboardData: () => Promise<void>;
  resetState: () => void;
}

const initialState = {
  stats: null,
  users: null,
  recentActivities: null,
  systemHealth: null,
  isLoading: false,
  error: null,
  activeTab: 'users',
};

export const useAdminDashboardStore = create<AdminDashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setStats: (stats) => set({ stats }),
        
        setUsers: (users) => set({ users }),
        
        setRecentActivities: (activities) => set({ recentActivities: activities }),
        
        setSystemHealth: (health) => set({ systemHealth: health }),
        
        setActiveTab: (tab) => set({ activeTab: tab }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        fetchDashboardData: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const { fetchAdminDashboardData } = useAdminDashboardData();
            const data = await fetchAdminDashboardData();
            
            set({
              stats: data.stats,
              users: data.users,
              recentActivities: data.activities,
              systemHealth: data.health,
              isLoading: false,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '获取管理员仪表盘数据失败',
            });
          }
        },
        
        resetState: () => set(initialState),
      }),
      {
        name: 'admin-dashboard-storage',
        partialize: (state) => ({
          activeTab: state.activeTab,
        }),
      }
    )
  )
);
