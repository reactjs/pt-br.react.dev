/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
=======
import {useRef, useLayoutEffect, Fragment} from 'react';

import cn from 'classnames';
>>>>>>> 3ff6fe871c6212118991ffafa5503358194489a0
import {RouteItem} from 'components/Layout/useRouteMeta';
import {useRouter} from 'next/router';
import {removeFromLast} from 'utils/removeFromLast';
import {useRouteMeta} from '../useRouteMeta';
import {SidebarLink} from './SidebarLink';
import useCollapse from 'react-collapsed';
import usePendingRoute from 'hooks/usePendingRoute';

interface SidebarRouteTreeProps {
  isForceExpanded: boolean;
  routeTree: RouteItem;
  level?: number;
}

function CollapseWrapper({
  isExpanded,
  duration,
  children,
}: {
  isExpanded: boolean;
  duration: number;
  children: any;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const {getCollapseProps} = useCollapse({
    isExpanded,
    duration,
  });

  // Disable pointer events while animating.
  const isExpandedRef = useRef(isExpanded);
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      const wasExpanded = isExpandedRef.current;
      if (wasExpanded === isExpanded) {
        return;
      }
      isExpandedRef.current = isExpanded;
      if (ref.current !== null) {
        const node: HTMLDivElement = ref.current;
        node.style.pointerEvents = 'none';
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          node.style.pointerEvents = '';
        }, duration + 100);
      }
    });
  }

  return (
    <div
      ref={ref}
      style={{
        opacity: isExpanded ? 1 : 0.5,
        transition: `opacity ${duration}ms ease-in-out`,
      }}>
      <div {...getCollapseProps()}>{children}</div>
    </div>
  );
}

export function SidebarRouteTree({
  isForceExpanded,
  routeTree,
  level = 0,
}: SidebarRouteTreeProps) {
  const {breadcrumbs} = useRouteMeta(routeTree);
  const cleanedPath = useRouter().asPath.split(/[\?\#]/)[0];
  const pendingRoute = usePendingRoute();

  const slug = cleanedPath;
  const currentRoutes = routeTree.routes as RouteItem[];
  const expandedPath = currentRoutes.reduce(
    (acc: string | undefined, curr: RouteItem) => {
      if (acc) return acc;
      const breadcrumb = breadcrumbs.find((b) => b.path === curr.path);
      if (breadcrumb) {
        return curr.path;
      }
      if (curr.path === cleanedPath) {
        return cleanedPath;
      }
      return undefined;
    },
    undefined
  );

  const expanded = expandedPath;
  return (
    <ul>
      {currentRoutes.map(
        (
          {path, title, routes, wip, heading, hasSectionHeader, sectionHeader},
          index
        ) => {
          const pagePath = path && removeFromLast(path, '.');
          const selected = slug === pagePath;

          let listItem = null;
          if (!path || !pagePath || heading) {
            // if current route item has no path and children treat it as an API sidebar heading
            listItem = (
              <SidebarRouteTree
                level={level + 1}
                isForceExpanded={isForceExpanded}
                routeTree={{title, routes}}
              />
            );
          } else if (routes) {
            // if route has a path and child routes, treat it as an expandable sidebar item
            const isExpanded = isForceExpanded || expanded === path;
            listItem = (
              <li key={`${title}-${path}-${level}-heading`}>
                <SidebarLink
                  key={`${title}-${path}-${level}-link`}
                  href={pagePath}
                  isPending={pendingRoute === pagePath}
                  selected={selected}
                  level={level}
                  title={title}
                  wip={wip}
                  isExpanded={isExpanded}
                  isBreadcrumb={expandedPath === path}
                  hideArrow={isForceExpanded}
                />
                <CollapseWrapper duration={250} isExpanded={isExpanded}>
                  <SidebarRouteTree
                    isForceExpanded={isForceExpanded}
                    routeTree={{title, routes}}
                    level={level + 1}
                  />
                </CollapseWrapper>
              </li>
            );
          } else {
            // if route has a path and no child routes, treat it as a sidebar link
            listItem = (
              <li key={`${title}-${path}-${level}-link`}>
                <SidebarLink
                  isPending={pendingRoute === pagePath}
                  href={path.startsWith('https://') ? path : pagePath}
                  selected={selected}
                  level={level}
                  title={title}
                  wip={wip}
                />
              </li>
            );
          }
          if (hasSectionHeader) {
            return (
              <Fragment key={`${sectionHeader}-${level}-separator`}>
                {index !== 0 && (
                  <li
                    role="separator"
                    className="mt-4 mb-2 ml-5 border-b border-border dark:border-border-dark"
                  />
                )}
                <h3
                  className={cn(
                    'mb-1 text-sm font-bold ml-5 text-gray-400 dark:text-gray-500',
                    index !== 0 && 'mt-2'
                  )}>
                  {sectionHeader}
                </h3>
              </Fragment>
            );
          } else {
            return listItem;
          }
        }
      )}
    </ul>
  );
}
