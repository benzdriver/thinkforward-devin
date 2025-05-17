import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { SectionContainer } from '../../components/layout/section-container';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Modal } from '../../components/ui/modal';
import { Select } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { LoadingState } from '../../components/ui/loading-state';
import { ErrorState } from '../../components/ui/error-state';
import { EmptyState } from '../../components/ui/empty-state';
import { useAdminUsersStore } from '../../lib/store/zustand/useAdminUsersStore';
import { User, UserRole } from '../../lib/store/zustand/useAdminUsersStore';

const AdminUsersPage: React.FC = () => {
  const { t } = useTranslation('common');
  const {
    users,
    filteredUsers,
    pagination,
    filters,
    isLoading,
    error,
    activeTab,
    selectedUsers,
    isInviteModalOpen,
    isDeleteModalOpen,
    isEditModalOpen,
    editingUser,
    
    setActiveTab,
    setFilters,
    setPagination,
    fetchUsers,
    selectUser,
    deselectUser,
    selectAllUsers,
    deselectAllUsers,
    openInviteModal,
    closeInviteModal,
    openDeleteModal,
    closeDeleteModal,
    openEditModal,
    closeEditModal,
    setEditingUser,
    inviteUsers,
    deleteUsers,
    updateUser,
    resetState,
  } = useAdminUsersStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('client');
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchUsers();
    return () => resetState();
  }, [fetchUsers, resetState]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setFilters]);

  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  const handleRoleFilter = (role: string | null) => {
    setFilters({ role: role as UserRole | null });
  };

  const handleStatusFilter = (status: string | null) => {
    setFilters({ status: status as 'active' | 'inactive' | 'pending' | null });
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    if (bulkAction === 'delete') {
      openDeleteModal();
    } else if (bulkAction === 'activate') {
      updateUser(selectedUsers, { status: 'active' });
    } else if (bulkAction === 'deactivate') {
      updateUser(selectedUsers, { status: 'inactive' });
    }

    setBulkAction('');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = inviteEmails.split(/[\s,]+/).filter(Boolean);
    if (emails.length > 0) {
      inviteUsers(emails, inviteRole);
      setInviteEmails('');
      setInviteRole('client');
      closeInviteModal();
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser([editingUser.id], editingUser);
      closeEditModal();
    }
  };

  const handleDeleteConfirm = () => {
    deleteUsers(selectedUsers);
    closeDeleteModal();
    deselectAllUsers();
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      selectAllUsers(filteredUsers.map(user => user.id));
    } else {
      deselectAllUsers();
    }
  };

  const handleUserSelectChange = (userId: string, checked: boolean) => {
    if (checked) {
      selectUser(userId);
    } else {
      deselectUser(userId);
    }
  };

  if (isLoading && !users.length) {
    return (
      <DashboardLayout>
        <PageHeader title={t('user_management')} />
        <LoadingState title={t('loading_users')} />
      </DashboardLayout>
    );
  }

  if (error && !users.length) {
    return (
      <DashboardLayout>
        <PageHeader title={t('user_management')} />
        <ErrorState
          title={t('error_loading_users')}
          description={error}
          retryAction={
            <Button onClick={() => fetchUsers()}>
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
        title={t('user_management')} 
        description={t('user_management_description')}
        actions={
          <Button onClick={openInviteModal}>
            {t('invite_users')}
          </Button>
        }
      />

      <div className="mb-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="w-full md:w-1/3">
              <Input
                placeholder={t('search_users') as string}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.role || ''}
                onChange={(value: string) => handleRoleFilter(value || null)}
                className="w-full sm:w-auto"
                options={[
                  { value: '', label: t('all_roles') as string },
                  { value: 'admin', label: t('admin') as string },
                  { value: 'consultant', label: t('consultant') as string },
                  { value: 'client', label: t('client') as string }
                ]}
              />
              
              <Select
                value={filters.status || ''}
                onChange={(value: string) => handleStatusFilter(value || null)}
                className="w-full sm:w-auto"
                options={[
                  { value: '', label: t('all_statuses') as string },
                  { value: 'active', label: t('active') as string },
                  { value: 'inactive', label: t('inactive') as string },
                  { value: 'pending', label: t('pending') as string }
                ]}
              />
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">{t('all_users')}</TabsTrigger>
          <TabsTrigger value="admin">{t('admins')}</TabsTrigger>
          <TabsTrigger value="consultant">{t('consultants')}</TabsTrigger>
          <TabsTrigger value="client">{t('clients')}</TabsTrigger>
          <TabsTrigger value="pending">{t('pending_users')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <SectionContainer title={t('users')} className="mb-8">
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Select
                  value={bulkAction}
                  onChange={(value: string) => setBulkAction(value)}
                  className="w-40"
                  options={[
                    { value: '', label: t('bulk_actions') as string },
                    { value: 'activate', label: t('activate') as string },
                    { value: 'deactivate', label: t('deactivate') as string },
                    { value: 'delete', label: t('delete') as string }
                  ]}
                />
                <Button 
                  variant="secondary" 
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                >
                  {t('apply')}
                </Button>
                <span className="text-sm text-gray-500">
                  {t('selected_users', { count: selectedUsers.length })}
                </span>
              </div>
            )}

            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left">
                        <Checkbox 
                          checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                          onChange={(e) => handleSelectAllChange(e.target.checked)}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('user')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('email')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('role')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('status')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('joined_date')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => handleUserSelectChange(user.id, e.target.checked)}
                          />
                        </td>
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
                            user.role === 'admin' ? 'destructive' : 
                            user.role === 'consultant' ? 'info' : 'default'
                          }>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={
                            user.status === 'active' ? 'success' : 
                            user.status === 'pending' ? 'warning' : 'default'
                          }>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                openEditModal();
                              }}
                            >
                              {t('edit')}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                selectUser(user.id);
                                openDeleteModal();
                              }}
                            >
                              {t('delete')}
                            </Button>
                          </div>
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
                  <Button onClick={openInviteModal}>
                    {t('invite_users')}
                  </Button>
                }
              />
            )}

            {pagination.total > pagination.limit && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    {t('previous')}
                  </Button>
                  
                  <span className="text-sm">
                    {t('page_of_total', { page: pagination.page, total: Math.ceil(pagination.total / pagination.limit) })}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  >
                    {t('next')}
                  </Button>
                </div>
              </div>
            )}
          </SectionContainer>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          {/* Similar content as "all" tab but filtered for admins */}
        </TabsContent>

        <TabsContent value="consultant" className="space-y-6">
          {/* Similar content as "all" tab but filtered for consultants */}
        </TabsContent>

        <TabsContent value="client" className="space-y-6">
          {/* Similar content as "all" tab but filtered for clients */}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Similar content as "all" tab but filtered for pending users */}
        </TabsContent>
      </Tabs>

      {/* Invite Users Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        title={t('invite_users')}
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email_addresses')}
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              value={inviteEmails}
              onChange={(e) => setInviteEmails(e.target.value)}
              placeholder={t('invite_emails_placeholder') as string}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('invite_emails_help')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('role')}
            </label>
            <Select
              value={inviteRole}
              onChange={(value: string) => setInviteRole(value as UserRole)}
              className="w-full"
              options={[
                { value: 'client', label: t('client') as string },
                { value: 'consultant', label: t('consultant') as string },
                { value: 'admin', label: t('admin') as string }
              ]}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeInviteModal}
            >
              {t('cancel')}
            </Button>
            <Button type="submit">
              {t('send_invitations')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title={t('edit_user')}
      >
        {editingUser && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('name')}
              </label>
              <Input
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')}
              </label>
              <Input
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full"
                type="email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('role')}
              </label>
              <Select
                value={editingUser.role}
                onChange={(value: string) => setEditingUser({ ...editingUser, role: value as UserRole })}
                className="w-full"
                options={[
                  { value: 'client', label: t('client') as string },
                  { value: 'consultant', label: t('consultant') as string },
                  { value: 'admin', label: t('admin') as string }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('status')}
              </label>
              <Select
                value={editingUser.status}
                onChange={(value: string) => setEditingUser({ ...editingUser, status: value as 'active' | 'inactive' | 'pending' })}
                className="w-full"
                options={[
                  { value: 'active', label: t('active') as string },
                  { value: 'inactive', label: t('inactive') as string },
                  { value: 'pending', label: t('pending') as string }
                ]}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditModal}
              >
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('save_changes')}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title={t('confirm_deletion')}
      >
        <div className="space-y-4">
          <p>
            {t('delete_users_confirmation', { count: selectedUsers.length })}
          </p>
          <p className="text-sm text-red-500">
            {t('delete_users_warning')}
          </p>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              {t('delete')}
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
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default AdminUsersPage;
