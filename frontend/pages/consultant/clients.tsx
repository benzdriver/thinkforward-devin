import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { Dropdown } from '../../components/ui/dropdown';
import { DropdownMenu } from '../../components/ui/dropdown-menu';
import { EmptyState } from '../../components/ui/empty-state';
import { LoadingState } from '../../components/ui/loading-state';
import { ErrorState } from '../../components/ui/error-state';
import { SearchInput } from '../../components/form/search-input';
import { DatePicker } from '../../components/form/date-picker';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useConsultantClientsStore } from '../../lib/store/zustand/useConsultantClientsStore';
import {
  useConsultantClients,
  useConsultantClientStats,
  useClientTags,
  useClientSources,
  useDeleteClient,
} from '../../lib/api/services/consultant-clients';

const ClientsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  
  const {
    clients,
    stats,
    filters,
    pagination,
    isLoading,
    error,
    setClients,
    setStats,
    setFilters,
    setPagination,
    setLoading,
    setError,
    removeClient,
    resetFilters,
  } = useConsultantClientsStore();
  
  const consultantId = user?.id || '';
  
  const clientsQuery = useConsultantClients(consultantId, {
    search: filters.search,
    status: filters.status || undefined,
    tags: filters.tags,
    source: filters.source || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: pagination.page,
    limit: pagination.limit,
  });
  
  const statsQuery = useConsultantClientStats(consultantId);
  
  const tagsQuery = useClientTags(consultantId);
  const sourcesQuery = useClientSources(consultantId);
  
  const deleteClientMutation = useDeleteClient();
  
  useEffect(() => {
    if (clientsQuery.data) {
      setClients(clientsQuery.data.clients);
      setPagination({
        total: clientsQuery.data.total,
      });
    }
  }, [clientsQuery.data, setClients, setPagination]);
  
  useEffect(() => {
    if (statsQuery.data) {
      setStats(statsQuery.data);
    }
  }, [statsQuery.data, setStats]);
  
  useEffect(() => {
    setLoading(clientsQuery.isLoading || statsQuery.isLoading);
  }, [clientsQuery.isLoading, statsQuery.isLoading, setLoading]);
  
  useEffect(() => {
    if (clientsQuery.error) {
      setError((clientsQuery.error as Error)?.message || '获取客户列表失败');
    } else if (statsQuery.error) {
      setError((statsQuery.error as Error)?.message || '获取统计数据失败');
    } else {
      setError(null);
    }
  }, [clientsQuery.error, statsQuery.error, setError]);
  
  const handleSearch = (value: string) => {
    setFilters({ search: value });
  };
  
  const handleStatusChange = (value: string) => {
    setFilters({ status: value === 'all' ? null : value });
  };
  
  const handleSourceChange = (value: string) => {
    setFilters({ source: value === 'all' ? null : value });
  };
  
  const handleSortChange = (field: string) => {
    if (filters.sortBy === field) {
      setFilters({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setFilters({
        sortBy: field,
        sortOrder: 'desc',
      });
    }
  };
  
  const handlePageChange = (page: number) => {
    setPagination({ page });
  };
  
  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClientMutation.mutateAsync({
        consultantId,
        clientId,
      });
      removeClient(clientId);
    } catch (error) {
      setError((error as Error)?.message || '删除客户失败');
    }
  };
  
  const handleAddClient = () => {
    router.push('/consultant/clients/add');
  };
  
  const handleViewClient = (clientId: string) => {
    router.push(`/consultant/clients/${clientId}`);
  };
  
  const renderStatCards = () => {
    if (!stats) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-neutral-500">{t('consultant.clients.stats.total')}</div>
          <div className="text-2xl font-semibold mt-1">{stats.totalClients}</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-neutral-500">{t('consultant.clients.stats.active')}</div>
          <div className="text-2xl font-semibold mt-1 text-success-600">{stats.activeClients}</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-neutral-500">{t('consultant.clients.stats.inactive')}</div>
          <div className="text-2xl font-semibold mt-1 text-neutral-500">{stats.inactiveClients}</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-neutral-500">{t('consultant.clients.stats.pending')}</div>
          <div className="text-2xl font-semibold mt-1 text-warning-600">{stats.pendingClients}</div>
        </Card>
      </div>
    );
  };
  
  const renderFilters = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder={t('consultant.clients.search') as string}
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Select
            value={filters.status || 'all'}
            onChange={(value) => handleStatusChange(value)}
            className="w-40"
            options={[
              { value: 'all', label: t('consultant.clients.filters.allStatuses') },
              { value: 'active', label: t('consultant.clients.filters.active') },
              { value: 'inactive', label: t('consultant.clients.filters.inactive') },
              { value: 'pending', label: t('consultant.clients.filters.pending') }
            ]}
          />
          
          <Select
            value={filters.source || 'all'}
            onChange={(value) => handleSourceChange(value)}
            className="w-40"
            options={[
              { value: 'all', label: t('consultant.clients.filters.allSources') },
              ...(sourcesQuery.data?.map((source) => ({ value: source, label: source })) || [])
            ]}
          />
          
          <Button
            variant="outline"
            onClick={() => resetFilters()}
            className="whitespace-nowrap"
          >
            {t('common.resetFilters')}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderClientsTable = () => {
    if (clients.length === 0) {
      return (
        <EmptyState
          title={t('consultant.clients.empty.title')}
          description={t('consultant.clients.empty.description')}
          action={
            <Button onClick={handleAddClient}>
              {t('consultant.clients.addClient')}
            </Button>
          }
        />
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="px-4 py-3 text-left font-medium text-sm text-neutral-600">
                {t('consultant.clients.table.client')}
              </th>
              <th 
                className="px-4 py-3 text-left font-medium text-sm text-neutral-600 cursor-pointer"
                onClick={() => handleSortChange('status')}
              >
                {t('consultant.clients.table.status')}
                {filters.sortBy === 'status' && (
                  <span className="ml-1">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-left font-medium text-sm text-neutral-600">
                {t('consultant.clients.table.tags')}
              </th>
              <th 
                className="px-4 py-3 text-left font-medium text-sm text-neutral-600 cursor-pointer"
                onClick={() => handleSortChange('source')}
              >
                {t('consultant.clients.table.source')}
                {filters.sortBy === 'source' && (
                  <span className="ml-1">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="px-4 py-3 text-left font-medium text-sm text-neutral-600 cursor-pointer"
                onClick={() => handleSortChange('lastContactDate')}
              >
                {t('consultant.clients.table.lastContact')}
                {filters.sortBy === 'lastContactDate' && (
                  <span className="ml-1">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="px-4 py-3 text-right font-medium text-sm text-neutral-600">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr 
                key={client.id} 
                className="border-b border-neutral-200 hover:bg-neutral-50 cursor-pointer"
                onClick={() => handleViewClient(client.id)}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <Avatar
                      src={client.avatar}
                      alt={client.displayName}
                      fallback={client.displayName.substring(0, 2)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">{client.displayName}</div>
                      <div className="text-sm text-neutral-500">{client.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge
                    variant={
                      client.status === 'active'
                        ? 'success'
                        : client.status === 'pending'
                        ? 'warning'
                        : 'secondary'
                    }
                  >
                    {t(`consultant.clients.status.${client.status}`)}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {client.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="mr-1">
                        {tag}
                      </Badge>
                    ))}
                    {client.tags.length > 2 && (
                      <Badge variant="outline">+{client.tags.length - 2}</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm">{client.source}</td>
                <td className="px-4 py-4 text-sm">
                  {new Date(client.lastContactDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <DropdownMenu
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        •••
                      </Button>
                    }
                    items={[
                      {
                        label: t('common.view') as string,
                        onClick: () => handleViewClient(client.id),
                      },
                      {
                        label: t('common.edit') as string,
                        onClick: () => router.push(`/consultant/clients/edit/${client.id}`),
                      },
                      {
                        label: t('common.delete') as string,
                        onClick: () => {
                          if (window.confirm(t('consultant.clients.confirmDelete') as string)) {
                            handleDeleteClient(client.id);
                          }
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 分页 */}
        {pagination.total > pagination.limit && (
          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-neutral-500">
              {t('common.pagination.showing', {
                start: (pagination.page - 1) * pagination.limit + 1,
                end: Math.min(pagination.page * pagination.limit, pagination.total),
                total: pagination.total,
              })}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                {t('common.pagination.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page * pagination.limit >= pagination.total}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                {t('common.pagination.next')}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState description={t('consultant.clients.loading')} />;
    }
    
    if (error) {
      return (
        <ErrorState
          title={t('consultant.clients.errorTitle')}
          description={error}
          retryAction={
            <Button onClick={() => {
              clientsQuery.refetch();
              statsQuery.refetch();
            }}>
              {t('common.retry')}
            </Button>
          }
        />
      );
    }
    
    return (
      <>
        {renderStatCards()}
        {renderFilters()}
        <Card className="overflow-hidden">
          {renderClientsTable()}
        </Card>
      </>
    );
  };
  
  return (
    <DashboardLayout>
      <PageHeader
        title={t('consultant.clients.title')}
        description={t('consultant.clients.description')}
        actions={
          <Button onClick={handleAddClient}>
            {t('consultant.clients.addClient')}
          </Button>
        }
      />
      
      {renderContent()}
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

export default ClientsPage;
