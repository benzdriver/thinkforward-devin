import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select } from '../../../components/ui/select';
import { Avatar } from '../../../components/ui/avatar';
import { FormField } from '../../../components/form/form-field';
import { DatePicker } from '../../../components/form/date-picker';
import { FileUpload } from '../../../components/form/file-upload';
import { useAuthStore } from '../../../lib/store/zustand/useAuthStore';
import { useProfileSettingsStore } from '../../../lib/store/zustand/useProfileSettingsStore';
import { 
  useGetUserProfile, 
  useUpdateUserProfile, 
  useUploadAvatar, 
  useDeleteAvatar 
} from '../../../lib/api/services/profile-settings';

export const PersonalInfoTab: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const { 
    profile, 
    updateProfile, 
    setProfile, 
    setError 
  } = useProfileSettingsStore();
  
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  
  const profileQuery = useGetUserProfile(user?.id || '');
  const updateProfileMutation = useUpdateUserProfile(user?.id || '');
  const uploadAvatarMutation = useUploadAvatar(user?.id || '');
  const deleteAvatarMutation = useDeleteAvatar(user?.id || '');
  
  React.useEffect(() => {
    if (profileQuery.data && !profile) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data, profile, setProfile]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    try {
      const result = await updateProfileMutation.mutateAsync(profile);
      setProfile(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新个人资料失败');
    }
  };
  
  const handleAvatarUpload = (files: File | File[] | null) => {
    if (!files) return;
    
    const file = Array.isArray(files) ? files[0] : files;
    
    try {
      uploadAvatarMutation.mutate(file, {
        onSuccess: (result) => {
          setProfile(result);
          setError(null);
        },
        onError: (error) => {
          setError(error instanceof Error ? error.message : '上传头像失败');
        }
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传头像失败');
    }
  };
  
  const handleAvatarDelete = async () => {
    try {
      const result = await deleteAvatarMutation.mutateAsync();
      setProfile(result);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除头像失败');
    }
  };
  
  if (!profile) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">{t('profile.personal.title')}</h2>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center">
          <Avatar
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.firstName || ''} ${profile.lastName || ''}&size=200`}
            alt={profile.displayName || ''}
            size="xl"
            className="mb-4"
          />
          <div className="flex gap-2">
            <FileUpload
              id="avatar-upload"
              onChange={handleAvatarUpload}
              accept="image/*"
              maxSize={2 * 1024 * 1024} // 2MB
              label={t('profile.personal.uploadAvatar') as string}
              variant="outline"
              size="sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAvatarDelete}
              disabled={!profile.avatar}
            >
              {t('profile.personal.removeAvatar')}
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="firstName"
                label={t('profile.personal.firstName')}
                message={formErrors.firstName}
              >
                <Input
                  value={profile.firstName || ''}
                  onChange={(e) => updateProfile({ firstName: e.target.value })}
                  placeholder={t('profile.personal.firstNamePlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="lastName"
                label={t('profile.personal.lastName')}
                message={formErrors.lastName}
              >
                <Input
                  value={profile.lastName || ''}
                  onChange={(e) => updateProfile({ lastName: e.target.value })}
                  placeholder={t('profile.personal.lastNamePlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="displayName"
                label={t('profile.personal.displayName') as string}
                message={formErrors.displayName}
              >
                <Input
                  value={profile.displayName || ''}
                  onChange={(e) => updateProfile({ displayName: e.target.value })}
                  placeholder={t('profile.personal.displayNamePlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="dateOfBirth"
                label={t('profile.personal.dateOfBirth') as string}
                message={formErrors.dateOfBirth}
              >
                <DatePicker
                  value={profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined}
                  onChange={(date) => updateProfile({ dateOfBirth: date instanceof Date ? date.toISOString().split('T')[0] : undefined })}
                  placeholder={t('profile.personal.dateOfBirthPlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="gender"
                label={t('profile.personal.gender') as string}
                message={formErrors.gender}
              >
                <Select
                  value={profile.gender || ''}
                  onChange={(value) => updateProfile({ gender: value as any })}
                  placeholder={t('profile.personal.genderPlaceholder') as string}
                  options={[
                    { value: 'male', label: t('profile.personal.genderOptions.male') as string },
                    { value: 'female', label: t('profile.personal.genderOptions.female') as string },
                    { value: 'other', label: t('profile.personal.genderOptions.other') as string },
                    { value: 'prefer_not_to_say', label: t('profile.personal.genderOptions.preferNotToSay') as string }
                  ]}
                />
              </FormField>
              
              <FormField
                id="profession"
                label={t('profile.personal.profession') as string}
                message={formErrors.profession}
              >
                <Input
                  value={profile.profession || ''}
                  onChange={(e) => updateProfile({ profession: e.target.value })}
                  placeholder={t('profile.personal.professionPlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="company"
                label={t('profile.personal.company') as string}
                message={formErrors.company}
              >
                <Input
                  value={profile.company || ''}
                  onChange={(e) => updateProfile({ company: e.target.value })}
                  placeholder={t('profile.personal.companyPlaceholder') as string}
                />
              </FormField>
            </div>
            
            <FormField
              id="bio"
              label={t('profile.personal.bio') as string}
              message={formErrors.bio}
            >
              <Textarea
                value={profile.bio || ''}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                placeholder={t('profile.personal.bioPlaceholder') as string}
                rows={4}
              />
            </FormField>
            
            <h3 className="text-lg font-medium mt-6 mb-4">{t('profile.personal.address')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="street"
                label={t('profile.personal.street') as string}
                message={formErrors.street}
              >
                <Input
                  value={profile.address?.street || ''}
                  onChange={(e) => updateProfile({ 
                    address: { ...profile.address, street: e.target.value } 
                  })}
                  placeholder={t('profile.personal.streetPlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="city"
                label={t('profile.personal.city') as string}
                message={formErrors.city}
              >
                <Input
                  value={profile.address?.city || ''}
                  onChange={(e) => updateProfile({ 
                    address: { ...profile.address, city: e.target.value } 
                  })}
                  placeholder={t('profile.personal.cityPlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="state"
                label={t('profile.personal.state') as string}
                message={formErrors.state}
              >
                <Input
                  value={profile.address?.state || ''}
                  onChange={(e) => updateProfile({ 
                    address: { ...profile.address, state: e.target.value } 
                  })}
                  placeholder={t('profile.personal.statePlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="postalCode"
                label={t('profile.personal.postalCode') as string}
                message={formErrors.postalCode}
              >
                <Input
                  value={profile.address?.postalCode || ''}
                  onChange={(e) => updateProfile({ 
                    address: { ...profile.address, postalCode: e.target.value } 
                  })}
                  placeholder={t('profile.personal.postalCodePlaceholder') as string}
                />
              </FormField>
              
              <FormField
                id="country"
                label={t('profile.personal.country') as string}
                message={formErrors.country}
              >
                <Input
                  value={profile.address?.country || ''}
                  onChange={(e) => updateProfile({ 
                    address: { ...profile.address, country: e.target.value } 
                  })}
                  placeholder={t('profile.personal.countryPlaceholder') as string}
                />
              </FormField>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
              >
                {t('profile.personal.saveChanges')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
};
