import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { PageHeader } from '../../../components/layout/page-header';
import { SectionContainer } from '../../../components/layout/section-container';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Avatar } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { LoadingState } from '../../../components/ui/loading-state';
import { useProfileStore } from '../../../lib/store/zustand/useProfileStore';
import { useUpdatePersonalInfo, useUpdateEducationInfo, useUpdateWorkExperience, useUpdateLanguageSkills, useUpdateImmigrationInfo } from '../../../lib/api/services/profile';

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

interface ConversationState {
  messages: Message[];
  currentTopic: 'personalInfo' | 'educationInfo' | 'workExperience' | 'languageSkills' | 'immigrationInfo' | 'intro' | 'complete';
  isProcessing: boolean;
  completedTopics: string[];
}

const ConversationPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { profile, completionPercentage, updatePersonalInfo, updateEducationInfo, updateWorkExperience, updateLanguageSkills, updateImmigrationInfo } = useProfileStore();
  
  const [conversation, setConversation] = useState<ConversationState>({
    messages: [],
    currentTopic: 'intro',
    isProcessing: false,
    completedTopics: [],
  });
  
  const [userInput, setUserInput] = useState('');
  
  const simulateAIResponse = async (message: string, topic: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch(topic) {
      case 'intro':
        return t('profile.conversation.introResponse') as string;
      case 'personalInfo':
        return t('profile.conversation.personalInfoPrompt') as string;
      case 'educationInfo':
        return t('profile.conversation.educationInfoPrompt') as string;
      case 'workExperience':
        return t('profile.conversation.workExperiencePrompt') as string;
      case 'languageSkills':
        return t('profile.conversation.languageSkillsPrompt') as string;
      case 'immigrationInfo':
        return t('profile.conversation.immigrationInfoPrompt') as string;
      case 'complete':
        return t('profile.conversation.completeResponse') as string;
      default:
        return t('profile.conversation.defaultResponse') as string;
    }
  };
  
  const extractAndUpdateProfile = (message: string, topic: string) => {
    
    switch(topic) {
      case 'personalInfo':
        if (message.includes('名字') || message.includes('name')) {
          const nameParts = message.split(' ').filter(part => part.length > 1 && !part.includes('名字') && !part.includes('name'));
          if (nameParts.length >= 2) {
            updatePersonalInfo({
              firstName: nameParts[0],
              lastName: nameParts[1],
            });
          }
        }
        
        if (message.includes('邮箱') || message.includes('email')) {
          const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) {
            updatePersonalInfo({
              email: emailMatch[0],
            });
          }
        }
        
        if (message.includes('电话') || message.includes('phone')) {
          const phoneMatch = message.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
          if (phoneMatch) {
            updatePersonalInfo({
              phone: phoneMatch[0],
            });
          }
        }
        break;
        
      case 'educationInfo':
        if (message.includes('学位') || message.includes('degree')) {
          const degreeTypes = ['bachelor', 'master', 'phd', 'diploma', '学士', '硕士', '博士', '文凭'];
          for (const type of degreeTypes) {
            if (message.toLowerCase().includes(type)) {
              updateEducationInfo({
                highestDegree: type,
              });
              break;
            }
          }
        }
        
        if (message.includes('专业') || message.includes('field')) {
          const fieldMatch = message.match(/专业是(.*?)(?:。|$)/) || message.match(/field of study is (.*?)(?:\.|$)/);
          if (fieldMatch && fieldMatch[1]) {
            updateEducationInfo({
              fieldOfStudy: fieldMatch[1].trim(),
            });
          }
        }
        break;
        
      case 'workExperience':
        if (message.includes('职业') || message.includes('occupation')) {
          const occupationMatch = message.match(/职业是(.*?)(?:。|$)/) || message.match(/occupation is (.*?)(?:\.|$)/);
          if (occupationMatch && occupationMatch[1]) {
            updateWorkExperience({
              occupation: occupationMatch[1].trim(),
            });
          }
        }
        
        if (message.includes('年') || message.includes('years')) {
          const yearsMatch = message.match(/(\d+)年/) || message.match(/(\d+) years/);
          if (yearsMatch && yearsMatch[1]) {
            updateWorkExperience({
              yearsOfExperience: parseInt(yearsMatch[1]),
            });
          }
        }
        break;
        
      case 'languageSkills':
        if (message.includes('英语') || message.includes('English')) {
          const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'fluent', 'native', '初级', '中级', '高级', '流利', '母语'];
          for (const level of proficiencyLevels) {
            if (message.toLowerCase().includes(level)) {
              updateLanguageSkills({
                englishProficiency: level,
              });
              break;
            }
          }
        }
        
        if (message.includes('法语') || message.includes('French')) {
          const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'fluent', 'native', '初级', '中级', '高级', '流利', '母语'];
          for (const level of proficiencyLevels) {
            if (message.toLowerCase().includes(level)) {
              updateLanguageSkills({
                frenchProficiency: level,
              });
              break;
            }
          }
        }
        break;
        
      case 'immigrationInfo':
        if (message.includes('国家') || message.includes('country')) {
          const countries = ['Canada', 'Australia', 'USA', 'UK', '加拿大', '澳大利亚', '美国', '英国'];
          for (const country of countries) {
            if (message.includes(country)) {
              updateImmigrationInfo({
                desiredCountry: country,
              });
              break;
            }
          }
        }
        
        if (message.includes('省') || message.includes('province')) {
          const provinces = ['Ontario', 'Quebec', 'British Columbia', 'Alberta', '安大略', '魁北克', '不列颠哥伦比亚', '艾伯塔'];
          for (const province of provinces) {
            if (message.includes(province)) {
              updateImmigrationInfo({
                desiredProvince: province,
              });
              break;
            }
          }
        }
        
        if (message.includes('工作机会') || message.includes('job offer')) {
          updateImmigrationInfo({
            hasJobOffer: message.includes('有') || message.includes('yes') || message.includes('have'),
          });
        }
        
        if (message.includes('家人') || message.includes('family')) {
          updateImmigrationInfo({
            hasFamilyInCountry: message.includes('有') || message.includes('yes') || message.includes('have'),
          });
        }
        break;
        
      default:
        break;
    }
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userInput.trim() || conversation.isProcessing) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: userInput,
      sender: 'user',
      timestamp: new Date(),
      category: conversation.currentTopic === 'intro' || conversation.currentTopic === 'complete' 
        ? undefined 
        : conversation.currentTopic,
    };
    
    const aiLoadingMessage: Message = {
      id: `ai-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      category: conversation.currentTopic === 'intro' || conversation.currentTopic === 'complete' 
        ? undefined 
        : conversation.currentTopic,
      isLoading: true,
    };
    
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, aiLoadingMessage],
      isProcessing: true,
    }));
    
    setUserInput('');
    
    if (conversation.currentTopic !== 'intro' && conversation.currentTopic !== 'complete') {
      extractAndUpdateProfile(userInput, conversation.currentTopic);
    }
    
    try {
      const aiResponse = await simulateAIResponse(userInput, conversation.currentTopic);
      
      setConversation(prev => {
        const updatedMessages = [...prev.messages];
        const loadingMessageIndex = updatedMessages.findIndex(m => m.id === aiLoadingMessage.id);
        
        if (loadingMessageIndex !== -1) {
          updatedMessages[loadingMessageIndex] = {
            ...updatedMessages[loadingMessageIndex],
            content: aiResponse,
            isLoading: false,
          };
        }
        
        let nextTopic = prev.currentTopic;
        let updatedCompletedTopics = [...prev.completedTopics];
        
        if (prev.currentTopic === 'intro') {
          nextTopic = 'personalInfo';
        } else if (prev.currentTopic !== 'complete') {
          if (!updatedCompletedTopics.includes(prev.currentTopic)) {
            updatedCompletedTopics.push(prev.currentTopic);
          }
          
          const allTopics = ['personalInfo', 'educationInfo', 'workExperience', 'languageSkills', 'immigrationInfo'];
          const remainingTopics = allTopics.filter(topic => !updatedCompletedTopics.includes(topic));
          
          if (remainingTopics.length > 0) {
            nextTopic = remainingTopics[0] as any;
          } else {
            nextTopic = 'complete';
          }
        }
        
        return {
          ...prev,
          messages: updatedMessages,
          isProcessing: false,
          currentTopic: nextTopic,
          completedTopics: updatedCompletedTopics,
        };
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      setConversation(prev => {
        const updatedMessages = [...prev.messages];
        const loadingMessageIndex = updatedMessages.findIndex(m => m.id === aiLoadingMessage.id);
        
        if (loadingMessageIndex !== -1) {
          updatedMessages[loadingMessageIndex] = {
            ...updatedMessages[loadingMessageIndex],
            content: t('profile.conversation.errorResponse') as string,
            isLoading: false,
          };
        }
        
        return {
          ...prev,
          messages: updatedMessages,
          isProcessing: false,
        };
      });
    }
  };
  
  const handleQuickReplyClick = (option: string) => {
    setUserInput(option);
    handleSubmit();
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);
  
  useEffect(() => {
    const initConversation = async () => {
      const initialAIMessage: Message = {
        id: `ai-${Date.now()}`,
        content: '',
        sender: 'ai',
        timestamp: new Date(),
        isLoading: true,
      };
      
      setConversation(prev => ({
        ...prev,
        messages: [initialAIMessage],
        isProcessing: true,
      }));
      
      try {
        const aiResponse = await simulateAIResponse('', 'intro');
        
        setConversation(prev => {
          const updatedMessages = [...prev.messages];
          updatedMessages[0] = {
            ...updatedMessages[0],
            content: aiResponse,
            isLoading: false,
          };
          
          return {
            ...prev,
            messages: updatedMessages,
            isProcessing: false,
          };
        });
      } catch (error) {
        console.error('Error initializing conversation:', error);
        
        setConversation(prev => {
          const updatedMessages = [...prev.messages];
          updatedMessages[0] = {
            ...updatedMessages[0],
            content: t('profile.conversation.errorResponse') as string,
            isLoading: false,
          };
          
          return {
            ...prev,
            messages: updatedMessages,
            isProcessing: false,
          };
        });
      }
    };
    
    initConversation();
  }, [t]);
  
  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div 
        key={message.id} 
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isUser && (
          <div className="mr-2 flex-shrink-0">
            <Avatar 
              src="/images/ai-assistant.png" 
              alt="AI Assistant" 
              className="w-10 h-10"
            />
          </div>
        )}
        
        <div 
          className={`max-w-[80%] rounded-lg p-4 ${
            isUser 
              ? 'bg-primary-600 text-white rounded-tr-none' 
              : 'bg-secondary-100 text-gray-800 rounded-tl-none'
          }`}
        >
          {message.category && (
            <div className="mb-1">
              <Badge variant={isUser ? 'primary' : 'secondary'}>
                {t(`profile.categories.${message.category}`)}
              </Badge>
            </div>
          )}
          
          {message.isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <div className="whitespace-pre-line">{message.content}</div>
          )}
          
          {message.options && message.options.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.options.map((option, index) => (
                <Button 
                  key={index} 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => option.action ? option.action() : handleQuickReplyClick(option.text)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {isUser && (
          <div className="ml-2 flex-shrink-0">
            <Avatar 
              src="/images/user-avatar.png" 
              fallback={profile.personalInfo?.firstName?.[0] || 'U'}
              alt="User" 
              className="w-10 h-10"
            />
          </div>
        )}
      </div>
    );
  };
  
  const renderProgressIndicator = () => {
    const topics = [
      { id: 'personalInfo', label: t('profile.categories.personalInfo') as string },
      { id: 'educationInfo', label: t('profile.categories.educationInfo') as string },
      { id: 'workExperience', label: t('profile.categories.workExperience') as string },
      { id: 'languageSkills', label: t('profile.categories.languageSkills') as string },
      { id: 'immigrationInfo', label: t('profile.categories.immigrationInfo') as string },
    ];
    
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">{t('profile.conversation.progress') as string}</h3>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        
        <Progress value={completionPercentage} max={100} className="mb-4" />
        
        <div className="flex flex-wrap gap-2">
          {topics.map(topic => (
            <Badge 
              key={topic.id} 
              variant={conversation.completedTopics.includes(topic.id) ? 'success' : 'secondary'}
              className="text-xs"
            >
              {topic.label}
            </Badge>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <PageHeader 
        title={t('profile.conversation.title') as string}
        description={t('profile.conversation.description') as string}
      />
      
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-240px)] flex flex-col">
              <div className="p-6 flex-grow overflow-y-auto">
                {conversation.messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-secondary-200">
                <form onSubmit={handleSubmit} className="flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={t('profile.conversation.inputPlaceholder') as string}
                    className="flex-grow px-4 py-2 border border-secondary-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={conversation.isProcessing}
                  />
                  <Button 
                    type="submit" 
                    variant="primary"
                    className="rounded-l-none"
                    disabled={conversation.isProcessing || !userInput.trim()}
                  >
                    {t('profile.conversation.send') as string}
                  </Button>
                </form>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleQuickReplyClick(t('profile.conversation.quickReplies.tellMeMore') as string)}
                  >
                    {t('profile.conversation.quickReplies.tellMeMore') as string}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleQuickReplyClick(t('profile.conversation.quickReplies.skipTopic') as string)}
                  >
                    {t('profile.conversation.quickReplies.skipTopic') as string}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleQuickReplyClick(t('profile.conversation.quickReplies.help') as string)}
                  >
                    {t('profile.conversation.quickReplies.help') as string}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-6 mb-6">
              {renderProgressIndicator()}
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">{t('profile.conversation.actions') as string}</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => router.push('/profile/build/form')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  {t('profile.conversation.switchToForm') as string}
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {t('common.backToDashboard') as string}
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  onClick={() => {
                    setConversation({
                      messages: [],
                      currentTopic: 'intro',
                      isProcessing: false,
                      completedTopics: [],
                    });
                    
                    const initConversation = async () => {
                      const initialAIMessage: Message = {
                        id: `ai-${Date.now()}`,
                        content: '',
                        sender: 'ai',
                        timestamp: new Date(),
                        isLoading: true,
                      };
                      
                      setConversation(prev => ({
                        ...prev,
                        messages: [initialAIMessage],
                        isProcessing: true,
                      }));
                      
                      try {
                        const aiResponse = await simulateAIResponse('', 'intro');
                        
                        setConversation(prev => {
                          const updatedMessages = [...prev.messages];
                          updatedMessages[0] = {
                            ...updatedMessages[0],
                            content: aiResponse,
                            isLoading: false,
                          };
                          
                          return {
                            ...prev,
                            messages: updatedMessages,
                            isProcessing: false,
                          };
                        });
                      } catch (error) {
                        console.error('Error initializing conversation:', error);
                      }
                    };
                    
                    initConversation();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  {t('profile.conversation.restartConversation') as string}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default ConversationPage;
