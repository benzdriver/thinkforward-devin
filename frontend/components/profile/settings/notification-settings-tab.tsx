import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { FormField } from '../../../components/form/form-field';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useProfileSettingsStore } from '../../../lib/store/zustand/useProfileSettingsStore';
import { 
  useGetNotificationSettings, 
  useUpdateNotificationSettings 
} from '../../../lib/api/services/profile-settings';

export const NotificationSettingsTab: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const { 
    notificationSettings, 
    updateNotificationSettings, 
    setNotificationSettings, 
    setError 
  } = useProfileSettingsStore();
  
  const notificationSettingsQuery = useGetNotificationSettings(user?.id || '');
  const updateNotificationSettingsMutation = useUpdateNotificationSettings(user?.id || '');
  
  React.useEffect(() => {
    if (notificationSettingsQuery.data && !notificationSettings) {
      setNotificationSettings(notificationSettingsQuery.data);
    }
  }, [notificationSettingsQuery.data, notificationSettings, setNotificationSettings]);
  
  const handleNotificationSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationSettings) return;
    
    try {
      const result = await updateNotificationSettingsMutation.mutateAsync(notificationSettings);
      setNotificationSettings(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新通知设置失败');
    }
  };
  
  if (!notificationSettings) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">{t('profile.notifications.title') as string}</h2>
      
      <form onSubmit={handleNotificationSettingsUpdate} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">{t('profile.notifications.emailSection') as string}</h3>
          <div className="space-y-3">
            <FormField
              id="email-marketing"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.emailMarketing') as string}
                description={t('profile.notifications.emailMarketingDesc') as string}
                checked={notificationSettings.email.marketing}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    email: { ...notificationSettings.email, marketing: e.target.checked } 
                  })
                }
              />
              <div className="space-y-1">
                <label 
                  htmlFor="email-marketing" 
                  className="font-medium cursor-pointer"
                >
                  {t('profile.notifications.emailMarketing') as string}
                </label>
                <p className="text-sm text-neutral-500">
                  {t('profile.notifications.emailMarketingDesc') as string}
                </p>
              </div>
            </FormField>
            
            <FormField
              id="email-updates"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.emailUpdates') as string}
                description={t('profile.notifications.emailUpdatesDesc') as string}
                checked={notificationSettings.email.updates}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    email: { ...notificationSettings.email, updates: e.target.checked } 
                  })
                }
              />
            </FormField>
            
            <FormField
              id="email-security"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.emailSecurity') as string}
                description={t('profile.notifications.emailSecurityDesc') as string}
                checked={notificationSettings.email.security}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    email: { ...notificationSettings.email, security: e.target.checked } 
                  })
                }
              />
            </FormField>
            
            <FormField
              id="email-reminders"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.emailReminders') as string}
                description={t('profile.notifications.emailRemindersDesc') as string}
                checked={notificationSettings.email.reminders}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    email: { ...notificationSettings.email, reminders: e.target.checked } 
                  })
                }
              />
            </FormField>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">{t('profile.notifications.pushSection') as string}</h3>
          <div className="space-y-3">
            <FormField
              id="push-messages"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.pushMessages') as string}
                description={t('profile.notifications.pushMessagesDesc') as string}
                checked={notificationSettings.push.messages}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    push: { ...notificationSettings.push, messages: e.target.checked } 
                  })
                }
              />
            </FormField>
            
            <FormField
              id="push-taskUpdates"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.pushTaskUpdates') as string}
                description={t('profile.notifications.pushTaskUpdatesDesc') as string}
                checked={notificationSettings.push.taskUpdates}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    push: { ...notificationSettings.push, taskUpdates: e.target.checked } 
                  })
                }
              />
            </FormField>
            
            <FormField
              id="push-appointments"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.pushAppointments') as string}
                description={t('profile.notifications.pushAppointmentsDesc') as string}
                checked={notificationSettings.push.appointments}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    push: { ...notificationSettings.push, appointments: e.target.checked } 
                  })
                }
              />
            </FormField>
            
            <FormField
              id="push-documentUpdates"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.pushDocumentUpdates') as string}
                description={t('profile.notifications.pushDocumentUpdatesDesc') as string}
                checked={notificationSettings.push.documentUpdates}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    push: { ...notificationSettings.push, documentUpdates: e.target.checked } 
                  })
                }
              />
            </FormField>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">{t('profile.notifications.smsSection') as string}</h3>
          <div className="space-y-3">
            <FormField
              id="sms-security"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.smsSecurity') as string}
                description={t('profile.notifications.smsSecurityDesc') as string}
                checked={notificationSettings.sms.security}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    sms: { ...notificationSettings.sms, security: e.target.checked } 
                  })
                }
              />
            </FormField>
            
            <FormField
              id="sms-appointments"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.smsAppointments') as string}
                description={t('profile.notifications.smsAppointmentsDesc') as string}
                checked={notificationSettings.sms.appointments}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    sms: { ...notificationSettings.sms, appointments: e.target.checked } 
                  })
                }
              />
            </FormField>
            
            <FormField
              id="sms-importantUpdates"
              className="flex items-start space-x-3"
            >
              <Checkbox
                label={t('profile.notifications.smsImportantUpdates') as string}
                description={t('profile.notifications.smsImportantUpdatesDesc') as string}
                checked={notificationSettings.sms.importantUpdates}
                onChange={(e) => 
                  updateNotificationSettings({ 
                    sms: { ...notificationSettings.sms, importantUpdates: e.target.checked } 
                  })
                }
              />
            </FormField>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={updateNotificationSettingsMutation.isPending}
          >
            {t('profile.notifications.saveChanges') as string}
          </Button>
        </div>
      </form>
    </Card>
  );
};
