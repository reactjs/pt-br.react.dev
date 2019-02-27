/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import React, {Component} from 'react';
import {colors, media} from 'theme';

type State = {
  enabled: boolean,
};

class DocSearch extends Component<{}, State> {
  state = {
    enabled: true,
  };
  componentDidMount() {
    // Inicializar a busca do Algolia.
    // TODO Isto é custoso? Deveria ser adiado até que um usuário esteja prestes a pesquisar?
    // eslint-disable-next-line no-undef
    if (window.docsearch) {
      window.docsearch({
        apiKey: 'c87837f14775a7c3e2226c3a9e75a7e3',
        indexName: 'reactjs_pt-br',
        inputSelector: '#algolia-doc-search',
      });
    } else {
      console.warn('A busca falhou ao ser carregada e está sendo desativada');
      this.setState({enabled: false});
    }
  }

  render() {
    const {enabled} = this.state;

    return enabled ? (
      <form
        css={{
          display: 'flex',
          flex: '0 0 auto',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',

          [media.lessThan('expandedSearch')]: {
            justifyContent: 'flex-end',
            marginRight: 10,
          },
          // TODO: Something like this could show the full search box in more cases
          // but it currently breaks its expanding animation.
          // [media.between('mediumSearch', 'largerSearch')]: {
          //   width: 'calc(100% / 8)',
          // },
          [media.greaterThan('expandedSearch')]: {
            minWidth: 100,
          },
        }}>
        <input
          css={{
            width: '100%',
            appearance: 'none',
            background: 'transparent',
            border: 0,
            color: colors.white,
            fontSize: 18,
            fontWeight: 300,
            fontFamily: 'inherit',
            position: 'relative',
            padding: '4px 4px 4px 29px',
            backgroundImage: 'url(/search.svg)',
            backgroundSize: '16px 16px',
            backgroundRepeat: 'no-repeat',
            backgroundPositionY: 'center',
            backgroundPositionX: '4px',

            ':focus': {
              outline: 0,
              backgroundColor: colors.lighter,
              borderRadius: '0.25rem',
            },

            [media.lessThan('expandedSearch')]: {
              fontSize: 16,
              width: '16px',
              transition: 'width 0.2s ease, padding 0.2s ease',
              paddingLeft: '16px',

              ':focus': {
                paddingLeft: '29px',
                width: '8rem',
                outline: 'none',
              },
            },
          }}
          id="algolia-doc-search"
          type="search"
          placeholder="Buscar docs"
          aria-label="Buscar docs"
        />
      </form>
    ) : null;
  }
}

export default DocSearch;
