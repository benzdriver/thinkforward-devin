# 顾问资料页面技术规范

## 概述

顾问资料页面允许顾问查看和编辑其个人资料信息，包括专业背景、技能、服务范围和可用性设置。此页面对于顾问展示其专业形象和管理其服务信息至关重要。

## 数据模型

### ConsultantProfile

```typescript
interface ConsultantProfile {
  id: string;
  userId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  title: string;
  bio: string;
  shortBio: string;
  specialties: string[];
  languages: {
    language: string;
    proficiency: 'basic' | 'intermediate' | 'fluent' | 'native';
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    current: boolean;
    description?: string;
  }[];
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    location?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }[];
  skills: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
  services: {
    id: string;
    name: string;
    description: string;
    category: string;
    price?: number;
    pricingModel?: 'hourly' | 'fixed' | 'session';
    duration?: number; // 以分钟为单位
    isActive: boolean;
  }[];
  socialLinks: {
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'website' | 'other';
    url: string;
  }[];
  availability: {
    status: 'available' | 'limited' | 'unavailable';
    message?: string;
    acceptingNewClients: boolean;
    leadTime: number; // 预约提前天数
  };
  visibility: {
    profile: 'public' | 'clients_only' | 'private';
    contact: 'public' | 'clients_only' | 'private';
    availability: 'public' | 'clients_only' | 'private';
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### ConsultantProfileStats

```typescript
interface ConsultantProfileStats {
  viewCount: number;
  contactCount: number;
  bookingRate: number;
  completionRate: number;
  responseTime: number; // 以小时为单位
  popularServices: {
    serviceId: string;
    serviceName: string;
    bookingCount: number;
  }[];
  clientDemographics: {
    ageGroups: {
      range: string;
      percentage: number;
    }[];
    industries: {
      name: string;
      percentage: number;
    }[];
    locations: {
      name: string;
      percentage: number;
    }[];
  };
  monthlyStats: {
    month: string;
    views: number;
    contacts: number;
    bookings: number;
  }[];
}
```

## 组件结构

### 页面组件

```
ConsultantProfilePage
├── ProfileHeader
│   ├── Avatar
│   ├── BasicInfo
│   └── ActionButtons
├── ProfileTabs
│   ├── OverviewTab
│   │   ├── BioSection
│   │   ├── SpecialtiesSection
│   │   ├── LanguagesSection
│   │   └── ServicesSection
│   ├── ExperienceTab
│   │   ├── EducationSection
│   │   ├── WorkExperienceSection
│   │   ├── CertificationsSection
│   │   └── SkillsSection
│   ├── ServicesTab
│   │   ├── ServicesList
│   │   └── ServiceForm
│   ├── AvailabilityTab
│   │   ├── AvailabilityStatus
│   │   └── WorkingHoursSettings
│   └── StatsTab
│       ├── ProfileMetrics
│       ├── ClientDemographics
│       └── ActivityChart
└── ProfileSidebar
    ├── VerificationStatus
    ├── VisibilitySettings
    └── SocialLinks
```

### 状态管理

使用Zustand创建`useConsultantProfileStore`来管理顾问资料状态：

```typescript
interface ConsultantProfileState {
  profile: ConsultantProfile | null;
  stats: ConsultantProfileStats | null;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  editMode: boolean;
  
