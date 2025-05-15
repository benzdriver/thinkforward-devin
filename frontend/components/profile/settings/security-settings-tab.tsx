import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { FormField } from '../../../components/form/form-field';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useProfileSettingsStore } from '../../../lib/store/zustand/useProfileSettingsStore';
import { 
  useGetSecuritySettings, 
  useUpdateSecuritySettings,
  useChangePassword
} from '../../../lib/api/services/profile-settings';

export const SecuritySettingsTab: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const { 
    securitySettings, 
    setSecuritySettings, 
    setError 
  } = useProfileSettingsStore();
  
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  
  const securitySettingsQuery = useGetSecuritySettings(user?.id || '');
  const updateSecuritySettingsMutation = useUpdateSecuritySettings(user?.id || '');
  const changePasswordMutation = useChangePassword();
  
  React.useEffect(() => {
    if (securitySettingsQuery.data && !securitySettings) {
      setSecuritySettings(securitySettingsQuery.data);
    }
  }, [securitySettingsQuery.data, securitySettings, setSecuritySettings]);
  
  const handleSecuritySettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securitySettings) return;
    
    try {
      const result = await updateSecuritySettingsMutation.mutateAsync(securitySettings);
      setSecuritySettings(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新安全设置失败');
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t('profile.security.passwordsDoNotMatch') as string);
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError(t('profile.security.passwordTooShort') as string);
      return;
    }
    
    try {
      await changePasswordMutation.mutateAsync({
        userId: user?.id || '',
        currentPassword,
        newPassword
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setError(null);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : '密码更新失败');
    }
  };
  
  if (!securitySettings) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{t('profile.security.passwordTitle') as string}</h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <FormField
            id="currentPassword"
            label={t('profile.security.currentPassword') as string}
            message={formErrors.currentPassword}
          >
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('profile.security.currentPasswordPlaceholder') as string}
            />
          </FormField>
          
          <FormField
            id="newPassword"
            label={t('profile.security.newPassword') as string}
            message={formErrors.newPassword}
          >
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('profile.security.newPasswordPlaceholder') as string}
            />
          </FormField>
          
          <FormField
            id="confirmPassword"
            label={t('profile.security.confirmPassword') as string}
            message={formErrors.confirmPassword}
          >
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('profile.security.confirmPasswordPlaceholder') as string}
            />
          </FormField>
          
          {passwordError && (
            <div className="text-error-600 text-sm mt-2">
              {passwordError}
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
            >
              {t('profile.security.changePassword') as string}
            </Button>
          </div>
        </form>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{t('profile.security.twoFactorTitle') as string}</h2>
        
        <form onSubmit={handleSecuritySettingsUpdate} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t('profile.security.twoFactorAuthentication') as string}</h3>
              <p className="text-sm text-neutral-500">
                {t('profile.security.twoFactorDescription') as string}
              </p>
            </div>
            
            <Button
              type="button"
              variant={securitySettings.twoFactorEnabled ? "outline" : "primary"}
              onClick={() => {
                if (!securitySettings.twoFactorEnabled) {
                } else {
                }
              }}
            >
              {securitySettings.twoFactorEnabled 
                ? t('profile.security.disable2FA') as string
                : t('profile.security.enable2FA') as string
              }
            </Button>
          </div>
        </form>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{t('profile.security.sessionsTitle') as string}</h2>
        
        <div className="space-y-4">
          {securitySettings.activeSessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-0">
              <div>
                <div className="font-medium">{session.device}</div>
                <div className="text-sm text-neutral-500">
                  {session.location} • {session.lastActive}
                </div>
              </div>
              
              {session.current ? (
                <div className="text-sm font-medium text-success-600">
                  {t('profile.security.currentSession') as string}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                  }}
                >
                  {t('profile.security.revokeSession') as string}
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
            }}
          >
            {t('profile.security.revokeAllSessions') as string}
          </Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{t('profile.security.loginAlertsTitle') as string}</h2>
        
        <form onSubmit={handleSecuritySettingsUpdate} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t('profile.security.loginAlerts') as string}</h3>
              <p className="text-sm text-neutral-500">
                {t('profile.security.loginAlertsDescription') as string}
              </p>
            </div>
            
            <Button
              type="button"
              variant={securitySettings.loginAlertsEnabled ? "outline" : "primary"}
              onClick={() => {
                updateSecuritySettingsMutation.mutate({
                  ...securitySettings,
                  loginAlertsEnabled: !securitySettings.loginAlertsEnabled
                });
              }}
            >
              {securitySettings.loginAlertsEnabled 
                ? t('profile.security.disableAlerts') as string
                : t('profile.security.enableAlerts') as string
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
