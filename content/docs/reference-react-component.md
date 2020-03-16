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


Esta página contém uma referência detalhada da API para a definição de classes de componentes React. Nós assumimos que você possui familiaridade com conceitos fundamentais do React, como [Componentes e Props](/docs/components-and-props.html), bem como [Estado e Ciclo de Vida](/docs/state-and-lifecycle.html). Se isto não é familiar para você, leia essas páginas primeiro.


## Visão Geral {#overview}

React permite definirmos componentes como classes (*class components*) ou como funções. Componentes definidos como classes possuem mais funcionalidades que serão detalhadas nesta página. Para definir um *class component*, a classe precisa estender `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Olá, {this.props.name}</h1>;
  }
}
```

O único método que você *deve* definir em uma subclasse de `React.Component` é chamado [`render()`](#render). Todos os outros métodos descritos nesta página são opcionais.

**Nós somos fortemente contra a criação de seus próprios componentes base.** Em componentes React, [o reuso do código é obtido primariamente através de composição ao invés de herança](/docs/composition-vs-inheritance.html).

>Nota:
>
>React não lhe obriga a utilizar a sintaxe ES6 para classes. Se preferir não usá-la, você pode usar o módulo `create-react-class` ou alguma outra abstração similar. Dê uma olhada em
[Usando React sem ES6](/docs/react-without-es6.html) para mais sobre este assunto.

### O Ciclo de Vida de um Componente {#component-life-cycle}

Cada componente possui muitos "métodos do ciclo de vida" que você pode sobrescrever para executar determinado código em momentos particulares do processo. **Você pode usar [este diagrama do ciclo de vida](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) para consulta.** Na lista abaixo, os métodos do ciclo de vida mais usados estão marcados em **negrito**. O resto deles, existe para o uso em casos relativamente raros.

#### Montando (mounting) {#mounting}

Estes métodos são chamados na seguinte ordem quando uma instância de um componente está sendo criada e inserida no DOM:


- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Nota:
>
>Estes métodos são considerados legado e você deve [evitá-los](/blog/2018/03/27/update-on-async-rendering.html) em código novo:
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Atualizando {#updating}

Uma atualização pode ser causada por alterações em props ou no state. Estes métodos são chamados na seguinte ordem quando um componente esta sendo re-renderizado:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Nota:
>
>Estes métodos são considerados legado e você deve [evitá-los](/blog/2018/03/27/update-on-async-rendering.html) em código novo:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Desmontando (unmounting) {#unmounting}

Estes métodos são chamados quando um componente está sendo removido do DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Tratando Erros {#error-handling}

Estes métodos são chamados quando existir um erro durante a renderização, em um método do ciclo de vida, ou no construtor de qualquer componente-filho.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Outras APIs {#other-apis}

Cada componente também fornece outras APIs:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Propriedades da Classe {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Propriedades da Instância {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Referência {#reference}

### Métodos Mais Usados do Ciclo de Vida {#commonly-used-lifecycle-methods}

Os métodos desta seção cobrem a grande maioria dos casos de uso que você encontrará criando componentes React. **Para uma referência visual, veja : [este diagrama do ciclo de vida](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```
O método `render()` é o único método obrigatório em um class-component.

Quando chamado, ele examina `this.props` e `this.state` e retorna um dos seguintes tipos:

- **Elementos React.** Tipicamente criados via [JSX](/docs/introducing-jsx.html). Por exemplo, `<div />` e `<MyComponent />` são elementos React que instruem o React para renderizar um nó do DOM, ou outro componente definido pelo usuário, respectivamente.
- **Arrays e fragmentos.** Permitem que você retorne múltiplos elementos ao renderizar. Veja a documentação em [fragments](/docs/fragments.html) para mais detalhes.
- **Portals**. Permitem que você renderize componentes-filhos em uma sub-árvore diferente do DOM. Veja a documentação em [portals](/docs/portals.html) para mais detalhes.
- **String e números.** Estes são renderizados como nós de texto no DOM.
- **Booleanos ou `null`**. Não renderizam nada.(A maioria existe para suportar  o padrão `return test && <Child />` , onde `test` é um booleano.)

A função `render()` deve ser pura, o que significa que ela não modifica o state. Pois, ela retorna o mesmo resultado a cada vez que é chamada e isso não interage diretamente com o browser.
Se você precisar interagir com o browser, faça isto no método `componentDidMount()` ou em outros métodos do ciclo de vida. Manter `render()` puro faz com que os componentes sejam fáceis de se trabalhar.


> Nota
>
> `render()` não será invocado se  [`shouldComponentUpdate()`](#shouldcomponentupdate) retornar false.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**Se você não inicializar o state e não fizer o bind dos métodos, você não precisa implementar um construtor para seu componente**

O construtor para um componente React é chamado antes que este componente seja montado. Quando estiver implementando o construtor para uma subclasse de `React.Component`, você deveria chamar `super(props)` antes de qualquer outra coisa.
Caso contrário `this.props` será indefinido no construtor, o que pode levar a bugs.

Normalmente, em React, os construtores são usados somente para dois propósitos:

* Inicializar [local state](/docs/state-and-lifecycle.html) através da atribuição de um objeto a `this.state`.
* Ligação (binding) de um método [manipulador de eventos](/docs/handling-events.html) à uma instância.

Você **não deve chamar `setState()`**  no `constructor()`. Ao invés disso, se seu componente precisa de local state, **atribua o initial state à `this.state`** diretamente no construtor:

```js
constructor(props) {
  super(props);
  // Não chame this.setState() aqui!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```
O método construtor é o único lugar onde você deve atribuir `this.state` diretamente. Em todos os outros métodos, você precisa usar `this.setState()`.

Evite introduzir qualquer efeito colateral no construtor. Para estes casos use `componentDidMount()`.

>Nota
>
>**Evite copiar props no state! Este é um erro comum:**
>
>```js
>constructor(props) {
>  super(props);
>  // Não faça isso!
>  this.state = { color: props.color };
>}
>```
>
>O problema é que isto é desnecessário (você pode usar `this.props.color` diretamente), e cria bugs (atualizações em `color` não serão refletidas no state).
>
>**Use este pattern somente se você quiser ignorar atualizações em props intencionalmente.** Neste caso, faz sentido renomear a prop para ser chamada `initialColor` ou `defaultColor`. É possível então forçar um componente a "resetar" seu state interno através de  [mudando sua `chave`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) quando necessário.
>
>Leia nosso [post no blog sobre evitar derivações no state](/blog/2018/06/07/you-probably-dont-need-derived-state.html) para aprender sobre o que fazer se você acha que precisa que o state dependa das props.

* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` É invocado imediatamente após um componente ser montado (inserido na árvore). Inicializações que exijam nós do DOM devem vir aqui. Se precisar carregar data de um endpoint remoto, este é um bom lugar para instanciar sua requisição.

Este método é um bom lugar para colocar qualquer subscrição. Se fizer isto, não esqueça de desinscrever no `componentWillUnmount()`.

Você **pode chamar `setState()` diretamente** dentro do `componentDidMount()`. Ele irá disparar uma renderização extra, mas isto irá ocorrer antes que o browser atualize a tela. Isso garante que mesmo que o `render()` seja chamado duas vezes neste caso, o usuário não verá o state intermediário. Use este pattern com cuidado porque isto frequentemente causa issues de performance. Na maioria dos casos, você deve atribuir o initial state no `constructor()`. Isto pode, no entanto, ser necessário para casos como modais e tooltips quando você precisa mensurar um nó do DOM antes de renderizar algo que dependa de seu tamanho ou posição.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` é invocado imediatamente após alguma atualização ocorrer. Este método não é chamado pelo initial render.

Use isto como uma oportunidade para alterar o DOM quando o componente for atualizado. Este também é um bom lugar para realizar requisições de rede enquanto compara as props atuais com as props anteriores (e.g. uma chamada de rede pode não ser necessária se as props não mudaram).

```js
componentDidUpdate(prevProps) {
  // Uso típico, (não esqueça de comparar as props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

Você **pode chamar `setState()` imediatamente** dentro do `componentDidUpdate()` mas perceba que **isto deve estar encapsulado em uma condição** como no exemplo abaixo, ou você irá causar um loop infinito. Isto também causaria uma re-renderização extra, que por mais que não seja visível para o usuário pode afetar a performance do componente. Se você está tentando "espelhar" algum state para uma prop vinda de cima, considere usar a prop diretamente. Leia mais sobre [porque copiar props no state causa bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

Se seu componente implementa o método `getSnapshotBeforeUpdate()` (o que é raro), o valor que ele retorna será passado como o terceiro parâmetro "snapshot" para `componentDidUpdate()`. Caso contrário este parâmetro será undefined.

> Nota
>
> `componentDidUpdate()` não será invocado se [`shouldComponentUpdate()`](#shouldcomponentupdate) retornar false.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` é invocado imediatamente antes que um componente seja desmontado e destruído. Qualquer limpeza necessária deve ser realizada neste método, como invalidar timers, cancelar requisições de rede, ou limpar qualquer subscrição que foi criada no `componentDidMount()`.

**Não se deve chamar `setState()`** em `componentWillUnmount()` porque o componente nunca irá será renderizado novamente. Uma vez que a instância do componente foi desmontada, ela nunca será montada de novo.

* * *

### Métodos Raramente Usados {#rarely-used-lifecycle-methods}

Estes métodos dessa seção correspondem a casos de uso incomuns. Eles são úteis de vez em quando, mas na maioria das vezes, seus componentes provavelmente não irão precisar de nenhum deles. **Pode ver a maioria dos métodos abaixo [neste diagrama do ciclo de vida](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) se clicar na checkbox "Mostrar ciclos de vida menos comuns" no topo da página.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Use `shouldComponentUpdate()` para permitir que o React saiba se o resultado de um componente não é afetado pelas mudanças atuais em state ou props. O comportamento padrão é para re-renderizar a cada mudança do state, e na grande maioria dos casos você deve confiar no comportamento padrão.

`shouldComponentUpdate()` é executado antes da renderização, quando novas props ou state são recebidos. O valor default é `true`. Este método não é chamado na renderização inicial ou quando `forceUpdate()`é usado.

Este método existe somente para **[otimização de performance ](/docs/optimizing-performance.html).** Não confie nele para "evitar" a renderização, pois isso pode levar a bugs. **Considere usar [`PureComponent`](/docs/react-api.html#reactpurecomponent)** no lugar de escrever `shouldComponentUpdate()` manualmente. `PureComponent` realiza uma comparação superficial das props e do state, e reduz as chances de pular um update necessário.

Se você está confiante que quer escrever isto manualmente, pode comparar `this.props` com `nextProps` e `this.state` com `nextState`
e retornar `false` para informar o React que o update pode ser pulado. Perceba que retornando `false` não evita que componentes filhos sejam renderizados novamente quando o state *deles* sofrer alterações.

Não recomendamos fazer verificações de igualdade profundas ou usar `JSON.stringify()` dentro de `shouldComponentUpdate()`. Isto é ineficiente e irá prejudicar a performance.

Atualmente, se `shouldComponentUpdate()` retornar `false`, então [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), e [`componentDidUpdate()`](#componentdidupdate) não serão invocados. No futuro, React pode tratar  `shouldComponentUpdate()` como uma dica ao invés de uma rigorosa diretiva, e retornar `false` pode continuar resultando em re-renderização do componente.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` é invocado imediatamente antes de chamar o método render, ambos na montagem inicial e nas atualizações subsequente. Devem retornar um objeto para atualizar o state, ou null para não atualizar nada.

Este método existe para [casos de uso raros](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) onde o state depende de mudanças nas props ao longo do tempo. Por exemplo, pode ser útil para implementar um componente `<Transition>` que compara seus filhos anteriores e próximos para decidir quais deles devem ser animados.

Derivando o state leva a código verboso e faz seus componentes difíceis de compreender.
[Tenha certeza de estar familiarizado com alternativas mais simples:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Se precisar  **executar um side effect** (por exemplo, buscar dados ou uma animação) em resposta a uma alteração em props, use [`componentDidUpdate`](#componentdidupdate) no lugar.

* Se você quer **recomputar alguns dados somente quando uma prop muda**, [use um auxiliar de memorização no lugar](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Se você quer **"resetar" o state quando uma prop muda**, considere criar um componente [completamente controlado](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ou [completamente controlado com uma `chave`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.

Este método não tem acesso à instância do componente. Se você quiser, pode reusar o código entre o método `getDerivedStateFromProps()` e os métodos de outra classe extraindo funções puras para as props e state do componente, fora da definição da classe.

Perceba que este método é disparado a *cada* renderização, independentemente da razão. Isto está em contraste com  `UNSAFE_componentWillReceiveProps`, que dispara somente quando um componente pai causa uma re-renderização e não como resultado de uma chamada local a `setState`.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` é invocado imediatamente antes que o retorno da renderização mais recente seja escrito e.g. no DOM. Isto permite que o componente capture alguma informação do DOM (e.g. posição do scroll) antes que ela seja potencialmente alterada. Qualquer valor retornado por este método do ciclo de vida será passado como parâmetro para `componentDidUpdate()`.

Este caso de uso não é comum, mas pode ocorrer em UIs como um thread de um chat que precise tratar a posição do scroll de uma maneira especial.

A snapshot value (or `null`) should be returned.
O valor do snapshot (ou `null`) deve ser retornado

Por exemplo:

`embed:react-component-reference/get-snapshot-before-update.js`

No exemplo acima, é importante lermos a propriedade `scrollHeight` em `getSnapshotBeforeUpdate` porque podem ocorrer delays entre a fase do ciclo de vida "renderização"  (`render`) e a fase "commit" (commit `getSnapshotBeforeUpdate` e `componentDidUpdate`).

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

### Métodos Legado do Ciclo de Vida {#legacy-lifecycle-methods}

Os métodos do ciclo de vida abaixo estão marcados como "legado". Eles ainda funcionam, mas não recomendamos utilizar eles em código novo. Você pode aprender mais sobre a migração de métodos legado do ciclo de vida [neste post no blog](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Nota
>
> Este lifecycle era nomeado `componentWillMount`. Este nome continuará a funcionar até a versão 17. Utilize o [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) para atualizar automaticamente seus componentes.

`UNSAFE_componentWillMount()` é invocado antes que o *mounting* ocorra. Ele é chamado antes de `render()`, portanto chamar `setState()` sincronamente neste método não irá acarretar numa renderização extra. Geralmente, nós recomendamos o `constructor()` como alternativa para inicializar o *state*.

Evite introduzir quaisquer efeitos colaterais (*side-effects*) ou *subscriptions* neste método. Para estes casos de uso, utilize `componentDidMount()`.

Este é o único método do lifecycle chamado na *renderização do servidor*.

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

Note que se um componente pai causar a re-renderização do seu componente, este método será chamado mesmo se as *props* não foram alteradas. Certifique-se de comparar o valor atual e o próximo se você deseja somente manipular mudanças.

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
setState(updater, [callback])
```

`setState()` enfileira mudanças ao *state* do componente e diz ao React que este componente e seus componentes filho precisam ser re-renderizados com a atualização do *state*. Este é o principal método que você utiliza para atualizar a UI em resposta a *event handlers* e à resposta de servidores.

Pense em `setState()` como uma *requisição* ao invés de um comando imediato para atualizar o componente. Para uma melhoria na performance, o React pode atrasar a atualização, e então atualizar diversos componentes numa só leva. O React não garante que as mudanças no *state* são aplicadas imediatamente.

`setState()` nem sempre atualiza o componente imediatamente. Ele pode adiar a atualização para mais tarde. Isto torna a leitura de `this.state` logo após chamar `setState()` uma potencial cilada. Como alternativa, utilize `componentDidUpdate` ou o *callback* de `setState` (`setState(updater, callback)`), ambos possuem a garantia de dispararem após a aplicação da atualização. Se você precisa definir o *state* baseado no *state* anterior, leia sobre o argumento `updater` abaixo.

`setState()` vai sempre conduzir a uma re-renderização a menos que `shouldComponentUpdate()` retorne `false`. Se objetos mutáveis estão sendo utilizados e lógica de renderização condicional não puder ser implementada em `shouldComponentUpdate()`, chamar `setState()` somente quando o novo *state* diferir do *state* anterior irá evitar re-renderizações desnecessárias.

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

O segundo parâmetro de `setState()` é uma função de *callback* opcional que será executada assim que `setState` for completada e o componente re-renderizado. Geralmente, recomendamos utilizar `componentDidUpdate()` para implementar esta lógica.

Você também pode passar um objeto como primeiro argumento de `setState()` ao invés de uma função:

```javascript
setState(stateChange[, callback])
```

Isto realiza uma mescla superficial de `stateChange` dentro no novo *state*. Por exemplo: para ajustar a quantidade de items no carrinho de compras:

```javascript
this.setState({quantity: 2})
```

Esta forma de `setState()` também é assíncrona e múltiplas chamadas durante o mesmo ciclo podem ser agrupadas numa só. Por exemplo, se você tentar incrementar a quantidade de itens mais que uma vez no mesmo ciclo, isto resultará no equivalente a:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Chamadas subsequentes irão sobrescrever valores de chamadas anteriores no mesmo ciclo. Com isso, a quantidade será incrementada somente uma vez. Se o próximo estado depende do estado atual, recomendamos utilizar a função *updater* como alternativa:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

Para mais informações, veja:

* [Guia de Estado e Ciclo de Vida](/docs/state-and-lifecycle.html)
* [Em detalhes: Quando e por que `setState()` agrupa chamadas?](https://stackoverflow.com/a/48610973/458193)
* [Em detalhes: por que o `this.state` é atualizado imediatamente?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

Por padrão, quando o *state* ou as *props* do seu componente são alteradas, seu componente renderizará novamente. Caso seu método `render()` dependa de algum outro dado, você pode informar ao React que o componente precisa de uma re-renderização chamando `forceUpdate()`.

Chamar `forceUpdate()` acarretará numa chamada de `render()` no componente, escapando `shouldComponentUpdate()`. Os métodos normais do lifecycle para os componentes filho serão chamados, incluindo o método `shouldComponentUpdate()` de cada filho. O React ainda irá atualizar o *DOM* caso realmente haja mudanças.

Normalmente, você deveria tentar evitar o uso de `forceUpdate()` e somente ler de `this.props` e `this.state` em `render()`.

* * *

## Propriedades da Classe {#class-properties-1}

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

A *string* `displayName` é utilizada em mensagens de depuração. Normalmente, você não precisa defini-la explicitamente. Pois isto é inferido do nome da função ou classe que definem o componente. Você pode querer defini-la explicitamente se quiser exibir um nome diferente para propósitos de depuração ou quando você cria um *higher-order component*. Veja [Envolva o Display Name para Facilitar a Depuração](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) para mais detalhes.

* * *

## Propriedades da Instância {#instance-properties-1}

### `props` {#props}

`this.props` contém as *props* que foram definidas por quem chamou este componente. Veja [Componentes e Props](/docs/components-and-props.html) para uma introdução às *props*.

Em particular, `this.props.children` é uma *prop* especial, normalmente definida pelas *tags* filhas na expressão JSX, ao invés de na própria *tag*.

### `state` {#state}

O *state* contém dados específicos a este componente que podem mudar com o tempo. O *state* é definido pelo usuário e deve ser um objeto JavaScript.

Se algum valor não for usado para renderizamento ou para controle de *data flow* (por exemplo, um *ID* de *timer*), você não precisa colocar no *state*. Tais valores podem ser definidos como campos na instância do componente.

Veja [Estado e Ciclo de Vida](/docs/state-and-lifecycle.html) para mais informações sobre o *state*.

Nunca mude `this.state` diretamente, pois chamar `setState()` após a mutação pode substituir a mutação realizada. Trate `this.state` como se ele fosse imutável.