  // 操作方法
  setProfile: (profile: ConsultantProfile) => void;
  setStats: (stats: ConsultantProfileStats) => void;
  setActiveTab: (tab: string) => void;
  toggleEditMode: () => void;
  updateProfile: (updates: Partial<ConsultantProfile>) => void;
  addEducation: (education: Omit<ConsultantProfile['education'][0], 'id'>) => void;
  updateEducation: (id: string, updates: Partial<ConsultantProfile['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Omit<ConsultantProfile['experience'][0], 'id'>) => void;
  updateExperience: (id: string, updates: Partial<ConsultantProfile['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  addCertification: (certification: Omit<ConsultantProfile['certifications'][0], 'id'>) => void;
  updateCertification: (id: string, updates: Partial<ConsultantProfile['certifications'][0]>) => void;
  removeCertification: (id: string) => void;
  addService: (service: Omit<ConsultantProfile['services'][0], 'id'>) => void;
  updateService: (id: string, updates: Partial<ConsultantProfile['services'][0]>) => void;
  removeService: (id: string) => void;
  updateSkills: (skills: ConsultantProfile['skills']) => void;
  updateAvailability: (availability: ConsultantProfile['availability']) => void;
  updateVisibility: (visibility: ConsultantProfile['visibility']) => void;
  updateSocialLinks: (socialLinks: ConsultantProfile['socialLinks']) => void;
  resetState: () => void;
}
```

## API服务

### 端点设计

```typescript
// 获取顾问资料
GET /api/consultant/profile

// 更新顾问资料
PATCH /api/consultant/profile

// 获取顾问资料统计数据
GET /api/consultant/profile/stats

// 上传顾问头像
POST /api/consultant/profile/avatar

// 添加教育经历
POST /api/consultant/profile/education

// 更新教育经历
PATCH /api/consultant/profile/education/:id

// 删除教育经历
DELETE /api/consultant/profile/education/:id

// 添加工作经验
POST /api/consultant/profile/experience

// 更新工作经验
PATCH /api/consultant/profile/experience/:id

// 删除工作经验
DELETE /api/consultant/profile/experience/:id

// 添加认证
POST /api/consultant/profile/certification

// 更新认证
PATCH /api/consultant/profile/certification/:id

// 删除认证
DELETE /api/consultant/profile/certification/:id

// 添加服务
POST /api/consultant/profile/service

// 更新服务
PATCH /api/consultant/profile/service/:id

// 删除服务
DELETE /api/consultant/profile/service/:id

// 更新技能
PUT /api/consultant/profile/skills

// 更新可用性
PATCH /api/consultant/profile/availability

// 更新可见性设置
PATCH /api/consultant/profile/visibility

// 更新社交链接
PUT /api/consultant/profile/social-links

// 请求资料验证
POST /api/consultant/profile/request-verification
```

### API服务实现

```typescript
// consultant-profile.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ConsultantProfile, ConsultantProfileStats } from '../../store/zustand/useConsultantProfileStore';

// 获取顾问资料
export const useConsultantProfile = () => {
  return useQuery({
    queryKey: ['consultantProfile'],
    queryFn: async () => {
      const response = await apiClient.get<ConsultantProfile>('/api/consultant/profile');
      return response.data;
    },
  });
};

// 获取顾问资料统计数据
export const useConsultantProfileStats = () => {
  return useQuery({
    queryKey: ['consultantProfileStats'],
    queryFn: async () => {
      const response = await apiClient.get<ConsultantProfileStats>('/api/consultant/profile/stats');
      return response.data;
    },
  });
};

// 更新顾问资料
export const useUpdateConsultantProfile = () => {
  return useMutation({
    mutationFn: async (updates: Partial<ConsultantProfile>) => {
      const response = await apiClient.patch<ConsultantProfile>('/api/consultant/profile', updates);
      return response.data;
    },
  });
};

// 上传顾问头像
export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post<{ avatarUrl: string }>('/api/consultant/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.avatarUrl;
    },
  });
};

// 添加教育经历
export const useAddEducation = () => {
  return useMutation({
    mutationFn: async (education: Omit<ConsultantProfile['education'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['education'][0]>('/api/consultant/profile/education', education);
      return response.data;
    },
  });
};

// 更新教育经历
export const useUpdateEducation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['education'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['education'][0]>(`/api/consultant/profile/education/${id}`, updates);
      return response.data;
    },
  });
};

// 删除教育经历
export const useDeleteEducation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/education/${id}`);
      return id;
    },
  });
};

// 添加工作经验
export const useAddExperience = () => {
  return useMutation({
    mutationFn: async (experience: Omit<ConsultantProfile['experience'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['experience'][0]>('/api/consultant/profile/experience', experience);
      return response.data;
    },
  });
};

// 更新工作经验
export const useUpdateExperience = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['experience'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['experience'][0]>(`/api/consultant/profile/experience/${id}`, updates);
      return response.data;
    },
  });
};

// 删除工作经验
export const useDeleteExperience = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/experience/${id}`);
      return id;
    },
  });
};

// 添加认证
export const useAddCertification = () => {
  return useMutation({
    mutationFn: async (certification: Omit<ConsultantProfile['certifications'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['certifications'][0]>('/api/consultant/profile/certification', certification);
      return response.data;
    },
  });
};

// 更新认证
export const useUpdateCertification = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['certifications'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['certifications'][0]>(`/api/consultant/profile/certification/${id}`, updates);
      return response.data;
    },
  });
};

// 删除认证
export const useDeleteCertification = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/certification/${id}`);
      return id;
    },
  });
};

// 添加服务
export const useAddService = () => {
  return useMutation({
    mutationFn: async (service: Omit<ConsultantProfile['services'][0], 'id'>) => {
      const response = await apiClient.post<ConsultantProfile['services'][0]>('/api/consultant/profile/service', service);
      return response.data;
    },
  });
};

// 更新服务
export const useUpdateService = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ConsultantProfile['services'][0]>;
    }) => {
      const response = await apiClient.patch<ConsultantProfile['services'][0]>(`/api/consultant/profile/service/${id}`, updates);
      return response.data;
    },
  });
};

// 删除服务
export const useDeleteService = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/consultant/profile/service/${id}`);
      return id;
    },
  });
};

