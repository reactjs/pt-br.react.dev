---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---


Esta página contem uma referência detalhada da API para a definição de classes de componentes React. Nós assumimos que você possui familiaridade com conceitos fundamentais do React, como [Componentes e Props](/docs/components-and-props.html), bem como [State e Lifecycle](/docs/state-and-lifecycle.html). Se isto não é familiar para você, leia essas páginas primeiro.


## Visão Geral {#overview}

React permite definirmos componentes como classes ou como funções. Componentes definidos como classes possuem mais funcionalidades que serão detalhadas nesta página. Para definir uma classe componente, ela precisa estender a classe `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Olá, {this.props.name}</h1>;
  }
}
```

O único método que você *deve* definir em uma subclasse de `React.Component` é chamado [`render()`](#render). Todos os outros métodos descritos nesta página são opcionais.

**Nós somos fortemente contra a criação de seus próprios componentes base.** Em componentes React, [O reuso do código é obtido primariamente através de composição ao invés de herança]
(/docs/composition-vs-inheritance.html).

>Nota:
>
>React não te obriga a utilizar a sintaxe ES6 para classes. Se preferir não usá-la, você pode usar o módulo `create-react-class` ou alguma outra abstração similar. Dê uma olhada em 
[Usando React sem ES6](/docs/react-without-es6.html) para mais sobre este assunto.

### O Ciclo de vida de um Componente {#ciclo-de-vida-de-componentes}

Cada componente possui muitos "métodos do ciclo de vida" que você pode sobrescrever para executar determinado código em momentos particulares do processo. **Você pode usar [este diagrama do ciclo de vida](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) para consulta.** Na lista abaixo, os métodos do ciclo de vida mais usados estão marcados em **negrito**. O resto deles, existe para o uso em casos relativamente raros.

#### Montando {#montando}

Estes métodos são chamados na seguinte ordem quando uma instância de um componente está sendo criada e inserida no DOM:


- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Nota:
>
>Estes métodos são considerados legado e você deve [evitá-los]/blog/2018/03/27/update-on-async-rendering.html) em código novo:
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Atualizando {#atualizando}

Uma atualização pode ser causada por alterações em props ou no state. Estes métodos são chamados na seguinte ordem quando um componente esta sendo re-renderizado:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Nota:
>
>Estes métodos são considerados legado e você deve [evitá-los]/blog/2018/03/27/update-on-async-rendering.html) em código novo:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Desmontando {#desmontando}

Estes métodos são chamados quando um componente está sendo removido do DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Tratando erros {#tratando-erros}

Estes métodos são chamados quando existir um erro durante a renderização, em um método do ciclo de vida, ou no construtor de qualquer componente-filho.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Outras APIs {#outras-apis}

Cada componente também fornece outras APIs:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Propriedades de Classes {#propriedades-de-classes}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Propriedades da instância {#propriedades-da-instância}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Referencia {#referencia}

### Métodos mais usados do Ciclo de Vida {#métodos-mais-usados-do-ciclo-de-vida}
Os métodos desta seção cobrem a grande maioria dos casos de uso que você encontrará criando componentes React. **Para uma referência visual, veja : [este diagrama do ciclo de vida](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

The `render()` method is the only required method in a class component.

When called, it should examine `this.props` and `this.state` and return one of the following types:

- **React elements.** Typically created via [JSX](/docs/introducing-jsx.html). For example, `<div />` and `<MyComponent />` are React elements that instruct React to render a DOM node, or another user-defined component, respectively.
- **Arrays and fragments.** Let you return multiple elements from render. See the documentation on [fragments](/docs/fragments.html) for more details.
- **Portals**. Let you render children into a different DOM subtree. See the documentation on [portals](/docs/portals.html) for more details.
- **String and numbers.** These are rendered as text nodes in the DOM.
- **Booleans or `null`**. Render nothing. (Mostly exists to support `return test && <Child />` pattern, where `test` is boolean.)

The `render()` function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, and it does not directly interact with the browser.

If you need to interact with the browser, perform your work in `componentDidMount()` or the other lifecycle methods instead. Keeping `render()` pure makes components easier to think about.

> Note
>
> `render()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**If you don't initialize state and you don't bind methods, you don't need to implement a constructor for your React component.**

The constructor for a React component is called before it is mounted. When implementing the constructor for a `React.Component` subclass, you should call `super(props)` before any other statement. Otherwise, `this.props` will be undefined in the constructor, which can lead to bugs.

Typically, in React constructors are only used for two purposes:

* Initializing [local state](/docs/state-and-lifecycle.html) by assigning an object to `this.state`.
* Binding [event handler](/docs/handling-events.html) methods to an instance.

You **should not call `setState()`** in the `constructor()`. Instead, if your component needs to use local state, **assign the initial state to `this.state`** directly in the constructor:

```js
constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Constructor is the only place where you should assign `this.state` directly. In all other methods, you need to use `this.setState()` instead.

Avoid introducing any side-effects or subscriptions in the constructor. For those use cases, use `componentDidMount()` instead.

>Note
>
>**Avoid copying props into state! This is a common mistake:**
>
>```js
>constructor(props) {
>  super(props);
>  // Don't do this!
>  this.state = { color: props.color };
>}
>```
>
>The problem is that it's both unnecessary (you can use `this.props.color` directly instead), and creates bugs (updates to the `color` prop won't be reflected in the state).
>
>**Only use this pattern if you intentionally want to ignore prop updates.** In that case, it makes sense to rename the prop to be called `initialColor` or `defaultColor`. You can then force a component to "reset" its internal state by [changing its `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) when necessary.
>
>Read our [blog post on avoiding derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html) to learn about what to do if you think you need some state to depend on the props.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.

This method is a good place to set up any subscriptions. If you do that, don't forget to unsubscribe in `componentWillUnmount()`.

You **may call `setState()` immediately** in `componentDidMount()`. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the `render()` will be called twice in this case, the user won't see the intermediate state. Use this pattern with caution because it often causes performance issues. In most cases, you should be able to assign the initial state in the `constructor()` instead. It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` is invoked immediately after updating occurs. This method is not called for the initial render.

Use this as an opportunity to operate on the DOM when the component has been updated. This is also a good place to do network requests as long as you compare the current props to previous props (e.g. a network request may not be necessary if the props have not changed).

```js
componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

You **may call `setState()` immediately** in `componentDidUpdate()` but note that **it must be wrapped in a condition** like in the example above, or you'll cause an infinite loop. It would also cause an extra re-rendering which, while not visible to the user, can affect the component performance. If you're trying to "mirror" some state to a prop coming from above, consider using the prop directly instead. Read more about [why copying props into state causes bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

If your component implements the `getSnapshotBeforeUpdate()` lifecycle (which is rare), the value it returns will be passed as a third "snapshot" parameter to `componentDidUpdate()`. Otherwise this parameter will be undefined.

> Note
>
> `componentDidUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` is invoked immediately before a component is unmounted and destroyed. Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in `componentDidMount()`.

You **should not call `setState()`** in `componentWillUnmount()` because the component will never be re-rendered. Once a component instance is unmounted, it will never be mounted again.

* * *

### Rarely Used Lifecycle Methods {#rarely-used-lifecycle-methods}

The methods in this section correspond to uncommon use cases. They're handy once in a while, but most of your components probably don't need any of them. **You can see most of the methods below on [this lifecycle diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) if you click the "Show less common lifecycles" checkbox at the top of it.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Use `shouldComponentUpdate()` to let React know if a component's output is not affected by the current change in state or props. The default behavior is to re-render on every state change, and in the vast majority of cases you should rely on the default behavior.

`shouldComponentUpdate()` is invoked before rendering when new props or state are being received. Defaults to `true`. This method is not called for the initial render or when `forceUpdate()` is used.

This method only exists as a **[performance optimization](/docs/optimizing-performance.html).** Do not rely on it to "prevent" a rendering, as this can lead to bugs. **Consider using the built-in [`PureComponent`](/docs/react-api.html#reactpurecomponent)** instead of writing `shouldComponentUpdate()` by hand. `PureComponent` performs a shallow comparison of props and state, and reduces the chance that you'll skip a necessary update.

If you are confident you want to write it by hand, you may compare `this.props` with `nextProps` and `this.state` with `nextState` and return `false` to tell React the update can be skipped. Note that returning `false` does not prevent child components from re-rendering when *their* state changes.

We do not recommend doing deep equality checks or using `JSON.stringify()` in `shouldComponentUpdate()`. It is very inefficient and will harm performance.

Currently, if `shouldComponentUpdate()` returns `false`, then [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), and [`componentDidUpdate()`](#componentdidupdate) will not be invoked. In the future React may treat `shouldComponentUpdate()` as a hint rather than a strict directive, and returning `false` may still result in a re-rendering of the component.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` is invoked right before calling the render method, both on the initial mount and on subsequent updates. It should return an object to update the state, or null to update nothing.

This method exists for [rare use cases](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) where the state depends on changes in props over time. For example, it might be handy for implementing a `<Transition>` component that compares its previous and next children to decide which of them to animate in and out.

Deriving state leads to verbose code and makes your components difficult to think about.  
[Make sure you're familiar with simpler alternatives:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) lifecycle instead.

* If you want to **re-compute some data only when a prop changes**, [use a memoization helper instead](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* If you want to **"reset" some state when a prop changes**, consider either making a component [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.

This method doesn't have access to the component instance. If you'd like, you can reuse some code between `getDerivedStateFromProps()` and the other class methods by extracting pure functions of the component props and state outside the class definition.

Note that this method is fired on *every* render, regardless of the cause. This is in contrast to `UNSAFE_componentWillReceiveProps`, which only fires when the parent causes a re-render and not as a result of a local `setState`.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` is invoked right before the most recently rendered output is committed to e.g. the DOM. It enables your component to capture some information from the DOM (e.g. scroll position) before it is potentially changed. Any value returned by this lifecycle will be passed as a parameter to `componentDidUpdate()`.

This use case is not common, but it may occur in UIs like a chat thread that need to handle scroll position in a special way.

A snapshot value (or `null`) should be returned.

For example:

`embed:react-component-reference/get-snapshot-before-update.js`

In the above examples, it is important to read the `scrollHeight` property in `getSnapshotBeforeUpdate` because there may be delays between "render" phase lifecycles (like `render`) and "commit" phase lifecycles (like `getSnapshotBeforeUpdate` and `componentDidUpdate`).

* * *

### Error boundaries {#error-boundaries}

Os *[error boundaries](/docs/error-boundaries.html)* são componentes React que realizam o *catch* de erros de JavaScript em qualquer parte da sua árvore de componentes filhos, realiza o *log* destes erros e exibe uma UI de *fallback* ao invés da árvore de componentes que quebrou. Os *Error boundary* realizam o *catch* de erros durante a renderização, nos métodos do lifecycle e em construtores de toda a sua árvore descendente.

Um *class component* se torna um *error boundary* caso ele defina um dos (ou ambos) métodos do lifecycle `static getDerivedStateFromError()` ou `componentDidCatch()`. Atualizar o *state* a partir destes lifecycles permite que você capture um erro JavaScript não tratado na árvore de descendentes e exiba uma UI de *fallback*.

Somente utilize *error boundaries* para recuperação de exceções inesperadas; **não tente utilizá-lo para controlar o fluxo.**

Para mais detalhes, veja *[Tratamento de Erros no React 16](/blog/2017/07/26/error-handling-in-react-16.html)*.

> Nota
>
> Os *error boundaries* somente realizam *catch* nos componentes **abaixo** dele na árvore. Um *error boundary* não pode realizar o *catch* de um erro dentro de si próprio.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

Este *lifecycle* é invocado após um erro ser lançado por um componente descendente.
Ele recebe o erro que foi lançado como parâmetro e deve retornar um valor para atualizar o *state*.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualize o state para que a próxima renderização exiba a UI de fallback.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI como fallback
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Nota
>
> `getDerivedStateFromError()` é chamado durante a fase de renderização, portanto efeitos colaterais (*side-effects*) não são permitidos.
> Para estes casos de uso, utilize `componentDidCatch()` como alternativa.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

Este lifecycle é invocado após um erro ter sido lançado por um componente descendente.
Ele recebe dois parâmetros:

1. `error` - O erro que foi lançado.
2. `info` - Um objeto com uma chave `componentStack` contendo [informações sobre qual componente lançou o erro](/docs/error-boundaries.html#component-stack-traces).

`componentDidCatch()` é chamado durante a fase de "commit", portanto efeitos colaterais (*side-effects*) não são permitidos.
Ele deveria ser usado para, por exemplo, realizar o *log* de erros:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualize o state para que a próxima renderização exiba a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Examplo de "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI como fallback
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Nota
>
> No evento de um erro, você pode renderizar uma UI de *fallback* com `componentDidCatch()` chamando `setState`, mas isto será depreciado numa *release* futura.
> Use `static getDerivedStateFromError()` para manipular a renderização de *fallback* como alternativa.

* * *

### Métodos legado do lifecycle {#legacy-lifecycle-methods}

Os métodos do lifecycle abaixo estão marcados como "legado". Eles ainda funcionam, mas não recomendamos utilizar eles em código novo. Você pode aprender mais sobre a migração de métodos legado do lifecycle [neste post no blog](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Nota
>
> Este lifecycle era nomeado `componentWillMount`. Este nome continuará a funcionar até a versão 17. Utilize o [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para atualizar automaticamente seus componentes.

`UNSAFE_componentWillMount()` é invocado antes que o *mounting* ocorra. Ele é chamado antes de `render()`, portanto chamar `setState()` sincronamente neste método não irá acarretar numa renderização extra. Geralmente, nós recomendamos o `constructor()` como alternativa para inicializar o *state*.

Evite introduzir quaisquer efeitos colaterais (*side-effects*) ou *subscriptions* neste método. Para estes casos de uso, utilize `componentDidMount()`.

Este é o único método do lifecycle chamado em *server rendering*.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Nota
>
> Este lifecycle era nomeado `componentWillReceiveProps`. Este nome continuará a funcionar até a versão 17. Utilize o [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para atualizar automaticamente seus componentes.

> Nota
>
> Utilizar este método do lifecycle frequentemente acarreta em *bugs* e inconsistências.
>
> * Se você precisar causar um *side-effect* (por exemplo, buscar dados um realizar uma animação) em resposta a uma mudança nas *props*, utilize o método do lifecycle [`componentDidUpdate`](#componentdidupdate) como alternativa.
> * Se você usa `componentWillReceiveProps` para **recomputar algum dado somente quando uma *prop* muda**, [utilize um *memoization helper*](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * Se você usa `componentWillReceiveProps` para **"resetar" algum *state* quando uma *prop* muda**, considere ou criar um componente [completamente controlado](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ou [completamente não controlado com uma `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) como alternativa.
> Para outros casos de uso, [siga as recomendações neste *post* do *blog* sobre *derived state*](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` é invocado antes que um componente montado receba novas *props*. Se você precisa atualizar o estado em resposta a mudanças na *prop* (por exemplo, para resetá-lo), você pode comparar `this.props` e `nextProps` e realizar transições de *state* utilizando `this.setState()` neste método.

Note que se um componente pai causar a rerenderização do seu componente, este método será chamado mesmo se as *props* não foram alteradas. Certifique-se de comparar o valor atual e o próximo se você deseja somente manipular mudanças.

O React não chama `UNSAFE_componentWillReceiveProps()` com *props* iniciais durante o *[mounting](#mounting)*. Ele só chama este método se alguma das *props* do componente puderem atualizar. Chamar `this.setState()` geralmente não desencadeia uma outra chamada `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Nota
>
> Este lifecycle era nomeado `componentWillUpdate`. Este nome continuará a funcionar até a versão 17. Utilize o [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para atualizar automaticamente seus componentes.

`UNSAFE_componentWillUpdate()` é invocado antes da renderização quando novas *props* ou *state* estão sendo recebidos. Utilize este método como uma oportunidade para realizar preparações antes que uma atualização ocorra. Este método não é chamado para a renderização inicial.

Note que você não pode chamar `this.setState()` aqui; e nem deveria fazer nada além (por exemplo, realizar o *dispatch* de uma *action* do *Redux*) que desencadearia uma atualização em um componente React antes que `UNSAFE_componentWillUpdate()` retorne.

Tipicamente, este método pode ser substituído por `componentDidUpdate()`. Se você estiver lendo do *DOM* neste método (por exemplo, para salvar a posição de rolagem), você pode mover esta lógica para `getSnapshotBeforeUpdate()`.

> Nota
>
> `UNSAFE_componentWillUpdate()` não será invocado se [`shouldComponentUpdate()`](#shouldcomponentupdate) retornar *false*.

* * *

## Outras APIs {#other-apis-1}

Diferentemente dos métodos do *lifecycle* acima (que o React chama por você), os métodos abaixo são métodos que *você* pode chamar a partir de seus componentes.

Existem apenas dois deles: `setState()` e `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` enfileira mudanças ao *state* do componente e diz ao React que este componente e seus componentes filho precisam ser rerenderizados com a atualização do *state*. Este é o principal método que você utiliza para atualizar a UI em resposta a *event handlers* e à resposta de servidores.

Pense em `setState()` como uma *requisição* ao invés de um comando imediato para atualizar o componente. Para uma melhoria na performance, o React pode atrasar a atualização, e então atualizar diversos componentes numa só leva. O React não garante que as mudanças no *state* são aplicadas imediatamente.

`setState()` nem sempre atualiza o componente imediatamente. Ele pode adiar a atualização para mais tarde. Isto torna a leitura de `this.state` logo após chamar `setState()` uma potencial cilada. Como alternativa, utilize `componentDidUpdate` ou o *callback* de `setState` (`setState(updater, callback)`), ambos possuem a garantia de dispararem após a aplicação da atualização. Se você precisa definir o *state* baseado no *state* anterior, leia sobre o argumento `updater` abaixo.

`setState()` vai sempre conduzir a uma rerenderização a menos que `shouldComponentUpdate()` retorne `false`. Se objetos mutáveis estão sendo utilizados e lógica de renderização condicional não puder ser implementada em `shouldComponentUpdate()`, chamar `setState()` somente quando o novo *state* diferir do *state* anterior irá evitar rerenderizações desnecessárias.

O primeiro argumento é uma função `updater` com a assinatura:

```javascript
(state, props) => stateChange
```

`state` é a referência ao *state* do componente no momento que a mudança está sendo aplicada. Ele não deve ser mutado diretamente. As mudanças devem ser representadas construindo um novo objeto baseado no *input* de *state* e *props*. Por exemplo, suponha que queiramos incrementar um valor no *state* em `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Tanto `state` quanto `props` que foram recebidas pela função `updater` tem a garantia de estarem atualizados. A saída do *updater* é superficialmente mesclada com o *state*.

O segundo parâmetro de `setState()` é uma função de *callback* opcional que será executada assim que `setState` for completada e o componente rerenderizado. Geralmente, recomendamos utilizar `componentDidUpdate()` para implementar esta lógica.

Você também pode passar um objeto como primeiro argumento de `setState()` ao invés de uma função:

```javascript
setState(stateChange[, callback])
```

Isto realiza uma mescla superficial de `stateChange` dentro no novo *state*. Por exemplo: para ajustar a quantidade de items no carrinho de compras:

```javascript
this.setState({quantity: 2})
```

Esta forma de `setState()` também é assíncrona, e múltiplas chamadas durante o mesmo ciclo podem ser agrupadas numa só. Por exemplo, se você tentar incrementar a quantidade de itens mais que uma vez no mesmo ciclo, isto resultará no equivalente a:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Chamadas subsequentes irão sobrescrever valores de chamadas anteriores no mesmo ciclo, então a quantidade será incrementada somente uma vez. Se o próximo estado depende do estado atual, recomendamos utilizar a função *updater* como alternativa:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

Para mais informações, veja:

* [Guia de State e Lifecycle](/docs/state-and-lifecycle.html)
* [Em detalhes: Quando e por que `setState()` agrupa chamadas?](https://stackoverflow.com/a/48610973/458193)
* [Em detalhes: por que o `this.state` é atualizado imediatamente?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

Por padrão, quando o *state* ou as *props* do seu componente são alteradas, seu componente renderizará novamente. Caso seu método `render()` dependa de algum outro dado, você pode informar ao React que o componente precisa de uma rerenderização chamando `forceUpdate()`.

Chamar `forceUpdate()` acarretará numa chamada de `render()` no componente, escapando `shouldComponentUpdate()`. Os métodos normais do lifecycle para os componentes filho serão chamados, incluindo o método `shouldComponentUpdate()` de cada filho. O React ainda irá atualizar o *DOM* caso realmente haja mudanças.

Norlmalmente, você deveria tentar evitar o uso de `forceUpdate()` e somente ler de `this.props` e `this.state` em `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` pode ser definido como uma propriedade do *component class*, para definir as *props* padrão para a classe. Isto é aplicado a *props* cujo valor é `undefined`, mas não para `null`. Por exemplo:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

Se `props.color` não for informado, o seu valor será definido como `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color será definido como 'blue'
  }
```

Se `props.color` for igual a `null`, continuará como `null`:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color continuará null
  }
```

* * *

### `displayName` {#displayname}

A *string* `displayName` é utilizada em mensagens de depuração. Normalmente, você não precisa defini-la explicitamente, pois é isto é inferido do nome da função ou classe que definem o componente. Você pode querer defini-la explicitamente se quiser exibir um nome diferente para propósitos de depuração ou quando você cria um *higher-order component*. Veja [Envolva o Display Name para Facilitar a Depuração](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) para mais detalhes.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` contém as *props* que foram definidas por quem chamou este componente. Veja [Componentes e Props](/docs/components-and-props.html) para uma introdução às *props*.

Em particular, `this.props.children` é uma *prop* especial, tipicamente definida pelas *tags* filhas na expressão JSX, ao invés de na própria *tag*.

### `state` {#state}

O *state* contém dados específicos a este componente que podem mudar com o tempo. O *state* é definido pelo usuário, e deve ser um objeto JavaScript.

Se algum valor não for usado para renderizamento ou para controle de *data flow* (por exemplo, um *ID* de *timer*), você não precisa colocar no *state*. Tais valores podem ser definidos como campos na instância do componente.

Veja [State e Lifecycle](/docs/state-and-lifecycle.html) para mais informações sobre o *state*.

Nunca mute `this.state` diretamente, pois chamar `setState()` após a mutação pode substituir a mutação realizada. Trate `this.state` como se ele fosse imutável.
