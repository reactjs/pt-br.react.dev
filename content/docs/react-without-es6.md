---
id: react-without-es6
title: React sem ES6
permalink: docs/react-without-es6.html
---

Normalmente você definiria um componente React como uma simples classe JavaScript:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Se você ainda não usa ES6, você pode usar o módulo `create-react-class`:


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

A API de classes do ES6 é similar a `createReactClass()` com algumas exceções.

## Declarando Props padrão {#declaring-default-props}

Com funções e classes ES6, `defaultProps` é definido como uma propriedade do próprio componente:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

Com `createReactClass()`, você precisa definir `getDefaultProps()` como uma função no objeto que é passado como parâmetro:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## Configurando o State Inicial {#setting-the-initial-state}

Em classes ES6, você pode definir o state inicial ao definir `this.state` no construtor:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

Com `createReactClass()`, você deve passar um método `getInitialState` que retorna o state inicial:

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Autobinding {#autobinding}

Em componentes React declarados como classes ES6, métodos seguem a mesma semântica que classes ES6 regulares. Isso significa que elas não fazem bind do `this` da instância. Você terá que explicitamente usar `.bind(this)` no construtor:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // Esta linha é importante!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Devido `this.handleClick` ter sido amarrado, podemos usá-lo como um controlador de evento.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Com `createReactClass()`, isso não é necessário por que ele faz bind de todos os métodos:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

Isso significa que escrever classes ES6 necessita um pouco mais de código boilerplate para controladores de eventos. Por outro lado, é levemente mais performático em aplicações de larga escala.

Se você acha que código boilerplate pouco atraente, você pode ativar a proposta de [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/) **experimentais** com Babel:


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // AVISO: essa sintaxe é experimental!
  // Usar uma arrow function aqui já faz bind do método
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Por favor, notem que a sintaxe acima é **experimental** e que a sintaxe pode mudar ou ainda, a proposta pode não ser implementada na linguagem.

Se você prefere jogar seguro, você tem algumas opções:

* Fazer bind do método no construtor.
* Usar arrow functions, e.g. `onClick={(e) => this.handleClick(e)}`.
* Continuar usando `createReactClass`.

## Mixins {#mixins}

>**Notas:**
>
>ES6 foi lançado sem suporte a mixins. Portanto, não há suporte para mixins quando você usar React com classes ES6.
>
>**Nós também descobrimos inúmeros problemas na base de código usando mixins, [e não recomendamos usar em novos códigos](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Esta seção existe somente para referência.

Algumas vezes, componentes muito diferentes podem compartilhar alguma funcionalidade. Chamamos estes casos de [cross-cutting concerns](https://pt.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` permite que você use um sistema legado de `mixins` para isso.

Um caso de uso comum é um componente que quer se atualizar em um intervalo de tempo. É fácil de usar o `setInterval()`, mas é importante do cancelar o intervalo quando você não precisa mais dele para economizar memória. React fornece [lifecycle methods](/docs/react-component.html#the-component-lifecycle) que permitem que você saiba quando um componente está prestes a ser criado ou destruído. Vamos criar um *mixin* simples que usa esses métodos para fornecer uma funcionalidade fácil de `setInterval()` que será limpa automaticamente quando seu componente for destruído.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Use o mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Chamada de um método no mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React está rodando por {this.state.seconds} segundos.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

Se um componente está usando múltiplos mixins e diversos desses mixins definem o mesmo lifecycle method (por ex. diversos mixins querem fazer uma limpeza quando um componente é destruído), todos os lifecycle methods terão garantia de serem chamados. Métodos definidos em um mixin são executados na ordem em que foram listados, seguidos por uma chamada de método no componente.
