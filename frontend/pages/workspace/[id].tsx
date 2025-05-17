import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { LoadingState } from '../../components/ui/loading-state';
import { EmptyState } from '../../components/ui/empty-state';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { FileUpload } from '../../components/form/file-upload';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useWorkspaceStore } from '../../lib/store/zustand/useWorkspaceStore';
import { 
  useGetWorkspace, 
  useGetMessages, 
  useGetTasks, 
  useGetDocuments,
  useSendMessage,
  useCreateTask,
  useUpdateTask,
  useUploadDocument,
  mockWorkspaces
} from '../../lib/api/services/workspace';

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
      workspaceId: params?.id || '',
    },
  };
};

const WorkspacePage = ({ workspaceId }: { workspaceId: string }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    currentWorkspace, 
    setCurrentWorkspace,
    messages,
    setMessages,
    tasks,
    setTasks,
    documents,
    setDocuments,
    isLoading,
    error,
    setLoading,
    setError,
    addMessage,
    addTask,
    updateTask,
    addDocument
  } = useWorkspaceStore();
  
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [newMessage, setNewMessage] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  
  const workspaceQuery = useGetWorkspace(workspaceId);
  const messagesQuery = useGetMessages(workspaceId);
  const tasksQuery = useGetTasks(workspaceId);
  const documentsQuery = useGetDocuments(workspaceId);
  
  const sendMessageMutation = useSendMessage(workspaceId);
  const createTaskMutation = useCreateTask(workspaceId);
  const updateTaskMutation = useUpdateTask(workspaceId, '');
  const uploadDocumentMutation = useUploadDocument(workspaceId);
  
  useEffect(() => {
    if (workspaceQuery.isLoading || messagesQuery.isLoading || tasksQuery.isLoading || documentsQuery.isLoading) {
      setLoading(true);
    } else if (workspaceQuery.isError) {
      setError(workspaceQuery.error instanceof Error ? workspaceQuery.error.message : '获取工作空间失败');
      setLoading(false);
    } else {
      if (workspaceQuery.data) {
        setCurrentWorkspace(workspaceQuery.data);
      } else {
        const mockWorkspace = mockWorkspaces.find(ws => ws.id === workspaceId);
        if (mockWorkspace) {
          setCurrentWorkspace(mockWorkspace);
        } else {
          setError('找不到指定的工作空间');
        }
      }
      
      if (messagesQuery.data) {
        setMessages(messagesQuery.data);
      }
      
      if (tasksQuery.data) {
        setTasks(tasksQuery.data);
      }
      
      if (documentsQuery.data) {
        setDocuments(documentsQuery.data);
      }
      
      setLoading(false);
    }
  }, [
    workspaceQuery.isLoading, workspaceQuery.isError, workspaceQuery.data,
    messagesQuery.isLoading, messagesQuery.data,
    tasksQuery.isLoading, tasksQuery.data,
    documentsQuery.isLoading, documentsQuery.data
  ]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;
    
    try {
      const result = await sendMessageMutation.mutateAsync({
        senderId: user.id,
        content: newMessage,
      });
      
      addMessage(result);
      setNewMessage('');
    } catch (error) {
      setError(error instanceof Error ? error.message : '发送消息失败');
    }
  };
  
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !user?.id) return;
    
    try {
      const result = await createTaskMutation.mutateAsync({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        creatorId: user.id,
        assigneeId: user.id,
      });
      
      addTask(result);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
    } catch (error) {
      setError(error instanceof Error ? error.message : '创建任务失败');
    }
  };
  
  const handleUpdateTaskStatus = async (taskId: string, status: 'pending' | 'in-progress' | 'completed' | 'cancelled') => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const updateTaskMutation = useUpdateTask(workspaceId, taskId);
      const result = await updateTaskMutation.mutateAsync({
        status,
      });
      
      updateTask(taskId, result);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新任务状态失败');
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    try {
      const result = await uploadDocumentMutation.mutateAsync({
        file,
        name: file.name,
        description: '',
        uploaderId: user.id,
      });
      
      addDocument(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传文档失败');
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState title={t('workspace.loading')} />
      </DashboardLayout>
    );
  }
  
  if (error || !currentWorkspace) {
    return (
      <DashboardLayout>
        <EmptyState
          title={t('workspace.error.title')}
          description={error || t('workspace.error.notFound')}
          action={
            <Button onClick={() => router.push('/dashboard')}>
              {t('common.backToDashboard')}
            </Button>
          }
        />
      </DashboardLayout>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-200 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <DashboardLayout>
      <PageHeader
        title={currentWorkspace.name}
        description={currentWorkspace.description || t('workspace.noDescription')}
        actions={
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="mr-2">
              {t(`workspace.status.${currentWorkspace.status}`)}
            </Badge>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              {t('common.backToDashboard')}
            </Button>
          </div>
        }
      />
      
      <SectionContainer>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-lg font-medium">{t('workspace.participants.title')}</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {currentWorkspace.participants.map((participant) => (
              <div key={participant.userId} className="flex items-center p-2 bg-gray-50 rounded-md">
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${participant.userId}&background=random`}
                  alt={participant.userId}
                  size="sm"
                />
                <div className="ml-2">
                  <div className="text-sm font-medium">{participant.userId}</div>
                  <div className="text-xs text-gray-500">
                    {t(`workspace.roles.${participant.role}`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="messages">{t('workspace.messages.title')}</TabsTrigger>
            <TabsTrigger value="tasks">{t('workspace.tasks.title')}</TabsTrigger>
            <TabsTrigger value="documents">{t('workspace.documents.title')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <EmptyState
                    title={t('workspace.messages.empty.title')}
                    description={t('workspace.messages.empty.description')}
                  />
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = message.senderId === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-3/4 p-3 rounded-lg ${
                              isCurrentUser
                                ? 'bg-primary-100 text-primary-900'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="text-xs text-gray-500 mb-1">
                              {message.senderId} · {new Date(message.createdAt).toLocaleString()}
                            </div>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('workspace.messages.inputPlaceholder') as string}
                  className="flex-grow"
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  className="self-end"
                >
                  {t('workspace.messages.send')}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">{t('workspace.tasks.create')}</h3>
                <div className="space-y-4">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder={t('workspace.tasks.titlePlaceholder') as string}
                  />
                  <Textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder={t('workspace.tasks.descriptionPlaceholder') as string}
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('workspace.tasks.priority')}
                    </label>
                    <div className="flex space-x-2">
                      {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                        <Button
                          key={priority}
                          variant={newTaskPriority === priority ? 'primary' : 'outline'}
                          onClick={() => setNewTaskPriority(priority)}
                          className="flex-1"
                        >
                          {t(`workspace.tasks.priorities.${priority}`)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateTask}
                    disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
                    className="w-full"
                  >
                    {t('workspace.tasks.createButton')}
                  </Button>
                </div>
              </Card>
              
              {tasks.length === 0 ? (
                <EmptyState
                  title={t('workspace.tasks.empty.title')}
                  description={t('workspace.tasks.empty.description')}
                />
              ) : (
                <div className="space-y-4">
                  {['pending', 'in-progress', 'completed'].map((status) => (
                    <div key={status}>
                      <h3 className="text-lg font-medium mb-2">
                        {t(`workspace.tasks.status.${status}`)}
                      </h3>
                      <div className="space-y-2">
                        {tasks
                          .filter((task) => task.status === status)
                          .map((task) => (
                            <Card key={task.id} className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-md font-medium">{task.title}</h4>
                                <div className="flex space-x-2">
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {t(`workspace.tasks.priorities.${task.priority}`)}
                                  </Badge>
                                  <Badge className={getStatusColor(task.status)}>
                                    {t(`workspace.tasks.status.${task.status}`)}
                                  </Badge>
                                </div>
                              </div>
                              
                              {task.description && (
                                <p className="text-gray-600 mb-4">{task.description}</p>
                              )}
                              
                              <div className="flex justify-between items-center text-sm text-gray-500">
                                <div>
                                  {t('workspace.tasks.assignee')}: {task.assigneeId || t('workspace.tasks.unassigned')}
                                </div>
                                {task.dueDate && (
                                  <div>
                                    {t('workspace.tasks.dueDate')}: {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-4 flex justify-end space-x-2">
                                {task.status === 'pending' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                                  >
                                    {t('workspace.tasks.actions.start')}
                                  </Button>
                                )}
                                
                                {task.status === 'in-progress' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                  >
                                    {t('workspace.tasks.actions.complete')}
                                  </Button>
                                )}
                                
                                {task.status !== 'cancelled' && task.status !== 'completed' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'cancelled')}
                                  >
                                    {t('workspace.tasks.actions.cancel')}
                                  </Button>
                                )}
                              </div>
                            </Card>
                          ))}
                        
                        {tasks.filter((task) => task.status === status).length === 0 && (
                          <p className="text-gray-500 text-sm py-2">
                            {t(`workspace.tasks.empty.${status}`)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">{t('workspace.documents.upload')}</h3>
                <FileUpload
                  onSelect={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  maxSize={10 * 1024 * 1024} // 10MB
                  label={t('workspace.documents.dropzone') as string}
                />
              </Card>
              
              {documents.length === 0 ? (
                <EmptyState
                  title={t('workspace.documents.empty.title')}
                  description={t('workspace.documents.empty.description')}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('workspace.documents.list')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((document) => (
                      <Card key={document.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-md font-medium truncate" title={document.name}>
                            {document.name}
                          </h4>
                          <Badge variant="outline">v{document.version}</Badge>
                        </div>
                        
                        {document.description && (
                          <p className="text-gray-600 mb-4 text-sm">{document.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                          <div>{(document.size / 1024 / 1024).toFixed(2)} MB</div>
                          <div>{new Date(document.uploadedAt).toLocaleDateString()}</div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(document.url, '_blank')}
                          >
                            {t('workspace.documents.actions.view')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = window.document.createElement('a');
                              link.href = document.url;
                              link.download = document.name;
                              link.click();
                            }}
                          >
                            {t('workspace.documents.actions.download')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SectionContainer>
    </DashboardLayout>
  );
};

export default WorkspacePage;
