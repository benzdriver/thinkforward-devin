import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useAdminUsersData, useInviteUsers, useDeleteUsers, useUpdateUser } from '../../api/services/admin-users';

export type UserRole = 'admin' | 'consultant' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  metadata?: Record<string, any>;
}

interface UserFilters {
  search: string;
  role: UserRole | null;
  status: 'active' | 'inactive' | 'pending' | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface AdminUsersState {
  users: User[];
  filteredUsers: User[];
  pagination: Pagination;
  filters: UserFilters;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  selectedUsers: string[];
  isInviteModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isEditModalOpen: boolean;
  editingUser: User | null;
  
  setUsers: (users: User[]) => void;
  setFilteredUsers: (users: User[]) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  selectUser: (userId: string) => void;
  deselectUser: (userId: string) => void;
  selectAllUsers: (userIds: string[]) => void;
  deselectAllUsers: () => void;
  
  openInviteModal: () => void;
  closeInviteModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  openEditModal: () => void;
  closeEditModal: () => void;
  setEditingUser: (user: User | null) => void;
  
  fetchUsers: () => Promise<void>;
  inviteUsers: (emails: string[], role: UserRole) => Promise<void>;
  deleteUsers: (userIds: string[]) => Promise<void>;
  updateUser: (userIds: string[], updates: Partial<User>) => Promise<void>;
  
  resetState: () => void;
}

const initialFilters: UserFilters = {
  search: '',
  role: null,
  status: null,
  startDate: null,
  endDate: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const initialPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
};

const initialState = {
  users: [],
  filteredUsers: [],
  pagination: initialPagination,
  filters: initialFilters,
  isLoading: false,
  error: null,
  activeTab: 'all',
  selectedUsers: [],
  isInviteModalOpen: false,
  isDeleteModalOpen: false,
  isEditModalOpen: false,
  editingUser: null,
};

export const useAdminUsersStore = create<AdminUsersState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setUsers: (users) => {
          set({ users });
          get().setFilteredUsers(users);
        },
        
        setFilteredUsers: (users) => {
          set({ filteredUsers: users });
        },
        
        setFilters: (filters) => {
          set((state) => {
            const newFilters = { ...state.filters, ...filters };
            
            let filtered = [...state.users];
            
            if (newFilters.search) {
              const searchLower = newFilters.search.toLowerCase();
              filtered = filtered.filter(
                (user) =>
                  user.name.toLowerCase().includes(searchLower) ||
                  user.email.toLowerCase().includes(searchLower)
              );
            }
            
            if (newFilters.role) {
              filtered = filtered.filter((user) => user.role === newFilters.role);
            }
            
            if (newFilters.status) {
              filtered = filtered.filter((user) => user.status === newFilters.status);
            }
            
            if (newFilters.startDate) {
              const startDate = new Date(newFilters.startDate);
              filtered = filtered.filter(
                (user) => new Date(user.createdAt) >= startDate
              );
            }
            
            if (newFilters.endDate) {
              const endDate = new Date(newFilters.endDate);
              filtered = filtered.filter(
                (user) => new Date(user.createdAt) <= endDate
              );
            }
            
            filtered.sort((a, b) => {
              const aValue = a[newFilters.sortBy as keyof User];
              const bValue = b[newFilters.sortBy as keyof User];
              
              if (typeof aValue === 'string' && typeof bValue === 'string') {
                return newFilters.sortOrder === 'asc'
                  ? aValue.localeCompare(bValue)
                  : bValue.localeCompare(aValue);
              }
              
              if (aValue instanceof Date && bValue instanceof Date) {
                return newFilters.sortOrder === 'asc'
                  ? aValue.getTime() - bValue.getTime()
                  : bValue.getTime() - aValue.getTime();
              }
              
              return 0;
            });
            
            return {
              filters: newFilters,
              filteredUsers: filtered,
            };
          });
        },
        
        setPagination: (pagination) => {
          set((state) => ({
            pagination: { ...state.pagination, ...pagination },
          }));
        },
        
        setActiveTab: (tab) => {
          set({ activeTab: tab });
          
          if (tab === 'all') {
            get().setFilters({ role: null, status: null });
          } else if (tab === 'admin' || tab === 'consultant' || tab === 'client') {
            get().setFilters({ role: tab as UserRole, status: null });
          } else if (tab === 'pending') {
            get().setFilters({ status: 'pending', role: null });
          }
        },
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        selectUser: (userId) => {
          set((state) => ({
            selectedUsers: [...state.selectedUsers, userId],
          }));
        },
        
        deselectUser: (userId) => {
          set((state) => ({
            selectedUsers: state.selectedUsers.filter((id) => id !== userId),
          }));
        },
        
        selectAllUsers: (userIds) => {
          set({ selectedUsers: userIds });
        },
        
        deselectAllUsers: () => {
          set({ selectedUsers: [] });
        },
        
        openInviteModal: () => set({ isInviteModalOpen: true }),
        
        closeInviteModal: () => set({ isInviteModalOpen: false }),
        
        openDeleteModal: () => set({ isDeleteModalOpen: true }),
        
        closeDeleteModal: () => set({ isDeleteModalOpen: false }),
        
        openEditModal: () => set({ isEditModalOpen: true }),
        
        closeEditModal: () => set({ isEditModalOpen: false, editingUser: null }),
        
        setEditingUser: (user) => set({ editingUser: user }),
        
        fetchUsers: async () => {
          const { setLoading, setError, setUsers, setPagination } = get();
          
          setLoading(true);
          setError(null);
          
          try {
            const { fetchAdminUsersData } = useAdminUsersData();
            const { users, total } = await fetchAdminUsersData(
              get().pagination.page,
              get().pagination.limit,
              get().filters
            );
            
            setUsers(users);
            setPagination({ total });
            setLoading(false);
          } catch (error) {
            setLoading(false);
            setError(error instanceof Error ? error.message : '获取用户数据失败');
          }
        },
        
        inviteUsers: async (emails, role) => {
          const { setLoading, setError, fetchUsers } = get();
          
          setLoading(true);
          setError(null);
          
          try {
            const { inviteUsers } = useInviteUsers();
            await inviteUsers(emails, role);
            
            setLoading(false);
            fetchUsers();
          } catch (error) {
            setLoading(false);
            setError(error instanceof Error ? error.message : '邀请用户失败');
          }
        },
        
        deleteUsers: async (userIds) => {
          const { setLoading, setError, fetchUsers } = get();
          
          setLoading(true);
          setError(null);
          
          try {
            const { deleteUsers } = useDeleteUsers();
            await deleteUsers(userIds);
            
            setLoading(false);
            fetchUsers();
          } catch (error) {
            setLoading(false);
            setError(error instanceof Error ? error.message : '删除用户失败');
          }
        },
        
        updateUser: async (userIds, updates) => {
          const { setLoading, setError, fetchUsers } = get();
          
          setLoading(true);
          setError(null);
          
          try {
            const { updateUser } = useUpdateUser();
            await updateUser(userIds, updates);
            
            setLoading(false);
            fetchUsers();
          } catch (error) {
            setLoading(false);
            setError(error instanceof Error ? error.message : '更新用户失败');
          }
        },
        
        resetState: () => set(initialState),
      }),
      {
        name: 'admin-users-storage',
        partialize: (state) => ({
          filters: state.filters,
          pagination: {
            limit: state.pagination.limit,
          },
          activeTab: state.activeTab,
        }),
      }
    )
  )
);
