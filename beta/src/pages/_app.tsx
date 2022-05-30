/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
<<<<<<< HEAD
// @ts-ignore
import galite from 'ga-lite';
=======
import {ga} from '../utils/analytics';
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';
import '@codesandbox/sandpack-react/dist/index.css';

<<<<<<< HEAD
const EmptyAppShell: React.FC = ({children}) => <>{children}</>;

if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    galite('create', process.env.NEXT_PUBLIC_GA_TRACKING_ID, 'auto');
  }
  const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
  window.addEventListener(terminationEvent, function () {
    galite('send', 'timing', 'JS Dependencies', 'unload');
=======
const EmptyAppShell = ({children}: {children: React.ReactNode}) => (
  <>{children}</>
);

if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    ga('create', process.env.NEXT_PUBLIC_GA_TRACKING_ID, 'auto');
  }
  const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
  window.addEventListener(terminationEvent, function () {
    ga('send', 'timing', 'JS Dependencies', 'unload');
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
  });
}

export default function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
<<<<<<< HEAD
      galite('set', 'page', url);
      galite('send', 'pageview');
=======
      ga('set', 'page', url);
      ga('send', 'pageview');
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  let AppShell = (Component as any).appShell || EmptyAppShell;
  // In order to make sidebar scrolling between pages work as expected
  // we need to access the underlying MDX component.
  if ((Component as any).isMDXComponent) {
    AppShell = (Component as any)({}).props.originalType.appShell;
  }

  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  );
}
