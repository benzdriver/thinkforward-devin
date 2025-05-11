import React from 'react';
import { Tabs as BaseTabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface Tab {
  id: string;
  label: string;
}

interface TabsSimpleProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

/**
 * 简化的标签页组件，用于在表单式资料收集页面中切换不同部分
 */
export const TabsSimple: React.FC<TabsSimpleProps> = ({ 
  tabs, 
  activeTab, 
  onChange,
  className = '' 
}) => {
  return (
    <BaseTabs
      value={activeTab}
      onValueChange={onChange}
      className={className}
    >
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex-1"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </BaseTabs>
  );
};
