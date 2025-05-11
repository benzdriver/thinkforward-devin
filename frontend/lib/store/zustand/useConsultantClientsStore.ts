import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Client {
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
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  pendingClients: number;
  newClientsThisMonth: number;
  clientsBySource: {
    source: string;
    count: number;
  }[];
}

interface ConsultantClientsState {
  clients: Client[];
  stats: ClientStats | null;
  filters: {
    search: string;
    status: string | null;
    tags: string[];
    source: string | null;
    startDate: string | null;
    endDate: string | null;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
  
  setClients: (clients: Client[]) => void;
  setStats: (stats: ClientStats) => void;
  setFilters: (filters: Partial<ConsultantClientsState['filters']>) => void;
  setPagination: (pagination: Partial<ConsultantClientsState['pagination']>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  addClient: (client: Client) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  removeClient: (clientId: string) => void;
  resetFilters: () => void;
  resetState: () => void;
}

const initialFilters = {
  search: '',
  status: null,
  tags: [],
  source: null,
  startDate: null,
  endDate: null,
  sortBy: 'lastContactDate',
  sortOrder: 'desc' as const,
};

const initialPagination = {
  page: 1,
  limit: 20,
  total: 0,
};

const initialState = {
  clients: [],
  stats: null,
  filters: initialFilters,
  pagination: initialPagination,
  isLoading: false,
  error: null,
};

export const useConsultantClientsStore = create<ConsultantClientsState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setClients: (clients) => set({ clients }),
        
        setStats: (stats) => set({ stats }),
        
        setFilters: (filters) => set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
        
        setPagination: (pagination) => set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        addClient: (client) => set((state) => ({
          clients: [...state.clients, client],
          pagination: {
            ...state.pagination,
            total: state.pagination.total + 1,
          },
        })),
        
        updateClient: (clientId, updates) => set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId ? { ...client, ...updates } : client
          ),
        })),
        
        removeClient: (clientId) => set((state) => ({
          clients: state.clients.filter((client) => client.id !== clientId),
          pagination: {
            ...state.pagination,
            total: state.pagination.total - 1,
          },
        })),
        
        resetFilters: () => set({ filters: initialFilters, pagination: { ...initialPagination, total: initialState.pagination.total } }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'consultant-clients-storage',
        partialize: (state) => ({
          filters: state.filters,
          pagination: {
            limit: state.pagination.limit,
          },
        }),
      }
    )
  )
);
