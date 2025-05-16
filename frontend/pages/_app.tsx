import React from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StoreProvider } from '../lib/store';
import { queryClient } from '../lib/api';
import { AuthProvider } from '../lib/auth/AuthContext';
import '../styles/globals.css';
import '../styles/custom.css'; // Import custom CSS
import Head from 'next/head';
import '../i18n'; // Import i18n initialization

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ThinkForward AI</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </StoreProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
