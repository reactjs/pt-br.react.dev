/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {MenuProvider} from 'components/useMenu';
import * as React from 'react';
import {Nav} from './Nav';
import {RouteItem, SidebarContext} from './useRouteMeta';
import {Sidebar} from './Sidebar';
import {Footer} from './Footer';
import SocialBanner from '../SocialBanner';
interface PageProps {
  children: React.ReactNode;
  routeTree: RouteItem;
}

export function Page({routeTree, children}: PageProps) {
  return (
<<<<<<< HEAD
    <MenuProvider>
      <SidebarContext.Provider value={routeTree}>
        <div className="h-auto lg:h-screen flex flex-row">
          <div className="no-bg-scrollbar h-auto lg:h-full lg:overflow-y-scroll fixed flex flex-row lg:flex-col py-0 top-0 left-0 right-0 lg:max-w-xs w-full shadow lg:shadow-none z-50">
            <Nav />
            <Sidebar />
          </div>

          <div className="flex flex-1 w-full h-full self-stretch">
            <div className="w-full min-w-0">
              <main
                className="flex flex-1 self-stretch flex-col items-end"
                style={{justifyContent: 'space-around'}}>
                {children}
                <Footer />
              </main>
=======
    <>
      <SocialBanner />
      <MenuProvider>
        <SidebarContext.Provider value={routeTree}>
          <div className="h-auto lg:h-screen flex flex-row">
            <div className="no-bg-scrollbar h-auto lg:h-[calc(100%-40px)] lg:overflow-y-scroll fixed flex flex-row lg:flex-col py-0 top-16 sm:top-10 left-0 right-0 lg:max-w-xs w-full shadow lg:shadow-none z-50">
              <Nav />
              <Sidebar />
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e
            </div>

            {/* No fallback UI so need to be careful not to suspend directly inside. */}
            <React.Suspense fallback={null}>
              <div className="flex flex-1 w-full h-full self-stretch">
                <div className="w-full min-w-0">
                  <main className="flex flex-1 self-stretch mt-16 sm:mt-10 flex-col items-end justify-around">
                    {children}
                    <Footer />
                  </main>
                </div>
              </div>
            </React.Suspense>
          </div>
        </SidebarContext.Provider>
      </MenuProvider>
    </>
  );
}
