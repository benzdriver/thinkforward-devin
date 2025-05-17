import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default function AuthIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);
  
  return (
    <>
      <Head>
        <title>Redirecting... | ThinkForward AI</title>
        <meta name="description" content="Redirecting to login page" />
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Redirecting to login page...</p>
      </div>
    </>
  );
}
