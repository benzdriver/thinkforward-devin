import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { PageHeader } from '../../components/layout/page-header';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar } from '../../components/ui/avatar';
import { LoadingState } from '../../components/ui/loading-state';
import { ErrorState } from '../../components/ui/error-state';
import { useAuthStore } from '../../lib/store/zustand/useAuthStore';
import { useConsultantProfileStore } from '../../lib/store/zustand/useConsultantProfileStore';
import {
  useConsultantProfile,
  useConsultantProfileStats,
  useUpdateConsultantProfile,
  useUploadAvatar,
  useRequestVerification
} from '../../lib/api/services/consultant-profile';

const ConsultantProfilePage: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const {
    profile,
    stats,
    isLoading,
    error,
    activeTab,
    editMode,
    setProfile,
    setStats,
    setActiveTab,
    toggleEditMode,
    updateProfile,
    resetState
  } = useConsultantProfileStore();

  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useConsultantProfile();
  
  const { data: statsData, isLoading: isLoadingStats } = useConsultantProfileStats();
  
  const updateProfileMutation = useUpdateConsultantProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const requestVerificationMutation = useRequestVerification();

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
    
    if (statsData) {
      setStats(statsData);
    }
    
    return () => {
      resetState();
    };
  }, [profileData, statsData, setProfile, setStats, resetState]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleEditToggle = () => {
    toggleEditMode();
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      await updateProfileMutation.mutateAsync(profile);
      toggleEditMode();
    } catch (error) {
      console.error('保存资料失败', error);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      const avatarUrl = await uploadAvatarMutation.mutateAsync(file);
      updateProfile({ avatar: avatarUrl });
    } catch (error) {
      console.error('上传头像失败', error);
    }
  };

  if (isLoadingProfile || isLoading) {
    return (
      <DashboardLayout>
        <PageHeader title={t('consultant_profile')} />
        <LoadingState title={t('loading_profile')} />
      </DashboardLayout>
    );
  }

  if (profileError || error) {
    return (
      <DashboardLayout>
        <PageHeader title={t('consultant_profile')} />
        <ErrorState
          title={t('error_loading_profile')}
          retryAction={
            <Button variant="primary" onClick={() => window.location.reload()}>
              {t('retry')}
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <PageHeader title={t('consultant_profile')} />
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">{t('profile_not_found')}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            {t('refresh')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={t('consultant_profile')}
        description={t('consultant_profile_description')}
      />

      {/* 资料头部 */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar
                src={profile.avatar || '/images/default-avatar.png'}
                alt={profile.displayName}
                size="xl"
              />
              {editMode && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="bg-primary-500 text-white rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleUploadAvatar(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  {editMode ? (
                    <div className="mb-2">
                      <input
                        type="text"
                        className="text-2xl font-bold w-full border rounded-md p-1"
                        value={profile.displayName}
                        onChange={(e) => updateProfile({ displayName: e.target.value })}
                      />
                      <input
                        type="text"
                        className="text-gray-600 w-full border rounded-md p-1 mt-1"
                        value={profile.title}
                        onChange={(e) => updateProfile({ title: e.target.value })}
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                      <p className="text-gray-600">{profile.title}</p>
                    </>
                  )}
                  <div className="flex items-center mt-1">
                    {profile.verificationStatus === 'verified' && (
                      <Badge variant="success" className="mr-2">
                        {t('verified')}
                      </Badge>
                    )}
                    {profile.specialties?.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="mr-2">
                        {specialty}
                      </Badge>
                    ))}
                    {profile.specialties?.length > 3 && (
                      <Badge variant="secondary">+{profile.specialties.length - 3}</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!editMode ? (
                    <Button variant="primary" onClick={handleEditToggle}>
                      {t('edit_profile')}
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleEditToggle}>
                        {t('cancel')}
                      </Button>
                      <Button variant="primary" onClick={handleSaveProfile}>
                        {t('save')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧内容 */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="experience">{t('experience')}</TabsTrigger>
              <TabsTrigger value="services">{t('services')}</TabsTrigger>
              <TabsTrigger value="availability">{t('availability')}</TabsTrigger>
              <TabsTrigger value="stats">{t('stats')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('bio')}</h3>
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('short_bio')}</label>
                        <textarea
                          className="w-full p-2 border rounded-md"
                          rows={2}
                          value={profile.shortBio}
                          onChange={(e) => updateProfile({ shortBio: e.target.value })}
                          maxLength={160}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {profile.shortBio.length}/160 {t('characters')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('full_bio')}</label>
                        <textarea
                          className="w-full p-2 border rounded-md"
                          rows={6}
                          value={profile.bio}
                          onChange={(e) => updateProfile({ bio: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 italic mb-4">{profile.shortBio}</p>
                      <p className="whitespace-pre-line">{profile.bio}</p>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="experience">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('education_and_experience')}</h3>
                <p>{t('education_experience_placeholder')}</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="services">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('services')}</h3>
                <p>{t('services_placeholder')}</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="availability">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('availability')}</h3>
                <p>{t('availability_placeholder')}</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('profile_stats')}</h3>
                <p>{t('stats_placeholder')}</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* 右侧侧边栏 */}
        <div className="w-full lg:w-80">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">{t('verification_status')}</h3>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                profile.verificationStatus === 'verified' ? 'bg-success-500' :
                profile.verificationStatus === 'pending' ? 'bg-warning-500' : 'bg-destructive-500'
              }`}></div>
              <span>{t(profile.verificationStatus)}</span>
            </div>
            {profile.verificationStatus !== 'verified' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => requestVerificationMutation.mutate()}
              >
                {t('request_verification')}
              </Button>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('visibility_settings')}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">{t('profile_visibility')}</p>
                <p className="text-sm text-gray-500">{t(profile.visibility.profile)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('contact_visibility')}</p>
                <p className="text-sm text-gray-500">{t(profile.visibility.contact)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('availability_visibility')}</p>
                <p className="text-sm text-gray-500">{t(profile.visibility.availability)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'zh', ['common'])),
    },
  };
};

export default ConsultantProfilePage;
