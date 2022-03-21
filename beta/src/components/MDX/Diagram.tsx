/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Image from 'next/image';

interface DiagramProps {
  name: string;
  alt: string;
  height: number;
  width: number;
  children: string;
<<<<<<< HEAD
}

export function Diagram({name, alt, height, width, children}: DiagramProps) {
  return (
    <figure className="flex flex-col px-0 py-5 sm:p-10">
=======
  captionPosition: 'top' | 'bottom' | null;
}

function Caption({text}: {text: string}) {
  return (
    <figcaption className="p-1 sm:p-2 mt-0 sm:mt-0 text-gray-40 text-base lg:text-lg text-center leading-tight">
      {text}
    </figcaption>
  );
}

export function Diagram({
  name,
  alt,
  height,
  width,
  children,
  captionPosition,
}: DiagramProps) {
  return (
    <figure className="flex flex-col px-0 p-0 sm:p-10 first:mt-0 mt-10 sm:mt-0 justify-center items-center">
      {captionPosition === 'top' && <Caption text={children} />}
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0
      <div className="dark-image">
        <Image
          src={`/images/docs/diagrams/${name}.dark.svg`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
      <div className="light-image">
        <Image
          src={`/images/docs/diagrams/${name}.svg`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
<<<<<<< HEAD
      <figcaption className="p-1 sm:p-4 mt-4 sm:mt-0 text-gray-40 text-base lg:text-lg text-center leading-6">
        {children}
      </figcaption>
=======
      {(!captionPosition || captionPosition === 'bottom') && (
        <Caption text={children} />
      )}
>>>>>>> 1e3b023d3192c36a2da7b72389debee2f0e0e8b0
    </figure>
  );
}

export default Diagram;
