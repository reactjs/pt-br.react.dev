/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MarkdownPage} from 'components/Layout/MarkdownPage';
import {MDXComponents} from 'components/MDX/MDXComponents';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]}>
      <MarkdownPage meta={{title: 'Não encontrada'}}>
        <MaxWidth>
          <Intro>
            <P>Esta página não existe.</P>
            <P>
              Muito possivelmente, ainda não foi escrita. Este beta é um{' '}
              <A href="/#how-much-content-is-ready">trabalho em progresso!</A>
            </P>
            <P>Por favor, verifique mais tarde.</P>
          </Intro>
        </MaxWidth>
      </MarkdownPage>
    </Page>
  );
}
