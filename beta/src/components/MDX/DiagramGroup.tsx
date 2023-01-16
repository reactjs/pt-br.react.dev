/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
=======
>>>>>>> 38bf76a4a7bec6072d086ce8efdeef9ebb7af227
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
>>>>>>> 38bf76a4a7bec6072d086ce8efdeef9ebb7af227
      {children}
    </div>
  );
}

export default DiagramGroup;
