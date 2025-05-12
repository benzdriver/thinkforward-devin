import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { LoadingState } from '../../components/ui/loading-state';
import { ErrorState } from '../../components/ui/error-state';
import { EmptyState } from '../../components/ui/empty-state';
import { useAdminDashboardStore } from '../../lib/store/zustand/useAdminDashboardStore';

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const {
    stats,
    users,
    recentActivities,
    systemHealth,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    fetchDashboardData,
    resetState,
  } = useAdminDashboardStore();

  useEffect(() => {
    fetchDashboardData();
    return () => resetState();
  }, [fetchDashboardData, resetState]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader title={t('admin_dashboard')} />
        <LoadingState title={t('loading_dashboard')} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <PageHeader title={t('admin_dashboard')} />
        <ErrorState
          title={t('error_loading_dashboard')}
          description={error}
          retryAction={
            <Button variant="primary" onClick={() => fetchDashboardData()}>
              {t('retry')}
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader 
        title={t('admin_dashboard')} 
        description={t('admin_dashboard_description')}
        actions={
          <Button variant="primary" href="/admin/settings">
            {t('system_settings')}
          </Button>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">{t('total_users')}</h3>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats?.userGrowth > 0 ? '+' : ''}{stats?.userGrowth || 0}% {t('from_last_month')}
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">{t('active_consultants')}</h3>
          <p className="text-3xl font-bold">{stats?.activeConsultants || 0}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats?.consultantGrowth > 0 ? '+' : ''}{stats?.consultantGrowth || 0}% {t('from_last_month')}
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">{t('completed_assessments')}</h3>
          <p className="text-3xl font-bold">{stats?.completedAssessments || 0}</p>
          <p className="text-sm text-gray-500 mt-2">
            {stats?.assessmentGrowth > 0 ? '+' : ''}{stats?.assessmentGrowth || 0}% {t('from_last_month')}
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">{t('system_health')}</h3>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              systemHealth?.status === 'healthy' ? 'bg-green-500' : 
              systemHealth?.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <p className="text-lg font-medium">
              {systemHealth?.status === 'healthy' ? t('healthy') : 
               systemHealth?.status === 'warning' ? t('warning') : t('critical')}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">{systemHealth?.message}</p>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users">{t('recent_users')}</TabsTrigger>
          <TabsTrigger value="activities">{t('system_activities')}</TabsTrigger>
          <TabsTrigger value="health">{t('health_metrics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <SectionContainer title={t('recent_users')} className="mb-8">
            {users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('user')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('email')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('role')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('status')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('joined_date')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                              {user.avatar && (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">{user.email}</td>
                        <td className="px-4 py-4">
                          <Badge variant={
                            user.role === 'admin' ? 'red' : 
                            user.role === 'consultant' ? 'blue' : 'gray'
                          }>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={
                            user.status === 'active' ? 'green' : 
                            user.status === 'pending' ? 'yellow' : 'gray'
                          }>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <Button variant="ghost" size="sm" href={`/admin/users/${user.id}`}>
                            {t('view')}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState 
                title={t('no_users_found')}
                description={t('no_users_found_description')}
                action={
                  <Button variant="primary" href="/admin/users/invite">
                    {t('invite_users')}
                  </Button>
                }
              />
            )}
          </SectionContainer>
        </TabsContent>

        <TabsContent value="activities">
          <SectionContainer title={t('system_activities')} className="mb-8">
            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <Card key={activity.id} className="p-4">
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        activity.type === 'user' ? 'bg-blue-100 text-blue-600' : 
                        activity.type === 'system' ? 'bg-purple-100 text-purple-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'user' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        ) : activity.type === 'system' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6zm6 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-medium">{activity.title}</h4>
                          <span className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        {activity.metadata && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(activity.metadata, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                title={t('no_activities_found')}
                description={t('no_activities_found_description')}
              />
            )}
          </SectionContainer>
        </TabsContent>

        <TabsContent value="health">
          <SectionContainer title={t('health_metrics')} className="mb-8">
            {systemHealth?.metrics && systemHealth.metrics.length > 0 ? (
              <div className="space-y-6">
                {systemHealth.metrics.map((metric) => (
                  <Card key={metric.name} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium">{metric.name}</h4>
                        <p className="text-sm text-gray-500">{metric.description}</p>
                      </div>
                      <Badge variant={
                        metric.status === 'healthy' ? 'green' : 
                        metric.status === 'warning' ? 'yellow' : 'red'
                      }>
                        {metric.status}
                      </Badge>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          metric.status === 'healthy' ? 'bg-green-500' : 
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">{metric.value}%</span>
                      <span className="text-sm text-gray-500">{metric.threshold}% threshold</span>
                    </div>
                    
                    {metric.details && (
                      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                        <p>{metric.details}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                title={t('no_health_metrics')}
                description={t('no_health_metrics_description')}
                action={
                  <Button variant="primary" onClick={() => fetchDashboardData()}>
                    {t('refresh_metrics')}
                  </Button>
                }
              />
            )}
          </SectionContainer>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default AdminDashboardPage;
