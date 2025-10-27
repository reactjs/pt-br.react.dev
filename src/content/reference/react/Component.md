---
title: Component
---

<Pitfall>

Recomendamos definir componentes como funções ao invés de classes. [Veja como migrar.](#alternatives)

</Pitfall>

<Intro>

`Component` é a classe base para os componentes React definidos como [classes JavaScript.](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes) Componentes de classe ainda são suportados pelo React, mas não recomendamos usá-los em código novo.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `Component` {/*component*/}

Para definir um componente React como uma classe, estenda a classe `Component` integrada e defina um método [`render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Somente o método `render ` é obrigatório, outros métodos são opcionais.

[Veja mais exemplos abaixo.](#usage)

---

### `context` {/*context*/}

O [contexto](/learn/passing-data-deeply-with-context) de um componente de classe está disponível como `this.context`. Ele só estará disponível se você especificar *qual* contexto deseja receber usando [`static contextType`](#static-contexttype).

Um componente de classe só pode ler um contexto por vez.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Ler `this.context` em componentes de classe é equivalente a [`useContext`](/reference/react/useContext) em componentes de função.

[Veja como migrar.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

As props passadas para um componente de classe estão disponíveis como `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Ler `this.props` em componentes de classe é equivalente a [declarar props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) em componentes de função.

[Veja como migrar.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

O estado de um componente de classe está disponível como `this.state`. O campo `state` deve ser um objeto. Não mute o estado diretamente. Se você deseja alterar o estado, chame `setState` com o novo estado.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

Definir `state` em componentes de classe é equivalente a chamar [`useState`](/reference/react/useState) em componentes de função.

[Veja como migrar.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

O [constructor](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes/constructor) é executado antes que seu componente de classe seja *montado* (adicionado à tela). Normalmente, um construtor é usado apenas para dois propósitos no React. Ele permite que você declare o state e faça o [`bind`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_objects/Function/bind) de seus métodos de classe para a instância da classe:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Se você usar a sintaxe moderna do JavaScript, os construtores raramente são necessários. Em vez disso, você pode reescrever o código acima usando a [sintaxe de campo de classe pública](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes/Public_class_fields), que é suportada tanto por navegadores modernos quanto por ferramentas como [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Um construtor não deve conter quaisquer efeitos colaterais ou assinaturas.

#### Parâmetros {/*constructor-parameters*/}

* `props`: as props iniciais do componente.

#### Retornos {/*constructor-returns*/}

O `constructor` não deve retornar nada.

#### Ressalvas {/*constructor-caveats*/}

* Não execute quaisquer efeitos colaterais ou assinaturas no construtor. Em vez disso, use [`componentDidMount`](#componentdidmount) para isso.

* Dentro de um construtor, você precisa chamar `super(props)` antes de qualquer outra instrução. Se você não fizer isso, `this.props` será `undefined ` enquanto o construtor é executado, o que pode ser confuso e causar erros.

* Construtor é o único lugar onde você pode atribuir [`this.state`](#state) diretamente. Em todos os outros métodos, você precisa usar [`this.setState()`](#setstate) em vez disso. Não chame `setState` no construtor.

* Quando você usa [renderização do servidor,](/reference/react-dom/server) o construtor também será executado no servidor, seguido pelo método [`render`](#render). No entanto, os métodos de ciclo de vida como `componentDidMount ` ou `componentWillUnmount ` não serão executados no servidor.

* Quando o [Modo Restrito](/reference/react/StrictMode) estiver ativado, o React chamará o `constructor` duas vezes no desenvolvimento e então descartará uma das instâncias. Isso ajuda você a perceber os efeitos colaterais acidentais que precisam ser movidos para fora do `constructor`.

<Note>

Não existe um equivalente exato para `constructor` em componentes de função. Para declarar o estado em um componente de função, chame [`useState`.](/reference/react/useState) Para evitar o recálculo do estado inicial, [passe uma função para `useState`.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Se você definir `componentDidCatch`, o React o chamará quando algum componente filho (incluindo filhos distantes) lançar um erro durante a renderização. Isso permite que você registre esse erro em um serviço de relatório de erros em produção.

<<<<<<< HEAD
Normalmente, ele é usado em conjunto com [`static getDerivedStateFromError`](#static-getderivedstatefromerror), que permite que você atualize o state em resposta a um erro e exiba uma mensagem de erro ao usuário. Um componente com esses métodos é chamado de *limite de erro*.
=======
Typically, it is used together with [`static getDerivedStateFromError`](#static-getderivedstatefromerror) which lets you update state in response to an error and display an error message to the user. A component with these methods is called an *Error Boundary*.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

[Veja um exemplo.](#catching-rendering-errors-with-an-error-boundary)

#### Parâmetros {/*componentdidcatch-parameters*/}

* `error`: O erro que foi lançado. Na prática, geralmente será uma instância de [`Error`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Error), mas isso não é garantido porque o JavaScript permite [`throw`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/throw) qualquer valor, incluindo strings ou até `null`.

* `info`: Um objeto contendo informações adicionais sobre o erro. Seu campo `componentStack` contém um rastreamento de pilha com o componente que lançou, bem como os nomes e locais de origem de todos os seus componentes pai. Em produção, os nomes dos componentes serão minimizados. Se você configurar o relatório de erros de produção, poderá decodificar a pilha de componentes usando mapas de origem da mesma forma que faria para pilhas de erros JavaScript regulares.

#### Retornos {/*componentdidcatch-returns*/}

`componentDidCatch` não deve retornar nada.

#### Ressalvas {/*componentdidcatch-caveats*/}

* No passado, era comum chamar `setState` dentro de `componentDidCatch` para atualizar a UI e exibir a mensagem de erro de fallback. Isso está obsoleto em favor da definição de [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* As compilações de produção e desenvolvimento do React diferem ligeiramente na forma como `componentDidCatch` trata os erros. No desenvolvimento, os erros serão propagados para `window`, o que significa que qualquer `window.onerror` ou `window.addEventListener('error', callback)` interceptará os erros que foram capturados por `componentDidCatch`. Em produção, em vez disso, os erros não serão propagados, o que significa que qualquer manipulador de erros ancestral só receberá erros não explicitamente capturados por `componentDidCatch`.

<Note>

Ainda não existe um equivalente direto para `componentDidCatch` em componentes de função. Se você quiser evitar a criação de componentes de classe, escreva um único componente `ErrorBoundary` como acima e use-o em todo o seu aplicativo. Alternativamente, você pode usar o pacote [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary), que faz isso por você.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Se você definir o método `componentDidMount`, o React o chamará quando seu componente for adicionado *(montado)* na tela. Este é um lugar comum para iniciar a busca de dados, configurar assinaturas ou manipular os nós DOM.

Se você implementar `componentDidMount`, geralmente precisará implementar outros métodos de ciclo de vida para evitar erros. Por exemplo, se `componentDidMount` ler algum state ou props, você também deve implementar [`componentDidUpdate`](#componentdidupdate) para lidar com suas alterações e [`componentWillUnmount`](#componentwillunmount) para limpar o que `componentDidMount` estava fazendo.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Veja mais exemplos.](#adding-lifecycle-methods-to-a-class-component)

#### Parâmetros {/*componentdidmount-parameters*/}

`componentDidMount` não recebe nenhum parâmetro.

#### Retornos {/*componentdidmount-returns*/}

`componentDidMount` não deve retornar nada.

#### Ressalvas {/*componentdidmount-caveats*/}

- Quando o [Modo Restrito](/reference/react/StrictMode) estiver ativado, no desenvolvimento o React chamará `componentDidMount`, em seguida chamará imediatamente [`componentWillUnmount `,] (#componentwillunmount) e depois chamará `componentDidMount` novamente. Isso ajuda você a notar se você se esqueceu de implementar `componentWillUnmount` ou se sua lógica não "espelha" totalmente o que `componentDidMount` faz.

- Embora você possa chamar [`setState`](#setstate) imediatamente em `componentDidMount`, é melhor evitar isso quando puder. Ele acionará uma renderização extra, mas isso acontecerá antes que o navegador atualize a tela. Isso garante que, mesmo que o [`render`](#render) seja chamado duas vezes nesse caso, o usuário não verá o estado intermediário. Use este padrão com cautela porque ele geralmente causa problemas de desempenho. Na maioria dos casos, você deve ser capaz de atribuir o estado inicial no [`constructor`](#constructor) em vez disso. No entanto, pode ser necessário para casos como modais e dicas de ferramentas quando você precisa medir um nó DOM antes de renderizar algo que dependa de seu tamanho ou posição.

<Note>

Para muitos casos de uso, definir `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` juntos em componentes de classe é equivalente a chamar [`useEffect`](/reference/react/useEffect) em componentes de função. Nos raros casos em que é importante que o código seja executado antes da pintura do navegador, [`useLayoutEffect`](/reference/react/useLayoutEffect) é uma correspondência mais adequada.

[Veja como migrar.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

Se você definir o método `componentDidUpdate`, o React o chamará imediatamente após seu componente ter sido renderizado novamente com props ou state atualizados. Este método não é chamado para a renderização inicial.

Você pode usá-lo para manipular o DOM após uma atualização. Este também é um lugar comum para fazer solicitações de rede, desde que você compare as props atuais com as props anteriores (por exemplo, uma solicitação de rede pode não ser necessária se as props não tiverem sido alteradas). Normalmente, você o usaria em conjunto com [`componentDidMount`](#componentdidmount) e [`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Veja mais exemplos.](#adding-lifecycle-methods-to-a-class-component)

#### Parâmetros {/*componentdidupdate-parameters*/}

* `prevProps`: Props antes da atualização. Compare `prevProps` com [`this.props`](#props) para determinar o que mudou.

* `prevState`: State antes da atualização. Compare `prevState` com [`this.state`](#state) para determinar o que mudou.

* `snapshot`: Se você implementou [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` conterá o valor que você retornou desse método. Caso contrário, será `undefined`.

#### Retornos {/*componentdidupdate-returns*/}

`componentDidUpdate` não deve retornar nada.

#### Ressalvas {/*componentdidupdate-caveats*/}

- `componentDidUpdate` não será chamado se [`shouldComponentUpdate`](#shouldcomponentupdate) for definido e retornar `false`.

- A lógica dentro de `componentDidUpdate` geralmente deve ser encapsulada em condições que comparam `this.props` com `prevProps` e `this.state` com `prevState`. Caso contrário, há o risco de criar loops infinitos.

- Embora você possa chamar [`setState`](#setstate) imediatamente em `componentDidUpdate`, é melhor evitar isso quando puder. Ele acionará uma renderização extra, mas isso acontecerá antes que o navegador atualize a tela. Isso garante que, mesmo que o [`render`](#render) seja chamado duas vezes nesse caso, o usuário não verá o estado intermediário. Esse padrão geralmente causa problemas de desempenho, mas pode ser necessário para casos raros como modais e dicas de ferramentas quando você precisa medir um nó DOM antes de renderizar algo que dependa de seu tamanho ou posição.

<Note>

Para muitos casos de uso, definir `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` juntos em componentes de classe é equivalente a chamar [`useEffect`](/reference/react/useEffect) em componentes de função. Nos raros casos em que é importante que o código seja executado antes da pintura do navegador, [`useLayoutEffect`](/reference/react/useLayoutEffect) é uma correspondência mais adequada.

[Veja como migrar.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

Esta API foi renomeada de `componentWillMount` para [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) O nome antigo foi descontinuado. Em uma futura versão principal do React, somente o novo nome funcionará.

Execute o [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para atualizar automaticamente seus componentes.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

Esta API foi renomeada de `componentWillReceiveProps` para [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) O nome antigo foi descontinuado. Em uma futura versão principal do React, somente o novo nome funcionará.

Execute o [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para atualizar automaticamente seus componentes.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

Esta API foi renomeada de `componentWillUpdate` para [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) O nome antigo foi descontinuado. Em uma futura versão principal do React, somente o novo nome funcionará.

Execute o [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para atualizar automaticamente seus componentes.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

Se você definir o método `componentWillUnmount`, o React o chamará antes que seu componente seja removido *(desmontado)* da tela. Este é um lugar comum para cancelar a busca de dados ou remover assinaturas.

A lógica dentro de `componentWillUnmount` deve "espelhar" a lógica dentro [`componentDidMount`.](#componentdidmount) Por exemplo, se `componentDidMount` configurar uma assinatura, `componentWillUnmount` deve limpar essa assinatura. Se a lógica de limpeza em seu `componentWillUnmount` lê algumas props ou state, você geralmente também precisará implementar [`componentDidUpdate`](#componentdidupdate) para limpar os recursos (como assinaturas) correspondentes às props e state antigas.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Veja mais exemplos.](#adding-lifecycle-methods-to-a-class-component)

#### Parâmetros {/*componentwillunmount-parameters*/}

`componentWillUnmount` não recebe nenhum parâmetro.

#### Retornos {/*componentwillunmount-returns*/}

`componentWillUnmount` não deve retornar nada.

#### Ressalvas {/*componentwillunmount-caveats*/}
```
```
- Quando o [Strict Mode](/reference/react/StrictMode) está ativado, no desenvolvimento, o React chamará [`componentDidMount`,](#componentdidmount) então chamará imediatamente `componentWillUnmount` e, em seguida, chamará `componentDidMount` novamente. Isso ajuda você a notar se esqueceu de implementar `componentWillUnmount` ou se sua lógica não "espelha" totalmente o que `componentDidMount` faz.

<Note>

Para muitos casos de uso, definir `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` juntos em componentes de classe é equivalente a chamar [`useEffect`](/reference/react/useEffect) em componentes de função. Nos raros casos em que é importante que o código seja executado antes da pintura do navegador, [`useLayoutEffect`](/reference/react/useLayoutEffect) é uma correspondência mais próxima.

[Veja como migrar.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Força um componente a renderizar novamente.

Normalmente, isso não é necessário. Se o método [`render`](#render) do seu componente lê apenas de [`this.props`](#props), [`this.state`](#state) ou [`this.context`,](#context) ele renderizará novamente automaticamente quando você chamar [`setState`](#setstate) dentro do seu componente ou de um de seus pais. No entanto, se o método `render` do seu componente lê diretamente de uma fonte de dados externa, você deve dizer ao React para atualizar a interface do usuário quando essa fonte de dados mudar. É isso que `forceUpdate` permite que você faça.

Tente evitar todos os usos de `forceUpdate` e leia apenas de `this.props` e `this.state` em `render`.

#### Parâmetros {/*forceupdate-parameters*/}

* **opcional** `callback` Se especificado, o React chamará o `callback` que você forneceu após a confirmação da atualização.

#### Retorna {/*forceupdate-returns*/}

`forceUpdate` não retorna nada.

#### Ressalvas {/*forceupdate-caveats*/}

- Se você chamar `forceUpdate`, o React irá renderizar novamente sem chamar [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Ler uma fonte de dados externa e forçar os componentes de classe a renderizar novamente em resposta às suas alterações com `forceUpdate` foi substituído por [`useSyncExternalStore`](/reference/react/useSyncExternalStore) em componentes de função.

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

Se você implementar `getSnapshotBeforeUpdate`, o React irá chamá-lo imediatamente antes que o React atualize o DOM. Ele permite que seu componente capture algumas informações do DOM (por exemplo, a posição da rolagem) antes que ele seja potencialmente alterado. Qualquer valor retornado por este método do ciclo de vida será passado como um parâmetro para [`componentDidUpdate`.](#componentdidupdate)

Por exemplo, você pode usá-lo em uma interface do usuário como um tópico de bate-papo que precisa preservar sua posição de rolagem durante as atualizações:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Estamos adicionando novos itens à lista?
    // Capture a posição da rolagem para que possamos ajustar a rolagem mais tarde.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Se tivermos um valor de snapshot, acabamos de adicionar novos itens.
    // Ajuste a rolagem para que esses novos itens não empurrem os antigos para fora da exibição.
    // (snapshot aqui é o valor retornado de getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...conteúdo... */}</div>
    );
  }
}
```

No exemplo acima, é importante ler a propriedade `scrollHeight` diretamente em `getSnapshotBeforeUpdate`. Não é seguro lê-la em [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) ou [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) porque há uma possível lacuna de tempo entre a chamada desses métodos e a atualização do DOM pelo React.

#### Parâmetros {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Props antes da atualização. Compare `prevProps` com [`this.props`](#props) para determinar o que mudou.

* `prevState`: State antes da atualização. Compare `prevState` com [`this.state`](#state) para determinar o que mudou.

#### Retorna {/*getsnapshotbeforeupdate-returns*/}

Você deve retornar um valor de snapshot de qualquer tipo que desejar ou `null`. O valor que você retornou será passado como o terceiro argumento para [`componentDidUpdate`.](#componentdidupdate)

#### Ressalvas {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` não será chamado se [`shouldComponentUpdate`](#shouldcomponentupdate) for definido e retornar `false`.

<Note>

No momento, não há equivalente a `getSnapshotBeforeUpdate` para componentes de função. Este caso de uso é muito incomum, mas se você precisar dele, por enquanto você terá que escrever um componente de classe.

</Note>

---

### `render()` {/*render*/}

O método `render` é o único método obrigatório em um componente de classe.

O método `render` deve especificar o que você deseja que apareça na tela, por exemplo:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Olá, {this.props.name}!</h1>;
  }
}
```

O React pode chamar `render` a qualquer momento, então você não deve presumir que ele seja executado em um momento específico. Normalmente, o método `render` deve retornar um pedaço de [JSX](/learn/writing-markup-with-jsx), mas alguns [outros tipos de retorno](#render-returns) (como strings) são suportados. Para calcular o JSX retornado, o método `render` pode ler [`this.props`](#props), [`this.state`](#state) e [`this.context`](#context).

Você deve escrever o método `render` como uma função pura, o que significa que ele deve retornar o mesmo resultado se as props, state e context forem os mesmos. Ele também não deve conter efeitos colaterais (como configurar assinaturas) ou interagir com as APIs do navegador. Efeitos colaterais devem acontecer em manipuladores de eventos ou métodos como [`componentDidMount`.](#componentdidmount)

#### Parâmetros {/*render-parameters*/}

`render` não recebe nenhum parâmetro.

#### Retorna {/*render-returns*/}

`render` pode retornar qualquer nó React válido. Isso inclui elementos React, como `<div />`, strings, números, [portais](/reference/react-dom/createPortal), nós vazios (`null`, `undefined`, `true` e `false`) e arrays de nós React.

#### Ressalvas {/*render-caveats*/}

- `render` deve ser escrito como uma função pura de props, state e context. Não deve ter efeitos colaterais.

- `render` não será chamado se [`shouldComponentUpdate`](#shouldcomponentupdate) for definido e retornar `false`.

- Quando o [Strict Mode](/reference/react/StrictMode) está ativado, o React chamará `render` duas vezes no desenvolvimento e depois descartará um dos resultados. Isso ajuda você a perceber os efeitos colaterais acidentais que precisam ser movidos de fora do método `render`.

- Não há correspondência um-para-um entre a chamada `render` e a subsequente chamada `componentDidMount` ou `componentDidUpdate`. Alguns dos resultados da chamada `render` podem ser descartados pelo React quando for benéfico.

---

### `setState(nextState, callback?)` {/*setstate*/}

Chame `setState` para atualizar o state do seu componente React.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Olá, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` enfileira alterações no state do componente. Ele diz ao React que este componente e seus filhos precisam renderizar novamente com o novo state. Esta é a principal maneira de atualizar a interface do usuário em resposta às interações.

<Pitfall>

Chamar `setState` **não** altera o estado atual no código já em execução:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Ainda "Taylor"!
}
```

Ele só afeta o que `this.state` retornará a partir da próxima renderização.

</Pitfall>

Você também pode passar uma função para `setState`. Ele permite que você atualize o state com base no state anterior:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

Você não precisa fazer isso, mas é útil se quiser atualizar o state várias vezes durante o mesmo evento.

#### Parâmetros {/*setstate-parameters*/}

* `nextState`: Um objeto ou uma função.
  * Se você passar um objeto como `nextState`, ele será superficialmente mesclado em `this.state`.
  * Se você passar uma função como `nextState`, ela será tratada como uma _função atualizadora_. Ela deve ser pura, deve receber o state e as props pendentes como argumentos e deve retornar o objeto a ser superficialmente mesclado em `this.state`. O React colocará sua função atualizadora em uma fila e renderizará novamente seu componente. Durante a próxima renderização, o React calculará o próximo state aplicando todos os atualizadores enfileirados ao state anterior.

* **opcional** `callback`: Se especificado, o React chamará o `callback` que você forneceu após a confirmação da atualização.

#### Retorna {/*setstate-returns*/}

`setState` não retorna nada.

#### Ressalvas {/*setstate-caveats*/}

- Pense em `setState` como uma *solicitação* em vez de um comando imediato para atualizar o componente. Quando vários componentes atualizam seu state em resposta a um evento, o React irá agrupar suas atualizações e renderizá-las juntas em uma única passagem no final do evento. No raro caso em que você precisa forçar que uma atualização de state específica seja aplicada de forma síncrona, você pode envolvê-la em [`flushSync`,](/reference/react-dom/flushSync) mas isso pode prejudicar o desempenho.

- `setState` não atualiza `this.state` imediatamente. Isso torna a leitura de `this.state` logo após a chamada `setState` um possível problema. Em vez disso, use [`componentDidUpdate`](#componentdidupdate) ou o argumento `callback` de setState, cada um dos quais tem garantia de ser acionado após a aplicação da atualização. Se você precisar definir o state com base no state anterior, poderá passar uma função para `nextState`, conforme descrito acima.

<Note>

Chamar `setState` em componentes de classe é semelhante a chamar uma função [`set`](/reference/react/useState#setstate) em componentes de função.

[Veja como migrar.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Se você definir `shouldComponentUpdate`, o React irá chamá-lo para determinar se uma renderização novamente pode ser ignorada.

Se você está confiante de que deseja escrevê-lo manualmente, você pode comparar `this.props` com `nextProps` e `this.state` com `nextState` e retornar `false` para dizer ao React que a atualização pode ser ignorada.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nada mudou, então uma renderização novamente é desnecessária
      return false;
    }
    return true;
  }

  // ...
}

```

O React chama `shouldComponentUpdate` antes da renderização quando novas props ou state são recebidos. O padrão é `true`. Este método não é chamado para a renderização inicial ou quando [`forceUpdate`](#forceupdate) é usado.

#### Parâmetros {/*shouldcomponentupdate-parameters*/}

- `nextProps`: As próximas props que o componente está prestes a renderizar. Compare `nextProps` com [`this.props`](#props) para determinar o que mudou.
- `nextState`: O próximo state que o componente está prestes a renderizar. Compare `nextState` com [`this.state`](#props) para determinar o que mudou.
- `nextContext`: O próximo context que o componente está prestes a renderizar. Compare `nextContext` com [`this.context`](#context) para determinar o que mudou. Disponível apenas se você especificar [`static contextType`](#static-contexttype).

#### Retorna {/*shouldcomponentupdate-returns*/}

Retorne `true` se você deseja que o componente renderize novamente. Esse é o comportamento padrão.

Retorne `false` para dizer ao React que renderizar novamente pode ser ignorado.

#### Ressalvas {/*shouldcomponentupdate-caveats*/}

- Este método *só* existe como uma otimização de desempenho. Se seu componente quebrar sem ele, corrija isso primeiro.

- Considere usar [`PureComponent`](/reference/react/PureComponent) em vez de escrever `shouldComponentUpdate` manualmente. `PureComponent` compara superficialmente as props e o state e reduz a chance de que você ignore uma atualização necessária.

- Não recomendamos fazer verificações de igualdade profunda ou usar `JSON.stringify` em `shouldComponentUpdate`. Isso torna o desempenho imprevisível e dependente da estrutura de dados de cada prop e state. No melhor dos casos, você corre o risco de introduzir paralisações de vários segundos em seu aplicativo e, no pior dos casos, corre o risco de travá-lo.

- Retornar `false` não impede que os componentes filhos renderizem novamente quando o *seu* state mudar.

- Retornar `false` não *garante* que o componente não irá renderizar novamente. O React usará o valor de retorno como uma dica, mas ainda poderá optar por renderizar novamente seu componente se fizer sentido fazê-lo por outros motivos.

<Note>

Otimizar componentes de classe com `shouldComponentUpdate` é semelhante a otimizar componentes de função com [`memo`.](/reference/react/memo) Os componentes de função também oferecem otimização mais granular com [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

Se você definir `UNSAFE_componentWillMount`, o React o chamará imediatamente após o [`constructor`.](#constructor) Ele existe apenas por razões históricas e não deve ser usado em nenhum código novo. Em vez disso, use uma das alternativas:

- Para inicializar o state, declare [`state`](#state) como um campo de classe ou defina `this.state` dentro do [`constructor`.](#constructor)
- Se você precisar executar um efeito colateral ou configurar uma assinatura, mova essa lógica para [`componentDidMount`](#componentdidmount) em vez disso.

[Veja exemplos de como migrar de lifecycles inseguros.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parâmetros {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` não recebe nenhum parâmetro.

#### Retorna {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` não deve retornar nada.

#### Ressalvas {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` não será chamado se o componente implementar [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) ou [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Apesar de sua nomenclatura, `UNSAFE_componentWillMount` não garante que o componente *será* montado se seu aplicativo usa recursos modernos do React, como [`Suspense`.](/reference/react/Suspense) Se uma tentativa de renderização for suspensa (por exemplo, porque o código de algum componente filho ainda não foi carregado), o React jogará a árvore em andamento fora e tentará construir o componente do zero durante a próxima tentativa. É por isso que este método é "inseguro". O código que depende da montagem (como adicionar uma assinatura) deve ir para [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` é o único método do ciclo de vida que é executado durante a [renderização do servidor.](/reference/react-dom/server) Para todos os efeitos práticos, ele é idêntico ao [`constructor`,](#constructor) então você deve usar o `constructor` para esse tipo de lógica.

<Note>

Chamar [`setState`](#setstate) dentro de `UNSAFE_componentWillMount` em um componente de classe para inicializar o state é equivalente a passar esse state como o state inicial para [`useState`](/reference/react/useState) em um componente de função.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

Se você definir `UNSAFE_componentWillReceiveProps`, o React irá chamá-lo quando o componente receber novas props. Ele existe apenas por razões históricas e não deve ser usado em nenhum código novo. Em vez disso, use uma das alternativas:

- Se você precisar **executar um efeito colateral** (por exemplo, buscar dados, executar uma animação ou reinicializar uma assinatura) em resposta a alterações de prop, mova essa lógica para [`componentDidUpdate`](#componentdidupdate) em vez disso.
- Se você precisar **evitar o recálculo de alguns dados somente quando uma prop mudar,** use um [auxiliar de memoização](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) em vez disso.
- Se você precisar **"resetar" algum state quando uma prop mudar,** considere tornar um componente [totalmente controlado](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ou [totalmente não controlado com uma chave](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) em vez disso.
- Se você precisar **"ajustar" algum state quando uma prop mudar,** verifique se você pode calcular todas as informações necessárias apenas a partir das props durante a renderização. Se não for possível, use [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) em vez disso.

[Veja exemplos de como migrar de lifecycles inseguros.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Parâmetros {/*unsafe_componentwillreceiveprops-parameters*/}```text {/*parâmetros-unsafe_componentwillreceiveprops-parameterstext*/}
- `nextProps`: As próximas props que o componente está prestes a receber de seu componente pai. Compare `nextProps` com [`this.props`](#props) para determinar o que mudou.
- `nextContext`: O próximo contexto que o componente está prestes a receber do provedor mais próximo. Compare `nextContext` com [`this.context`](#context) para determinar o que mudou. Disponível somente se você especificar [`static contextType`](#static-contexttype).

#### Retorna {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` não deve retornar nada.

#### Ressalvas {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` não será chamado se o componente implementar [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) ou [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Apesar de seu nome, `UNSAFE_componentWillReceiveProps` não garante que o componente *receberá* essas props se seu aplicativo usar recursos modernos do React como [`Suspense`.](/reference/react/Suspense) Se uma tentativa de renderização for suspensa (por exemplo, porque o código de algum componente filho ainda não foi carregado), o React descartará a árvore em andamento e tentará construir o componente do zero durante a próxima tentativa. No momento da próxima tentativa de renderização, as props podem ser diferentes. É por isso que este método é "unsafe". O código que deve ser executado apenas para atualizações confirmadas (como redefinir uma assinatura) deve ir para [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` não significa que o componente recebeu *props diferentes* da última vez. Você precisa comparar `nextProps` e `this.props` por conta própria para verificar se algo mudou.

- O React não chama `UNSAFE_componentWillReceiveProps` com as props iniciais durante a montagem. Ele só chama este método se algumas das props do componente forem atualizadas. Por exemplo, chamar [`setState`](#setstate) não aciona geralmente `UNSAFE_componentWillReceiveProps` dentro do mesmo componente.

<Note>

Chamar [`setState`](#setstate) dentro de `UNSAFE_componentWillReceiveProps` em um componente de classe para "ajustar" o estado é equivalente a [chamar a função `set` de `useState` durante a renderização](/reference/react/useState#storing-information-from-previous-renders) em um componente de função.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}

Se você definir `UNSAFE_componentWillUpdate`, o React o chamará antes de renderizar com as novas props ou estado. Ele só existe por razões históricas e não deve ser usado em nenhum código novo. Em vez disso, use uma das alternativas:

- Se você precisar executar um efeito colateral (por exemplo, buscar dados, executar uma animação ou reinicializar uma assinatura) em resposta a alterações de prop ou estado, mova essa lógica para [`componentDidUpdate`](#componentdidupdate) em vez disso.
- Se você precisar ler algumas informações do DOM (por exemplo, para salvar a posição atual da rolagem) para que possa usá-la em [`componentDidUpdate`](#componentdidupdate) posteriormente, leia-a dentro de [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) em vez disso.

[Veja exemplos de como migrar de ciclos de vida inseguros.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parâmetros {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: As próximas props que o componente está prestes a renderizar. Compare `nextProps` com [`this.props`](#props) para determinar o que mudou.
- `nextState`: O próximo estado com o qual o componente está prestes a renderizar. Compare `nextState` com [`this.state`](#state) para determinar o que mudou.

#### Retorna {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` não deve retornar nada.

#### Ressalvas {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` não será chamado se [`shouldComponentUpdate`](#shouldcomponentupdate) for definido e retornar `false`.

- `UNSAFE_componentWillUpdate` não será chamado se o componente implementar [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) ou [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Não é suportado chamar [`setState`](#setstate) (ou qualquer método que leve a `setState` ser chamado, como despachar uma ação do Redux) durante `componentWillUpdate`.

- Apesar de seu nome, `UNSAFE_componentWillUpdate` não garante que o componente *será* atualizado se seu aplicativo usar recursos modernos do React como [`Suspense`.](/reference/react/Suspense) Se uma tentativa de renderização for suspensa (por exemplo, porque o código de algum componente filho ainda não foi carregado), o React descartará a árvore em andamento e tentará construir o componente do zero durante a próxima tentativa. No momento da próxima tentativa de renderização, as props e o estado podem ser diferentes. É por isso que este método é "unsafe". O código que deve ser executado apenas para atualizações confirmadas (como redefinir uma assinatura) deve ir para [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` não significa que o componente recebeu *props ou estado diferentes* da última vez. Você precisa comparar `nextProps` com `this.props` e `nextState` com `this.state` por conta própria para verificar se algo mudou.

- O React não chama `UNSAFE_componentWillUpdate` com as props e o estado iniciais durante a montagem.

<Note>

Não existe equivalente direto para `UNSAFE_componentWillUpdate` em componentes de função.

</Note>

---

### `static contextType` {/*static-contexttype*/}

Se você quiser ler [`this.context`](#context-instance-field) do seu componente de classe, você deve especificar qual contexto ele precisa ler. O contexto que você especifica como `static contextType` deve ser um valor criado anteriormente por [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Ler `this.context` em componentes de classe é equivalente a [`useContext`](/reference/react/useContext) em componentes de função.

[Veja como migrar.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Você pode definir `static defaultProps` para definir as props padrão para a classe. Elas serão usadas para props `undefined` e ausentes, mas não para props `null`.

Por exemplo, aqui está como você define que a prop `color` deve ser definida por padrão como `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

Se a prop `color` não for fornecida ou for `undefined`, ela será definida por padrão como `'blue'`:

```js
<>
  {/* this.props.color é "blue" */}
  <Button />

  {/* this.props.color é "blue" */}
  <Button color={undefined} />

  {/* this.props.color é null */}
  <Button color={null} />

  {/* this.props.color é "red" */}
  <Button color="red" />
</>
```

<Note>

Definir `defaultProps` em componentes de classe é semelhante a usar [valores padrão](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) em componentes de função.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

Se você definir `static getDerivedStateFromError`, o React o chamará quando um componente filho (incluindo filhos distantes) lançar um erro durante a renderização. Isso permite que você exiba uma mensagem de erro em vez de limpar a UI.

<<<<<<< HEAD
Normalmente, ele é usado em conjunto com [`componentDidCatch`](#componentdidcatch), que permite enviar o relatório de erro para algum serviço de análise. Um componente com esses métodos é chamado de *borda de erro*.
=======
Typically, it is used together with [`componentDidCatch`](#componentdidcatch) which lets you send the error report to some analytics service. A component with these methods is called an *Error Boundary*.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

[Veja um exemplo.](#catching-rendering-errors-with-an-error-boundary)

#### Parâmetros {/*static-getderivedstatefromerror-parameters*/}

* `error`: O erro que foi lançado. Na prática, geralmente será uma instância de [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), mas isso não é garantido porque o JavaScript permite [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) qualquer valor, incluindo strings ou até mesmo `null`.

#### Retorna {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` deve retornar o estado que diz ao componente para exibir a mensagem de erro.

#### Ressalvas {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` deve ser uma função pura. Se você deseja executar um efeito colateral (por exemplo, chamar um serviço de análise), também precisa implementar [`componentDidCatch`.](#componentdidcatch)

<Note>

Ainda não existe um equivalente direto para `static getDerivedStateFromError` em componentes de função. Se você quiser evitar a criação de componentes de classe, escreva um único componente `ErrorBoundary` como acima e use-o em todo o seu aplicativo. Como alternativa, use o pacote [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary), que faz isso.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

Se você definir `static getDerivedStateFromProps`, o React o chamará logo antes de chamar o [`render`,](#render) tanto na montagem inicial quanto nas atualizações subsequentes. Ele deve retornar um objeto para atualizar o estado ou `null` para não atualizar nada.

Este método existe para [casos de uso raros](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state), onde o estado depende de alterações nas props ao longo do tempo. Por exemplo, este componente `Form` redefine o estado `email` quando a prop `userID` muda:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Sempre que o usuário atual mudar,
    // Redefinir quaisquer partes do estado que estejam vinculadas a esse usuário.
    // Neste exemplo simples, é apenas o e-mail.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Observe que este padrão requer que você mantenha um valor anterior da prop (como `userID`) no estado (como `prevUserID`).

<Pitfall>

Derivar o estado leva a um código prolixo e dificulta a reflexão sobre seus componentes. [Certifique-se de estar familiarizado com alternativas mais simples:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Se você precisar **executar um efeito colateral** (por exemplo, busca de dados ou uma animação) em resposta a uma alteração nas props, use o método [`componentDidUpdate`](#componentdidupdate) em vez disso.
- Se você deseja **recalcular alguns dados somente quando uma prop muda,** [use um auxiliar de memoização em vez disso.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- Se você deseja **"redefinir" algum estado quando uma prop muda,** considere tornar um componente [totalmente controlado](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ou [totalmente não controlado com uma chave](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) em vez disso.

</Pitfall>

#### Parâmetros {/*static-getderivedstatefromprops-parameters*/}

- `props`: As próximas props que o componente está prestes a renderizar.
- `state`: O próximo estado com o qual o componente está prestes a renderizar.

#### Retorna {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` retorna um objeto para atualizar o estado ou `null` para não atualizar nada.

#### Ressalvas {/*static-getderivedstatefromprops-caveats*/}

- Este método é disparado em *cada* renderização, independentemente da causa. Isso é diferente de [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), que só é disparado quando os pais causam uma nova renderização e não como resultado de um `setState` local.

- Este método não tem acesso à instância do componente. Se você quiser, poderá reutilizar algum código entre `static getDerivedStateFromProps` e os outros métodos de classe, extraindo funções puras das props e do estado do componente fora da definição da classe.

<Note>

Implementar `static getDerivedStateFromProps` em um componente de classe é equivalente a [chamar a função `set` de `useState` durante a renderização](/reference/react/useState#storing-information-from-previous-renders) em um componente de função.

</Note>

---

## Uso {/*usage*/}

### Definindo um componente de classe {/*defining-a-class-component*/}

Para definir um componente React como uma classe, estenda a classe `Component` integrada e defina um método [`render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

O React chamará seu método [`render`](#render) sempre que precisar descobrir o que exibir na tela. Normalmente, você retornará algum [JSX](/learn/writing-markup-with-jsx) dele. Seu método `render` deve ser uma [função pura:](https://en.wikipedia.org/wiki/Pure_function), ele só deve calcular o JSX.

Semelhante aos [componentes de função,](/learn/your-first-component#defining-a-component) um componente de classe pode [receber informações por props](/learn/your-first-component#defining-a-component) de seu componente pai. No entanto, a sintaxe para ler props é diferente. Por exemplo, se o componente pai renderizar `<Greeting name="Taylor" />`, então você pode ler a prop `name` de [`this.props`](#props), como `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Observe que Hooks (funções começando com `use`, como [`useState`](/reference/react/useState)) não são compatíveis com componentes de classe.

<Pitfall>

Recomendamos definir componentes como funções em vez de classes. [Veja como migrar.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Adicionando estado a um componente de classe {/*adding-state-to-a-class-component*/}

Para adicionar [estado](/learn/state-a-components-memory) a uma classe, atribua um objeto a uma propriedade chamada [`state`](#state). Para atualizar o estado, chame [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

Recomendamos definir componentes como funções em vez de classes. [Veja como migrar.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Adicionando métodos do ciclo de vida a um componente de classe {/*adding-lifecycle-methods-to-a-class-component*/}

Existem alguns métodos especiais que você pode definir em sua classe.

Se você definir o método [`componentDidMount`](#componentdidmount), o React o chamará quando seu componente for adicionado *(montado)* à tela. O React chamará [`componentDidUpdate`](#componentdidupdate) após o seu componente renderizar novamente, devido a props ou estado alterados. O React chamará [`componentWillUnmount`](#componentwillunmount) depois que seu componente for removido *(desmontado)* da tela.

Se você implementar `componentDidMount`, geralmente precisará implementar todos os três ciclos de vida para evitar erros. Por exemplo, se `componentDidMount` lê algum estado ou props, você também precisa implementar `componentDidUpdate` para lidar com suas alterações e `componentWillUnmount` para limpar o que `componentDidMount` estava fazendo.

Por exemplo, este componente `ChatRoom` mantém uma conexão de chat sincronizada com props e estado:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Escolha a sala de bate-papo:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">geral</option>
          <option value="travel">viagem</option>
          <option value="music">música</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fechar bate-papo' : 'Abrir bate-papo'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }```js
import { Component } from 'react';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Bem vindo(a) à sala {this.props.roomId}!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Observe que, em desenvolvimento, quando o [Modo Strict](/reference/react/StrictMode) está ativado, o React chamará `componentDidMount`, chamará imediatamente `componentWillUnmount` e, em seguida, chamará `componentDidMount` novamente. Isso ajuda você a notar se você esqueceu de implementar `componentWillUnmount` ou se sua lógica não "espelha" totalmente o que `componentDidMount` faz.

<Pitfall>

Recomendamos definir componentes como funções em vez de classes. [Veja como migrar.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

<<<<<<< HEAD
### Capturando erros de renderização com um limite de erro {/*catching-rendering-errors-with-an-error-boundary*/}

Por padrão, se seu aplicativo lançar um erro durante a renderização, o React removerá sua UI da tela. Para evitar isso, você pode encapsular uma parte da sua UI em um *limite de erro*. Um limite de erro é um componente especial que permite que você mostre alguma UI de fallback em vez da parte que travou — por exemplo, uma mensagem de erro.

Para implementar um componente de limite de erro, você precisa fornecer [`static getDerivedStateFromError`](#static-getderivedstatefromerror) que permite que você atualize o estado em resposta a um erro e exiba uma mensagem de erro ao usuário. Você também pode implementar opcionalmente [`componentDidCatch`](#componentdidcatch) para adicionar alguma lógica extra, por exemplo, para registrar o erro em um serviço de análise.
=======
### Catching rendering errors with an Error Boundary {/*catching-rendering-errors-with-an-error-boundary*/}

By default, if your application throws an error during rendering, React will remove its UI from the screen. To prevent this, you can wrap a part of your UI into an *Error Boundary*. An Error Boundary is a special component that lets you display some fallback UI instead of the part that crashed--for example, an error message.

To implement an Error Boundary component, you need to provide [`static getDerivedStateFromError`](#static-getderivedstatefromerror) which lets you update state in response to an error and display an error message to the user. You can also optionally implement [`componentDidCatch`](#componentdidcatch) to add some extra logic, for example, to log the error to an analytics service.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

With [`captureOwnerStack`](/reference/react/captureOwnerStack) you can include the Owner Stack during development.

```js {9-12,14-27}
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualize o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback personalizada
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Então você pode encapsular uma parte da sua árvore de componentes com ele:

```js {1,3}
<ErrorBoundary fallback={<p>Algo deu errado</p>}>
  <Profile />
</ErrorBoundary>
```

Se `Profile` ou seu componente filho lançarem um erro, `ErrorBoundary` "capturará" esse erro, exibirá uma UI de fallback com a mensagem de erro que você forneceu e enviará um relatório de erro de produção para seu serviço de relatório de erro.

<<<<<<< HEAD
Você não precisa encapsular cada componente em um limite de erro separado. Quando você pensa sobre a [granularidade dos limites de erro,](https://www.brandondail.com/posts/fault-tolerance-react) considere onde faz sentido exibir uma mensagem de erro. Por exemplo, em um aplicativo de mensagens, faz sentido colocar um limite de erro ao redor da lista de conversas. Também faz sentido colocar um ao redor de cada mensagem individual. No entanto, não faria sentido colocar um limite em cada avatar.

<Note>

Atualmente, não há como escrever um limite de erro como um componente de função. No entanto, você não precisa escrever a classe de limite de erro sozinho. Por exemplo, você pode usar [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) em vez disso.
=======
You don't need to wrap every component into a separate Error Boundary. When you think about the [granularity of Error Boundaries,](https://www.brandondail.com/posts/fault-tolerance-react) consider where it makes sense to display an error message. For example, in a messaging app, it makes sense to place an Error Boundary around the list of conversations. It also makes sense to place one around every individual message. However, it wouldn't make sense to place a boundary around every avatar.

<Note>

There is currently no way to write an Error Boundary as a function component. However, you don't have to write the Error Boundary class yourself. For example, you can use [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) instead.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

</Note>

---

## Alternativas {/*alternatives*/}

### Migrando um componente simples de uma classe para uma função {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Normalmente, você irá [definir componentes como funções](/learn/your-first-component#defining-a-component) em vez disso.

Por exemplo, suponha que você esteja convertendo este componente de classe `Greeting` em uma função:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Defina uma função chamada `Greeting`. É aqui que você moverá o corpo da sua função `render`.

```js
function Greeting() {
  // ... mova o código do método render aqui ...
}
```

Em vez de `this.props.name`, defina a `name` prop [usando a sintaxe de desestruturação](/learn/passing-props-to-a-component) e leia-a diretamente:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

Aqui está um exemplo completo:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrando um componente com estado de uma classe para uma função {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Suponha que você esteja convertendo este componente de classe `Counter` em uma função:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Comece declarando uma função com as [variáveis de estado](/reference/react/useState#adding-state-to-a-component) necessárias:

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Em seguida, converta os manipuladores de eventos:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Finalmente, substitua todas as referências começando com `this` pelas variáveis e funções que você definiu em seu componente. Por exemplo, substitua `this.state.age` por `age` e substitua `this.handleNameChange` por `handleNameChange`.

Aqui está um componente totalmente convertido:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrando um componente com métodos de ciclo de vida de uma classe para uma função {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Suponha que você esteja convertendo este componente de classe `ChatRoom` com métodos de ciclo de vida em uma função:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente conectaria ao servidor
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Primeiro, verifique se seu [`componentWillUnmount`](#componentwillunmount) faz o oposto de [`componentDidMount`.](#componentdidmount) No exemplo acima, isso é verdade: ele desconecta a conexão que `componentDidMount` configura. Se essa lógica estiver faltando, adicione-a primeiro.

Em seguida, verifique se seu método [`componentDidUpdate`](#componentdidupdate) lida com as alterações em quaisquer props e estado que você está usando em `componentDidMount`. No exemplo acima, `componentDidMount` chama `setupConnection`, que lê `this.state.serverUrl` e `this.props.roomId`. É por isso que `componentDidUpdate` verifica se `this.state.serverUrl` e `this.props.roomId` foram alterados e redefinem a conexão, caso tenham sido. Se a lógica do seu `componentDidUpdate` estiver faltando ou não manipular as alterações em todas as props e estado relevantes, corrija-a primeiro.

No exemplo acima, a lógica dentro dos métodos de ciclo de vida conecta o componente a um sistema fora do React (um servidor de bate-papo). Para conectar um componente a um sistema externo, [descreva essa lógica como um único Efeito:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

Esta chamada [`useEffect`](/reference/react/useEffect) é equivalente à lógica nos métodos de ciclo de vida acima. Se seus métodos de ciclo de vida fizerem várias coisas não relacionadas, [divida-os em vários Efeitos independentes.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Aqui está um exemplo completo com o qual você pode brincar:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bem vindo(a) à sala {roomId}!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Uma implementação real realmente conectaria ao servidor
  return {
    connect() {
      console.log('✅ Conectando à sala "' + roomId + '" em ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Desconectado da sala "' + roomId + '" em ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

Se seu componente não sincroniza com nenhum sistema externo, [você pode não precisar de um Efeito.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrando um componente com contexto de uma classe para uma função {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

Neste exemplo, os componentes de classe `Panel` e `Button` leem o [contexto](/learn/passing-data-deeply-with-context) de [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Quando você os converte em componentes de função, substitua `this.context` pelas chamadas [`useContext`]:

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
