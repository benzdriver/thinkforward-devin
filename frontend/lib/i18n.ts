import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticPropsContext, GetServerSidePropsContext } from 'next';

/**
 * Hook to use translations in components
 * @param namespace - Translation namespace(s) to use
 * @returns Translation utilities
 */
export const useAppTranslation = (namespace: string | string[] = 'common') => {
  return useTranslation(namespace);
};

/**
 * Get translations for static pages
 * @param locale - Current locale
 * @param namespaces - Translation namespaces to load
 * @returns Props with translations
 */
export const getStaticTranslations = async (
  context: GetStaticPropsContext,
  namespaces: string[] = ['common']
) => {
  const { locale = 'en' } = context;
  return {
    ...(await serverSideTranslations(locale, namespaces)),
  };
};

/**
 * Get translations for server-side rendered pages
 * @param context - Server-side context
 * @param namespaces - Translation namespaces to load
 * @returns Props with translations
 */
export const getServerSideTranslations = async (
  context: GetServerSidePropsContext,
  namespaces: string[] = ['common']
) => {
  const { locale = 'en' } = context;
  return {
    ...(await serverSideTranslations(locale, namespaces)),
  };
};
