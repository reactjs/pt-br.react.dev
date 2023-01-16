/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
=======
>>>>>>> 38bf76a4a7bec6072d086ce8efdeef9ebb7af227
import {UnstyledOpenInCodeSandboxButton} from '@codesandbox/sandpack-react';
import {IconNewPage} from '../../Icon/IconNewPage';

export const OpenInCodeSandboxButton = () => {
  return (
    <UnstyledOpenInCodeSandboxButton
<<<<<<< HEAD
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1 ml-3 md:ml-1"
      title="Open in CodeSandbox">
      <IconNewPage
        className="inline mb-0.5 ml-1 mr-1 relative top-px"
        width=".8em"
        height=".8em"
=======
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1 ml-2 md:ml-1"
      title="Open in CodeSandbox">
      <IconNewPage
        className="inline ml-1 mr-1 relative top-[1px]"
        width="1em"
        height="1em"
>>>>>>> 38bf76a4a7bec6072d086ce8efdeef9ebb7af227
      />
      <span className="hidden md:block">Fork</span>
    </UnstyledOpenInCodeSandboxButton>
  );
};
