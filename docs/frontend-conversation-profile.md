# ThinkForward AI 前端对话式资料收集页面文档

本文档描述了ThinkForward AI平台的对话式资料收集页面实现，包括页面结构、组件使用和后端集成点。

## 对话式资料收集页面 (`/profile/build/conversation`)

### 页面概述

对话式资料收集页面提供了一个类似聊天界面的交互方式，通过自然对话引导用户完成个人资料的填写。系统会根据用户的回答自动提取关键信息并更新用户档案，使资料收集过程更加自然和友好。

### 页面结构

页面由以下几个主要部分组成：

1. **对话区域**：显示AI助手和用户之间的对话历史
2. **输入区域**：用户输入信息的文本框和发送按钮
3. **快速回复**：预设的常用回复选项
4. **进度指示器**：显示资料完成度和已完成的主题
5. **操作按钮**：切换到表单模式、返回仪表盘、重新开始对话等功能按钮

### 使用的组件

- `DashboardLayout`：提供带侧边栏和顶部导航的布局结构
- `PageHeader`：页面标题和描述
- `SectionContainer`：内容区块容器
- `Card`：对话界面和侧边栏卡片
- `Button`：操作按钮和快速回复按钮
- `Avatar`：用户和AI助手头像
- `Badge`：主题标签和完成状态指示
- `Progress`：完成度进度条

### 国际化支持

页面使用`next-i18next`实现国际化，所有文本内容都通过翻译键从语言文件中获取。翻译键位于`common.json`文件的`profile.conversation`部分。

```json
"profile": {
  "conversation": {
    "title": "对话式资料收集",
    "description": "通过自然对话方式完成您的个人资料",
    "inputPlaceholder": "输入您的回复...",
    "send": "发送",
    "progress": "完成进度",
    "actions": "操作",
    "switchToForm": "切换到表单模式",
    "restartConversation": "重新开始对话",
    "introResponse": "您好！我是ThinkForward AI助手，我将帮助您完成个人资料的填写。请告诉我您的基本信息，如姓名、邮箱和电话号码。",
    "personalInfoPrompt": "感谢您提供的信息。接下来，请告诉我您的教育背景，包括最高学位和专业。",
    "educationInfoPrompt": "非常好！现在请分享您的工作经验，包括职业和工作年限。",
    "workExperiencePrompt": "谢谢！请告诉我您的语言能力，特别是英语和法语的水平（如初级、中级、高级、流利或母语）。",
    "languageSkillsPrompt": "太好了！最后，请告诉我您的移民意向，包括目标国家、省份，以及是否有工作机会或家人在目标国家。",
    "immigrationInfoPrompt": "感谢您完成所有信息！您的资料已经保存。您可以随时返回修改或更新信息。",
    "completeResponse": "您的资料已完成！您可以继续完善或前往下一步。",
    "errorResponse": "抱歉，处理您的请求时出现了问题。请再试一次。",
    "defaultResponse": "我理解了。请继续告诉我更多信息。",
    "quickReplies": {
      "tellMeMore": "请告诉我更多",
      "skipTopic": "跳过这个主题",
      "help": "需要帮助"
    }
  },
  "categories": {
    "personalInfo": "个人信息",
    "educationInfo": "教育背景",
    "workExperience": "工作经验",
    "languageSkills": "语言能力",
    "immigrationInfo": "移民意向"
  }
}
```

### 数据结构

对话消息数据结构：

```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  category?: 'personalInfo' | 'educationInfo' | 'workExperience' | 'languageSkills' | 'immigrationInfo';
  isLoading?: boolean;
  options?: {
    text: string;
    value: string;
    action?: () => void;
  }[];
}
```

对话状态数据结构：

```typescript
interface ConversationState {
  messages: Message[];
  currentTopic: 'personalInfo' | 'educationInfo' | 'workExperience' | 'languageSkills' | 'immigrationInfo' | 'intro' | 'complete';
  isProcessing: boolean;
  completedTopics: string[];
}
```

### 信息提取逻辑

页面实现了智能信息提取功能，可以从用户的自然语言回复中识别和提取关键信息：

1. **个人信息提取**：
   - 从文本中提取姓名、邮箱和电话号码
   - 使用正则表达式匹配邮箱和电话格式

2. **教育背景提取**：
   - 识别学位类型（学士、硕士、博士等）
   - 提取专业领域

3. **工作经验提取**：
   - 识别职业名称
   - 提取工作年限

4. **语言能力提取**：
   - 识别语言水平（初级、中级、高级、流利、母语）
   - 分别处理英语和法语能力

5. **移民意向提取**：
   - 识别目标国家和省份
   - 提取是否有工作机会或家人在目标国家

### 对话流程

1. **初始化**：
   - 页面加载时，AI助手发送欢迎消息
   - 设置当前主题为"intro"

2. **主题进展**：
   - 用户回复后，系统提取信息并更新资料
   - 完成当前主题后，自动进入下一个主题
   - 主题顺序：个人信息 → 教育背景 → 工作经验 → 语言能力 → 移民意向

3. **完成流程**：
   - 所有主题完成后，显示完成消息
   - 用户可以继续修改或前往下一步

### 后端集成点

对话式资料收集页面需要与以下后端API端点集成：

1. **获取用户资料**：
   - 端点：`/api/profile`
   - 方法：`GET`
   - 返回：用户当前资料数据

2. **更新个人信息**：
   - 端点：`/api/profile/personal-info`
   - 方法：`PATCH`
   - 数据：部分或完整的个人信息

3. **更新教育背景**：
   - 端点：`/api/profile/education-info`
   - 方法：`PATCH`
   - 数据：部分或完整的教育信息

4. **更新工作经验**：
   - 端点：`/api/profile/work-experience`
   - 方法：`PATCH`
   - 数据：部分或完整的工作经验

5. **更新语言能力**：
   - 端点：`/api/profile/language-skills`
   - 方法：`PATCH`
   - 数据：部分或完整的语言能力

6. **更新移民意向**：
   - 端点：`/api/profile/immigration-info`
   - 方法：`PATCH`
   - 数据：部分或完整的移民意向

### 状态管理

页面使用React的useState钩子管理本地对话状态，使用Zustand存储管理用户资料数据：

```typescript
const { profile, completionPercentage, updatePersonalInfo, updateEducationInfo, updateWorkExperience, updateLanguageSkills, updateImmigrationInfo } = useProfileStore();
```

### 性能优化

1. **消息渲染优化**：
   - 使用函数组件和React.memo优化消息渲染
   - 使用useRef和scrollIntoView确保新消息可见

2. **状态更新优化**：
   - 使用函数式更新避免状态竞争条件
   - 批量更新状态减少重渲染

3. **响应式设计**：
   - 使用Grid布局实现响应式界面
   - 在移动设备上优化消息和输入区域布局

### 可访问性

页面遵循WCAG 2.1标准，确保：
- 所有交互元素都可通过键盘访问
- 适当的ARIA标签和角色
- 足够的颜色对比度
- 响应式设计适应不同设备

### 待完成事项

- 集成实际的NLP服务，提高信息提取准确性
- 添加语音输入功能
- 实现打字动画效果，增强用户体验
- 添加更多的快速回复选项
- 实现对话历史保存和恢复功能
