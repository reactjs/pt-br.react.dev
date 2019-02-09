---
id: state-and-lifecycle
title: Estado e Ciclo de Vida
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

Esta página apresenta o conceito de estado e ciclo de vida no um componente React. Você pode encontrar uma [referência detalhada da API de componente aqui](/docs/react-component.html).

Considere o exemplo do relógio de [uma das seções anteriores](/docs/rendering-elements.html#updating-the-rendered-element). Em [Elementos de Renderização](/docs/rendering-elements.html#rendering-an-element-into-the-dom), nós aprendemos apenas uma maneira de atualizar a UI. Nós chamamos `ReactDOM.render()` para mudar a saída renderizada.

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Experimente no CodePen**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

Esta seção, aprenderemos como tornar o componente `Clock` verdadeiramente reutilizável e encapsulado. Ele irá configurar seu próprio temporizador e se atualizar a cada segundo.

Podemos começar encapsulando como o relógio parece:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Experimente no CodePen**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

No entanto, falta um requisito crucial: o fato de que o `Clock` configura um temporizador e atualiza a UI a cada segundo deve ser um detalhe de implementação do `Clock`.

Idealmente, queremos escrever isto uma vez e ter o `Clock` se atualizado:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Para implementá-lo, precisamos adicionar um "state" ao componente `Clock`.

Estado do componente é similar as props, mas é privado e totalmente controlado pelo componente.

Nós [mencionamos antes](/docs/components-and-props.html#functional-and-class-components) que os componentes definidos como classes possuem alguns recursos adicionais. O estado local é exatamente isso: um recurso disponível apenas para classes.

## Convertendo uma Função para uma Classe {#convertendo-uma-funcao-para-uma-classe}

Você pode converter um componente de função como `Clock` em uma classe em cinco etapas:

1. Criar uma [classe ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes), com o mesmo nome, extendendo `React.component`.

2. Adicionar um único método vazio chamado `render()`.

3. Mova o corpo da função para o método `render()`.

4. Substitua `props` por `this.props` no corpo de `render()`.

5. Exclua a declaração da função vazia restante.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Experimente no CodePen**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` agora é definido como uma classe em vez de uma função.

O método `render` será chamado toda vez que uma atualização acontecer, mas enquanto renderizarmos `<Clock>` no mesmo nó DOM, apenas uma única instância da classe `Clock` será usada. Isso nos permite usar recursos adicionais, como o estado local e os métodos de ciclo de vida.

## Adicionando Estado Local a uma Classe {#adicionando-estado-local-em-uma-classe}

Vamos mover a `date` da props para o estado em três passos:

1) Substitua `this.props.date` por `this.state.date` no médoto `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Adicione um [construtor na classe](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes#Construtor) que atribui a data inicial no `this.state`:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Note como nos passamos `props` para o construtor:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Componentes de classes devem sempre chamar o construtor com `props`.

3) Remova a props `date` do elemento `<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Mais tarde, adiconaremos o código do timer de volta ao próprio componente.

O Resultado se parece com:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Experimente no CodePen**](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Em seguinda, faremos a configuração do próprio temporizador e atualizaremos a cada segundo.

## Adicionando métodos de ciclo de vida a classe {#adcionando-metodos-de-ciclo-de-vida-a-classe}

Em aplicações com muitos componentes, é muito importante limpar os recursos utilizados pelos componentes quando eles são destruídos.

Queremos [configurar um temporizador](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) sempre que o `Clock` é renderizado para o DOM pela primeira vez. Isso é chamado de "mounting" no React.

Nós também queremos [limpar o temporizador](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) sempre que o DOM produzido pelo `Clock` for removido. Isso é chamado de "unmounting" no React.

Podemos declarar métodos especiais no componente de classe para executar algum código quando um componente é montado e desmontado:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Estes métodos são chamados de "métodos de ciclo de vida".

O método `componentDidMount()` é executado depois que a saída do componente é renderizada no DOM. Este é um bom lugar para configurar um temporizador:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Note como nós salvamos o ID do temporizador em `this`.

Enquanto `this.props` é configurado pelo próprio React e `this.state` tem um significado especial, você está livre para adicionar campos adicionais à classe manualmente se precisar armazenar algo que não participe do fluxo de dados (como um ID do temporizador)

Vamos derrubar o temporizador no método do ciclo de vida `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Finalmente, vamos implementar um  método chamado `tick()` que o componente `Clock` executará a cada segundo.

Ele usará `this.setState()` para agendar atualizações para o estado local do componente:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Experimente no CodePen**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Agora o relógio bate a cada segundo.

Vamos recapitular rapidamente o que está acontencendo e a ordem na qual os métodos são chamados:

1) Quando `<Clock />` é passado para `ReactDOM.render()`, o React chama o construtor do componente `Clock`. Como `Clock` precisa exibir a hora atual, ele inicializa `this.state` com um objeto incluindo a hora atual. Mas tarde, atualizaremos este estado.

2) React chama então o método `render()` do componente `Clock`. É assim que o React aprende o que deve ser exibido na tela. React em seguida, atualiza o DOM para coincidir com a saída de renderização do `Clock`.