// 更新技能
export const useUpdateSkills = () => {
  return useMutation({
    mutationFn: async (skills: ConsultantProfile['skills']) => {
      const response = await apiClient.put<ConsultantProfile['skills']>('/api/consultant/profile/skills', skills);
      return response.data;
    },
  });
};

// 更新可用性
export const useUpdateAvailability = () => {
  return useMutation({
    mutationFn: async (availability: ConsultantProfile['availability']) => {
      const response = await apiClient.patch<ConsultantProfile['availability']>('/api/consultant/profile/availability', availability);
      return response.data;
    },
  });
};

// 更新可见性设置
export const useUpdateVisibility = () => {
  return useMutation({
    mutationFn: async (visibility: ConsultantProfile['visibility']) => {
      const response = await apiClient.patch<ConsultantProfile['visibility']>('/api/consultant/profile/visibility', visibility);
      return response.data;
    },
  });
};

// 更新社交链接
export const useUpdateSocialLinks = () => {
  return useMutation({
    mutationFn: async (socialLinks: ConsultantProfile['socialLinks']) => {
      const response = await apiClient.put<ConsultantProfile['socialLinks']>('/api/consultant/profile/social-links', socialLinks);
      return response.data;
    },
  });
};

// 请求资料验证
export const useRequestVerification = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<{ status: string; message: string }>('/api/consultant/profile/request-verification');
      return response.data;
    },
  });
};
```

## 后端集成要求

### 数据库表结构

1. `consultant_profiles` 表
   - id (主键)
   - user_id (外键，关联users表)
   - display_name
   - first_name
   - last_name
   - email
   - phone
   - avatar
   - title
   - bio
   - short_bio
   - verification_status
   - rating
   - review_count
   - created_at
   - updated_at

2. `consultant_specialties` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - specialty

3. `consultant_languages` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - language
   - proficiency

4. `consultant_education` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - institution
   - degree
   - field
   - start_year
   - end_year
   - current
   - description

5. `consultant_experience` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - company
   - position
   - start_date
   - end_date
   - current
   - description
   - location

6. `consultant_certifications` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - name
   - issuing_organization
   - issue_date
   - expiration_date
   - credential_id
   - credential_url

7. `consultant_skills` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - name
   - level

8. `consultant_services` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - name
   - description
   - category
   - price
   - pricing_model
   - duration
   - is_active

9. `consultant_social_links` 表
   - id (主键)
   - consultant_id (外键，关联consultant_profiles表)
   - platform
   - url

10. `consultant_availability` 表
    - id (主键)
    - consultant_id (外键，关联consultant_profiles表)
    - status
    - message
    - accepting_new_clients
    - lead_time

11. `consultant_visibility` 表
    - id (主键)
    - consultant_id (外键，关联consultant_profiles表)
    - profile
    - contact
    - availability

12. `consultant_profile_views` 表
    - id (主键)
    - consultant_id (外键，关联consultant_profiles表)
    - viewer_id (可为空，关联users表)
    - viewed_at

### API响应格式

所有API响应应遵循以下格式：

```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功"
}
```

错误响应：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 权限控制

- 顾问只能查看和编辑自己的资料
- 管理员可以查看所有顾问资料，但只能编辑特定字段（如验证状态）
- 客户可以查看顾问的公开资料，但不能编辑

## 国际化和可访问性

### 国际化

所有文本内容应通过i18n系统进行管理，支持中文、英文和法语：

```json
// zh.json
{
  "consultant_profile": {
    "title": "顾问资料",
    "edit_profile": "编辑资料",
    "save_changes": "保存更改",
    "cancel": "取消",
    "tabs": {
      "overview": "概览",
      "experience": "经验",
      "services": "服务",
      "availability": "可用性",
      "stats": "统计"
    },
    // 更多翻译...
  }
}
```

### 可访问性

- 所有表单字段应有适当的标签和ARIA属性
- 图像应有alt文本
- 颜色对比度应符合WCAG 2.1 AA标准
- 键盘导航应完全支持
- 屏幕阅读器兼容性

## 测试要求

### 单元测试

- 测试所有状态管理函数
- 测试表单验证逻辑
- 测试API服务函数

### 集成测试

- 测试表单提交流程
- 测试数据加载和显示
- 测试编辑模式切换

### 端到端测试

- 测试完整的资料编辑流程
- 测试不同角色的权限控制

## 性能考虑

- 使用React Query进行数据缓存
- 实现乐观更新以提高用户体验
- 图片上传应有预览和压缩功能
- 长列表（如技能、服务等）应实现虚拟滚动

## 安全考虑

- 所有API请求应验证用户身份和权限
- 防止XSS攻击
- 实现CSRF保护
- 敏感数据应适当加密
