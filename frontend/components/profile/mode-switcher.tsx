import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface ModeSwitcherProps {
  currentMode: 'conversation' | 'form';
  className?: string;
}

/**
 * 模式切换组件，允许用户在对话式和表单式资料收集模式之间切换
 */
export const ModeSwitcher = ({ currentMode, className = '' }: ModeSwitcherProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleSwitchMode = () => {
    const targetMode = currentMode === 'conversation' ? 'form' : 'conversation';
    router.push(`/profile/build/${targetMode}`);
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{t('profile.modeSwitcher.title')}</h3>
          <Badge variant={currentMode === 'conversation' ? 'primary' : 'secondary'}>
            {currentMode === 'conversation' 
              ? t('profile.modeSwitcher.conversationMode') 
              : t('profile.modeSwitcher.formMode')}
          </Badge>
        </div>
        
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {currentMode === 'conversation'
            ? t('profile.modeSwitcher.conversationDescription')
            : t('profile.modeSwitcher.formDescription')}
        </p>
        
        <Button 
          variant="outline" 
          onClick={handleSwitchMode}
          className="w-full"
        >
          {currentMode === 'conversation'
            ? t('profile.modeSwitcher.switchToForm')
            : t('profile.modeSwitcher.switchToConversation')}
        </Button>
      </div>
    </Card>
  );
};