3) Quando a saída do `Clock` é inserida no DOM, o React chama o método do ciclo de vida `componentDidMount()`. Dentro dele, o componente `Clock` pede ao navegador para configurar um temporizador para chamar o método `tick()` do componente uma vez por segundo.

4) A cada segundo o navegador chama o método `tick()`. Dentro dele, o componente `Clock` agenda uma atualização de UI chamando `setState()` com um objeto contendo a hora atual. Graças à chamada `setState()`, o método `render()` será diferente e, portanto, a saída de renderização incluirá a hora atualizada. React atualiza o DOM de acordo.

5) Se o componente `Clock` for removido do DOM, o React chama o método do ciclo de vida `componentWillUnmount()` para que o temporizador seja interrompido.

## Usando o estado corretamente {#usando-o-estado-corretamente}

Existem três coisas que você deve saber sobre `setState()`.

### Não modifique o estado diretamente {#nao-modifique-o-estado-diretamente}

Por exemplo, isso não renderizará novamente o componente:

```js
// Errado
this.state.comment = 'Hello';
```

Em vez disso, use `setState()`:

```js
// Correto
this.setState({comment: 'Hello'});
```

O único lugar onde você pode atribuir `this.state` é o construtor.

### Atualizações de estado podem ser assíncronas {#atualizacoes-de-estado-podem-ser-assincronas}

O React pode agrupar várias chamadas `setState()` em uma única atualização para desempenho.

Como `this.props` e `this.state` podem ser atualizados de forma assíncrona, você não deve confiar em seus valores para calcular o próximo estado.

Por exemplo, esse código pode falhar ao atualizar o contador:

```js
// Errado
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Para consertá-lo, use uma segunda forma de `setState()` que aceite uma função ao invés de um objeto. Essa função receberá o estado anterior como o primeiro argumento e as props no momento em que a atualização for aplicada como o segundo argumento:

```js
// Correto
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

Usamos um [arrow function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions) acima, mas também funciona com funções regulares:

```js
// Correto
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Atualizações de estado são mescladas {#atualizacoes-de-estado-sao-mescladas}

Quando você chama `setState()`, o React mescla o objeto que você fornece ao estado atual.

Por exemplo: seu estado pode conter várias variáveis independentes:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Então você pode atualizá-los independentemente com chamadas separadas do `setState()`:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

O merge é superficial, então `this.setState({comments})` deixa `this.state.posts` intacto, mas substitui completamente `this.state.comments`

## The Data Flows Down {#the-data-flows-down}

Neither parent nor child components can know if a certain component is stateful or stateless, and they shouldn't care whether it is defined as a function or a class.

This is why state is often called local or encapsulated. It is not accessible to any component other than the one that owns and sets it.

A component may choose to pass its state down as props to its child components:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

This also works for user-defined components:

```js
<FormattedDate date={this.state.date} />
```

The `FormattedDate` component would receive the `date` in its props and wouldn't know whether it came from the `Clock`'s state, from the `Clock`'s props, or was typed by hand:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

This is commonly called a "top-down" or "unidirectional" data flow. Any state is always owned by some specific component, and any data or UI derived from that state can only affect components "below" them in the tree.

If you imagine a component tree as a waterfall of props, each component's state is like an additional water source that joins it at an arbitrary point but also flows down.

To show that all components are truly isolated, we can create an `App` component that renders three `<Clock>`s:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Each `Clock` sets up its own timer and updates independently.

In React apps, whether a component is stateful or stateless is considered an implementation detail of the component that may change over time. You can use stateless components inside stateful components, and vice versa.
