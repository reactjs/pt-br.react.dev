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
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b
  noMargin?: boolean;
  noMarkers?: boolean;
}): any {
  const {children, isFromPackageImport} = props;
  return (
<<<<<<< HEAD
    <React.Suspense
=======
    <Suspense
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b
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
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b
  );
});
