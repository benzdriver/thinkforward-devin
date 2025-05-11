import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  participants: {
    userId: string;
    role: 'owner' | 'consultant' | 'client' | 'guest';
    joinedAt: string;
  }[];
  status: 'active' | 'archived' | 'completed';
  caseType?: string;
  caseId?: string;
}

export interface Message {
  id: string;
  workspaceId: string;
  senderId: string;
  content: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }[];
  createdAt: string;
  updatedAt: string;
  readBy: {
    userId: string;
    readAt: string;
  }[];
  replyTo?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assigneeId?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  comments?: {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
  }[];
}

export interface SharedDocument {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  type: string;
  url: string;
  size: number;
  uploaderId: string;
  uploadedAt: string;
  updatedAt: string;
  version: number;
  previousVersions?: {
    version: number;
    url: string;
    updatedAt: string;
    updatedBy: string;
  }[];
  comments?: {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    position?: {
      page: number;
      x: number;
      y: number;
    };
  }[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  messages: Message[];
  tasks: Task[];
  documents: SharedDocument[];
  isLoading: boolean;
  error: string | null;
  
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void;
  
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  markMessageAsRead: (messageId: string, userId: string) => void;
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addTaskComment: (taskId: string, comment: { userId: string; content: string; createdAt: string }) => void;
  
  setDocuments: (documents: SharedDocument[]) => void;
  addDocument: (document: SharedDocument) => void;
  updateDocument: (documentId: string, updates: Partial<SharedDocument>) => void;
  deleteDocument: (documentId: string) => void;
  addDocumentComment: (
    documentId: string, 
    comment: { 
      userId: string; 
      content: string; 
      createdAt: string;
      position?: { page: number; x: number; y: number };
    }
  ) => void;
  
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  messages: [],
  tasks: [],
  documents: [],
  isLoading: false,
  error: null,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setWorkspaces: (workspaces) => set({ workspaces }),
        
        setCurrentWorkspace: (workspace) => set({ 
          currentWorkspace: workspace,
          messages: [],
          tasks: [],
          documents: [],
        }),
        
        addWorkspace: (workspace) => set((state) => ({ 
          workspaces: [...state.workspaces, workspace] 
        })),
        
        updateWorkspace: (workspaceId, updates) => set((state) => ({
          workspaces: state.workspaces.map((workspace) => 
            workspace.id === workspaceId ? { ...workspace, ...updates } : workspace
          ),
          currentWorkspace: state.currentWorkspace?.id === workspaceId 
            ? { ...state.currentWorkspace, ...updates } 
            : state.currentWorkspace
        })),
        
        setMessages: (messages) => set({ messages }),
        
        addMessage: (message) => set((state) => ({ 
          messages: [...state.messages, message] 
        })),
        
        updateMessage: (messageId, updates) => set((state) => ({
          messages: state.messages.map((message) => 
            message.id === messageId ? { ...message, ...updates } : message
          )
        })),
        
        deleteMessage: (messageId) => set((state) => ({
          messages: state.messages.filter((message) => message.id !== messageId)
        })),
        
        markMessageAsRead: (messageId, userId) => set((state) => ({
          messages: state.messages.map((message) => {
            if (message.id === messageId) {
              const alreadyRead = message.readBy.some((read) => read.userId === userId);
              
              if (alreadyRead) {
                return message;
              }
              
              return {
                ...message,
                readBy: [...message.readBy, { userId, readAt: new Date().toISOString() }]
              };
            }
            
            return message;
          })
        })),
        
        setTasks: (tasks) => set({ tasks }),
        
        addTask: (task) => set((state) => ({ 
          tasks: [...state.tasks, task] 
        })),
        
        updateTask: (taskId, updates) => set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        })),
        
        deleteTask: (taskId) => set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId)
        })),
        
        addTaskComment: (taskId, comment) => set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                comments: [...(task.comments || []), { id: Date.now().toString(), ...comment }]
              };
            }
            
            return task;
          })
        })),
        
        setDocuments: (documents) => set({ documents }),
        
        addDocument: (document) => set((state) => ({ 
          documents: [...state.documents, document] 
        })),
        
        updateDocument: (documentId, updates) => set((state) => ({
          documents: state.documents.map((document) => 
            document.id === documentId ? { ...document, ...updates } : document
          )
        })),
        
        deleteDocument: (documentId) => set((state) => ({
          documents: state.documents.filter((document) => document.id !== documentId)
        })),
        
        addDocumentComment: (documentId, comment) => set((state) => ({
          documents: state.documents.map((document) => {
            if (document.id === documentId) {
              return {
                ...document,
                comments: [...(document.comments || []), { id: Date.now().toString(), ...comment }]
              };
            }
            
            return document;
          })
        })),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'workspace-storage',
        partialize: (state) => ({
          workspaces: state.workspaces,
          currentWorkspace: state.currentWorkspace,
        }),
      }
    )
  )
);
