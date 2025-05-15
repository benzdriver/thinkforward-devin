import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { MainLayout } from '../components/layout/main-layout';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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

const DashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge badge-success';
      case 'in-progress':
        return 'badge badge-primary';
      case 'pending':
        return 'badge badge-warning';
      default:
        return 'badge badge-secondary';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('dashboard.statusCompleted') || '已完成';
      case 'in-progress':
        return t('dashboard.statusInProgress') || '进行中';
      case 'pending':
        return t('dashboard.statusPending') || '待处理';
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
    <MainLayout>
      <Head>
        <title>{t('dashboard.title') || '仪表盘'} | ThinkForward AI</title>
        <meta name="description" content={t('dashboard.description') || '查看您的移民申请进度和下一步操作'} />
      </Head>
      
      {/* Hero Section - Airportr style */}
      <section className="bg-primary-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {t('dashboard.welcome', { name: mockUserData.name }) || `欢迎回来，${mockUserData.name}`}
              </h1>
              <p className="mt-2 opacity-90">
                {t('dashboard.currentPath') || '当前移民路径'}: <span className="font-medium">{mockUserData.immigrationPath}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/assessment/start">
                <button className="btn btn-light">
                  {t('dashboard.startNewApplication') || '开始新申请'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left and Center */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Completion Card */}
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-grow">
                  <h2 className="text-xl font-bold mb-2">
                    {t('dashboard.profileCompletion') || '个人资料完成度'}
                  </h2>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {mockUserData.profileCompletion}%
                      </span>
                      <span className="text-sm">
                        {mockUserData.profileCompletion >= 80 
                          ? (t('dashboard.almostThere') || '即将完成') 
                          : (t('dashboard.keepGoing') || '继续完善')}
                      </span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${mockUserData.profileCompletion}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/profile">
                    <button className="btn btn-primary">
                      {t('dashboard.continueProfile') || '继续完善资料'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Assessment Results Card */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {t('dashboard.assessmentResults') || '评估结果'}
                </h2>
                <Link href="/assessment/results">
                  <span className="text-primary-700 hover:text-primary-800 text-sm font-medium">
                    {t('dashboard.viewDetails') || '查看详情'}
                  </span>
                </Link>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-primary-50 rounded-lg p-4 w-full md:w-auto">
                  <div className="text-3xl font-bold text-primary-700">{mockUserData.assessmentResults.score}</div>
                  <div className="text-sm text-primary-600">{t('dashboard.points') || '分数'}</div>
                  <div className="mt-2 text-sm text-neutral-600">
                    {t('dashboard.lastUpdated') || '最后更新'}: {mockUserData.assessmentResults.lastUpdated}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="text-sm font-medium mb-2">{t('dashboard.scoreBreakdown') || '分数明细'}</div>
                  <div className="space-y-2">
                    {mockUserData.assessmentResults.breakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.category}</span>
                          <span>{item.score}/{item.maxScore}</span>
                        </div>
                        <div className="progress-container">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Next Steps Card */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {t('dashboard.nextSteps') || '下一步'}
                </h2>
                <Link href="/tasks">
                  <span className="text-primary-700 hover:text-primary-800 text-sm font-medium">
                    {t('dashboard.viewAll') || '查看全部'}
                  </span>
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockUserData.nextSteps.map((step) => (
                  <div key={step.id} className="flex items-start p-3 border border-neutral-200 rounded-lg">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-success-100 text-success-600' 
                          : step.status === 'in-progress'
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-warning-100 text-warning-600'
                      }`}>
                        {step.status === 'completed' ? (
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
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : step.status === 'in-progress' ? (
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
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        ) : (
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
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-medium">{step.title}</h4>
                        <span className={getStatusBadgeClass(step.status)}>
                          {getStatusText(step.status)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">
                        {t('dashboard.dueDate') || '截止日期'}: {step.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button className="btn btn-outline w-full">
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
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t('dashboard.addTask') || '添加任务'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Recent Documents Card */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {t('dashboard.recentDocuments') || '最近文档'}
                </h2>
                <Link href="/documents">
                  <span className="text-primary-700 hover:text-primary-800 text-sm font-medium">
                    {t('dashboard.viewAll') || '查看全部'}
                  </span>
                </Link>
              </div>
              
              <div className="space-y-3">
                {mockUserData.recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.type)}
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <span className="text-sm text-neutral-500">{t('dashboard.updatedOn') || '更新于'}: {doc.updatedAt}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button className="btn btn-outline w-full">
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
                  {t('dashboard.uploadDocument') || '上传文档'}
                </button>
              </div>
            </div>
            
            {/* Upcoming Appointments Card */}
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {t('dashboard.upcomingAppointments') || '即将到来的预约'}
                </h2>
                <Link href="/appointments">
                  <span className="text-primary-700 hover:text-primary-800 text-sm font-medium">
                    {t('dashboard.viewAll') || '查看全部'}
                  </span>
                </Link>
              </div>
              
              {mockUserData.upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {mockUserData.upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-neutral-200 rounded-lg">
                      <h4 className="font-medium mb-2">{appointment.title}</h4>
                      <div className="flex items-center text-sm text-neutral-600 mb-1">
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
                        {appointment.date} | {appointment.time}
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
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
                        <button className="btn btn-outline btn-sm">
                          {t('dashboard.reschedule') || '重新安排'}
                        </button>
                        <button className="btn btn-primary btn-sm">
                          {t('dashboard.joinMeeting') || '加入会议'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-neutral-500">
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
                      className="mx-auto text-neutral-400"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <p>{t('dashboard.noAppointments') || '没有预约'}</p>
                  <button className="btn btn-outline btn-sm mt-3">
                    {t('dashboard.scheduleAppointment') || '安排预约'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Quick Links Card */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">
                {t('dashboard.quickLinks') || '快速链接'}
              </h2>
              <div className="space-y-2">
                <Link href="/assessment/start">
                  <button className="btn btn-outline w-full justify-start btn-sm">
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
                    {t('dashboard.startAssessment') || '开始评估'}
                  </button>
                </Link>
                <Link href="/documents/upload">
                  <button className="btn btn-outline w-full justify-start btn-sm">
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
                    {t('dashboard.uploadDocuments') || '上传文档'}
                  </button>
                </Link>
                <Link href="/appointments/schedule">
                  <button className="btn btn-outline w-full justify-start btn-sm">
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
                    {t('dashboard.scheduleConsultation') || '安排咨询'}
                  </button>
                </Link>
                <Link href="/profile">
                  <button className="btn btn-outline w-full justify-start btn-sm">
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
                    {t('dashboard.editProfile') || '编辑个人资料'}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
