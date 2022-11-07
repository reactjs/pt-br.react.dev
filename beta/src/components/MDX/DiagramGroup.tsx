/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
=======
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
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
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
      {children}
    </div>
  );
}

export default DiagramGroup;
