/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

<<<<<<< HEAD
import * as React from 'react';
=======
>>>>>>> e77ba1e90338ff18f965c9b94c733b034b3ac18f
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
      <div className="dark-image">
        <Image
          src={`/images/docs/diagrams/${name}.dark.svg`}
=======
  captionPosition: 'top' | 'bottom' | null;
}

function Caption({text}: {text: string}) {
  return (
    <div className="w-full table">
      <figcaption className="p-1 sm:p-2 mt-0 sm:mt-0 text-gray-40 text-base lg:text-lg text-center leading-tight table-caption">
        {text}
      </figcaption>
    </div>
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
      <div className="dark-image">
        <Image
          src={`/images/docs/diagrams/${name}.dark.png`}
>>>>>>> e77ba1e90338ff18f965c9b94c733b034b3ac18f
          alt={alt}
          height={height}
          width={width}
        />
      </div>
      <div className="light-image">
        <Image
<<<<<<< HEAD
          src={`/images/docs/diagrams/${name}.svg`}
=======
          src={`/images/docs/diagrams/${name}.png`}
>>>>>>> e77ba1e90338ff18f965c9b94c733b034b3ac18f
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
>>>>>>> e77ba1e90338ff18f965c9b94c733b034b3ac18f
    </figure>
  );
}

export default Diagram;
