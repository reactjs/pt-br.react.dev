---
id: react-api
title: React Top-Level API
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` é o ponto de entrada da biblioteca React. Se você carrega o React a partir de uma *tag* `<script>`, estas *API*s *top-level* estarão disponíveis no `React` global. Se você usa ES6 com npm, você pode escrever `import React from 'react'`. Se você usa ES5 com npm, você pode escrever `var React = require('react')`.

## Visão Geral {#overview}

### Componentes {#components}

Os componentes React permitem que você divida a UI em pedaços independentes e reutilizáveis para pensar em cada pedaço isoladamente. Os componentes em React podem ser definidos ao estender `React.Component` ou `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Se você não utiliza classes do ES6, você pode usar o módulo `create-react-class`. Veja [Usando React sem ES6](/docs/react-without-es6.html) para mais informações.

Os componentes em React também podem ser definidos como funções que podem ser envoltas:

- [`React.memo`](#reactmemo)

### Criando Elementos em React {#creating-react-elements}

Nós recomendamos [utilizar o JSX](/docs/introducing-jsx.html) para descrever como sua UI deve se parecer. Cada elemento JSX é somente uma maneira alternativa de utilizar o [`React.createElement()`](#createelement). Em geral você não vai utilizar os métodos seguintes caso esteja usando JSX.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Veja [Usando React sem JSX](/docs/react-without-jsx.html) para mais informações.

### Transformando Elementos {#transforming-elements}

O `React` provê várias *API*s para manipulação de elementos:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragments {#fragments}

O `React` também provê um componente para que você possa renderizar múltiplos elementos sem a necessidade de criar outro elemento que os envolva.

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

O *Suspense* permite que componentes "esperem" por algo antes de renderizar. Atualmente, o *Suspense* suporta somente uma finalidade: [carregar componentes dinamicamente com `React.lazy`](/docs/code-splitting.html#reactlazy). Futuramente, ele prestará suporte para outras finalidades, como busca de dados.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Transitions {#transitions}

*Transitions* are a new concurrent feature introduced in React 18. They allow you to mark updates as transitions, which tells React that they can be interrupted and avoid going back to Suspense fallbacks for already visible content.

- [`React.startTransition`](#starttransition)
- [`React.useTransition`](/docs/hooks-reference.html#usetransition)

### Hooks {#hooks}

Os *Hooks* são uma novidade no React 16.8. Eles permitem que você utilize o estado (*state*) e outras funcionalidades do React sem ter que escrever uma classe para isso. Os *Hooks* possuem uma [seção dedicada na documentação](/docs/hooks-intro.html) e uma referência da *API* separada:

- [*Hooks* Básicos](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [*Hooks* Adicionais](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)
  - [`useDeferredValue`](/docs/hooks-reference.html#usedeferredvalue)
  - [`useTransition`](/docs/hooks-reference.html#usetransition)
  - [`useId`](/docs/hooks-reference.html#useid)
- [Library Hooks](/docs/hooks-reference.html#library-hooks)
  - [`useSyncExternalStore`](/docs/hooks-reference.html#usesyncexternalstore)
  - [`useInsertionEffect`](/docs/hooks-reference.html#useinsertioneffect)

* * *

## Referência {#reference}

### `React.Component` {#reactcomponent}

`React.Component` é a classe base para componentes React quando eles são definidos usando [classes ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Consulte a [referência da *API* para React.Component](/docs/react-component.html) para ver uma lista de métodos e propriedades relacionadas à classe base `React.Component`.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` é similar a [`React.Component`](#reactcomponent). A diferença entre eles é que o [`React.Component`](#reactcomponent) não implementa o  [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), enquanto o `React.PureComponent` a implementa com uma comparação superficial de props e state.

Se o método `render()` do seu componente React renderiza o mesmo resultado dados os mesmos props e state, você pode usar `React.PureComponent` para um aumento no desempenho em alguns casos.

> Nota
>
> O método `shouldComponentUpdate()` do `React.PureComponent` compara os objetos apenas superficialmente. Se eles contiverem estruturas de dados complexas, isto pode causar falso-negativos para diferenças mais profundas. Estenda `PureComponent` quando você espera possuir props e state simples, ou então use [`forceUpdate()`](/docs/react-component.html#forceupdate) quando você souber que ocorreram mudanças profundas na estrutura de dados.
>
> Além disso, o método `shouldComponentUpdate()` do `React.PureComponent` pula atualizações de prop para toda a subárvore do componente. Esteja certo de que todos seus componentes que descendem dele também são "puros".

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* renderize usando props */
});
```

`O React.memo` é um *[higher order component](/docs/higher-order-components.html)*.

Se seu componente renderiza o mesmo resultado dados os mesmos props, você pode envolver nele uma chamada para `React.memo` para um aumento no desempenho em alguns casos, através da memoização do resultado. Isto significa que o React vai pular a renderização do componente e reutilizar o último resultado renderizado.

`React.memo` verifica apenas as alterações de prop. Se o seu componente de função envolvido em `React.memo` tiver um [`useState`](/docs/hooks-state.html), [`useReducer`](/docs/hooks-reference.html#usereducer) ou [`useContext`](/docs/hooks-reference.html#usecontext) Hook em sua implementação, ele ainda será renderizado quando o estado ou o contexto mudar.

Por padrão, ele irá comparar apenas superficialmente os objetos nos props. Se você quiser controle sob a comparação, você também pode prover uma função customizada de comparação como segundo argumento.

```javascript
function MyComponent(props) {
  /* renderize usando props */
}
function areEqual(prevProps, nextProps) {
  /*
  se prevProps e nextProps renderizam o mesmo resultado,
  retorne true.
  caso contrário, retorne false.
  */
}
export default React.memo(MyComponent, areEqual);
```

Este método existe somente como uma **[otimização de performance](/docs/optimizing-performance.html).** Não conte com ele para "prevenir" uma renderização, pois isso pode levar a *bugs*.

> Nota
>
> Ao contrário do método [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) de *class components*, a função `areEqual` retorna `true` se os props são iguais e `false` se os props não são iguais. É o inverso de `shouldComponentUpdate`.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Cria e retorna um novo [elemento React](/docs/rendering-elements.html) do tipo determinado. O argumento `type` pode ser uma *string* contendo a *tag name* (como, por exemplo, `'div'` ou `'span'`), um [componente React](/docs/components-and-props.html) (uma classe ou uma função), ou um [React *fragment*](#reactfragment).

Código escrito utilizando [JSX](/docs/introducing-jsx.html) será convertido para utilizar `React.createElement()`. Você tipicamente não invocará `React.createElement()` diretamente se você estiver usando JSX. Veja [React sem JSX](/docs/react-without-jsx.html) para aprender mais.

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

Clona e retorna um novo elemento React usando `element` como ponto de partida. `config` deve conter todos os novos adereços, `key` ou `ref`. O elemento resultante terá os props do elemento original, com os novos props mesclados superficialmente. Novos elementos filhos substituirão os existentes. `key` e `ref` do elemento original serão preservados se não houver `key` e `ref` presentes na `config`.

`React.cloneElement()` é quase equivalente a:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

No entanto, ele também preserva `ref`s. Isto significa que se você possui um elemento filho com um `ref` nele, você não o roubará acidentalmente do seu antecessor. Você terá o mesmo `ref` ligado ao seu novo elemento. A nova `ref` ou `key` irá substituir as antigas, se houver.

Esta *API* foi introduzida como uma reposição ao `React.addons.cloneWithProps()`, que foi descontinuado.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Retorna uma função que produz elementos React do tipo determinado. Assim como em [`React.createElement()`](#createelement), o argumento `type` pode ser uma *string* contendo o *tag name* (como, por exemplo, `'div'` ou `'span'`), um [componente React](/docs/components-and-props.html) (uma classe ou uma função), ou um [React *fragment*](#reactfragment).

Este *helper* é considerado legado, e nós encorajamos você a utilizar JSX ou `React.createElement()` diretamente como alternativa.

Em geral você não invocará `React.createFactory()` diretamente se estiver utilizando JSX. Veja [React sem JSX](/docs/react-without-jsx.html) para aprender mais.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Verifica se o objeto é um elemento React. Retorna `true` ou `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` provê utilitários para lidar com a estrutura de dados opaca `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Invoca uma função em cada elemento filho imediato contido em `children` com `this` definido para `thisArg`. Se `children` for um *array*, a função será chamada para cada filho no *array*. Se `children` for `null` ou `undefined`, este método retornará `null` ou `undefined` ao invés de um *array*.

> Nota
>
> Se `children` for um `Fragment` ele será tratado como um elemento filho único.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Igual a [`React.Children.map()`](#reactchildrenmap), mas não retorna um *array*.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Retorna o número total de componentes em `children`, igual ao número de vezes que o *callback* passado para `map` ou `forEach` seria invocado.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Verifica que `children` possui apenas um elemento filho (um elemento React) e o retorna. Caso contrário, este método lança um erro.

> Nota
>
> O `React.Children.only()` não aceita o valor retornado de [`React.Children.map()`](#reactchildrenmap) pois este é um array ao invés de um elemento React.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Retorna a estrutura de dados opaca `children` como um *flat array* com as chaves atribuídas a cada elemento filho. Útil se você deseja manipular coleções de elementos filhos em seus métodos de renderização, especialmente se você quiser reordenar ou repartir `this.props.children` antes de repassá-los.

> Nota
>
> `React.Children.toArray()` altera `key`s para preservar a semântica de *arrays* aninhados quando realizando o *flatten* de listas de elementos filho. Isto é, `toArray` prefixa cada `key` no *array* retornado, de tal modo que o `key` de cada elemento possui o escopo do *array* que o contém.

* * *

### `React.Fragment` {#reactfragment}

O componente `React.Fragment` permite que você retorne múltiplos elementos num método `render()` sem precisar criar um elemento DOM adicional:

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

Você também pode usar ele com a forma abreviada `<></>`. Para mais informações, veja [React v16.2.0: Suporte Melhorado para *Fragments*](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

`React.createRef` cria uma [`ref`](/docs/refs-and-the-dom.html) que pode ser anexada a elementos React através do atributo `ref`.

`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` cria um componente React que encaminha o atributo [`ref`](/docs/refs-and-the-dom.html) que ele recebe para outro componente abaixo na árvore. Esta técnica não é muito comum, mas é particularmente útil nos dois cenários:

* [Encaminhando *refs* para componentes DOM](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Encaminhando *refs* em *higher-order-components*](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` aceita uma função de renderização como argumento. React chamará esta função com `props` e `ref` como seus dois argumentos. Esta função deve retornar um React *node*.

`embed:reference-react-forward-ref.js`

No exemplo acima, React passa o `ref` dado para o elemento `<FancyButton ref={ref}>` como o segundo argumento para a função de renderização dentro da chamada `React.forwardRef`.

Como resultado, após React anexar o `ref`, `ref.current` irá apontar diretamente para a instância do elemento DOM `<button>`

Para mais informações, veja [encaminhando *refs*](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

`React.lazy()` permite que você defina um componente que é carregado dinamicamente. Isto ajuda a reduzir o tamanho do *bundle*, retardando o carregamento de componentes que não são utilizados durante a renderização inicial.

Você pode aprender como utilizar isto em nossa [documentação de *code splitting*](/docs/code-splitting.html#reactlazy). Você pode também querer ver [este artigo](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) explicando como utilizar mais detalhadamente.

```js
// Este componente é carregado dinamicamente
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Note que renderizar componentes `lazy` requer que exista um componente `<React.Suspense>` num nível mais alto da árvore de renderização. É assim que você especifica um indicador de carregamento.

<<<<<<< HEAD
> Nota
>
> Usar `React.lazy` com *import* dinâmico requer que `Promises` estejam disponíveis no ambiente JS. Isto requer um *polyfill* no IE11 e suas versōes anteriores.

### `React.Suspense` {#reactsuspense}

`React.Suspense` permite especificar o indicador de carregamento em caso de alguns componentes abaixo na árvore ainda não estarem prontos para renderizar. Atualmente, componentes de carregamento *lazy* são a **única** finalidade que o `<React.Suspense>` presta suporte:
=======
### `React.Suspense` {#reactsuspense}

`React.Suspense` lets you specify the loading indicator in case some components in the tree below it are not yet ready to render. In the future we plan to let `Suspense` handle more scenarios such as data fetching. You can read about this in [our roadmap](/blog/2018/11/27/react-16-roadmap.html).

Today, lazy loading components is the **only** use case supported by `<React.Suspense>`:
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

```js
// Este componente é carregado dinamicamente
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Mostra <Spinner> enquanto OtherComponent carrega
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Isto está documentado em nosso [guia para *code splitting*](/docs/code-splitting.html#reactlazy). Note que componentes `lazy` podem estar em níveis profundos dentro da árvore de `Suspense` -- ele não precisa envolver cada um deles. A melhor prática é colocar `<Suspense>` onde você quer ver um indicador de carregamento, mas utilizar `lazy()` onde você quiser realizar *code splitting*.

<<<<<<< HEAD
Enquanto o React não presta suporte a isto, no futuro nós planejamos permitir que `Suspense` lide com mais cenários como busca de dados. Você pode ler sobre isso em [nosso *roadmap*](/blog/2018/11/27/react-16-roadmap.html).

> Nota
>
> `React.lazy()` e `<React.Suspense>` ainda não tem suporte através do `ReactDOMServer`. Esta é uma limitação conhecida que será resolvida futuramente.
=======
> Note
>
> For content that is already shown to the user, switching back to a loading indicator can be disorienting. It is sometimes better to show the "old" UI while the new UI is being prepared. To do this, you can use the new transition APIs [`startTransition`](#starttransition) and [`useTransition`](/docs/hooks-reference.html#usetransition) to mark updates as transitions and avoid unexpected fallbacks.

#### `React.Suspense` in Server Side Rendering {#reactsuspense-in-server-side-rendering}
During server side rendering Suspense Boundaries allow you to flush your application in smaller chunks by suspending.
When a component suspends we schedule a low priority task to render the closest Suspense boundary's fallback. If the component unsuspends before we flush the fallback then we send down the actual content and throw away the fallback.

#### `React.Suspense` during hydration {#reactsuspense-during-hydration}
Suspense boundaries depend on their parent boundaries being hydrated before they can hydrate, but they can hydrate independently from sibling boundaries. Events on a boundary before its hydrated will cause the boundary to hydrate at
a higher priority than neighboring boundaries. [Read more](https://github.com/reactwg/react-18/discussions/130)

### `React.startTransition` {#starttransition}

```js
React.startTransition(callback)
```
`React.startTransition` lets you mark updates inside the provided callback as transitions. This method is designed to be used when [`React.useTransition`](/docs/hooks-reference.html#usetransition) is not available.

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transition will not show a fallback for re-suspended content, allowing the user to continue interacting while rendering the update.
>
> `React.startTransition` does not provide an `isPending` flag. To track the pending status of a transition see [`React.useTransition`](/docs/hooks-reference.html#usetransition).
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb
