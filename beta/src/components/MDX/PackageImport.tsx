/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children} from 'react';
import * as React from 'react';
import CodeBlock from './CodeBlock';

interface PackageImportProps {
  children: React.ReactNode;
}

export function PackageImport({children}: PackageImportProps) {
  const terminal = Children.toArray(children).filter((child: any) => {
    return child.type?.mdxName !== 'pre';
  });
  const code = Children.toArray(children).map((child: any, i: number) => {
    if (child.type?.mdxName === 'pre') {
      return (
        <CodeBlock
<<<<<<< HEAD
          {...child.props.children.props}
=======
          {...child.props}
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b
          isFromPackageImport
          key={i}
          noMargin={true}
          noMarkers={true}
        />
      );
    } else {
      return null;
    }
  });
  return (
    <section className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
      <div className="flex flex-col justify-center">{terminal}</div>
      <div className="flex flex-col justify-center">{code}</div>
    </section>
  );
}
