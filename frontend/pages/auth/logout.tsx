import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

interface AuthContextType {
  logout: () => Promise<void>;
}

const useAuth = (): AuthContextType => {
  return {
    logout: async () => {
      console.log('Logging out...');
      if (typeof window !== 'undefined') {
        const authCookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'thinkforward_auth';
        document.cookie = `${authCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
      return Promise.resolve();
    }
  };
};

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { t } = useTranslation('common');
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/');
      }
    };
    
    performLogout();
  }, [logout, router]);
  
  return (
    <>
      <Head>
        <title>{t('auth.loggingOut', 'Logging Out')} | ThinkForward AI</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('auth.loggingOut', 'Logging Out')}</h1>
          <p className="text-neutral-600">{t('auth.redirectingToHome', 'Redirecting to homepage...')}</p>
        </div>
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
