/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import cn from 'classnames';
import * as React from 'react';
const CodeBlock = React.lazy(() => import('./CodeBlock'));

<<<<<<< HEAD
export default React.memo(function CodeBlockWrapper(props: {
  isFromPackageImport: boolean;
  children: string;
  className?: string;
  metastring: string;
=======
import * as React from 'react';
import cn from 'classnames';
import {lazy, memo, Suspense} from 'react';
const CodeBlock = lazy(() => import('./CodeBlock'));

export default memo(function CodeBlockWrapper(props: {
  children: React.ReactNode & {
    props: {
      className: string;
      children: string;
      meta?: string;
    };
  };
  isFromPackageImport: boolean;
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
  noMargin?: boolean;
  noMarkers?: boolean;
}): any {
  const {children, isFromPackageImport} = props;
  return (
<<<<<<< HEAD
    <React.Suspense
=======
    <Suspense
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
      fallback={
        <pre
          className={cn(
            'rounded-lg leading-6 h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden',
            !isFromPackageImport && 'my-8'
          )}>
          <div className="py-[18px] pl-5 font-normal ">
            <p className="sp-pre-placeholder overflow-hidden">{children}</p>
          </div>
        </pre>
      }>
      <CodeBlock {...props} />
<<<<<<< HEAD
    </React.Suspense>
=======
    </Suspense>
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
  );
});
