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
import { Card } from '../../components/ui/card';
import { Alert } from '../../components/ui/alert';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useProfileSettingsStore } from '../../lib/store/zustand/useProfileSettingsStore';
import { PersonalInfoTab } from '../../components/profile/settings/personal-info-tab';
import { AccountSettingsTab } from '../../components/profile/settings/account-settings-tab';
import { NotificationSettingsTab } from '../../components/profile/settings/notification-settings-tab';
import { PrivacySettingsTab } from '../../components/profile/settings/privacy-settings-tab';
import { SecuritySettingsTab } from '../../components/profile/settings/security-settings-tab';
import { AccountDeletionTab } from '../../components/profile/settings/account-deletion-tab';
import { LoadingState } from '../../components/ui/loading-state';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

const ProfileSettingsPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    activeTab,
    isLoading,
    error,
    setActiveTab,
  } = useProfileSettingsStore();

  useEffect(() => {
    if (!user?.id) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <LoadingState title={t('profile.settings.loading')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={t('profile.settings.title')}
        description={t('profile.settings.description')}
      />

      <SectionContainer>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="personal">{t('profile.settings.tabs.personal')}</TabsTrigger>
            <TabsTrigger value="account">{t('profile.settings.tabs.account')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('profile.settings.tabs.notifications')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('profile.settings.tabs.privacy')}</TabsTrigger>
            <TabsTrigger value="security">{t('profile.settings.tabs.security')}</TabsTrigger>
            <TabsTrigger value="deletion">{t('profile.settings.tabs.deletion')}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <PersonalInfoTab />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettingsTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettingsTab />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySettingsTab />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettingsTab />
          </TabsContent>

          <TabsContent value="deletion">
            <AccountDeletionTab />
          </TabsContent>
        </Tabs>
      </SectionContainer>
    </DashboardLayout>
  );
};

export default ProfileSettingsPage;
