/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useState, useCallback, useEffect} from 'react';

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
<<<<<<< HEAD
    media.addListener(updateTarget);
=======

    try {
      // Chrome & Firefox
      media.addEventListener('change', updateTarget);
    } catch {
      // @deprecated method - Safari <= iOS12
      media.addListener(updateTarget);
    }
>>>>>>> 71cc6be6182418dec43b72f2a9ef464619cb7025

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

<<<<<<< HEAD
    return () => media.removeListener(updateTarget);
=======
    return () => {
      try {
        // Chrome & Firefox
        media.removeEventListener('change', updateTarget);
      } catch {
        // @deprecated method - Safari <= iOS12
        media.removeListener(updateTarget);
      }
    };
>>>>>>> 71cc6be6182418dec43b72f2a9ef464619cb7025
  }, [updateTarget, width]);

  return targetReached;
};

const useIsMobile = () => {
  return useMediaQuery(640);
};

export {useMediaQuery, useIsMobile};
