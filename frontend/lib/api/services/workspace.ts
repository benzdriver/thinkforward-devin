import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { Workspace, Message, Task, SharedDocument } from '../../store/zustand/useWorkspaceStore';

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: '加拿大技术移民申请',
    description: '处理加拿大联邦技术移民申请的工作空间',
    createdAt: '2023-05-10T08:00:00Z',
    updatedAt: '2023-05-15T14:30:00Z',
    ownerId: 'user-1',
    participants: [
      { userId: 'user-1', role: 'client', joinedAt: '2023-05-10T08:00:00Z' },
      { userId: 'consultant-1', role: 'consultant', joinedAt: '2023-05-10T09:15:00Z' },
      { userId: 'admin-1', role: 'guest', joinedAt: '2023-05-12T10:30:00Z' },
    ],
    status: 'active',
    caseType: 'express-entry',
    caseId: 'case-123',
  },
  {
    id: 'ws-2',
    name: '澳大利亚技术移民申请',
    description: '处理澳大利亚技术移民申请的工作空间',
    createdAt: '2023-04-15T10:00:00Z',
    updatedAt: '2023-05-14T11:45:00Z',
    ownerId: 'user-1',
    participants: [
      { userId: 'user-1', role: 'client', joinedAt: '2023-04-15T10:00:00Z' },
      { userId: 'consultant-2', role: 'consultant', joinedAt: '2023-04-15T11:30:00Z' },
    ],
    status: 'active',
    caseType: 'skilled-migration',
    caseId: 'case-456',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    workspaceId: 'ws-1',
    senderId: 'consultant-1',
    content: '您好！我已经收到了您的申请材料，现在开始准备EE申请。',
    createdAt: '2023-05-10T09:30:00Z',
    updatedAt: '2023-05-10T09:30:00Z',
    readBy: [
      { userId: 'consultant-1', readAt: '2023-05-10T09:30:00Z' },
      { userId: 'user-1', readAt: '2023-05-10T10:15:00Z' },
    ],
  },
  {
    id: 'msg-2',
    workspaceId: 'ws-1',
    senderId: 'user-1',
    content: '谢谢您！我有一些关于语言成绩的问题想咨询。',
    createdAt: '2023-05-10T10:20:00Z',
    updatedAt: '2023-05-10T10:20:00Z',
    readBy: [
      { userId: 'user-1', readAt: '2023-05-10T10:20:00Z' },
      { userId: 'consultant-1', readAt: '2023-05-10T10:45:00Z' },
    ],
  },
  {
    id: 'msg-3',
    workspaceId: 'ws-1',
    senderId: 'consultant-1',
    content: '没问题，请问您具体有什么问题？',
    createdAt: '2023-05-10T10:50:00Z',
    updatedAt: '2023-05-10T10:50:00Z',
    readBy: [
      { userId: 'consultant-1', readAt: '2023-05-10T10:50:00Z' },
      { userId: 'user-1', readAt: '2023-05-10T11:05:00Z' },
    ],
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    workspaceId: 'ws-1',
    title: '准备EE资料',
    description: '准备Express Entry申请所需的所有文件和表格',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-06-15T23:59:59Z',
    assigneeId: 'user-1',
    creatorId: 'consultant-1',
    createdAt: '2023-05-10T09:45:00Z',
    updatedAt: '2023-05-12T14:30:00Z',
    comments: [
      {
        id: 'comment-1',
        userId: 'consultant-1',
        content: '请确保包含所有教育证明和工作经验证明',
        createdAt: '2023-05-11T10:15:00Z',
      },
    ],
  },
  {
    id: 'task-2',
    workspaceId: 'ws-1',
    title: '完成语言考试',
    description: '预约并完成IELTS或CELPIP考试',
    status: 'completed',
    priority: 'urgent',
    dueDate: '2023-05-30T23:59:59Z',
    assigneeId: 'user-1',
    creatorId: 'consultant-1',
    createdAt: '2023-05-10T09:50:00Z',
    updatedAt: '2023-05-20T16:45:00Z',
    completedAt: '2023-05-20T16:45:00Z',
  },
  {
    id: 'task-3',
    workspaceId: 'ws-1',
    title: '获取警方无犯罪证明',
    description: '申请并获取警方无犯罪证明',
    status: 'pending',
    priority: 'medium',
    dueDate: '2023-07-10T23:59:59Z',
    assigneeId: 'user-1',
    creatorId: 'consultant-1',
    createdAt: '2023-05-10T09:55:00Z',
    updatedAt: '2023-05-10T09:55:00Z',
  },
];

