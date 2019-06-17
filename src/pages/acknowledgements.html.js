/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

import names from '../../content/acknowledgements.yml';

const Acknowlegements = ({data, location}) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Agradecimentos</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/acknowledgements.html`}
            title="React - Agradecimentos"
          />

          <div css={sharedStyles.markdown}>
            <p>Nós gostaríamos de agradecer a todos os nossos contribuintes:</p>

            <ul
              css={{
                display: 'flex',
                flexWrap: 'wrap',
              }}>
              {names.map((name, index) => (
                <li
                  css={{
                    flex: '1 0 200px',
                  }}
                  key={index}>
                  {name}
                </li>
              ))}
            </ul>

            <p>Além disso, somos gratos a</p>
            <ul>
              <li>
                <a href="https://github.com/jeffbski">Jeff Barczewski</a> por
                nos permitir usar o nome{' '}
                <a href="https://www.npmjs.com/package/react">react</a>
                no npm.
              </li>
              <li>
                <a href="https://christopheraue.net/">Christopher Aue</a> por
                nos permitir usar o domínio{' '}
                <a href="https://reactjs.com/">reactjs.com</a> e a conta
                <a href="https://twitter.com/reactjs">@reactjs</a>
                no Twitter.
              </li>
              <li>
                <a href="https://github.com/ProjectMoon">ProjectMoon</a> por nos
                permitir usar o nome{' '}
                <a href="https://www.npmjs.com/package/flux">flux</a>
                no npm.
              </li>
              <li>
                Shane Anderson por nos permitir usar a organização{' '}
                <a href="https://github.com/react">react</a> no GitHub.
              </li>
              <li>
                <a href="https://github.com/voronianski">Dmitri Voronianski</a>{' '}
                por nos permitir usar o esquema de cores{' '}
                <a href="https://labs.voronianski.com/oceanic-next-color-scheme/">
                  Oceanic Next
                </a>{' '}
                neste website.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Acknowlegements;
