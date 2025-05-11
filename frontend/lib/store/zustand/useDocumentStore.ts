import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  url?: string;
  thumbnailUrl?: string;
  notes?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

interface DocumentState {
  documents: Document[];
  categories: DocumentCategory[];
  isLoading: boolean;
  error: string | null;
  
  addDocument: (document: Omit<Document, 'id' | 'uploadDate' | 'status'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  addCategory: (category: Omit<DocumentCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<DocumentCategory>) => void;
  removeCategory: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const defaultCategories: DocumentCategory[] = [
  {
    id: 'identity',
    name: '身份证明',
    description: '护照、身份证等身份证明文件',
    required: true,
    maxFiles: 2,
    acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  {
    id: 'education',
    name: '教育证明',
    description: '学位证书、成绩单等教育相关文件',
    required: true,
    maxFiles: 5,
    acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  {
    id: 'work',
    name: '工作证明',
    description: '工作证明信、推荐信、简历等工作相关文件',
    required: true,
    maxFiles: 10,
    acceptedFileTypes: ['.pdf', '.doc', '.docx']
  },
  {
    id: 'language',
    name: '语言能力证明',
    description: '语言考试成绩单等语言能力证明文件',
    required: true,
    maxFiles: 2,
    acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  {
    id: 'financial',
    name: '财务证明',
    description: '银行对账单、资产证明等财务相关文件',
    required: false,
    maxFiles: 5,
    acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  {
    id: 'other',
    name: '其他文件',
    description: '其他支持材料',
    required: false,
    maxFiles: 10,
    acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
  }
];

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      categories: defaultCategories,
      isLoading: false,
      error: null,
      
      addDocument: (document) => {
        const newDocument: Document = {
          ...document,
          id: crypto.randomUUID(),
          uploadDate: new Date().toISOString(),
          status: 'pending'
        };
        
        set((state) => ({
          documents: [...state.documents, newDocument]
        }));
      },
      
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((doc) => 
            doc.id === id ? { ...doc, ...updates } : doc
          )
        }));
      },
      
      removeDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id)
        }));
      },
      
      addCategory: (category) => {
        const newCategory: DocumentCategory = {
          ...category,
          id: crypto.randomUUID()
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) => 
            cat.id === id ? { ...cat, ...updates } : cat
          )
        }));
      },
      
      removeCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id)
        }));
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'document-storage',
      partialize: (state) => ({
        documents: state.documents,
        categories: state.categories
      })
    }
  )
);
