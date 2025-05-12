import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from 'date-fns';
import { zhCN, enUS, fr } from 'date-fns/locale';

import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingState } from '../../components/ui/loading-state';
import { ErrorState } from '../../components/ui/error-state';
import { Modal } from '../../components/ui/modal';

import { useScheduleStore } from '../../lib/store/zustand/useScheduleStore';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import {
  useScheduleEvents,
  useWorkingHours,
  useAppointmentRequests,
  useScheduleStats,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useUpdateWorkingHours,
  useHandleAppointmentRequest,
  useAvailableTimeSlots
} from '../../lib/api/services/schedule';

const Calendar = ({ events, selectedDate, viewMode, onDateSelect, onEventSelect, onViewModeChange, onNavigate }) => {
  const { t } = useTranslation('common');
  
  const getDateRange = () => {
    const locales = { zh: zhCN, en: enUS, fr };
    const { i18n } = useTranslation();
    const locale = locales[i18n.language] || enUS;
    
    switch (viewMode) {
      case 'month':
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
          title: format(selectedDate, 'MMMM yyyy', { locale })
        };
      case 'week':
        return {
          start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
          title: `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d', { locale })} - ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy', { locale })}`
        };
      case 'day':
        return {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate),
          title: format(selectedDate, 'EEEE, MMMM d, yyyy', { locale })
        };
      default:
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
          title: format(selectedDate, 'MMMM yyyy', { locale })
        };
    }
  };
  
  const { title } = getDateRange();
  
  const navigatePrevious = () => {
    switch (viewMode) {
      case 'month':
        onNavigate(subMonths(selectedDate, 1));
        break;
      case 'week':
        onNavigate(subWeeks(selectedDate, 1));
        break;
      case 'day':
        onNavigate(subDays(selectedDate, 1));
        break;
    }
  };
  
  const navigateNext = () => {
    switch (viewMode) {
      case 'month':
        onNavigate(addMonths(selectedDate, 1));
        break;
      case 'week':
        onNavigate(addWeeks(selectedDate, 1));
        break;
      case 'day':
        onNavigate(addDays(selectedDate, 1));
        break;
    }
  };
  
  const navigateToday = () => {
    onNavigate(new Date());
  };
  
  const renderCalendarView = () => {
    return (
      <div className="bg-white rounded-lg shadow p-4 min-h-[400px]">
        <div className="text-center text-gray-500">
          {viewMode === 'month' && <p>{t('month_view_placeholder')}</p>}
          {viewMode === 'week' && <p>{t('week_view_placeholder')}</p>}
          {viewMode === 'day' && <p>{t('day_view_placeholder')}</p>}
          {viewMode === 'agenda' && <p>{t('agenda_view_placeholder')}</p>}
          <p className="mt-2">{t('events_count', { count: events.length })}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button variant="outline" size="sm" onClick={navigateToday}>
            {t('today')}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <span className="sr-only">{t('previous')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <span className="sr-only">{t('next')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
          <div className="border-l h-6 mx-2" />
          <div className="flex">
            <Button
              variant={viewMode === 'month' ? 'primary' : 'outline'}
              size="sm"
              className="rounded-r-none"
              onClick={() => onViewModeChange('month')}
            >
              {t('month')}
            </Button>
            <Button
              variant={viewMode === 'week' ? 'primary' : 'outline'}
              size="sm"
              className="rounded-none border-l-0"
              onClick={() => onViewModeChange('week')}
            >
              {t('week')}
            </Button>
            <Button
              variant={viewMode === 'day' ? 'primary' : 'outline'}
              size="sm"
              className="rounded-none border-l-0"
              onClick={() => onViewModeChange('day')}
            >
              {t('day')}
            </Button>
            <Button
              variant={viewMode === 'agenda' ? 'primary' : 'outline'}
              size="sm"
              className="rounded-l-none border-l-0"
              onClick={() => onViewModeChange('agenda')}
            >
              {t('agenda')}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {renderCalendarView()}
      </div>
    </div>
  );
};

const WorkingHoursSettings = ({ workingHours, onUpdate, isLoading }) => {
  const { t } = useTranslation('common');
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!workingHours) {
    return <EmptyState title={t('no_working_hours')} description={t('setup_working_hours')} />;
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">{t('working_hours_settings')}</h3>
        <p className="text-gray-500 mb-4">{t('working_hours_description')}</p>
        <Button>{t('save_changes')}</Button>
      </Card>
    </div>
  );
};

const AppointmentRequests = ({ requests, onAccept, onReject, onReschedule, isLoading }) => {
  const { t } = useTranslation('common');
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!requests || requests.length === 0) {
    return <EmptyState title={t('no_appointment_requests')} description={t('no_appointment_requests_description')} />;
  }
  
  return (
    <div className="space-y-4">
      {requests.map(request => (
        <Card key={request.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium">{request.clientName}</h4>
              <p className="text-sm text-gray-500">{request.purpose}</p>
            </div>
            <Badge
              variant="outline"
              className={`${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                request.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                request.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                'bg-blue-100 text-blue-800 border-blue-200'
              }`}
            >
              {t(`status_${request.status}`)}
            </Badge>
          </div>
          
          {request.status === 'pending' && (
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(request.id)}
              >
                {t('reject')}
              </Button>
              <Button
                size="sm"
                onClick={() => onAccept(request.id, request.proposedTimes[0])}
              >
                {t('accept')}
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

const ConsultantSchedulePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const consultantId = user?.id;
  
  const {
    events,
    workingHours,
    appointmentRequests,
    stats,
    selectedDate,
    selectedEvent,
    viewMode,
    setEvents,
    setWorkingHours,
    setAppointmentRequests,
    setStats,
    setSelectedDate,
    setSelectedEvent,
    setViewMode,
    addEvent,
    updateEvent,
    removeEvent,
    updateWorkingHours,
    updateAppointmentRequest
  } = useScheduleStore();
  
  const getDateRange = () => {
    switch (viewMode) {
      case 'month':
        return {
          start: format(startOfMonth(selectedDate), 'yyyy-MM-dd'),
          end: format(endOfMonth(selectedDate), 'yyyy-MM-dd')
        };
      case 'week':
        return {
          start: format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
          end: format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
        };
      case 'day':
        return {
          start: format(startOfDay(selectedDate), 'yyyy-MM-dd'),
          end: format(endOfDay(selectedDate), 'yyyy-MM-dd')
        };
      default:
        return {
          start: format(startOfMonth(selectedDate), 'yyyy-MM-dd'),
          end: format(endOfMonth(selectedDate), 'yyyy-MM-dd')
        };
    }
  };
  
  const { start, end } = getDateRange();
  
  const eventsQuery = useScheduleEvents(consultantId, start, end);
  const workingHoursQuery = useWorkingHours(consultantId);
  const appointmentRequestsQuery = useAppointmentRequests(consultantId);
  const statsQuery = useScheduleStats(consultantId);
  
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const updateWorkingHoursMutation = useUpdateWorkingHours();
  const handleAppointmentRequestMutation = useHandleAppointmentRequest();
  
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isViewEventModalOpen, setIsViewEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  
  useEffect(() => {
    if (eventsQuery.data) {
      setEvents(eventsQuery.data);
    }
  }, [eventsQuery.data, setEvents]);
  
  useEffect(() => {
    if (workingHoursQuery.data) {
      setWorkingHours(workingHoursQuery.data);
    }
  }, [workingHoursQuery.data, setWorkingHours]);
  
  useEffect(() => {
    if (appointmentRequestsQuery.data) {
      setAppointmentRequests(appointmentRequestsQuery.data);
    }
  }, [appointmentRequestsQuery.data, setAppointmentRequests]);
  
  useEffect(() => {
    if (statsQuery.data) {
      setStats(statsQuery.data);
    }
  }, [statsQuery.data, setStats]);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsViewEventModalOpen(true);
  };
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  const handleNavigate = (date) => {
    setSelectedDate(date);
  };
  
  const handleCreateEvent = (eventData) => {
    createEventMutation.mutate(
      {
        consultantId,
        eventData
      },
      {
        onSuccess: (newEvent) => {
          addEvent(newEvent);
          setIsCreateEventModalOpen(false);
        }
      }
    );
  };
  
  const handleUpdateEvent = (eventId, updates) => {
    updateEventMutation.mutate(
      {
        consultantId,
        eventId,
        updates
      },
      {
        onSuccess: (updatedEvent) => {
          updateEvent(eventId, updatedEvent);
          setIsEditEventModalOpen(false);
          setIsViewEventModalOpen(false);
        }
      }
    );
  };
  
  const handleDeleteEvent = (eventId) => {
    deleteEventMutation.mutate(
      {
        consultantId,
        eventId
      },
      {
        onSuccess: () => {
          removeEvent(eventId);
          setIsViewEventModalOpen(false);
        }
      }
    );
  };
  
  const handleUpdateWorkingHours = (updates) => {
    updateWorkingHoursMutation.mutate(
      {
        consultantId,
        workingHours: updates
      },
      {
        onSuccess: (updatedWorkingHours) => {
          setWorkingHours(updatedWorkingHours);
        }
      }
    );
  };
  
  const handleAcceptAppointment = (requestId, selectedTime) => {
    handleAppointmentRequestMutation.mutate(
      {
        consultantId,
        requestId,
        action: 'accept',
        selectedTime
      },
      {
        onSuccess: (updatedRequest) => {
          updateAppointmentRequest(requestId, updatedRequest);
          eventsQuery.refetch();
        }
      }
    );
  };
  
  const handleRejectAppointment = (requestId) => {
    handleAppointmentRequestMutation.mutate(
      {
        consultantId,
        requestId,
        action: 'reject'
      },
      {
        onSuccess: (updatedRequest) => {
          updateAppointmentRequest(requestId, updatedRequest);
        }
      }
    );
  };
  
  const handleRescheduleAppointment = (requestId) => {
    console.log('Reschedule appointment', requestId);
  };
  
  const isLoading = eventsQuery.isLoading || workingHoursQuery.isLoading || appointmentRequestsQuery.isLoading || statsQuery.isLoading;
  
  const hasError = eventsQuery.isError || workingHoursQuery.isError || appointmentRequestsQuery.isError || statsQuery.isError;
  const errorMessage = eventsQuery.error?.message || workingHoursQuery.error?.message || appointmentRequestsQuery.error?.message || statsQuery.error?.message;
  
  if (!consultantId) {
    return (
      <DashboardLayout>
        <PageHeader
          title={t('schedule_management')}
          description={t('schedule_management_description')}
        />
        <SectionContainer>
          <EmptyState
            title={t('not_authenticated')}
            description={t('login_required')}
            action={
              <Button onClick={() => router.push('/auth/login')}>
                {t('login')}
              </Button>
            }
          />
        </SectionContainer>
      </DashboardLayout>
    );
  }
  
  if (hasError) {
    return (
      <DashboardLayout>
        <PageHeader
          title={t('schedule_management')}
          description={t('schedule_management_description')}
        />
        <SectionContainer>
          <ErrorState
            title={t('error_loading_data')}
            description={errorMessage || t('unknown_error')}
            action={
              <Button onClick={() => {
                eventsQuery.refetch();
                workingHoursQuery.refetch();
                appointmentRequestsQuery.refetch();
                statsQuery.refetch();
              }}>
                {t('try_again')}
              </Button>
            }
          />
        </SectionContainer>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <PageHeader
        title={t('schedule_management')}
        description={t('schedule_management_description')}
        actions={
          <Button onClick={() => setIsCreateEventModalOpen(true)}>
            {t('create_event')}
          </Button>
        }
      />
      
      {isLoading ? (
        <SectionContainer>
          <LoadingState />
        </SectionContainer>
      ) : (
        <>
          <SectionContainer className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-gray-500">{t('total_appointments')}</h3>
                <p className="text-3xl font-bold">{stats?.totalAppointments || 0}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-gray-500">{t('upcoming_appointments')}</h3>
                <p className="text-3xl font-bold">{stats?.upcomingAppointments || 0}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-gray-500">{t('today_appointments')}</h3>
                <p className="text-3xl font-bold">{stats?.todayAppointments || 0}</p>
              </Card>
              <Card className="p-4 flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-gray-500">{t('pending_requests')}</h3>
                <p className="text-3xl font-bold">
                  {appointmentRequests?.filter(req => req.status === 'pending').length || 0}
                </p>
              </Card>
            </div>
          </SectionContainer>
          
          <SectionContainer>
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="calendar">{t('calendar')}</TabsTrigger>
                <TabsTrigger value="requests">{t('appointment_requests')}</TabsTrigger>
                <TabsTrigger value="settings">{t('working_hours')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-0">
                <Calendar
                  events={events}
                  selectedDate={selectedDate}
                  viewMode={viewMode}
                  onDateSelect={handleDateSelect}
                  onEventSelect={handleEventSelect}
                  onViewModeChange={handleViewModeChange}
                  onNavigate={handleNavigate}
                />
              </TabsContent>
              
              <TabsContent value="requests" className="mt-0">
                <AppointmentRequests
                  requests={appointmentRequests}
                  onAccept={handleAcceptAppointment}
                  onReject={handleRejectAppointment}
                  onReschedule={handleRescheduleAppointment}
                  isLoading={appointmentRequestsQuery.isLoading}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <WorkingHoursSettings
                  workingHours={workingHours}
                  onUpdate={handleUpdateWorkingHours}
                  isLoading={workingHoursQuery.isLoading}
                />
              </TabsContent>
            </Tabs>
          </SectionContainer>
        </>
      )}
      
      {/* 创建事件模态框 */}
      <Modal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        title={t('create_event')}
      >
        <div className="p-4">
          <p>{t('event_form_placeholder')}</p>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setIsCreateEventModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button onClick={() => setIsCreateEventModalOpen(false)}>
              {t('create')}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* 查看事件模态框 */}
      <Modal
        isOpen={isViewEventModalOpen}
        onClose={() => setIsViewEventModalOpen(false)}
        title={selectedEvent?.title || t('event_details')}
      >
        <div className="p-4">
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('time')}</h4>
                <p>
                  {format(new Date(selectedEvent.startTime), 'PPP')} {format(new Date(selectedEvent.startTime), 'HH:mm')} - {format(new Date(selectedEvent.endTime), 'HH:mm')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('type')}</h4>
                <p>{t(`event_type_${selectedEvent.type}`)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{t('status')}</h4>
                <Badge
                  variant="outline"
                  className={`${
                    selectedEvent.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    selectedEvent.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                    selectedEvent.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                    selectedEvent.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  {t(`status_${selectedEvent.status}`)}
                </Badge>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('description')}</h4>
                  <p>{selectedEvent.description}</p>
                </div>
              )}
              
              {selectedEvent.clientName && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t('client')}</h4>
                  <p>{selectedEvent.clientName}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewEventModalOpen(false);
                    setIsEditEventModalOpen(true);
                  }}
                >
                  {t('edit')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  {t('delete')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      
      {/* 编辑事件模态框 */}
      <Modal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        title={t('edit_event')}
      >
        <div className="p-4">
          <p>{t('event_form_placeholder')}</p>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => setIsEditEventModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button onClick={() => setIsEditEventModalOpen(false)}>
              {t('save')}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

export default ConsultantSchedulePage;
