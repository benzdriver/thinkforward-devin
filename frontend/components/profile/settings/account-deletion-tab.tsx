import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { FormField } from '../../../components/form/form-field';
import { Alert } from '../../../components/ui/alert';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useProfileSettingsStore } from '../../../lib/store/zustand/useProfileSettingsStore';
import { useDeleteAccount } from '../../../lib/api/services/profile-settings';

export const AccountDeletionTab: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { setError } = useProfileSettingsStore();
  
  const [password, setPassword] = React.useState('');
  const [confirmText, setConfirmText] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  
  const deleteAccountMutation = useDeleteAccount(user?.id || '');
  
  const handleInitiateDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setShowConfirmation(true);
  };
  
  const handleConfirmDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (confirmText !== t('profile.deletion.confirmText')) {
      setFormError(t('profile.deletion.confirmTextError') as string);
      return;
    }
    
    try {
      await deleteAccountMutation.mutateAsync({
        password
      });
      
      logout();
      
      router.push('/');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : '账户删除失败');
      setError(error instanceof Error ? error.message : '账户删除失败');
    }
  };
  
  return (
    <Card className="p-6 border-error-300 bg-error-50">
      <h2 className="text-xl font-semibold mb-2 text-error-700">{t('profile.deletion.title') as string}</h2>
      <p className="text-neutral-700 mb-6">
        {t('profile.deletion.description') as string}
      </p>
      
      <Alert variant="error" className="mb-6">
        {t('profile.deletion.warning') as string}
      </Alert>
      
      {!showConfirmation ? (
        <form onSubmit={handleInitiateDeletion} className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">{t('profile.deletion.consequences.title') as string}</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>{t('profile.deletion.consequences.item1') as string}</li>
              <li>{t('profile.deletion.consequences.item2') as string}</li>
              <li>{t('profile.deletion.consequences.item3') as string}</li>
              <li>{t('profile.deletion.consequences.item4') as string}</li>
              <li>{t('profile.deletion.consequences.item5') as string}</li>
            </ul>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="destructive"
            >
              {t('profile.deletion.initiateButton') as string}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleConfirmDeletion} className="space-y-4">
          <FormField
            id="password"
            label={t('profile.deletion.password') as string}
          >
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('profile.deletion.passwordPlaceholder') as string}
            />
          </FormField>
          
          <FormField
            id="confirmText"
            label={t('profile.deletion.confirmTextLabel') as string}
            message={t('profile.deletion.confirmTextInstruction', { text: t('profile.deletion.confirmText') }) as string}
          >
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={t('profile.deletion.confirmTextPlaceholder') as string}
            />
          </FormField>
          
          {formError && (
            <div className="text-error-600 text-sm mt-2">
              {formError}
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              {t('profile.deletion.cancelButton') as string}
            </Button>
            
            <Button
              type="submit"
              variant="destructive"
              disabled={deleteAccountMutation.isPending}
            >
              {t('profile.deletion.confirmButton') as string}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};
