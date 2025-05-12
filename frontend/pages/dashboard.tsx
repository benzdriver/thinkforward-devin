import React from 'react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

import { DashboardLayout } from '../components/layout/dashboard-layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { SectionContainer } from '../components/layout/section-container';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

const mockUserData = {
  name: '张明',
  email: 'zhang.ming@example.com',
  profileCompletion: 65,
  immigrationPath: '加拿大快速通道',
  nextSteps: [
    { id: 1, title: '完成语言考试', status: 'pending', dueDate: '2023-06-30' },
    { id: 2, title: '提交学历评估', status: 'in-progress', dueDate: '2023-07-15' },
    { id: 3, title: '更新工作经验', status: 'completed', dueDate: '2023-05-20' },
  ],
  recentDocuments: [
    { id: 1, name: '护照扫描件', type: 'pdf', updatedAt: '2023-05-18' },
    { id: 2, name: '学位证书', type: 'pdf', updatedAt: '2023-05-15' },
    { id: 3, name: '工作证明信', type: 'docx', updatedAt: '2023-05-10' },
  ],
  upcomingAppointments: [
    { 
      id: 1, 
      title: '移民顾问咨询', 
      date: '2023-06-05', 
      time: '14:00-15:00',
      consultant: '李顾问'
    }
  ],
  assessmentResults: {
    score: 470,
    category: '联邦技术移民',
    lastUpdated: '2023-05-01',
    breakdown: [
      { category: '年龄', score: 110, maxScore: 110 },
      { category: '教育', score: 120, maxScore: 150 },
      { category: '语言能力', score: 110, maxScore: 160 },
      { category: '工作经验', score: 70, maxScore: 80 },
      { category: '适应性', score: 60, maxScore: 100 },
    ]
  }
};

const dashboardNavItems = [
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: '评估',
    href: '/assessment',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    children: [
      {
        title: '开始评估',
        href: '/assessment/start',
      },
      {
        title: '评估结果',
        href: '/assessment/results',
      },
    ],
  },
  {
    title: '文档',
    href: '/documents',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    badge: (
      <Badge variant="primary" size="sm">
        3
      </Badge>
    ),
  },
  {
    title: '表格',
    href: '/forms',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: '顾问',
    href: '/consultants',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: '设置',
    href: '/settings',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const DashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('dashboard.statusCompleted');
      case 'in-progress':
        return t('dashboard.statusInProgress');
      case 'pending':
        return t('dashboard.statusPending');
      default:
        return status;
    }
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      case 'docx':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
  };
  
  return (
    <>
      <Head>
        <title>{t('dashboard.title')} | ThinkForward AI</title>
        <meta name="description" content={t('dashboard.description') as string} />
      </Head>
      
      <DashboardLayout
        navigationItems={dashboardNavItems}
        sidebarWidth="md"
        sidebarVariant="default"
        defaultCollapsed={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧栏 - 个人资料和下一步 */}
          <div className="md:col-span-2 space-y-6">
            {/* 欢迎卡片 */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {t('dashboard.welcome', { name: mockUserData.name })}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {t('dashboard.currentPath')}: <span className="font-medium">{mockUserData.immigrationPath}</span>
                  </p>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {t('dashboard.profileCompletion')}: {mockUserData.profileCompletion}%
                      </span>
                    </div>
                    <Progress value={mockUserData.profileCompletion} className="h-2" />
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="primary">
                    {t('dashboard.continueProfile')}
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* 评估结果卡片 */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('dashboard.assessmentResults')}</h3>
                <Link href="/assessment/results" passHref>
                  <Button variant="link" size="sm">
                    {t('dashboard.viewDetails')}
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-primary-50 rounded-lg p-4 w-full md:w-auto">
                  <div className="text-3xl font-bold text-primary-700">{mockUserData.assessmentResults.score}</div>
                  <div className="text-sm text-primary-600">{t('dashboard.points')}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    {t('dashboard.lastUpdated')}: {mockUserData.assessmentResults.lastUpdated}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="text-sm font-medium mb-2">{t('dashboard.scoreBreakdown')}</div>
                  <div className="space-y-2">
                    {mockUserData.assessmentResults.breakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.category}</span>
                          <span>{item.score}/{item.maxScore}</span>
                        </div>
                        <Progress 
                          value={(item.score / item.maxScore) * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            {/* 下一步卡片 */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('dashboard.nextSteps')}</h3>
                <Link href="/tasks" passHref>
                  <Button variant="link" size="sm">
                    {t('dashboard.viewAll')}
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockUserData.nextSteps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {step.status === 'completed' ? (
                          <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-success-600"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{step.title}</div>
                        <div className="text-sm text-gray-500">
                          {t('dashboard.dueDate')}: {step.dueDate}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(step.status)}>
                      {getStatusText(step.status)}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  {t('dashboard.addTask')}
                </Button>
              </div>
            </Card>
          </div>
          
          {/* 右侧栏 - 最近文档和预约 */}
          <div className="space-y-6">
            {/* 最近文档卡片 */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('dashboard.recentDocuments')}</h3>
                <Link href="/documents" passHref>
                  <Button variant="link" size="sm">
                    {t('dashboard.viewAll')}
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {mockUserData.recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="mr-3 flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-medium truncate">{doc.name}</div>
                      <div className="text-sm text-gray-500">
                        {t('dashboard.updated')}: {doc.updatedAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  {t('dashboard.uploadDocument')}
                </Button>
              </div>
            </Card>
            
            {/* 即将到来的预约卡片 */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('dashboard.upcomingAppointments')}</h3>
                <Link href="/appointments" passHref>
                  <Button variant="link" size="sm">
                    {t('dashboard.scheduleNew')}
                  </Button>
                </Link>
              </div>
              
              {mockUserData.upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {mockUserData.upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="font-medium mb-2">{appointment.title}</div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {appointment.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {appointment.consultant}
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button variant="outline" size="sm">
                          {t('dashboard.reschedule')}
                        </Button>
                        <Button variant="primary" size="sm">
                          {t('dashboard.joinMeeting')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <div className="mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto text-gray-400"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <p>{t('dashboard.noAppointments')}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    {t('dashboard.scheduleAppointment')}
                  </Button>
                </div>
              )}
            </Card>
            
            {/* 快速链接卡片 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.quickLinks')}</h3>
              <div className="space-y-2">
                <Link href="/assessment/start" passHref>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    {t('dashboard.startAssessment')}
                  </Button>
                </Link>
                <Link href="/documents/upload" passHref>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {t('dashboard.uploadDocuments')}
                  </Button>
                </Link>
                <Link href="/forms/generate" passHref>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    {t('dashboard.generateForms')}
                  </Button>
                </Link>
                <Link href="/consultants/match" passHref>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    {t('dashboard.findConsultant')}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
