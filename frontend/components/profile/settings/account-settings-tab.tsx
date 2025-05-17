import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { FormField } from '../../../components/form/form-field';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useSettingsStore } from '../../../lib/store/zustand/useSettingsStore';
import { useProfileSettingsStore } from '../../../lib/store/zustand/useProfileSettingsStore';
import { 
  useGetAccountSettings, 
  useUpdateAccountSettings 
} from '../../../lib/api/services/profile-settings';

export const AccountSettingsTab: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const { 
    accountSettings, 
    updateAccountSettings, 
    setAccountSettings, 
    setError 
  } = useProfileSettingsStore();
  
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  
  const accountSettingsQuery = useGetAccountSettings(user?.id || '');
  const updateAccountSettingsMutation = useUpdateAccountSettings(user?.id || '');
  
  React.useEffect(() => {
    if (accountSettingsQuery.data && !accountSettings) {
      setAccountSettings(accountSettingsQuery.data);
    }
  }, [accountSettingsQuery.data, accountSettings, setAccountSettings]);
  
  const handleAccountSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountSettings) return;
    
    try {
      const result = await updateAccountSettingsMutation.mutateAsync(accountSettings);
      setAccountSettings(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新账户设置失败');
    }
  };
  
  if (!accountSettings) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">{t('profile.account.title') as string}</h2>
      
      <form onSubmit={handleAccountSettingsUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="email"
            label={t('profile.account.email') as string}
            message={formErrors.email}
          >
            <Input
              value={accountSettings.email || ''}
              onChange={(e) => updateAccountSettings({ email: e.target.value })}
              placeholder={t('profile.account.emailPlaceholder') as string}
              disabled={accountSettings.emailVerified}
            />
            {accountSettings.emailVerified ? (
              <div className="text-sm text-success-600 mt-1">
                {t('profile.account.emailVerified') as string}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {/* 发送验证邮件 */}}
              >
                {t('profile.account.verifyEmail') as string}
              </Button>
            )}
          </FormField>
          
          <FormField
            id="phone"
            label={t('profile.account.phone') as string}
            message={formErrors.phone}
          >
            <Input
              value={accountSettings.phone || ''}
              onChange={(e) => updateAccountSettings({ phone: e.target.value })}
              placeholder={t('profile.account.phonePlaceholder') as string}
              disabled={accountSettings.phoneVerified}
            />
            {accountSettings.phoneVerified ? (
              <div className="text-sm text-success-600 mt-1">
                {t('profile.account.phoneVerified') as string}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {/* 发送验证短信 */}}
              >
                {t('profile.account.verifyPhone') as string}
              </Button>
            )}
          </FormField>
          
          <FormField
            id="language"
            label={t('profile.account.language') as string}
            message={formErrors.language}
          >
            <Select
              value={accountSettings.language || ''}
              onChange={(value) => {
                updateAccountSettings({ language: value as string });
                useSettingsStore.getState().setLanguage(value as any);
              }}
              placeholder={t('profile.account.languagePlaceholder') as string}
              options={[
                { value: 'zh', label: t('profile.account.languageOptions.chinese') as string },
                { value: 'en', label: t('profile.account.languageOptions.english') as string },
                { value: 'fr', label: t('profile.account.languageOptions.french') as string }
              ]}
            />
          </FormField>
          
          <FormField
            id="timezone"
            label={t('profile.account.timezone') as string}
            message={formErrors.timezone}
          >
            <Select
              value={accountSettings.timezone || ''}
              onChange={(value) => updateAccountSettings({ timezone: value as string })}
              placeholder={t('profile.account.timezonePlaceholder') as string}
              options={[
                { value: 'Asia/Shanghai', label: t('profile.account.timezoneOptions.shanghai') as string },
                { value: 'America/New_York', label: t('profile.account.timezoneOptions.newYork') as string },
                { value: 'Europe/London', label: t('profile.account.timezoneOptions.london') as string },
                { value: 'Australia/Sydney', label: t('profile.account.timezoneOptions.sydney') as string }
              ]}
            />
          </FormField>
          
          <FormField
            id="dateFormat"
            label={t('profile.account.dateFormat') as string}
            message={formErrors.dateFormat}
          >
            <Select
              value={accountSettings.dateFormat || ''}
              onChange={(value) => updateAccountSettings({ dateFormat: value as string })}
              placeholder={t('profile.account.dateFormatPlaceholder') as string}
              options={[
                { value: 'YYYY-MM-DD', label: t('profile.account.dateFormatOptions.iso') as string },
                { value: 'MM/DD/YYYY', label: t('profile.account.dateFormatOptions.us') as string },
                { value: 'DD/MM/YYYY', label: t('profile.account.dateFormatOptions.eu') as string }
              ]}
            />
          </FormField>
          
          <FormField
            id="timeFormat"
            label={t('profile.account.timeFormat') as string}
            message={formErrors.timeFormat}
          >
            <Select
              value={accountSettings.timeFormat || ''}
              onChange={(value) => updateAccountSettings({ timeFormat: value as any })}
              placeholder={t('profile.account.timeFormatPlaceholder') as string}
              options={[
                { value: '12h', label: t('profile.account.timeFormatOptions.12h') as string },
                { value: '24h', label: t('profile.account.timeFormatOptions.24h') as string }
              ]}
            />
          </FormField>
          
          <FormField
            id="currency"
            label={t('profile.account.currency') as string}
            message={formErrors.currency}
          >
            <Select
              value={accountSettings.currency || ''}
              onChange={(value) => updateAccountSettings({ currency: value as string })}
              placeholder={t('profile.account.currencyPlaceholder') as string}
              options={[
                { value: 'CNY', label: t('profile.account.currencyOptions.cny') as string },
                { value: 'USD', label: t('profile.account.currencyOptions.usd') as string },
                { value: 'EUR', label: t('profile.account.currencyOptions.eur') as string },
                { value: 'GBP', label: t('profile.account.currencyOptions.gbp') as string },
                { value: 'CAD', label: t('profile.account.currencyOptions.cad') as string }
              ]}
            />
          </FormField>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={updateAccountSettingsMutation.isPending}
          >
            {t('profile.account.saveChanges') as string}
          </Button>
        </div>
      </form>
    </Card>
  );
};
