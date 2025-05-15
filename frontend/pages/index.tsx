import React from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { AuthLayout } from '../components/layout/auth-layout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Head from 'next/head';
import { LanguageSwitcher } from '../components/ui/language-switcher';

export default function LandingPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>{`ThinkForward AI | ${t('landing.title', '智能移民顾问')}`}</title>
        <meta name="description" content={String(t('landing.description', '使用AI技术简化您的移民流程'))} />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-white to-neutral-50">
        {/* Header */}
        <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-colored">
              <span className="text-white font-bold text-xl">TF</span>
            </div>
            <span className="text-2xl font-bold font-display bg-gradient-blue-purple bg-clip-text text-transparent">ThinkForward</span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
            <LanguageSwitcher />
            <Link href="/auth/login">
              <Button variant="ghost" leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }>
                {t('auth.login', '登录')}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              }>
                {t('auth.register', '注册')}
              </Button>
            </Link>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display leading-tight">
                  <span className="bg-gradient-blue-purple bg-clip-text text-transparent">{t('landing.headline', '智能移民解决方案')}</span>
                </h1>
                <p className="text-xl mb-8 text-neutral-700 max-w-xl mx-auto lg:mx-0">
                  {t('landing.subheading', '利用AI技术简化您的移民流程，获取个性化建议和支持')}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                  <Link href="/auth/register">
                    <Button size="lg" variant="primary" className="w-full sm:w-auto" leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    }>
                      {t('landing.getStarted', '立即开始')}
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="glass" className="w-full sm:w-auto" leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    }>
                      {t('landing.learnMore', '了解更多')}
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-8 mt-8">
                  <div className="flex items-center">
                    <div className="text-primary-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{t('landing.benefit1', '专业顾问')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-primary-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{t('landing.benefit2', 'AI辅助')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-primary-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{t('landing.benefit3', '全程跟踪')}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block relative h-[500px]">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-primary rounded-3xl opacity-10"></div>
                <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-accent rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 bg-gradient-blue-purple rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-[400px] h-[400px] relative">
                    {/* Placeholder for hero image */}
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center shadow-lg">
                      <div className="text-6xl text-primary-500">TF</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('landing.featuresTitle', '我们的服务')}</span>
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                {t('landing.featuresSubtitle', '全方位的移民服务，满足您的所有需求')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card variant="default" hover={true} className="transform transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-colored">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center font-display">{t('landing.feature1Title', '个性化评估')}</h3>
                  <p className="text-neutral-600 text-center">{t('landing.feature1Desc', '获取针对您情况的详细移民评估和建议')}</p>
                </CardContent>
              </Card>
              
              <Card variant="default" hover={true} className="transform transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6 shadow-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center font-display">{t('landing.feature2Title', '专家顾问')}</h3>
                  <p className="text-neutral-600 text-center">{t('landing.feature2Desc', '随时与专业移民顾问沟通，解答您的问题')}</p>
                </CardContent>
              </Card>
              
              <Card variant="default" hover={true} className="transform transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-blue-purple flex items-center justify-center mx-auto mb-6 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center font-display">{t('landing.feature3Title', '文档管理')}</h3>
                  <p className="text-neutral-600 text-center">{t('landing.feature3Desc', '轻松组织和管理您的移民文档和申请表格')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <Card variant="glass" className="overflow-hidden">
              <div className="p-8 md:p-12 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-accent rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative z-10 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">
                    {t('landing.ctaTitle', '准备好开始您的移民之旅了吗？')}
                  </h2>
                  <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
                    {t('landing.ctaText', '立即注册并开始使用我们的服务，让您的移民过程更加顺利')}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/auth/register">
                      <Button size="lg" variant="primary">
                        {t('landing.ctaButton', '免费注册')}
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline">
                        {t('landing.contactUs', '联系我们')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-6 md:px-12 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TF</span>
                  </div>
                  <span className="text-xl font-bold">ThinkForward</span>
                </div>
                <p className="text-sm text-neutral-600 mb-4">
                  {t('footer.description', '智能移民顾问，为您提供专业的移民服务')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t('footer.services', '服务')}</h4>
                <ul className="space-y-2">
                  <li><Link href="/services/assessment" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.assessment', '移民评估')}</Link></li>
                  <li><Link href="/services/consultation" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.consultation', '顾问咨询')}</Link></li>
                  <li><Link href="/services/documents" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.documents', '文档管理')}</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t('footer.company', '公司')}</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.about', '关于我们')}</Link></li>
                  <li><Link href="/contact" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.contact', '联系我们')}</Link></li>
                  <li><Link href="/careers" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.careers', '加入我们')}</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t('footer.legal', '法律')}</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.privacy', '隐私政策')}</Link></li>
                  <li><Link href="/terms" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">{t('footer.terms', '服务条款')}</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} ThinkForward AI. {t('footer.rights', '保留所有权利')}
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-neutral-400 hover:text-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-primary-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
