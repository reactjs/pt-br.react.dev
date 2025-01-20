---
title: "APIs Legadas do React"
---

<Intro>

Essas APIs são exportadas do pacote `react`, mas não são recomendadas para uso em código recém-escrito. Veja as páginas de API individuais vinculadas para as alternativas sugeridas.

</Intro>

---

## APIs Legadas {/*legacy-apis*/}

* [`Children`](/reference/react/Children) permite que você manipule e transforme o JSX recebido como a prop `children`. [Veja alternativas.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) permite que você crie um elemento React usando outro elemento como ponto de partida. [Veja alternativas.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) permite que você defina um componente React como uma classe JavaScript. [Veja alternativas.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) permite que você crie um elemento React. Normalmente, você usará JSX em vez disso.
* [`createRef`](/reference/react/createRef) cria um objeto ref que pode conter um valor arbitrário. [Veja alternativas.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) verifica se um valor é um elemento React. Normalmente usado com [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) é semelhante a [`Component`,](/reference/react/Component) mas ignora re-renderizações com as mesmas props. [Veja alternativas.](/reference/react/PureComponent#alternatives)

---

## APIs Obsoletas {/*deprecated-apis*/}

<Deprecated>

Essas APIs serão removidas em uma futura versão principal do React.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) permite que você crie uma função que produz elementos React de um determinado tipo.