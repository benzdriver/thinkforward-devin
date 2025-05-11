import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { LoadingState } from '../../components/ui/loading-state';
import { ErrorState } from '../../components/ui/error-state';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useConsultantDashboardStore } from '../../lib/store/zustand/useConsultantDashboardStore';
import { useConsultantDashboard, useUpdateConsultantStatus, useUpdateTaskStatus } from '../../lib/api/services/consultant-dashboard';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card className="p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-neutral-500">{title}</span>
        {icon && <span className="text-primary-500">{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        {trend && (
          <span className={`text-sm ${trend.isPositive ? 'text-success-500' : 'text-error-500'} flex items-center`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
    </Card>
  );
};

interface AppointmentCardProps {
  appointment: {
    id: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    startTime: string;
    endTime: string;
    type: string;
    status: 'scheduled' | 'confirmed' | 'cancelled';
  };
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onConfirm, onCancel }) => {
  const { t } = useTranslation('common');
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <Card className="p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Avatar
            src={appointment.clientAvatar}
            alt={appointment.clientName}
            fallback={appointment.clientName.substring(0, 2)}
            className="mr-3"
          />
          <div>
            <h4 className="font-medium">{appointment.clientName}</h4>
            <span className="text-sm text-neutral-500">{appointment.type}</span>
          </div>
        </div>
        <Badge
          variant={
            appointment.status === 'confirmed'
              ? 'success'
              : appointment.status === 'cancelled'
              ? 'destructive'
              : 'warning'
          }
        >
          {t(`appointment.status.${appointment.status}`)}
        </Badge>
      </div>
      <div className="flex justify-between items-center text-sm mb-3">
        <div>
          <div className="text-neutral-500">{t('appointment.startTime')}:</div>
          <div>{formatDateTime(appointment.startTime)}</div>
        </div>
        <div>
          <div className="text-neutral-500">{t('appointment.endTime')}:</div>
          <div>{formatDateTime(appointment.endTime)}</div>
        </div>
      </div>
      {appointment.status === 'scheduled' && (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCancel(appointment.id)}
          >
            {t('appointment.cancel')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirm(appointment.id)}
          >
            {t('appointment.confirm')}
          </Button>
        </div>
      )}
    </Card>
  );
};

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    relatedId?: string;
    relatedType?: 'client' | 'case';
  };
  onStatusChange: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange }) => {
  const { t } = useTranslation('common');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  const priorityColor = {
    low: 'bg-info-100 text-info-700',
    medium: 'bg-warning-100 text-warning-700',
    high: 'bg-error-100 text-error-700',
  };
  
  return (
    <div className="border-b border-neutral-200 py-3 last:border-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-medium">{task.title}</h4>
          <div className="flex items-center mt-1 text-sm">
            <span className="text-neutral-500 mr-2">
              {t('task.dueDate')}: {formatDate(task.dueDate)}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColor[task.priority]}`}>
              {t(`task.priority.${task.priority}`)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {task.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(task.id, 'in_progress')}
            >
              {t('task.startWorking')}
            </Button>
          )}
          {task.status === 'in_progress' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusChange(task.id, 'completed')}
            >
              {t('task.complete')}
            </Button>
          )}
          {task.status === 'completed' && (
            <Badge variant="success">{t('task.completed')}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  activity: {
    type: 'message' | 'appointment' | 'document' | 'case_update';
    timestamp: string;
    description: string;
    relatedId: string;
    relatedType: 'client' | 'case' | 'appointment';
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else {
      return `${diffDays}天前`;
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'appointment':
        return '📅';
      case 'document':
        return '📄';
      case 'case_update':
        return '📝';
      default:
        return '🔔';
    }
  };
  
  return (
    <div className="flex items-start py-3 border-b border-neutral-200 last:border-0">
      <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-full mr-3 text-primary-700">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1">
        <p className="text-sm">{activity.description}</p>
        <span className="text-xs text-neutral-500">{formatTime(activity.timestamp)}</span>
      </div>
    </div>
  );
};

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    avatar?: string;
    status: string;
    lastActivity: string;
  };
  onClick: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  return (
    <Card 
      className="p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(client.id)}
    >
      <div className="flex items-center">
        <Avatar
          src={client.avatar}
          alt={client.name}
          fallback={client.name.substring(0, 2)}
          className="mr-3"
        />
        <div className="flex-1">
          <h4 className="font-medium">{client.name}</h4>
          <span className="text-sm text-neutral-500">{client.status}</span>
        </div>
        <span className="text-xs text-neutral-500">{client.lastActivity}</span>
      </div>
    </Card>
  );
};

const ConsultantDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    consultant,
    stats,
    isLoading,
    error,
    setConsultant,
    setStats,
    setLoading,
    setError,
    updateConsultantStatus,
    markTaskAsInProgress,
    markTaskAsCompleted,
  } = useConsultantDashboardStore();
  
  const consultantId = user?.id || '';
  
  const dashboardQuery = useConsultantDashboard(consultantId);
  
  const updateStatusMutation = useUpdateConsultantStatus();
  
  const updateTaskMutation = useUpdateTaskStatus();
  
  useEffect(() => {
    if (dashboardQuery.isLoading) {
      setLoading(true);
    } else if (dashboardQuery.isError) {
      setLoading(false);
      setError((dashboardQuery.error as Error)?.message || '加载仪表盘数据失败');
    } else if (dashboardQuery.data) {
      setLoading(false);
      setError(null);
      setConsultant(dashboardQuery.data.consultant);
      setStats(dashboardQuery.data.stats);
    }
  }, [
    dashboardQuery.isLoading,
    dashboardQuery.isError,
    dashboardQuery.data,
    dashboardQuery.error,
    setLoading,
    setError,
    setConsultant,
    setStats,
  ]);
  
  const handleStatusChange = async (status: 'active' | 'away' | 'offline') => {
    try {
      await updateStatusMutation.mutateAsync({
        consultantId,
        status,
      });
      updateConsultantStatus(status);
    } catch (error) {
      setError((error as Error)?.message || '更新状态失败');
    }
  };
  
  const handleTaskStatusChange = async (
    taskId: string,
    status: 'pending' | 'in_progress' | 'completed'
  ) => {
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        status,
      });
      
      if (status === 'in_progress') {
        markTaskAsInProgress(taskId);
      } else if (status === 'completed') {
        markTaskAsCompleted(taskId);
      }
    } catch (error) {
      setError((error as Error)?.message || '更新任务状态失败');
    }
  };
  
  const handleConfirmAppointment = (appointmentId: string) => {
    console.log('确认预约:', appointmentId);
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    console.log('取消预约:', appointmentId);
  };
  
  const handleClientClick = (clientId: string) => {
    router.push(`/consultant/clients/${clientId}`);
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState description={t('consultant.dashboard.loading')} />
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <ErrorState
          title={t('consultant.dashboard.errorTitle')}
          description={error}
          retryAction={
            <Button onClick={() => dashboardQuery.refetch()}>
              {t('common.retry')}
            </Button>
          }
        />
      </DashboardLayout>
    );
  }
  
  if (!consultant || !stats) {
    return (
      <DashboardLayout>
        <ErrorState
          title={t('consultant.dashboard.noDataTitle')}
          description={t('consultant.dashboard.noDataMessage')}
          retryAction={
            <Button onClick={() => dashboardQuery.refetch()}>
              {t('common.retry')}
            </Button>
          }
        />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      {/* 页面标题 */}
      <PageHeader
        title={t('consultant.dashboard.title')}
        description={t('consultant.dashboard.description')}
        actions={
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">{t('consultant.status')}:</span>
              <select
                value={consultant.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="border border-neutral-300 rounded px-2 py-1 text-sm"
              >
                <option value="active">{t('consultant.status.active')}</option>
                <option value="away">{t('consultant.status.away')}</option>
                <option value="offline">{t('consultant.status.offline')}</option>
              </select>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/consultant/schedule')}
            >
              {t('consultant.viewSchedule')}
            </Button>
          </div>
        }
      />
      
      {/* 统计数据 */}
      <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('consultant.stats.activeClients')}
            value={stats.activeClients}
          />
          <StatCard
            title={t('consultant.stats.pendingAppointments')}
            value={stats.pendingAppointments}
          />
          <StatCard
            title={t('consultant.stats.completedCases')}
            value={stats.completedCases}
          />
          <StatCard
            title={t('consultant.stats.averageRating')}
            value={stats.averageRating.toFixed(1)}
            trend={{ value: 5, isPositive: true }}
          />
        </div>
      </SectionContainer>
      
      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：预约和任务 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 预约部分 */}
          <SectionContainer>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t('consultant.appointments.title')}
              </h3>
              <Button
                variant="link"
                onClick={() => router.push('/consultant/schedule')}
              >
                {t('common.viewAll')}
              </Button>
            </div>
            
            {stats.upcomingAppointments.length > 0 ? (
              <div>
                {stats.upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirmAppointment}
                    onCancel={handleCancelAppointment}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center text-neutral-500">
                {t('consultant.appointments.empty')}
              </Card>
            )}
          </SectionContainer>
          
          {/* 任务部分 */}
          <SectionContainer>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t('consultant.tasks.title')}
              </h3>
              <Button
                variant="link"
                onClick={() => router.push('/consultant/tasks')}
              >
                {t('common.viewAll')}
              </Button>
            </div>
            
            <Card className="p-4">
              {stats.pendingTasks.length > 0 ? (
                <div>
                  {stats.pendingTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onStatusChange={handleTaskStatusChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-neutral-500">
                  {t('consultant.tasks.empty')}
                </div>
              )}
            </Card>
          </SectionContainer>
        </div>
        
        {/* 右侧：活动和客户 */}
        <div className="space-y-6">
          {/* 活动部分 */}
          <SectionContainer>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t('consultant.activity.title')}
              </h3>
              <Button
                variant="link"
                onClick={() => router.push('/consultant/activity')}
              >
                {t('common.viewAll')}
              </Button>
            </div>
            
            <Card className="p-4">
              {stats.recentActivity.length > 0 ? (
                <div>
                  {stats.recentActivity.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-neutral-500">
                  {t('consultant.activity.empty')}
                </div>
              )}
            </Card>
          </SectionContainer>
          
          {/* 客户部分 */}
          <SectionContainer>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t('consultant.clients.title')}
              </h3>
              <Button
                variant="link"
                onClick={() => router.push('/consultant/clients')}
              >
                {t('common.viewAll')}
              </Button>
            </div>
            
            {/* 这里使用模拟数据，实际应用中应从API获取 */}
            {[
              {
                id: 'client-1',
                name: '张三',
                avatar: '',
                status: '正在申请中',
                lastActivity: '今天',
              },
              {
                id: 'client-2',
                name: '李四',
                avatar: '',
                status: '等待文件',
                lastActivity: '昨天',
              },
              {
                id: 'client-3',
                name: '王五',
                avatar: '',
                status: '已提交申请',
                lastActivity: '3天前',
              },
            ].map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={handleClientClick}
              />
            ))}
          </SectionContainer>
        </div>
      </div>
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

export default ConsultantDashboardPage;
