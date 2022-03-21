/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {ReactNode} from 'react';

interface DiagramGroupProps {
  children: ReactNode;
}

export function DiagramGroup({children}: DiagramGroupProps) {
  return (
<<<<<<< HEAD
    <div className="flex flex-col sm:flex-row px-6 py-2 sm:p-0 space-y-10 sm:space-y-0">
=======
    <div className="flex flex-col sm:flex-row py-2 sm:p-0 sm:space-y-0 justify-center items-start sm:items-center w-full">
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0
      {children}
    </div>
  );
}

export default DiagramGroup;
