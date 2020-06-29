/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const JsxCompiler = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>JSX Compiler Service</Header>
          <div css={sharedStyles.markdown}>
            <p>
              <strong>
                Esta ferramenta foi removida pois o JSXTransformer foi
                depreciado.
              </strong>
            </p>
            <p>
              Nós recomendamos usar outra ferramenta como o{' '}
              <a href="https://babeljs.io/repl">Babel REPL</a>.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default JsxCompiler;
