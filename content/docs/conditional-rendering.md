---
id: conditional-rendering
title: Renderização condicional
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

Em React, você pode criar componentes distintos que encapsulam o comportamento que você precisa. Então, você pode renderizar apenas alguns dos elementos, dependendo do estado da sua aplicação. 

Renderização condicional em React funciona da mesma forma que condições funcionam em JavaScript. Use operadores de JavaScript  como [`if`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else) ou [operador condicional](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Operador_Condicional) para criar elementos representando o estado atual, e deixe o React atualizar a UI para corresponde-los.

Considere esses dois componentes:

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```


Nós vamos criar um componente `Greeting` que mostra um dos outros dois componentes se o usuário estiver logado ou não:

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Este exemplo renderiza um "greeting" diferente dependendo do valor da prop `isLoggedIn`.

### Variáveis de Elementos {#element-variables}

Você pode usar variáveis para guardar elementos. Isto pode te ajudar a renderizar condicionalmente parte do componente enquanto o resto do resultado não muda.

Considere esses dois novos componentes representando os botões de Logout e Login:

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

No exemplo abaixo, nós vamos criar um [componente _stateful_](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) chamado `LoginControl`.

O componente irá renderizar o `<LoginButton />` ou `<LogoutButton />` dependendo do estado atual. Ele tambem irá renderizar  `<Greeting />` do exemplo anterior:

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Declarar uma variável e usar uma declaração condicional `if` é uma ótima maneira de renderizar um componente, mas às vezes você pode querer usar uma sintaxe mais curta. Existem algumas maneiras para utilizar condições inline em JSX, explicadas abaixo.

### If inline com o Operador Lógico &&  {#inline-if-with-logical--operator}

Você pode [incorporar qualquer expressão em JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) encapsulando em chaves. Isto inclui o operador lógico `&&` de JavaScript. Isto pode ser conveniente para incluir um elemento condicionalmente: 

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Isto funciona porque em JavaScript, `true && expressão` são sempre avaliadas como `expressão`, e `false && expressão` são sempre avaliadas como `false`.

Portanto, se a condição é `true`, o elemento logo depois do `&&` irá aparecer no resultado. Se o elemento é `false`, React irá ignora-lo.

### If-Else inline com Operador Condicional {#inline-if-else-with-conditional-operator}

Outro método para renderizar elementos inline é utilizar o operador condicional em JavaScript [`condição ? true : false`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Operador_Condicional).

No exemplo abaixo, nós o utilizaremos para renderizar condicionalmente um pequeno bloco de texto.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

Pode também ser usado para expressões mais longas, embora o que está acontecendo seja menos óbvio:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

Assim como em JavaScript, você decide o estilo apropriado com base no que você e a sua equipe considera mais legível. Lembre-se  que toda vez que condições se tornam muito complexas, pode ser um bom momento para [extrair componentes](/docs/components-and-props.html#extracting-components).

### Evitando que um Componente seja Renderizado {#preventing-component-from-rendering}

Em casos raros você pode desejar que um componente se esconda ainda que ele tenha sido renderizado por outro componente. Para fazer isso, retorne `null` ao invés do resultado renderizado.

No exemplo abaixo, o `<WarningBanner />` é renderizado dependendo do valor da prop chamada `warn`. Se o valor da prop é  `false`, o componente não é renderizado:

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Retornar `null` do método `render` de um componente não afeta a ativação dos métodos do ciclo de vida do componente. Por exemplo, o método `componentDidUpdate` ainda será chamado.