export const mockDocuments: SharedDocument[] = [
  {
    id: 'doc-1',
    workspaceId: 'ws-1',
    name: '护照扫描件.pdf',
    description: '申请人护照首页和个人信息页的扫描件',
    type: 'application/pdf',
    url: 'https://example.com/documents/passport.pdf',
    size: 2500000,
    uploaderId: 'user-1',
    uploadedAt: '2023-05-11T14:30:00Z',
    updatedAt: '2023-05-11T14:30:00Z',
    version: 1,
  },
  {
    id: 'doc-2',
    workspaceId: 'ws-1',
    name: '学历证明.pdf',
    description: '大学学位证书和成绩单',
    type: 'application/pdf',
    url: 'https://example.com/documents/education.pdf',
    size: 3800000,
    uploaderId: 'user-1',
    uploadedAt: '2023-05-12T10:15:00Z',
    updatedAt: '2023-05-14T09:20:00Z',
    version: 2,
    previousVersions: [
      {
        version: 1,
        url: 'https://example.com/documents/education_v1.pdf',
        updatedAt: '2023-05-12T10:15:00Z',
        updatedBy: 'user-1',
      },
    ],
    comments: [
      {
        id: 'doc-comment-1',
        userId: 'consultant-1',
        content: '请提供学位认证的翻译件',
        createdAt: '2023-05-13T11:30:00Z',
      },
    ],
  },
  {
    id: 'doc-3',
    workspaceId: 'ws-1',
    name: '工作经验证明.pdf',
    description: '工作经验证明信和相关文件',
    type: 'application/pdf',
    url: 'https://example.com/documents/work_experience.pdf',
    size: 4200000,
    uploaderId: 'user-1',
    uploadedAt: '2023-05-13T16:45:00Z',
    updatedAt: '2023-05-13T16:45:00Z',
    version: 1,
  },
];

export const useGetWorkspaces = (userId: string) => {
  return useQuery({
    queryKey: ['workspaces', userId],
    queryFn: async () => {
      try {
        return mockWorkspaces;
      } catch (error) {
        console.error('Error fetching workspaces:', error);
        throw error;
      }
    },
  });
};

export const useCreateWorkspace = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newWorkspace: Workspace = {
          ...data,
          id: `ws-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newWorkspace;
      } catch (error) {
        console.error('Error creating workspace:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
    },
  });
};

export const useGetWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      try {
        return mockWorkspaces.find(ws => ws.id === workspaceId) || null;
      } catch (error) {
        console.error(`Error fetching workspace ${workspaceId}:`, error);
        throw error;
      }
    },
  });
};

export const useUpdateWorkspace = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Workspace>) => {
      try {
        const workspace = mockWorkspaces.find(ws => ws.id === workspaceId);
        if (!workspace) {
          throw new Error(`Workspace ${workspaceId} not found`);
        }
        const updatedWorkspace = { ...workspace, ...updates, updatedAt: new Date().toISOString() };
        return updatedWorkspace;
      } catch (error) {
        console.error(`Error updating workspace ${workspaceId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useGetMessages = (workspaceId: string, options?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ['messages', workspaceId, options],
    queryFn: async () => {
      try {
        return mockMessages.filter(msg => msg.workspaceId === workspaceId);
      } catch (error) {
        console.error(`Error fetching messages for workspace ${workspaceId}:`, error);
        throw error;
      }
    },
  });
};

export const useSendMessage = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { senderId: string; content: string; attachments?: any[]; replyTo?: string }) => {
      try {
        const now = new Date().toISOString();
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          workspaceId,
          senderId: data.senderId,
          content: data.content,
          attachments: data.attachments,
          replyTo: data.replyTo,
          createdAt: now,
          updatedAt: now,
          readBy: [{ userId: data.senderId, readAt: now }],
        };
        return newMessage;
      } catch (error) {
        console.error(`Error sending message to workspace ${workspaceId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] });
    },
  });
};

export const useMarkMessageAsRead = (workspaceId: string, messageId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        return { success: true };
      } catch (error) {
        console.error(`Error marking message ${messageId} as read:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', workspaceId] });
    },
  });
};

