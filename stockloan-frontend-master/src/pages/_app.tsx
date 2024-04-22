import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';
import '@/styles/modal.css';
import '@/styles/better.css';

import Seo from '@/components/Seo';

import { persistor, store } from '@/store/store';

import ErrorIcon from '@/assets/icon/alert/ErrorIcon';
import InfoIcon from '@/assets/icon/alert/InfoIcon';
import SuccessIcon from '@/assets/icon/alert/SuccessIcon';

// ----------------------------------------------------------------------

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

declare global {
  interface Window {
    Gitple: (value: string) => void;
    showErrorAlert: (msg: string) => void;
  }
}

const AlertOptions = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: '30px',
  transition: transitions.SCALE,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AlertTemplate = ({ options, message }: any) => (
  <div className='alert-container'>
    {options.type === 'info' && <InfoIcon />}
    {options.type === 'success' && <SuccessIcon />}
    {options.type === 'error' && <ErrorIcon />}
    <span>{message}</span>
  </div>
);

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    if (typeof window !== undefined) {
      if (window.Gitple) {
        window.Gitple('show');
      }
      setIsSSR(false);
    }
  }, []),
    [];

  return (
    <>
      {/* GA */}
      <Script
        strategy='afterInteractive'
        src='https://www.googletagmanager.com/gtag/js?id=G-P4LVCNY85C'
      />
      <Script
        id='ga-script'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P4LVCNY85C');
             `,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AlertProvider template={AlertTemplate} {...AlertOptions}>
                <Seo templateTitle='Home' />
                {!isSSR && <Component {...pageProps} />}
              </AlertProvider>
            </PersistGate>
          </Provider>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
