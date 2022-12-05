/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
=======
>>>>>>> cb9854a54984ef1288a8a2b8754897b15e75f433
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
>>>>>>> cb9854a54984ef1288a8a2b8754897b15e75f433
      {children}
    </div>
  );
}

export default DiagramGroup;
