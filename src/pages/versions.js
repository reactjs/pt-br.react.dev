/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

type Props = {
  location: Location,
};

const Versions = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Versões do React</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/versions/`}
            title="React - Versões"
          />
          <div css={sharedStyles.markdown}>
            <p>
              O histórico completo de lançamentos do React está disponível{' '}
              <a
                href="https://github.com/facebook/react/releases"
                target="_blank"
                rel="noopener">
                no GitHub
              </a>
              .<br />A documentação mais recente pode ser encontrada abaixo.
            </p>
            <p>
              Veja nosso FAQ para se informar sobre{' '}
              <a href="/docs/faq-versioning.html">
                nossa política de versionamento e compromisso com estabilidade
              </a>
              .
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      Changelog
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        Documentação
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Versions;
