import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';

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
        return t('dashboard.statusCompleted', { defaultValue: '已完成' });
      case 'in-progress':
        return t('dashboard.statusInProgress', { defaultValue: '进行中' });
      case 'pending':
        return t('dashboard.statusPending', { defaultValue: '待处理' });
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
            style={{ color: '#e53e3e' }}
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
            style={{ color: '#3182ce' }}
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
            style={{ color: '#718096' }}
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
        <title>{t('dashboard.title', { defaultValue: '仪表盘' })} | ThinkForward AI</title>
        <meta name="description" content={t('dashboard.description', { defaultValue: '查看您的移民进度和下一步' }) as string} />
      </Head>
      
      <Navbar />
      
      <div className="bg-gradient">
        <div className="container py-16">
          <h1 className="text-center mb-8">{t('dashboard.title', { defaultValue: '仪表盘' })}</h1>
          
          <div className="grid">
            {/* 左侧栏 - 个人资料和下一步 */}
            <div className="md:col-span-2 space-y-6">
              {/* 欢迎卡片 */}
              <div className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {t('dashboard.welcome', { name: mockUserData.name, defaultValue: `欢迎, ${mockUserData.name}` })}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {t('dashboard.currentPath', { defaultValue: '当前移民路径' })}: <span className="font-medium">{mockUserData.immigrationPath}</span>
                    </p>
                    <div className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {t('dashboard.profileCompletion', { defaultValue: '个人资料完成度' })}: {mockUserData.profileCompletion}%
                        </span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{width: `${mockUserData.profileCompletion}%`}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button className="btn btn-primary">
                      {t('dashboard.continueProfile', { defaultValue: '继续完善资料' })}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 评估结果卡片 */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('dashboard.assessmentResults', { defaultValue: '评估结果' })}</h3>
                  <Link href="/assessment/results">
                    <button className="btn btn-secondary btn-sm">
                      {t('dashboard.viewDetails', { defaultValue: '查看详情' })}
                    </button>
                  </Link>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-lg" style={{backgroundColor: '#ebf5ff'}}>
                    <div className="text-3xl font-bold" style={{color: '#2563eb'}}>{mockUserData.assessmentResults.score}</div>
                    <div className="text-sm" style={{color: '#3b82f6'}}>{t('dashboard.points', { defaultValue: '分数' })}</div>
                    <div className="mt-2 text-sm text-gray-600">
                      {t('dashboard.lastUpdated', { defaultValue: '最后更新' })}: {mockUserData.assessmentResults.lastUpdated}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-sm font-medium mb-2">{t('dashboard.scoreBreakdown', { defaultValue: '分数明细' })}</div>
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
                              style={{width: `${(item.score / item.maxScore) * 100}%`}} 
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 下一步卡片 */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('dashboard.nextSteps', { defaultValue: '下一步' })}</h3>
                  <Link href="/tasks">
                    <button className="btn btn-secondary btn-sm">
                      {t('dashboard.viewAll', { defaultValue: '查看全部' })}
                    </button>
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {mockUserData.nextSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {step.status === 'completed' ? (
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
                            style={{ color: '#10b981' }}
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        ) : (
                          <div style={{
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '50%', 
                            backgroundColor: step.status === 'in-progress' ? '#2563eb' : '#f59e0b'
                          }}></div>
                        )}
                        <span className="font-medium">{step.title}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`badge badge-${getStatusBadgeVariant(step.status)}`}>
                          {getStatusText(step.status)}
                        </span>
                        <span className="text-sm text-neutral-500">{t('dashboard.dueDate', { defaultValue: '截止日期' })}: {step.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <button className="btn btn-secondary w-full">
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
                      style={{ marginRight: '0.5rem' }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {t('dashboard.addTask', { defaultValue: '添加任务' })}
                  </button>
                </div>
              </div>
            </div>
            
            {/* 右侧栏 - 文档和预约 */}
            <div className="space-y-6">
              {/* 最近文档卡片 */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('dashboard.recentDocuments', { defaultValue: '最近文档' })}</h3>
                  <Link href="/documents">
                    <button className="btn btn-secondary btn-sm">
                      {t('dashboard.viewAll', { defaultValue: '查看全部' })}
                    </button>
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {mockUserData.recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(doc.type)}
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <span className="text-sm text-neutral-500">{t('dashboard.updatedOn', { defaultValue: '更新于' })}: {doc.updatedAt}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <button className="btn btn-secondary w-full">
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
                      style={{ marginRight: '0.5rem' }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {t('dashboard.uploadDocument', { defaultValue: '上传文档' })}
                  </button>
                </div>
              </div>
              
              {/* 即将到来的预约卡片 */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('dashboard.upcomingAppointments', { defaultValue: '即将到来的预约' })}</h3>
                  <Link href="/appointments">
                    <button className="btn btn-secondary btn-sm">
                      {t('dashboard.viewAll', { defaultValue: '查看全部' })}
                    </button>
                  </Link>
                </div>
                
                {mockUserData.upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {mockUserData.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-3 border border-neutral-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{appointment.title}</h4>
                          <span className="badge badge-primary">{appointment.date}</span>
                        </div>
                        <p className="text-sm text-neutral-600 mb-2">
                          {appointment.time} • {appointment.consultant}
                        </p>
                        <div className="flex space-x-2">
                          <button className="btn btn-secondary btn-sm">
                            {t('dashboard.reschedule', { defaultValue: '重新安排' })}
                          </button>
                          <button className="btn btn-primary btn-sm">
                            {t('dashboard.joinMeeting', { defaultValue: '加入会议' })}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-neutral-500 mb-4">{t('dashboard.noAppointments', { defaultValue: '没有即将到来的预约' })}</p>
                    <button className="btn btn-primary btn-sm">
                      {t('dashboard.scheduleAppointment', { defaultValue: '安排预约' })}
                    </button>
                  </div>
                )}
              </div>
              
              {/* 快速链接卡片 */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">{t('dashboard.quickLinks', { defaultValue: '快速链接' })}</h3>
                <div className="space-y-2">
                  <Link href="/assessment/start">
                    <button className="btn btn-secondary w-full text-left">
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
                        style={{ marginRight: '0.5rem' }}
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                      {t('dashboard.startAssessment', { defaultValue: '开始评估' })}
                    </button>
                  </Link>
                  <Link href="/documents/upload">
                    <button className="btn btn-secondary w-full text-left">
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
                        style={{ marginRight: '0.5rem' }}
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {t('dashboard.uploadDocuments', { defaultValue: '上传文档' })}
                    </button>
                  </Link>
                  <Link href="/forms/generate">
                    <button className="btn btn-secondary w-full text-left">
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
                        style={{ marginRight: '0.5rem' }}
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      {t('dashboard.generateForms', { defaultValue: '生成表格' })}
                    </button>
                  </Link>
                  <Link href="/consultants/match">
                    <button className="btn btn-secondary w-full text-left">
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
                        style={{ marginRight: '0.5rem' }}
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      {t('dashboard.findConsultant', { defaultValue: '寻找顾问' })}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