export const useGetTasks = (workspaceId: string, options?: { status?: string; assigneeId?: string }) => {
  return useQuery({
    queryKey: ['tasks', workspaceId, options],
    queryFn: async () => {
      try {
        let filteredTasks = mockTasks.filter(task => task.workspaceId === workspaceId);
        
        if (options?.status) {
          filteredTasks = filteredTasks.filter(task => task.status === options.status);
        }
        
        if (options?.assigneeId) {
          filteredTasks = filteredTasks.filter(task => task.assigneeId === options.assigneeId);
        }
        
        return filteredTasks;
      } catch (error) {
        console.error(`Error fetching tasks for workspace ${workspaceId}:`, error);
        throw error;
      }
    },
  });
};

export const useCreateTask = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      dueDate?: string;
      assigneeId?: string;
      creatorId: string;
    }) => {
      try {
        const now = new Date().toISOString();
        const newTask: Task = {
          id: `task-${Date.now()}`,
          workspaceId,
          title: data.title,
          description: data.description,
          status: 'pending',
          priority: data.priority,
          dueDate: data.dueDate,
          assigneeId: data.assigneeId,
          creatorId: data.creatorId,
          createdAt: now,
          updatedAt: now,
        };
        return newTask;
      } catch (error) {
        console.error(`Error creating task in workspace ${workspaceId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
    },
  });
};

export const useUpdateTask = (workspaceId: string, taskId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      try {
        const task = mockTasks.find(t => t.id === taskId && t.workspaceId === workspaceId);
        if (!task) {
          throw new Error(`Task ${taskId} not found in workspace ${workspaceId}`);
        }
        
        const now = new Date().toISOString();
        const updatedTask = { 
          ...task, 
          ...updates, 
          updatedAt: now,
          completedAt: updates.status === 'completed' ? now : task.completedAt
        };
        
        return updatedTask;
      } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
    },
  });
};

export const useAddTaskComment = (workspaceId: string, taskId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { userId: string; content: string }) => {
      try {
        const now = new Date().toISOString();
        const newComment = {
          id: `comment-${Date.now()}`,
          userId: data.userId,
          content: data.content,
          createdAt: now,
        };
        return newComment;
      } catch (error) {
        console.error(`Error adding comment to task ${taskId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
    },
  });
};

export const useGetDocuments = (workspaceId: string) => {
  return useQuery({
    queryKey: ['documents', workspaceId],
    queryFn: async () => {
      try {
        return mockDocuments.filter(doc => doc.workspaceId === workspaceId);
      } catch (error) {
        console.error(`Error fetching documents for workspace ${workspaceId}:`, error);
        throw error;
      }
    },
  });
};

export const useUploadDocument = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      file: File;
      name: string;
      description?: string;
      uploaderId: string;
    }) => {
      try {
        
        
        const now = new Date().toISOString();
        const newDocument: SharedDocument = {
          id: `doc-${Date.now()}`,
          workspaceId,
          name: data.name,
          description: data.description,
          type: data.file.type,
          url: URL.createObjectURL(data.file),
          size: data.file.size,
          uploaderId: data.uploaderId,
          uploadedAt: now,
          updatedAt: now,
          version: 1,
        };
        
        return newDocument;
      } catch (error) {
        console.error(`Error uploading document to workspace ${workspaceId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] });
    },
  });
};

export const useAddDocumentComment = (workspaceId: string, documentId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      content: string;
      position?: {
        page: number;
        x: number;
        y: number;
      };
    }) => {
      try {
        const now = new Date().toISOString();
        const newComment = {
          id: `doc-comment-${Date.now()}`,
          userId: data.userId,
          content: data.content,
          createdAt: now,
          position: data.position,
        };
        return newComment;
      } catch (error) {
        console.error(`Error adding comment to document ${documentId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] });
    },
  });
};
