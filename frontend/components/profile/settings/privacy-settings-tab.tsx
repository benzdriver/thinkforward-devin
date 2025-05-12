import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Select } from '../../../components/ui/select';
import { FormField } from '../../../components/form/form-field';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useProfileSettingsStore } from '../../../lib/store/zustand/useProfileSettingsStore';
import { 
  useGetPrivacySettings, 
  useUpdatePrivacySettings 
} from '../../../lib/api/services/profile-settings';

export const PrivacySettingsTab: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const { 
    privacySettings, 
    updatePrivacySettings, 
    setPrivacySettings, 
    setError 
  } = useProfileSettingsStore();
  
  const privacySettingsQuery = useGetPrivacySettings(user?.id || '');
  const updatePrivacySettingsMutation = useUpdatePrivacySettings(user?.id || '');
  
  React.useEffect(() => {
    if (privacySettingsQuery.data && !privacySettings) {
      setPrivacySettings(privacySettingsQuery.data);
    }
  }, [privacySettingsQuery.data, privacySettings, setPrivacySettings]);
  
  const handlePrivacySettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacySettings) return;
    
    try {
      const result = await updatePrivacySettingsMutation.mutateAsync(privacySettings);
      setPrivacySettings(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新隐私设置失败');
    }
  };
  
  if (!privacySettings) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">{t('profile.privacy.title') as string}</h2>
      
      <form onSubmit={handlePrivacySettingsUpdate} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('profile.privacy.profileVisibility') as string}</h3>
          
          <FormField
            id="profileVisibility"
            label={t('profile.privacy.whoCanSeeProfile') as string}
          >
            <Select
              value={privacySettings.profileVisibility}
              onChange={(value) => updatePrivacySettings({ profileVisibility: value as any })}
              options={[
                { value: 'public', label: t('profile.privacy.visibilityOptions.public') as string },
                { value: 'connections', label: t('profile.privacy.visibilityOptions.connections') as string },
                { value: 'private', label: t('profile.privacy.visibilityOptions.private') as string }
              ]}
            />
          </FormField>
          
          <FormField
            id="activityVisibility"
            label={t('profile.privacy.whoCanSeeActivity') as string}
          >
            <Select
              value={privacySettings.activityVisibility}
              onChange={(value) => updatePrivacySettings({ activityVisibility: value as any })}
              options={[
                { value: 'public', label: t('profile.privacy.visibilityOptions.public') as string },
                { value: 'connections', label: t('profile.privacy.visibilityOptions.connections') as string },
                { value: 'private', label: t('profile.privacy.visibilityOptions.private') as string }
              ]}
            />
          </FormField>
          
          <FormField
            id="documentVisibility"
            label={t('profile.privacy.whoCanSeeDocuments') as string}
          >
            <Select
              value={privacySettings.documentVisibility}
              onChange={(value) => updatePrivacySettings({ documentVisibility: value as any })}
              options={[
                { value: 'public', label: t('profile.privacy.visibilityOptions.public') as string },
                { value: 'connections', label: t('profile.privacy.visibilityOptions.connections') as string },
                { value: 'private', label: t('profile.privacy.visibilityOptions.private') as string }
              ]}
            />
          </FormField>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('profile.privacy.dataSharing') as string}</h3>
          
          <div className="space-y-3">
            <Checkbox
              label={t('profile.privacy.shareDataWithPartners') as string}
              description={t('profile.privacy.shareDataWithPartnersDesc') as string}
              checked={privacySettings.shareDataWithPartners}
              onChange={(e) => updatePrivacySettings({ shareDataWithPartners: e.target.checked })}
            />
            
            <Checkbox
              label={t('profile.privacy.allowPersonalizedRecommendations') as string}
              description={t('profile.privacy.allowPersonalizedRecommendationsDesc') as string}
              checked={privacySettings.allowPersonalizedRecommendations}
              onChange={(e) => updatePrivacySettings({ allowPersonalizedRecommendations: e.target.checked })}
            />
            
            <Checkbox
              label={t('profile.privacy.allowAnonymousDataCollection') as string}
              description={t('profile.privacy.allowAnonymousDataCollectionDesc') as string}
              checked={privacySettings.allowAnonymousDataCollection}
              onChange={(e) => updatePrivacySettings({ allowAnonymousDataCollection: e.target.checked })}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('profile.privacy.searchEngines') as string}</h3>
          
          <Checkbox
            label={t('profile.privacy.allowSearchEngineIndexing') as string}
            description={t('profile.privacy.allowSearchEngineIndexingDesc') as string}
            checked={privacySettings.allowSearchEngineIndexing}
            onChange={(e) => updatePrivacySettings({ allowSearchEngineIndexing: e.target.checked })}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('profile.privacy.cookies') as string}</h3>
          
          <div className="space-y-3">
            <Checkbox
              label={t('profile.privacy.allowEssentialCookies') as string}
              description={t('profile.privacy.allowEssentialCookiesDesc') as string}
              checked={privacySettings.cookies.essential}
              onChange={(e) => updatePrivacySettings({ 
                cookies: { ...privacySettings.cookies, essential: e.target.checked } 
              })}
              disabled={true} // Essential cookies cannot be disabled
            />
            
            <Checkbox
              label={t('profile.privacy.allowPreferenceCookies') as string}
              description={t('profile.privacy.allowPreferenceCookiesDesc') as string}
              checked={privacySettings.cookies.preferences}
              onChange={(e) => updatePrivacySettings({ 
                cookies: { ...privacySettings.cookies, preferences: e.target.checked } 
              })}
            />
            
            <Checkbox
              label={t('profile.privacy.allowAnalyticsCookies') as string}
              description={t('profile.privacy.allowAnalyticsCookiesDesc') as string}
              checked={privacySettings.cookies.analytics}
              onChange={(e) => updatePrivacySettings({ 
                cookies: { ...privacySettings.cookies, analytics: e.target.checked } 
              })}
            />
            
            <Checkbox
              label={t('profile.privacy.allowMarketingCookies') as string}
              description={t('profile.privacy.allowMarketingCookiesDesc') as string}
              checked={privacySettings.cookies.marketing}
              onChange={(e) => updatePrivacySettings({ 
                cookies: { ...privacySettings.cookies, marketing: e.target.checked } 
              })}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={updatePrivacySettingsMutation.isPending}
          >
            {t('profile.privacy.saveChanges') as string}
          </Button>
        </div>
      </form>
    </Card>
  );
};
