/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
=======
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34
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
>>>>>>> 664dd5736287e01a4557cd03c9a8736682911b34
      {children}
    </div>
  );
}

export default DiagramGroup;
