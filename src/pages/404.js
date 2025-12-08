/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>Esta página não existe.</P>
          <P>
            Se isso é um erro{', '}
            <A href="https://github.com/reactjs/pt-br.reactjs.org/issues/new">
              nos informe
            </A>
            {', '}e vamos tentar corrigi-lo!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
