import { useApiQuery, useApiMutation, useApiPatchMutation, optimisticUpdate } from '../hooks';
import { ProfileData } from '../../store/zustand/useProfileStore';

export function useGetProfile(userId: string) {
  return useApiQuery<ProfileData>(
    ['profile', userId],
    `/profile/${userId}`
  );
}

export function useUpdateProfile(userId: string) {
  return useApiPatchMutation<ProfileData, Partial<ProfileData>>(
    `/profile/${userId}`,
    {
      ...optimisticUpdate<ProfileData, Partial<ProfileData>>(
        ['profile', userId],
        (oldData, newData) => ({
          ...oldData,
          ...newData,
        })
      ),
    }
  );
}

export function useUpdatePersonalInfo(userId: string) {
  return useApiPatchMutation<ProfileData, Partial<ProfileData['personalInfo']>>(
    `/profile/${userId}/personal-info`,
    {
      ...optimisticUpdate<ProfileData, Partial<ProfileData['personalInfo']>>(
        ['profile', userId],
        (oldData, newData) => ({
          ...oldData,
          personalInfo: {
            ...oldData.personalInfo,
            ...newData,
          },
        })
      ),
    }
  );
}

export function useUpdateEducationInfo(userId: string) {
  return useApiPatchMutation<ProfileData, Partial<ProfileData['educationInfo']>>(
    `/profile/${userId}/education-info`,
    {
      ...optimisticUpdate<ProfileData, Partial<ProfileData['educationInfo']>>(
        ['profile', userId],
        (oldData, newData) => ({
          ...oldData,
          educationInfo: {
            ...oldData.educationInfo,
            ...newData,
          },
        })
      ),
    }
  );
}

export function useUpdateWorkExperience(userId: string) {
  return useApiPatchMutation<ProfileData, Partial<ProfileData['workExperience']>>(
    `/profile/${userId}/work-experience`,
    {
      ...optimisticUpdate<ProfileData, Partial<ProfileData['workExperience']>>(
        ['profile', userId],
        (oldData, newData) => ({
          ...oldData,
          workExperience: {
            ...oldData.workExperience,
            ...newData,
          },
        })
      ),
    }
  );
}

export function useUpdateLanguageSkills(userId: string) {
  return useApiPatchMutation<ProfileData, Partial<ProfileData['languageSkills']>>(
    `/profile/${userId}/language-skills`,
    {
      ...optimisticUpdate<ProfileData, Partial<ProfileData['languageSkills']>>(
        ['profile', userId],
        (oldData, newData) => ({
          ...oldData,
          languageSkills: {
            ...oldData.languageSkills,
            ...newData,
          },
        })
      ),
    }
  );
}

export function useUpdateImmigrationInfo(userId: string) {
  return useApiPatchMutation<ProfileData, Partial<ProfileData['immigrationInfo']>>(
    `/profile/${userId}/immigration-info`,
    {
      ...optimisticUpdate<ProfileData, Partial<ProfileData['immigrationInfo']>>(
        ['profile', userId],
        (oldData, newData) => ({
          ...oldData,
          immigrationInfo: {
            ...oldData.immigrationInfo,
            ...newData,
          },
        })
      ),
    }
  );
}
