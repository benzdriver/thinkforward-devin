import React from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StoreProvider } from '../lib/store';
import { queryClient } from '../lib/api';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
