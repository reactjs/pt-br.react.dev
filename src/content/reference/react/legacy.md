---
title: "APIs Legadas do React"
---

<Intro>

Essas APIs são exportadas do pacote `react`, mas não são recomendadas para uso em códigos recém-escritos. Veja as páginas de API individuais vinculadas para as alternativas sugeridas.

</Intro>

---

## APIs Legadas {/*legacy-apis*/}

* [`Children`](/reference/react/Children) permite que você manipule e transforme o JSX recebido como a `children` prop. [Veja as alternativas.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) permite que você crie um Elemento React usando outro elemento como ponto de partida. [Veja as alternativas.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) permite que você defina um Componente React como uma classe JavaScript. [Veja as alternativas.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) permite que você crie um Elemento React. Tipicamente, você usará JSX em vez disso.
* [`createRef`](/reference/react/createRef) cria um objeto ref que pode conter um valor arbitrário. [Veja as alternativas.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) permite que seu componente exponha um nó do DOM ao componente pai com um [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) verifica se um valor é um Elemento React. Tipicamente usado com [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) é similar a [`Component`,](/reference/react/Component) mas ele pula as re-renderizações com as mesmas props. [Veja as alternativas.](/reference/react/PureComponent#alternatives)

---

## APIs Removidas {/*removed-apis*/}

Essas APIs foram removidas no React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX em vez disso.
* Componentes de Classe: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) em vez disso.
* Componentes de Classe: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) em vez disso.
* Componentes de Classe: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) em vez disso.
* Componentes de Classe: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use um sistema de tipos como [TypeScript](https://www.typescriptlang.org/) em vez disso.
* Componentes de Classe: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) em vez disso.