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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Checkbox } from '../../components/ui/checkbox';
import { Toggle } from '../../components/ui/toggle';
import { Select } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { LoadingState } from '../../components/ui/loading-state';
import { ErrorState } from '../../components/ui/error-state';
import { Modal } from '../../components/ui/modal';
import { useAdminSettingsStore } from '../../lib/store/zustand/useAdminSettingsStore';
import { SystemSettings } from '../../lib/types/admin-settings';

const AdminSettingsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const {
    settings,
    isLoading,
    error,
    activeTab,
    hasUnsavedChanges,
    isResetModalOpen,
    
    setActiveTab,
    fetchSettings,
    updateSettings,
    resetSettings,
    setHasUnsavedChanges,
    openResetModal,
    closeResetModal,
    updateSetting,
  } = useAdminSettingsStore();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateSettings();
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetConfirm = async () => {
    try {
      await resetSettings();
      closeResetModal();
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  const handleInputChange = <K extends keyof SystemSettings, SK extends keyof SystemSettings[K]>(
    category: K,
    key: SK,
    value: SystemSettings[K][SK]
  ) => {
    updateSetting(category, key, value);
    setHasUnsavedChanges(true);
  };

  if (isLoading && !settings) {
    return (
      <DashboardLayout>
        <PageHeader title={t('system_settings')} />
        <LoadingState title={t('loading_settings')} />
      </DashboardLayout>
    );
  }

  if (error && !settings) {
    return (
      <DashboardLayout>
        <PageHeader title={t('system_settings')} />
        <ErrorState
          title={t('error_loading_settings')}
          description={error}
          retryAction={
            <Button onClick={() => fetchSettings()}>
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
        title={t('system_settings')} 
        description={t('system_settings_description')}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={openResetModal}
            >
              {t('reset_to_defaults')}
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges || isSaving}
            >
              {isSaving ? t('saving') : t('save_changes')}
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('integrations')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
          <TabsTrigger value="advanced">{t('advanced')}</TabsTrigger>
        </TabsList>

        {settings && (
          <>
            <TabsContent value="general" className="space-y-6">
              <SectionContainer title={t('general_settings')} className="mb-8">
                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('site_information')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('site_name')}
                        </label>
                        <Input
                          value={settings.general.siteName}
                          onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                          className="w-full max-w-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('site_description')}
                        </label>
                        <Textarea
                          value={settings.general.siteDescription}
                          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                          className="w-full max-w-md"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contact_email')}
                        </label>
                        <Input
                          type="email"
                          value={settings.general.contactEmail}
                          onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                          className="w-full max-w-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('localization')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('default_language')}
                        </label>
                        <Select
                          value={settings.general.defaultLanguage}
                          onChange={(value) => handleInputChange('general', 'defaultLanguage', value)}
                          className="w-full max-w-md"
                          options={[
                            { value: 'en', label: 'English' },
                            { value: 'zh', label: '中文' },
                            { value: 'fr', label: 'Français' }
                          ]}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('timezone')}
                        </label>
                        <Select
                          value={settings.general.timezone}
                          onChange={(value) => handleInputChange('general', 'timezone', value)}
                          className="w-full max-w-md"
                          options={[
                            { value: 'UTC', label: 'UTC' },
                            { value: 'America/New_York', label: 'Eastern Time (ET)' },
                            { value: 'America/Chicago', label: 'Central Time (CT)' },
                            { value: 'America/Denver', label: 'Mountain Time (MT)' },
                            { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                            { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
                            { value: 'Europe/Paris', label: 'Central European Time (CET)' }
                          ]}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('date_format')}
                        </label>
                        <Select
                          value={settings.general.dateFormat}
                          onChange={(value) => handleInputChange('general', 'dateFormat', value)}
                          className="w-full max-w-md"
                          options={[
                            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('features')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enableAssessments"
                          checked={settings.general.enableAssessments}
                          onChange={(e) => handleInputChange('general', 'enableAssessments', e.target.checked)}
                        />
                        <label htmlFor="enableAssessments" className="ml-2 text-sm text-gray-700">
                          {t('enable_assessments')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="enablePathways"
                          checked={settings.general.enablePathways}
                          onChange={(e) => handleInputChange('general', 'enablePathways', e.target.checked)}
                        />
                        <label htmlFor="enablePathways" className="ml-2 text-sm text-gray-700">
                          {t('enable_pathways')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="enableConsultantMatching"
                          checked={settings.general.enableConsultantMatching}
                          onChange={(e) => handleInputChange('general', 'enableConsultantMatching', e.target.checked)}
                        />
                        <label htmlFor="enableConsultantMatching" className="ml-2 text-sm text-gray-700">
                          {t('enable_consultant_matching')}
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </SectionContainer>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <SectionContainer title={t('security_settings')} className="mb-8">
                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('authentication')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enableTwoFactor"
                          checked={settings.security.enableTwoFactor}
                          onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
                        />
                        <label htmlFor="enableTwoFactor" className="ml-2 text-sm text-gray-700">
                          {t('enable_two_factor_authentication')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="requireEmailVerification"
                          checked={settings.security.requireEmailVerification}
                          onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                        />
                        <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-gray-700">
                          {t('require_email_verification')}
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('session_timeout')} (minutes)
                        </label>
                        <Input
                          type="number"
                          min="5"
                          max="1440"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full max-w-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('password_policy')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('minimum_password_length')}
                        </label>
                        <Input
                          type="number"
                          min="6"
                          max="32"
                          value={settings.security.minimumPasswordLength}
                          onChange={(e) => handleInputChange('security', 'minimumPasswordLength', parseInt(e.target.value))}
                          className="w-full max-w-md"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="requireSpecialCharacters"
                          checked={settings.security.requireSpecialCharacters}
                          onChange={(e) => handleInputChange('security', 'requireSpecialCharacters', e.target.checked)}
                        />
                        <label htmlFor="requireSpecialCharacters" className="ml-2 text-sm text-gray-700">
                          {t('require_special_characters')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="requireNumbers"
                          checked={settings.security.requireNumbers}
                          onChange={(e) => handleInputChange('security', 'requireNumbers', e.target.checked)}
                        />
                        <label htmlFor="requireNumbers" className="ml-2 text-sm text-gray-700">
                          {t('require_numbers')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="requireUppercase"
                          checked={settings.security.requireUppercase}
                          onChange={(e) => handleInputChange('security', 'requireUppercase', e.target.checked)}
                        />
                        <label htmlFor="requireUppercase" className="ml-2 text-sm text-gray-700">
                          {t('require_uppercase')}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('rate_limiting')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('max_login_attempts')}
                        </label>
                        <Input
                          type="number"
                          min="3"
                          max="20"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full max-w-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('lockout_duration')} (minutes)
                        </label>
                        <Input
                          type="number"
                          min="5"
                          max="1440"
                          value={settings.security.lockoutDuration}
                          onChange={(e) => handleInputChange('security', 'lockoutDuration', parseInt(e.target.value))}
                          className="w-full max-w-md"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </SectionContainer>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <SectionContainer title={t('notification_settings')} className="mb-8">
                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('email_notifications')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="sendWelcomeEmail"
                          checked={settings.notifications.sendWelcomeEmail}
                          onChange={(e) => handleInputChange('notifications', 'sendWelcomeEmail', e.target.checked)}
                        />
                        <label htmlFor="sendWelcomeEmail" className="ml-2 text-sm text-gray-700">
                          {t('send_welcome_email')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="sendPasswordResetEmail"
                          checked={settings.notifications.sendPasswordResetEmail}
                          onChange={(e) => handleInputChange('notifications', 'sendPasswordResetEmail', e.target.checked)}
                        />
                        <label htmlFor="sendPasswordResetEmail" className="ml-2 text-sm text-gray-700">
                          {t('send_password_reset_email')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="sendAppointmentReminders"
                          checked={settings.notifications.sendAppointmentReminders}
                          onChange={(e) => handleInputChange('notifications', 'sendAppointmentReminders', e.target.checked)}
                        />
                        <label htmlFor="sendAppointmentReminders" className="ml-2 text-sm text-gray-700">
                          {t('send_appointment_reminders')}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('in_app_notifications')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enableInAppNotifications"
                          checked={settings.notifications.enableInAppNotifications}
                          onChange={(e) => handleInputChange('notifications', 'enableInAppNotifications', e.target.checked)}
                        />
                        <label htmlFor="enableInAppNotifications" className="ml-2 text-sm text-gray-700">
                          {t('enable_in_app_notifications')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="showUnreadBadges"
                          checked={settings.notifications.showUnreadBadges}
                          onChange={(e) => handleInputChange('notifications', 'showUnreadBadges', e.target.checked)}
                        />
                        <label htmlFor="showUnreadBadges" className="ml-2 text-sm text-gray-700">
                          {t('show_unread_badges')}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('notification_templates')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('welcome_email_subject')}
                        </label>
                        <Input
                          value={settings.notifications.welcomeEmailSubject}
                          onChange={(e) => handleInputChange('notifications', 'welcomeEmailSubject', e.target.value)}
                          className="w-full max-w-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('appointment_reminder_subject')}
                        </label>
                        <Input
                          value={settings.notifications.appointmentReminderSubject}
                          onChange={(e) => handleInputChange('notifications', 'appointmentReminderSubject', e.target.value)}
                          className="w-full max-w-md"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </SectionContainer>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-6">
              <SectionContainer title={t('integration_settings')} className="mb-8">
                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('api_keys')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('openai_api_key')}
                        </label>
                        <Input
                          type="password"
                          value={settings.integrations.openaiApiKey}
                          onChange={(e) => handleInputChange('integrations', 'openaiApiKey', e.target.value)}
                          className="w-full max-w-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('google_maps_api_key')}
                        </label>
                        <Input
                          type="password"
                          value={settings.integrations.googleMapsApiKey}
                          onChange={(e) => handleInputChange('integrations', 'googleMapsApiKey', e.target.value)}
                          className="w-full max-w-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('payment_gateways')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enableStripe"
                          checked={settings.integrations.enableStripe}
                          onChange={(e) => handleInputChange('integrations', 'enableStripe', e.target.checked)}
                        />
                        <label htmlFor="enableStripe" className="ml-2 text-sm text-gray-700">
                          {t('enable_stripe')}
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('stripe_publishable_key')}
                        </label>
                        <Input
                          type="password"
                          value={settings.integrations.stripePublishableKey}
                          onChange={(e) => handleInputChange('integrations', 'stripePublishableKey', e.target.value)}
                          className="w-full max-w-md"
                          disabled={!settings.integrations.enableStripe}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('stripe_secret_key')}
                        </label>
                        <Input
                          type="password"
                          value={settings.integrations.stripeSecretKey}
                          onChange={(e) => handleInputChange('integrations', 'stripeSecretKey', e.target.value)}
                          className="w-full max-w-md"
                          disabled={!settings.integrations.enableStripe}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('social_login')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enableGoogleLogin"
                          checked={settings.integrations.enableGoogleLogin}
                          onChange={(e) => handleInputChange('integrations', 'enableGoogleLogin', e.target.checked)}
                        />
                        <label htmlFor="enableGoogleLogin" className="ml-2 text-sm text-gray-700">
                          {t('enable_google_login')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="enableFacebookLogin"
                          checked={settings.integrations.enableFacebookLogin}
                          onChange={(e) => handleInputChange('integrations', 'enableFacebookLogin', e.target.checked)}
                        />
                        <label htmlFor="enableFacebookLogin" className="ml-2 text-sm text-gray-700">
                          {t('enable_facebook_login')}
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </SectionContainer>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <SectionContainer title={t('appearance_settings')} className="mb-8">
                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('theme')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('color_scheme')}
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="lightTheme"
                              name="colorScheme"
                              value="light"
                              checked={settings.appearance.colorScheme === 'light'}
                              onChange={() => handleInputChange('appearance', 'colorScheme', 'light')}
                              className="mr-2"
                            />
                            <label htmlFor="lightTheme">{t('light')}</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="darkTheme"
                              name="colorScheme"
                              value="dark"
                              checked={settings.appearance.colorScheme === 'dark'}
                              onChange={() => handleInputChange('appearance', 'colorScheme', 'dark')}
                              className="mr-2"
                            />
                            <label htmlFor="darkTheme">{t('dark')}</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="systemTheme"
                              name="colorScheme"
                              value="system"
                              checked={settings.appearance.colorScheme === 'system'}
                              onChange={() => handleInputChange('appearance', 'colorScheme', 'system')}
                              className="mr-2"
                            />
                            <label htmlFor="systemTheme">{t('system')}</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('primary_color')}
                        </label>
                        <div className="flex items-center space-x-4">
                          {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                            <div key={color} className="flex flex-col items-center">
                              <button
                                type="button"
                                className={`w-8 h-8 rounded-full bg-${color}-500 border-2 ${
                                  settings.appearance.primaryColor === color
                                    ? 'border-black dark:border-white'
                                    : 'border-transparent'
                                }`}
                                onClick={() => handleInputChange('appearance', 'primaryColor', color)}
                                aria-label={`${color} theme`}
                              />
                              <span className="text-xs mt-1 capitalize">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('layout')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enableCompactMode"
                          checked={settings.appearance.enableCompactMode}
                          onChange={(e) => handleInputChange('appearance', 'enableCompactMode', e.target.checked)}
                        />
                        <label htmlFor="enableCompactMode" className="ml-2 text-sm text-gray-700">
                          {t('enable_compact_mode')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="enableAnimations"
                          checked={settings.appearance.enableAnimations}
                          onChange={(e) => handleInputChange('appearance', 'enableAnimations', e.target.checked)}
                        />
                        <label htmlFor="enableAnimations" className="ml-2 text-sm text-gray-700">
                          {t('enable_animations')}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('branding')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('logo_url')}
                        </label>
                        <Input
                          value={settings.appearance.logoUrl}
                          onChange={(e) => handleInputChange('appearance', 'logoUrl', e.target.value)}
                          className="w-full max-w-md"
                        />
                        {settings.appearance.logoUrl && (
                          <div className="mt-2">
                            <img
                              src={settings.appearance.logoUrl}
                              alt="Logo preview"
                              className="h-10 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = '';
                                e.currentTarget.alt = 'Logo preview (invalid URL)';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('favicon_url')}
                        </label>
                        <Input
                          value={settings.appearance.faviconUrl}
                          onChange={(e) => handleInputChange('appearance', 'faviconUrl', e.target.value)}
                          className="w-full max-w-md"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </SectionContainer>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <SectionContainer title={t('advanced_settings')} className="mb-8">
                <Card className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('system_maintenance')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enableMaintenanceMode"
                          checked={settings.advanced.enableMaintenanceMode}
                          onChange={(e) => handleInputChange('advanced', 'enableMaintenanceMode', e.target.checked)}
                        />
                        <label htmlFor="enableMaintenanceMode" className="ml-2 text-sm text-gray-700">
                          {t('enable_maintenance_mode')}
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('maintenance_message')}
                        </label>
                        <Textarea
                          value={settings.advanced.maintenanceMessage}
                          onChange={(e) => handleInputChange('advanced', 'maintenanceMessage', e.target.value)}
                          className="w-full max-w-md"
                          rows={3}
                          disabled={!settings.advanced.enableMaintenanceMode}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('caching')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="enablePageCaching"
                          checked={settings.advanced.enablePageCaching}
                          onChange={(e) => handleInputChange('advanced', 'enablePageCaching', e.target.checked)}
                        />
                        <label htmlFor="enablePageCaching" className="ml-2 text-sm text-gray-700">
                          {t('enable_page_caching')}
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('cache_ttl')} (seconds)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="86400"
                          value={settings.advanced.cacheTTL}
                          onChange={(e) => handleInputChange('advanced', 'cacheTTL', parseInt(e.target.value))}
                          className="w-full max-w-md"
                          disabled={!settings.advanced.enablePageCaching}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('logging')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('log_level')}
                        </label>
                        <Select
                          value={settings.advanced.logLevel}
                          onChange={(value) => handleInputChange('advanced', 'logLevel', value as 'error' | 'warn' | 'info' | 'debug')}
                          className="w-full max-w-md"
                          options={[
                            { value: 'error', label: 'Error' },
                            { value: 'warn', label: 'Warning' },
                            { value: 'info', label: 'Info' },
                            { value: 'debug', label: 'Debug' }
                          ]}
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <Checkbox
                          id="enableErrorReporting"
                          checked={settings.advanced.enableErrorReporting}
                          onChange={(e) => handleInputChange('advanced', 'enableErrorReporting', e.target.checked)}
                        />
                        <label htmlFor="enableErrorReporting" className="ml-2 text-sm text-gray-700">
                          {t('enable_error_reporting')}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('database')}</h3>
                    <div className="space-y-4">
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            alert(t('database_backup_started'));
                          }}
                        >
                          {t('backup_database')}
                        </Button>
                      </div>
                      
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            alert(t('database_cache_cleared'));
                          }}
                        >
                          {t('clear_database_cache')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </SectionContainer>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        title={t('confirm_reset')}
      >
        <div className="space-y-4">
          <p>
            {t('reset_settings_confirmation')}
          </p>
          <p className="text-sm text-red-500">
            {t('reset_settings_warning')}
          </p>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={closeResetModal}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetConfirm}
            >
              {t('reset')}
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

export default AdminSettingsPage;
