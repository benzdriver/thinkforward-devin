import React from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StoreProvider } from '../lib/store';
import { queryClient } from '../lib/api';
import { LanguageProvider } from '../components/providers/language-provider';
import nextI18NextConfig from '../next-i18next.config.js';
import '../styles/globals.css';

if (typeof window !== 'undefined') {
  require('../lib/i18n-client');
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <LanguageProvider>
          <Component {...pageProps} />
        </LanguageProvider>
      </StoreProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
