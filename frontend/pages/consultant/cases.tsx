import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { SearchInput } from '../../components/form/search-input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Dropdown } from '../../components/ui/dropdown';
import { Modal } from '../../components/ui/modal';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { DatePicker } from '../../components/form/date-picker';
import { FormField } from '../../components/form/form-field';
import { LoadingState } from '../../components/ui/loading-state';
import { EmptyState } from '../../components/ui/empty-state';
import { ErrorState } from '../../components/ui/error-state';
import { useAuth } from '../../lib/auth/AuthContext';
import { useCasesStore } from '../../lib/store/zustand/useCasesStore';
import {
  useCases,
  useCaseStats,
  useCaseTypes,
  useCreateCase,
  useUpdateCase,
  useDeleteCase
} from '../../lib/api/services/cases';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

const CasesPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuth();
  const consultantId = user?.id || '';

  const {
    cases,
    stats,
    caseTypes,
    filters,
    pagination,
    viewMode,
    selectedCaseIds,
    isCreateModalOpen,
    isDetailDrawerOpen,
    isLoading,
    error,
    setCases,
    setStats,
    setCaseTypes,
    setFilters,
    setPagination,
    setViewMode,
    setSelectedCaseIds,
    toggleCaseSelection,
    clearSelectedCases,
    setCreateModalOpen,
    setDetailDrawerOpen,
    resetFilters,
  } = useCasesStore();

  const casesQuery = useCases(consultantId, {
    ...filters,
    page: pagination.page,
    limit: pagination.limit,
  });

  const statsQuery = useCaseStats(consultantId);
  const typesQuery = useCaseTypes(consultantId);
  const createCaseMutation = useCreateCase();
  const updateCaseMutation = useUpdateCase();
  const deleteCaseMutation = useDeleteCase();

  const [newCaseData, setNewCaseData] = useState({
    title: '',
    clientId: '',
    type: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
  const [dateLocale, setDateLocale] = useState(enUS);

  useEffect(() => {
    if (casesQuery.data) {
      setCases(casesQuery.data.cases);
      setPagination({
        total: casesQuery.data.total,
      });
    }
  }, [casesQuery.data, setCases, setPagination]);

  useEffect(() => {
    if (statsQuery.data) {
      setStats(statsQuery.data);
    }
  }, [statsQuery.data, setStats]);

  useEffect(() => {
    if (typesQuery.data) {
      setCaseTypes(typesQuery.data);
    }
  }, [typesQuery.data, setCaseTypes]);

  useEffect(() => {
    const currentLocale = router.locale || 'en';
    setDateLocale(currentLocale === 'zh' ? zhCN : enUS);
  }, [router.locale]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters({ [key]: value });
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
  };

  const handleCreateCase = async () => {
    if (!newCaseData.title || !newCaseData.clientId || !newCaseData.type) {
      return;
    }

    try {
      const result = await createCaseMutation.mutateAsync({
        consultantId,
        caseData: newCaseData,
      });

      if (result) {
        setCreateModalOpen(false);
        setNewCaseData({
          title: '',
          clientId: '',
          type: '',
          description: '',
          priority: 'medium',
          dueDate: '',
        });
        casesQuery.refetch();
        statsQuery.refetch();
      }
    } catch (error) {
      console.error('Failed to create case:', error);
    }
  };

  const handleDeleteCase = async () => {
    if (!caseToDelete) return;

    try {
      await deleteCaseMutation.mutateAsync({
        consultantId,
        caseId: caseToDelete,
      });

      setIsDeleteModalOpen(false);
      setCaseToDelete(null);
      casesQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      console.error('Failed to delete case:', error);
    }
  };

  const handleCaseClick = (caseId: string) => {
    setSelectedCase(caseId);
    setDetailDrawerOpen(true);
  };

  const handleBulkAction = async (action: 'delete' | 'archive' | 'export') => {
    if (selectedCaseIds.length === 0) return;

    if (action === 'delete') {
    } else if (action === 'archive') {
    } else if (action === 'export') {
    }
  };

  const renderCaseStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('cases.stats.total')}</h3>
          <p className="text-2xl font-bold">{stats.totalCases}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('cases.stats.open')}</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.openCases}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('cases.stats.inProgress')}</h3>
          <p className="text-2xl font-bold text-green-600">{stats.inProgressCases}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('cases.stats.pending')}</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingCases}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('cases.stats.closed')}</h3>
          <p className="text-2xl font-bold text-gray-600">{stats.closedCases}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">{t('cases.stats.archived')}</h3>
          <p className="text-2xl font-bold text-gray-400">{stats.archivedCases}</p>
        </Card>
      </div>
    );
  };

  const renderFilters = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <SearchInput
            placeholder={t('cases.filters.search')}
            value={filters.search}
            onChange={(value) => handleFilterChange('search', value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            placeholder={t('cases.filters.status')}
            value={filters.status || ''}
            onChange={(value) => handleFilterChange('status', value || null)}
            options={[
              { value: 'open', label: t('cases.status.open') },
              { value: 'in-progress', label: t('cases.status.inProgress') },
              { value: 'pending', label: t('cases.status.pending') },
              { value: 'closed', label: t('cases.status.closed') },
              { value: 'archived', label: t('cases.status.archived') },
            ]}
            className="w-32"
          />
          <Select
            placeholder={t('cases.filters.type')}
            value={filters.type || ''}
            onChange={(value) => handleFilterChange('type', value || null)}
            options={caseTypes.map((type) => ({ value: type, label: type }))}
            className="w-40"
          />
          <Select
            placeholder={t('cases.filters.priority')}
            value={filters.priority || ''}
            onChange={(value) => handleFilterChange('priority', value || null)}
            options={[
              { value: 'low', label: t('cases.priority.low') },
              { value: 'medium', label: t('cases.priority.medium') },
              { value: 'high', label: t('cases.priority.high') },
            ]}
            className="w-32"
          />
          <DatePicker
            placeholder={t('cases.filters.startDate')}
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(date) =>
              handleFilterChange('startDate', date ? date.toISOString() : null)
            }
            locale={dateLocale}
            className="w-40"
          />
          <DatePicker
            placeholder={t('cases.filters.endDate')}
            value={filters.endDate ? new Date(filters.endDate) : undefined}
            onChange={(date) =>
              handleFilterChange('endDate', date ? date.toISOString() : null)
            }
            locale={dateLocale}
            className="w-40"
          />
          <Button
            variant="outline"
            onClick={() => resetFilters()}
            className="ml-2"
          >
            {t('common.reset')}
          </Button>
        </div>
      </div>
    );
  };

  const renderViewToggle = () => {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Tabs value={viewMode} onValueChange={(value) => handleViewModeChange(value as 'table' | 'grid')}>
          <TabsList>
            <TabsTrigger value="table">{t('cases.view.table')}</TabsTrigger>
            <TabsTrigger value="grid">{t('cases.view.grid')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex-grow"></div>
        {selectedCaseIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {t('cases.selected', { count: selectedCaseIds.length })}
            </span>
            <Dropdown
              trigger={
                <Button variant="outline" size="sm">
                  {t('cases.bulkActions')}
                </Button>
              }
              items={[
                {
                  label: t('common.delete'),
                  onClick: () => handleBulkAction('delete'),
                },
                {
                  label: t('cases.actions.archive'),
                  onClick: () => handleBulkAction('archive'),
                },
                {
                  label: t('cases.actions.export'),
                  onClick: () => handleBulkAction('export'),
                },
              ]}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearSelectedCases()}
            >
              {t('common.clear')}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderCaseStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      open: { color: 'bg-blue-100 text-blue-800', label: t('cases.status.open') },
      'in-progress': { color: 'bg-green-100 text-green-800', label: t('cases.status.inProgress') },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: t('cases.status.pending') },
      closed: { color: 'bg-gray-100 text-gray-800', label: t('cases.status.closed') },
      archived: { color: 'bg-gray-100 text-gray-500', label: t('cases.status.archived') },
    };

    const { color, label } = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return <Badge className={color}>{label}</Badge>;
  };

  const renderCasePriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { color: string; label: string }> = {
      low: { color: 'bg-gray-100 text-gray-800', label: t('cases.priority.low') },
      medium: { color: 'bg-blue-100 text-blue-800', label: t('cases.priority.medium') },
      high: { color: 'bg-red-100 text-red-800', label: t('cases.priority.high') },
    };

    const { color, label } = priorityMap[priority] || { color: 'bg-gray-100 text-gray-800', label: priority };

    return <Badge className={color}>{label}</Badge>;
  };

  const renderTableView = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedCaseIds.length > 0 && selectedCaseIds.length === cases.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCaseIds(cases.map((c) => c.id));
                    } else {
                      clearSelectedCases();
                    }
                  }}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.title')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.client')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.type')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.priority')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.progress')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.dueDate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('cases.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cases.map((caseItem) => (
              <tr
                key={caseItem.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCaseClick(caseItem.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedCaseIds.includes(caseItem.id)}
                    onChange={() => toggleCaseSelection(caseItem.id)}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {caseItem.clientAvatar && (
                      <img
                        className="h-8 w-8 rounded-full mr-2"
                        src={caseItem.clientAvatar}
                        alt={caseItem.clientName}
                      />
                    )}
                    <div className="text-sm font-medium text-gray-900">{caseItem.clientName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{caseItem.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderCaseStatusBadge(caseItem.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderCasePriorityBadge(caseItem.priority)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${caseItem.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{caseItem.progress}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {caseItem.dueDate
                      ? format(new Date(caseItem.dueDate), 'yyyy-MM-dd')
                      : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="sm">
                        {t('common.actions')}
                      </Button>
                    }
                    items={[
                      {
                        label: t('common.view'),
                        onClick: () => handleCaseClick(caseItem.id),
                      },
                      {
                        label: t('common.edit'),
                        onClick: () => {
                          handleCaseClick(caseItem.id);
                        },
                      },
                      {
                        label: t('common.delete'),
                        onClick: () => {
                          setCaseToDelete(caseItem.id);
                          setIsDeleteModalOpen(true);
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((caseItem) => (
          <Card
            key={caseItem.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCaseClick(caseItem.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 truncate" title={caseItem.title}>
                  {caseItem.title}
                </h3>
                <p className="text-sm text-gray-500">{caseItem.type}</p>
              </div>
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedCaseIds.includes(caseItem.id)}
                  onChange={() => toggleCaseSelection(caseItem.id)}
                  className="h-4 w-4 text-primary border-gray-300 rounded mr-2"
                />
                <Dropdown
                  trigger={
                    <Button variant="ghost" size="sm" className="p-1">
                      <span className="sr-only">{t('common.actions')}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </Button>
                  }
                  items={[
                    {
                      label: t('common.view'),
                      onClick: () => handleCaseClick(caseItem.id),
                    },
                    {
                      label: t('common.edit'),
                      onClick: () => {
                        handleCaseClick(caseItem.id);
                      },
                    },
                    {
                      label: t('common.delete'),
                      onClick: () => {
                        setCaseToDelete(caseItem.id);
                        setIsDeleteModalOpen(true);
                      },
                    },
                  ]}
                />
              </div>
            </div>
            <div className="flex items-center mb-2">
              {caseItem.clientAvatar && (
                <img
                  className="h-8 w-8 rounded-full mr-2"
                  src={caseItem.clientAvatar}
                  alt={caseItem.clientName}
                />
              )}
              <span className="text-sm font-medium">{caseItem.clientName}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div>{renderCaseStatusBadge(caseItem.status)}</div>
              <div>{renderCasePriorityBadge(caseItem.priority)}</div>
            </div>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${caseItem.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{t('cases.progress')}: {caseItem.progress}%</span>
                {caseItem.dueDate && (
                  <span className="text-xs text-gray-500">
                    {t('cases.dueDate')}: {format(new Date(caseItem.dueDate), 'yyyy-MM-dd')}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          {t('common.pagination.showing')} <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>{' '}
          {t('common.pagination.to')}{' '}
          <span className="font-medium">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{' '}
          {t('common.pagination.of')} <span className="font-medium">{pagination.total}</span>{' '}
          {t('common.pagination.results')}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            {t('common.pagination.previous')}
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          {totalPages > 5 && <span>...</span>}
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            {t('common.pagination.next')}
          </Button>
        </div>
      </div>
    );
  };

  const renderCreateCaseModal = () => {
    return (
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={t('cases.create.title')}
      >
        <div className="space-y-4">
          <FormField
            label={t('cases.create.caseTitle')}
            required
          >
            <Input
              value={newCaseData.title}
              onChange={(e) => setNewCaseData({ ...newCaseData, title: e.target.value })}
              placeholder={t('cases.create.caseTitlePlaceholder')}
            />
          </FormField>
          <FormField
            label={t('cases.create.client')}
            required
          >
            <Select
              value={newCaseData.clientId}
              onChange={(value) => setNewCaseData({ ...newCaseData, clientId: value || '' })}
              placeholder={t('cases.create.selectClient')}
              options={[
                { value: 'client-1', label: '张三' },
                { value: 'client-2', label: '李四' },
              ]}
            />
          </FormField>
          <FormField
            label={t('cases.create.type')}
            required
          >
            <Select
              value={newCaseData.type}
              onChange={(value) => setNewCaseData({ ...newCaseData, type: value || '' })}
              placeholder={t('cases.create.selectType')}
              options={caseTypes.map((type) => ({ value: type, label: type }))}
            />
          </FormField>
          <FormField
            label={t('cases.create.description')}
          >
            <Textarea
              value={newCaseData.description}
              onChange={(e) => setNewCaseData({ ...newCaseData, description: e.target.value })}
              placeholder={t('cases.create.descriptionPlaceholder')}
              rows={4}
            />
          </FormField>
          <FormField
            label={t('cases.create.priority')}
          >
            <Select
              value={newCaseData.priority}
              onChange={(value) => setNewCaseData({ ...newCaseData, priority: (value as 'low' | 'medium' | 'high') || 'medium' })}
              placeholder={t('cases.create.selectPriority')}
              options={[
                { value: 'low', label: t('cases.priority.low') },
                { value: 'medium', label: t('cases.priority.medium') },
                { value: 'high', label: t('cases.priority.high') },
              ]}
            />
          </FormField>
          <FormField
            label={t('cases.create.dueDate')}
          >
            <DatePicker
              value={newCaseData.dueDate ? new Date(newCaseData.dueDate) : undefined}
              onChange={(date) => setNewCaseData({ ...newCaseData, dueDate: date ? date.toISOString() : '' })}
              placeholder={t('cases.create.selectDueDate')}
              locale={dateLocale}
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setCreateModalOpen(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleCreateCase}
            disabled={!newCaseData.title || !newCaseData.clientId || !newCaseData.type || createCaseMutation.isPending}
          >
            {createCaseMutation.isPending ? t('common.creating') : t('common.create')}
          </Button>
        </div>
      </Modal>
    );
  };

  const renderDeleteConfirmationModal = () => {
    return (
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('cases.delete.title')}
      >
        <p className="text-gray-700 mb-6">{t('cases.delete.confirmation')}</p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCase}
            disabled={deleteCaseMutation.isPending}
          >
            {deleteCaseMutation.isPending ? t('common.deleting') : t('common.delete')}
          </Button>
        </div>
      </Modal>
    );
  };

  if (isLoading.cases || casesQuery.isLoading) {
    return (
      <DashboardLayout>
        <PageHeader
          title={t('cases.title')}
          description={t('cases.description')}
        />
        <SectionContainer>
          <LoadingState message={t('common.loading')} />
        </SectionContainer>
      </DashboardLayout>
    );
  }

  if (error.cases || casesQuery.isError) {
    return (
      <DashboardLayout>
        <PageHeader
          title={t('cases.title')}
          description={t('cases.description')}
        />
        <SectionContainer>
          <ErrorState
            message={t('common.error')}
            retryAction={() => casesQuery.refetch()}
          />
        </SectionContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={t('cases.title')}
        description={t('cases.description')}
        actions={
          <Button onClick={() => setCreateModalOpen(true)}>
            {t('cases.create.button')}
          </Button>
        }
      />
      <SectionContainer>
        {renderCaseStats()}
        {renderFilters()}
        {renderViewToggle()}
        
        {cases.length === 0 ? (
          <EmptyState
            title={t('cases.empty.title')}
            description={t('cases.empty.description')}
            action={
              <Button onClick={() => setCreateModalOpen(true)}>
                {t('cases.create.button')}
              </Button>
            }
          />
        ) : (
          <>
            {viewMode === 'table' ? renderTableView() : renderGridView()}
            {renderPagination()}
          </>
        )}
        
        {renderCreateCaseModal()}
        {renderDeleteConfirmationModal()}
      </SectionContainer>
    </DashboardLayout>
  );
};

export default CasesPage;
