import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CaseListItem {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  type: string;
  status: 'open' | 'in-progress' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDetail extends CaseListItem {
  description: string;
  consultantId: string;
  consultantName: string;
  notes: CaseNote[];
  documents: CaseDocument[];
  tasks: CaseTask[];
  timeline: CaseTimelineEvent[];
}

export interface CaseNote {
  id: string;
  caseId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseTask {
  id: string;
  caseId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseTimelineEvent {
  id: string;
  caseId: string;
  type: 'status_change' | 'note_added' | 'document_added' | 'task_created' | 'task_completed' | 'comment_added';
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface CaseStats {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  pendingCases: number;
  closedCases: number;
  archivedCases: number;
  casesByType: {
    type: string;
    count: number;
  }[];
  casesByPriority: {
    priority: 'low' | 'medium' | 'high';
    count: number;
  }[];
  upcomingDeadlines: {
    caseId: string;
    caseTitle: string;
    clientName: string;
    dueDate: string;
  }[];
}

interface CasesState {
  cases: CaseListItem[];
  caseDetail: CaseDetail | null;
  stats: CaseStats | null;
  caseTypes: string[];
  
  filters: {
    search: string;
    status: string | null;
    type: string | null;
    priority: string | null;
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
  
  viewMode: 'table' | 'grid';
  selectedCaseIds: string[];
  isCreateModalOpen: boolean;
  isDetailDrawerOpen: boolean;
  activeDetailTab: 'overview' | 'tasks' | 'notes' | 'documents' | 'timeline';
  
  isLoading: {
    cases: boolean;
    caseDetail: boolean;
    stats: boolean;
    tasks: boolean;
    notes: boolean;
    documents: boolean;
    timeline: boolean;
  };
  
  error: {
    cases: string | null;
    caseDetail: string | null;
    stats: string | null;
    tasks: string | null;
    notes: string | null;
    documents: string | null;
    timeline: string | null;
  };
  
  setCases: (cases: CaseListItem[]) => void;
  setCaseDetail: (caseDetail: CaseDetail | null) => void;
  setStats: (stats: CaseStats) => void;
  setCaseTypes: (types: string[]) => void;
  
  setFilters: (filters: Partial<CasesState['filters']>) => void;
  setPagination: (pagination: Partial<CasesState['pagination']>) => void;
  
  setViewMode: (mode: 'table' | 'grid') => void;
  setSelectedCaseIds: (ids: string[]) => void;
  toggleCaseSelection: (id: string) => void;
  clearSelectedCases: () => void;
  
  setCreateModalOpen: (isOpen: boolean) => void;
  setDetailDrawerOpen: (isOpen: boolean) => void;
  setActiveDetailTab: (tab: CasesState['activeDetailTab']) => void;
  
  setLoading: (key: keyof CasesState['isLoading'], isLoading: boolean) => void;
  setError: (key: keyof CasesState['error'], error: string | null) => void;
  
  addCase: (caseItem: CaseListItem) => void;
  updateCase: (caseId: string, updates: Partial<CaseListItem>) => void;
  removeCase: (caseId: string) => void;
  
  addTask: (task: CaseTask) => void;
  updateTask: (taskId: string, updates: Partial<CaseTask>) => void;
  removeTask: (taskId: string) => void;
  
  addNote: (note: CaseNote) => void;
  updateNote: (noteId: string, updates: Partial<CaseNote>) => void;
  removeNote: (noteId: string) => void;
  
  addDocument: (document: CaseDocument) => void;
  updateDocument: (documentId: string, updates: Partial<CaseDocument>) => void;
  removeDocument: (documentId: string) => void;
  
  resetFilters: () => void;
  resetState: () => void;
}

const initialFilters = {
  search: '',
  status: null,
  type: null,
  priority: null,
  startDate: null,
  endDate: null,
  sortBy: 'updatedAt',
  sortOrder: 'desc' as const,
};

const initialPagination = {
  page: 1,
  limit: 20,
  total: 0,
};

const initialIsLoading = {
  cases: false,
  caseDetail: false,
  stats: false,
  tasks: false,
  notes: false,
  documents: false,
  timeline: false,
};

const initialError = {
  cases: null,
  caseDetail: null,
  stats: null,
  tasks: null,
  notes: null,
  documents: null,
  timeline: null,
};

export const useCasesStore = create<CasesState>()(
  devtools(
    persist(
      (set) => ({
        cases: [],
        caseDetail: null,
        stats: null,
        caseTypes: [],
        
        filters: initialFilters,
        pagination: initialPagination,
        
        viewMode: 'table',
        selectedCaseIds: [],
        isCreateModalOpen: false,
        isDetailDrawerOpen: false,
        activeDetailTab: 'overview',
        
        isLoading: initialIsLoading,
        error: initialError,
        
        setCases: (cases) => set({ cases }),
        
        setCaseDetail: (caseDetail) => set({ caseDetail }),
        
        setStats: (stats) => set({ stats }),
        
        setCaseTypes: (types) => set({ caseTypes: types }),
        
        setFilters: (filters) => set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
        
        setPagination: (pagination) => set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),
        
        setViewMode: (viewMode) => set({ viewMode }),
        
        setSelectedCaseIds: (selectedCaseIds) => set({ selectedCaseIds }),
        
        toggleCaseSelection: (id) => set((state) => {
          const isSelected = state.selectedCaseIds.includes(id);
          return {
            selectedCaseIds: isSelected
              ? state.selectedCaseIds.filter((caseId) => caseId !== id)
              : [...state.selectedCaseIds, id],
          };
        }),
        
        clearSelectedCases: () => set({ selectedCaseIds: [] }),
        
        setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
        
        setDetailDrawerOpen: (isOpen) => set({ isDetailDrawerOpen: isOpen }),
        
        setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),
        
        setLoading: (key, isLoading) => set((state) => ({
          isLoading: { ...state.isLoading, [key]: isLoading },
        })),
        
        setError: (key, error) => set((state) => ({
          error: { ...state.error, [key]: error },
        })),
        
        addCase: (caseItem) => set((state) => ({
          cases: [...state.cases, caseItem],
          pagination: {
            ...state.pagination,
            total: state.pagination.total + 1,
          },
        })),
        
        updateCase: (caseId, updates) => set((state) => ({
          cases: state.cases.map((caseItem) =>
            caseItem.id === caseId ? { ...caseItem, ...updates } : caseItem
          ),
          caseDetail: state.caseDetail?.id === caseId
            ? { ...state.caseDetail, ...updates }
            : state.caseDetail,
        })),
        
        removeCase: (caseId) => set((state) => ({
          cases: state.cases.filter((caseItem) => caseItem.id !== caseId),
          pagination: {
            ...state.pagination,
            total: state.pagination.total - 1,
          },
          caseDetail: state.caseDetail?.id === caseId ? null : state.caseDetail,
        })),
        
        addTask: (task) => set((state) => {
          if (!state.caseDetail || state.caseDetail.id !== task.caseId) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              tasks: [...state.caseDetail.tasks, task],
            },
          };
        }),
        
        updateTask: (taskId, updates) => set((state) => {
          if (!state.caseDetail) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              tasks: state.caseDetail.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            },
          };
        }),
        
        removeTask: (taskId) => set((state) => {
          if (!state.caseDetail) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              tasks: state.caseDetail.tasks.filter((task) => task.id !== taskId),
            },
          };
        }),
        
        addNote: (note) => set((state) => {
          if (!state.caseDetail || state.caseDetail.id !== note.caseId) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              notes: [...state.caseDetail.notes, note],
            },
          };
        }),
        
        updateNote: (noteId, updates) => set((state) => {
          if (!state.caseDetail) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              notes: state.caseDetail.notes.map((note) =>
                note.id === noteId ? { ...note, ...updates } : note
              ),
            },
          };
        }),
        
        removeNote: (noteId) => set((state) => {
          if (!state.caseDetail) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              notes: state.caseDetail.notes.filter((note) => note.id !== noteId),
            },
          };
        }),
        
        addDocument: (document) => set((state) => {
          if (!state.caseDetail || state.caseDetail.id !== document.caseId) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              documents: [...state.caseDetail.documents, document],
            },
          };
        }),
        
        updateDocument: (documentId, updates) => set((state) => {
          if (!state.caseDetail) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              documents: state.caseDetail.documents.map((document) =>
                document.id === documentId ? { ...document, ...updates } : document
              ),
            },
          };
        }),
        
        removeDocument: (documentId) => set((state) => {
          if (!state.caseDetail) {
            return state;
          }
          
          return {
            caseDetail: {
              ...state.caseDetail,
              documents: state.caseDetail.documents.filter((document) => document.id !== documentId),
            },
          };
        }),
        
        resetFilters: () => set({
          filters: initialFilters,
          pagination: { ...initialPagination, total: 0 },
        }),
        
        resetState: () => set({
          cases: [],
          caseDetail: null,
          stats: null,
          filters: initialFilters,
          pagination: initialPagination,
          selectedCaseIds: [],
          isCreateModalOpen: false,
          isDetailDrawerOpen: false,
          activeDetailTab: 'overview',
          isLoading: initialIsLoading,
          error: initialError,
        }),
      }),
      {
        name: 'cases-storage',
        partialize: (state) => ({
          filters: state.filters,
          pagination: {
            limit: state.pagination.limit,
          },
          viewMode: state.viewMode,
        }),
      }
    )
  )
);
