import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export default function Home() {
  const { t } = useTranslation('common');
  
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center mb-6">{t('common.welcomeToThinkForward')}</h1>
      <p className="text-lg text-center text-neutral-700 max-w-2xl mx-auto">
        {t('common.homeDescription')}
      </p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
