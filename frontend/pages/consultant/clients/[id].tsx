import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { SectionContainer } from '@/components/layout/section-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/lib/auth/AuthContext';
import { useClientDetailStore } from '@/lib/store/zustand/useClientDetailStore';
import {
  useClientDetail,
  useClientNotes,
  useClientDocuments,
  useClientAppointments,
  useClientCases,
  useClientActivities
} from '@/lib/api/services/client-detail';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

const ClientDetailPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const consultantId = user?.id || '';
  const clientId = id as string;
  
  const {
    client,
    notes,
    documents,
    appointments,
    cases,
    activities,
    activeTab,
    isLoading,
    error,
    setClient,
    setNotes,
    setDocuments,
    setAppointments,
    setCases,
    setActivities,
    setActiveTab,
    setLoading,
    setError,
    setPagination,
    resetState,
  } = useClientDetailStore();
  
  const clientDetailQuery = useClientDetail(consultantId, clientId);
  const clientNotesQuery = useClientNotes(consultantId, clientId, 1, 10);
  const clientDocumentsQuery = useClientDocuments(consultantId, clientId, 1, 10);
  const clientAppointmentsQuery = useClientAppointments(consultantId, clientId, 1, 10);
  const clientCasesQuery = useClientCases(consultantId, clientId, 1, 10);
  const clientActivitiesQuery = useClientActivities(consultantId, clientId, 1, 10);
  
  useEffect(() => {
    if (clientDetailQuery.data) {
      setClient(clientDetailQuery.data);
    }
    setLoading('client', clientDetailQuery.isLoading);
    setError('client', clientDetailQuery.error ? '加载客户详情失败' : null);
  }, [clientDetailQuery.data, clientDetailQuery.isLoading, clientDetailQuery.error]);
  
  useEffect(() => {
    if (clientNotesQuery.data) {
      setNotes(clientNotesQuery.data.notes);
      setPagination('notes', {
        total: clientNotesQuery.data.total,
      });
    }
    setLoading('notes', clientNotesQuery.isLoading);
    setError('notes', clientNotesQuery.error ? '加载客户笔记失败' : null);
  }, [clientNotesQuery.data, clientNotesQuery.isLoading, clientNotesQuery.error]);
  
  useEffect(() => {
    if (clientDocumentsQuery.data) {
      setDocuments(clientDocumentsQuery.data.documents);
      setPagination('documents', {
        total: clientDocumentsQuery.data.total,
      });
    }
    setLoading('documents', clientDocumentsQuery.isLoading);
    setError('documents', clientDocumentsQuery.error ? '加载客户文档失败' : null);
  }, [clientDocumentsQuery.data, clientDocumentsQuery.isLoading, clientDocumentsQuery.error]);
  
  useEffect(() => {
    if (clientAppointmentsQuery.data) {
      setAppointments(clientAppointmentsQuery.data.appointments);
      setPagination('appointments', {
        total: clientAppointmentsQuery.data.total,
      });
    }
    setLoading('appointments', clientAppointmentsQuery.isLoading);
    setError('appointments', clientAppointmentsQuery.error ? '加载客户预约失败' : null);
  }, [clientAppointmentsQuery.data, clientAppointmentsQuery.isLoading, clientAppointmentsQuery.error]);
  
  useEffect(() => {
    if (clientCasesQuery.data) {
      setCases(clientCasesQuery.data.cases);
      setPagination('cases', {
        total: clientCasesQuery.data.total,
      });
    }
    setLoading('cases', clientCasesQuery.isLoading);
    setError('cases', clientCasesQuery.error ? '加载客户案例失败' : null);
  }, [clientCasesQuery.data, clientCasesQuery.isLoading, clientCasesQuery.error]);
  
  useEffect(() => {
    if (clientActivitiesQuery.data) {
      setActivities(clientActivitiesQuery.data.activities);
      setPagination('activities', {
        total: clientActivitiesQuery.data.total,
      });
    }
    setLoading('activities', clientActivitiesQuery.isLoading);
    setError('activities', clientActivitiesQuery.error ? '加载客户活动失败' : null);
  }, [clientActivitiesQuery.data, clientActivitiesQuery.isLoading, clientActivitiesQuery.error]);
  
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
  };
  
  if (isLoading.client) {
    return (
      <DashboardLayout>
        <LoadingState>{t('loading_client_details')}</LoadingState>
      </DashboardLayout>
    );
  }
  
  if (error.client) {
    return (
      <DashboardLayout>
        <ErrorState
          title={t('error_loading_client')}
          description={error.client}
          retryAction={<Button onClick={() => clientDetailQuery.refetch()}>{t('try_again')}</Button>}
        />
      </DashboardLayout>
    );
  }
  
  if (!client) {
    return (
      <DashboardLayout>
        <EmptyState
          title={t('client_not_found')}
          description={t('client_not_found_message')}
          action={<Button onClick={() => router.push('/consultant/clients')}>{t('back_to_clients')}</Button>}
        />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      {/* 页面头部 */}
      <PageHeader
        title={client.displayName}
        description={`${client.email} · ${t(`client_status_${client.status}`)}`}
        actions={
          <>
            <Button variant="outline" onClick={() => router.push('/consultant/clients')}>
              {t('back_to_clients')}
            </Button>
            <Button onClick={() => {}}>
              {t('edit_client')}
            </Button>
          </>
        }
      />
      
      {/* 客户信息部分 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 lg:col-span-3">
          <div className="flex items-start gap-6">
            <Avatar
              src={client.avatar || ''}
              alt={client.displayName}
              className="w-20 h-20"
              fallback={`${client.firstName?.[0]}${client.lastName?.[0]}`}
            />
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={client.status === 'active' ? 'success' : client.status === 'inactive' ? 'secondary' : 'warning'}>
                  {t(`client_status_${client.status}`)}
                </Badge>
                {client.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('contact_info')}</h3>
                  <div className="mt-1">
                    <p>{t('email')}: {client.email}</p>
                    <p>{t('phone')}: {client.phone || t('not_provided')}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('client_info')}</h3>
                  <div className="mt-1">
                    <p>{t('source')}: {client.source}</p>
                    <p>{t('since')}: {new Date(client.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-medium mb-4">{t('quick_actions')}</h3>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {}}
            >
              {t('add_note')}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {}}
            >
              {t('upload_document')}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {}}
            >
              {t('schedule_appointment')}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {}}
            >
              {t('create_case')}
            </Button>
          </div>
        </Card>
      </div>
      
      {/* 标签页内容 */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="notes">{t('notes')}</TabsTrigger>
          <TabsTrigger value="documents">{t('documents')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('appointments')}</TabsTrigger>
          <TabsTrigger value="cases">{t('cases')}</TabsTrigger>
          <TabsTrigger value="activities">{t('activities')}</TabsTrigger>
        </TabsList>
        
        {/* 概览标签页 */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近活动 */}
            <SectionContainer title={t('recent_activity')}>
              {isLoading.activities ? (
                <LoadingState size="sm" />
              ) : activities.length === 0 ? (
                <EmptyState
                  title={t('no_activities')}
                  description={t('no_activities_message')}
                  size="sm"
                />
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex gap-4 p-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionContainer>
            
            {/* 即将到来的预约 */}
            <SectionContainer title={t('upcoming_appointments')}>
              {isLoading.appointments ? (
                <LoadingState size="sm" />
              ) : appointments.length === 0 ? (
                <EmptyState
                  title={t('no_appointments')}
                  description={t('no_appointments_message')}
                  action={<Button onClick={() => {}}>{t('schedule_appointment')}</Button>}
                  size="sm"
                />
              ) : (
                <div className="space-y-4">
                  {appointments
                    .filter((apt) => new Date(apt.startTime) > new Date())
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .slice(0, 3)
                    .map((appointment) => (
                      <Card key={appointment.id} className="p-4">
                        <h4 className="font-medium">{appointment.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.startTime).toLocaleString()} - 
                          {new Date(appointment.endTime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm mt-2">{appointment.description}</p>
                        <div className="mt-3">
                          <Badge variant={
                            appointment.status === 'confirmed' ? 'success' :
                            appointment.status === 'cancelled' ? 'destructive' : 'default'
                          }>
                            {t(`appointment_status_${appointment.status}`)}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </SectionContainer>
            
            {/* 活跃案例 */}
            <SectionContainer title={t('active_cases')}>
              {isLoading.cases ? (
                <LoadingState size="sm" />
              ) : cases.length === 0 ? (
                <EmptyState
                  title={t('no_cases')}
                  description={t('no_cases_message')}
                  action={<Button onClick={() => {}}>{t('create_case')}</Button>}
                  size="sm"
                />
              ) : (
                <div className="space-y-4">
                  {cases
                    .filter((c) => c.status !== 'closed' && c.status !== 'archived')
                    .slice(0, 3)
                    .map((clientCase) => (
                      <Card key={clientCase.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{clientCase.title}</h4>
                          <Badge variant={
                            clientCase.priority === 'high' ? 'destructive' :
                            clientCase.priority === 'medium' ? 'warning' : 'default'
                          }>
                            {t(`priority_${clientCase.priority}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{clientCase.type}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${clientCase.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{clientCase.progress}%</span>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </SectionContainer>
            
            {/* 最近文档 */}
            <SectionContainer title={t('recent_documents')}>
              {isLoading.documents ? (
                <LoadingState size="sm" />
              ) : documents.length === 0 ? (
                <EmptyState
                  title={t('no_documents')}
                  description={t('no_documents_message')}
                  action={<Button onClick={() => {}}>{t('upload_document')}</Button>}
                  size="sm"
                />
              ) : (
                <div className="space-y-4">
                  {documents.slice(0, 5).map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-gray-500">
                          {document.category} · {new Date(document.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => window.open(document.url, '_blank')}>
                        {t('view')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SectionContainer>
          </div>
        </TabsContent>
        
        {/* 笔记标签页 */}
        <TabsContent value="notes">
          <SectionContainer
            title={t('client_notes')}
            headerActions={
              <Button onClick={() => {}}>
                {t('add_note')}
              </Button>
            }
          >
            {isLoading.notes ? (
              <LoadingState />
            ) : notes.length === 0 ? (
              <EmptyState
                title={t('no_notes')}
                description={t('no_notes_message')}
                action={<Button onClick={() => {}}>{t('add_first_note')}</Button>}
              />
            ) : (
              <div className="space-y-6">
                {notes.map((note) => (
                  <Card key={note.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                        {note.isPrivate && (
                          <Badge variant="secondary" className="mt-1">
                            {t('private')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </Card>
                ))}
              </div>
            )}
          </SectionContainer>
        </TabsContent>
        
        {/* 其他标签页内容 */}
        <TabsContent value="documents">
          <SectionContainer title={t('client_documents')}>
            {isLoading.documents ? (
              <LoadingState />
            ) : documents.length === 0 ? (
              <EmptyState
                title={t('no_documents')}
                description={t('no_documents_message')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 文档卡片列表 */}
              </div>
            )}
          </SectionContainer>
        </TabsContent>
        
        <TabsContent value="appointments">
          <SectionContainer title={t('client_appointments')}>
            {isLoading.appointments ? (
              <LoadingState />
            ) : appointments.length === 0 ? (
              <EmptyState
                title={t('no_appointments')}
                description={t('no_appointments_message')}
              />
            ) : (
              <div className="space-y-4">
                {/* 预约列表 */}
              </div>
            )}
          </SectionContainer>
        </TabsContent>
        
        <TabsContent value="cases">
          <SectionContainer title={t('client_cases')}>
            {isLoading.cases ? (
              <LoadingState />
            ) : cases.length === 0 ? (
              <EmptyState
                title={t('no_cases')}
                description={t('no_cases_message')}
              />
            ) : (
              <div className="space-y-6">
                {/* 案例列表 */}
              </div>
            )}
          </SectionContainer>
        </TabsContent>
        
        <TabsContent value="activities">
          <SectionContainer title={t('client_activities')}>
            {isLoading.activities ? (
              <LoadingState />
            ) : activities.length === 0 ? (
              <EmptyState
                title={t('no_activities')}
                description={t('no_activities_message')}
              />
            ) : (
              <div className="space-y-4">
                {/* 活动列表 */}
              </div>
            )}
          </SectionContainer>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
