# 个人资料数据结构对齐实现

## 概述

本文档描述了后端个人资料数据结构与前端数据结构的对齐实现。通过分析前端的`useProfileStore.ts`文件，我们对后端的`Profile.js`模型进行了相应的调整，确保前后端数据结构的一致性。

## 主要变更

1. **地址字段移动**：
   - 将`address`字段从`personalInfo`对象中移出，作为`Profile`模型的顶级字段
   - 保持地址的内部结构不变（street, city, province, postalCode, country）

2. **个人信息字段更新**：
   - 确保`personalInfo`对象包含与前端一致的字段：firstName, lastName, dateOfBirth, nationality, passportNumber, email, phone
   - 更新`updateCompletionStatus`方法以反映新的字段结构

3. **添加lastUpdated字段**：
   - 添加`lastUpdated`字段，类型为String，默认值为当前时间的ISO字符串
   - 该字段与前端的`lastUpdated`字段对应，用于跟踪个人资料的最后更新时间

4. **profileService更新**：
   - 更新`updatePersonalInfo`方法，处理地址字段的分离
   - 如果个人信息中包含地址数据，将其提取并单独更新

## 数据结构对比

### 前端数据结构 (TypeScript)

```typescript
export type ProfileData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    email: string;
    phone: string;
  };
  educationInfo: {
    highestDegree: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
  };
  workExperience: {
    occupation: string;
    yearsOfExperience: number;
    currentEmployer: string;
    jobTitle: string;
  };
  languageSkills: {
    englishProficiency: string;
    frenchProficiency: string;
    otherLanguages: string[];
  };
  immigrationInfo: {
    desiredCountry: string;
    desiredProvince: string;
    immigrationPath: string;
    hasJobOffer: boolean;
    hasFamilyInCountry: boolean;
  };
};
```

### 后端数据结构 (MongoDB Schema)

```javascript
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    nationality: {
      type: String,
      trim: true
    },
    passportNumber: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  address: {
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: String
  },
  // 其他字段保持不变...
  lastUpdated: {
    type: String,
    default: () => new Date().toISOString()
  }
});
```

## API端点影响

这些变更不会影响现有的API端点，因为：

1. 个人资料的获取仍然返回完整的个人资料对象
2. 更新个人信息的API端点已经更新，可以正确处理地址字段的分离
3. 前端应用程序将继续按照其预期的数据结构接收和发送数据

## 测试要点

在测试这些变更时，应特别关注：

1. 个人信息更新时地址字段的正确处理
2. 完成状态计算的准确性
3. lastUpdated字段的正确更新
4. 与前端的数据交互是否正常

## 结论

通过这些变更，我们确保了后端个人资料数据结构与前端的完全一致，为无缝的数据交互提供了基础。这些变更是非破坏性的，不会影响现有的功能，同时为未来的功能扩展提供了更好的基础。
