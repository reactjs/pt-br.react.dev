/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock';
import {useRouter} from 'next/router';

<<<<<<< HEAD
type SidebarNav = 'root' | 'docs' | 'apis';
=======
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
/**
 * Menu toggle that enables body scroll locking (for
 * iOS Mobile and Tablet, Android, desktop Safari/Chrome/Firefox)
 * without breaking scrolling of a target
 * element.
 */
export const useMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const showSidebar = React.useCallback(() => {
    setIsOpen(true);
    if (menuRef.current != null) {
      disableBodyScroll(menuRef.current);
    }
  }, []);

  const hideSidebar = React.useCallback(() => {
    setIsOpen(false);
    if (menuRef.current != null) {
      enableBodyScroll(menuRef.current);
    }
  }, []);

  const toggleOpen = React.useCallback(() => {
    if (isOpen) {
      hideSidebar();
    } else {
      showSidebar();
    }
  }, [showSidebar, hideSidebar, isOpen]);

  React.useEffect(() => {
    hideSidebar();
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [router.pathname, hideSidebar]);

  // Avoid top-level context re-renders
  return React.useMemo(
    () => ({
      hideSidebar,
      showSidebar,
      toggleOpen,
      menuRef,
      isOpen,
    }),
    [hideSidebar, showSidebar, toggleOpen, menuRef, isOpen]
  );
};

export const MenuContext = React.createContext<ReturnType<typeof useMenu>>(
  {} as ReturnType<typeof useMenu>
);

export function MenuProvider(props: {children: React.ReactNode}) {
  return <MenuContext.Provider value={useMenu()} {...props} />;
}
