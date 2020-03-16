---
id: components-and-props
title: Componentes e Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Componentes permitem você dividir a UI em partes independentes, reutilizáveis e pensar em cada parte isoladamente. Essa página fornece uma introdução à ideia de componentes. Você pode encontrar uma [referência detalhada da API de componente aqui](/docs/react-component.html).

Conceitualmente, componentes são como funções JavaScript. Eles aceitam entradas arbitrárias (chamadas "props") e retornam elementos React que descrevem o que deve aparecer na tela.

## Componentes de Função e Classe {#function-and-class-components}

A maneira mais simples de definir um componente é escrever uma função JavaScript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Essa função é um componente React válido porque aceita um único argumento de objeto "props" (que significa propriedades) com dados e retorna um elemento React. Nós chamamos esses componentes de "componentes de função" porque são literalmente funções JavaScript.

Você também pode usar uma [classe ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes) para definir um componente:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Os dois componentes acima são equivalentes do ponto de vista do React.

Function e Class componentes têm alguns recursos adicionais que discutiremos nas [próximas seções](/docs/state-and-lifecycle.html).

## Renderizando um Componente {#rendering-a-component}

Anteriormente, nós encontramos apenas elementos React que representam tags do DOM:

```js
const element = <div />;
```

No entanto, elementos também podem representar componentes definidos pelo usuário:

```js
const element = <Welcome name="Sara" />;
```

Quando o React vê um elemento representando um componente definido pelo usuário, ele passa atributos JSX e componentes filhos para esse componente como um único objeto. Nós chamamos esse objeto de "props". 

Por exemplo, esse código renderiza "Hello, Sara" na página:

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component)

Vamos recapitular o que acontece nesse exemplo:

1. Nós chamamos `ReactDOM.render()` com o elemento `<Welcome name="Sara" />`.
2. React chama o componente `Welcome` com `{name: 'Sara'}` como props.
3. Nosso componente `Welcome` retorna um elemento `<h1>Hello, Sara</h1>` como resultado.
4. React DOM atualiza eficientemente o DOM para corresponder `<h1>Hello, Sara</h1>`.

>**Nota:** Sempre inicie os nomes dos componentes com uma letra maiúscula.
>
>O React trata componentes começando com letras minúsculas como tags do DOM. Por exemplo, `<div />` representa uma tag div do HTML, mas `<Welcome />` representa um componente e requer que `Welcome` esteja no escopo.
>
>Você pode ler mais sobre o raciocínio por trás dessa convenção [aqui.](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)

## Compondo Componentes {#composing-components}

Componentes podem se referir a outros componentes em sua saída. Isso nos permite usar a mesma abstração de componente para qualquer nível de detalhe. Um botão, um formulário, uma caixa de diálogo, uma tela: em aplicativos React, todos esses são normalmente expressos como componentes.

Por exemplo, nós podemos criar um componente `App` que renderiza `Welcome` muitas vezes:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components)

Tipicamente, novos aplicativos React tem um único componente `App` no topo. Contudo, se você integrar o React em um aplicativo existente, você pode começar de baixo para cima com um pequeno componente como o `Button` e gradualmente chegar ao topo da hierarquia de exibição.

## Extraindo Componentes {#extracting-components}

Não tenha medo de dividir componentes em componentes menores.

Por exemplo, considere esse componente `Comment`:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components)

Ele aceita `author` (um objeto), `text` (uma string) e `date` (uma data) como props e descreve um comentário em um site de mídia social.

Esse componente pode ser complicado de alterar por causa de todo o aninhamento. Também é difícil reutilizar suas partes individuais. Vamos extrair alguns componentes dele.

Primeiro, nós vamos extrair `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

O `Avatar` não precisa saber que está sendo renderizado dentro do `Comment`. É por isso que nós demos ao seu prop um nome mais genérico: `user` em vez de `author`.

Nós recomendamos nomear props a partir do ponto de vista do próprio componente ao invés do contexto em que ele está sendo usado.

Agora nós podemos simplificar `Comment` um pouco mais:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Em seguida, nós vamos extrair o componente `UserInfo` que renderiza um `Avatar` ao lado do nome do usuário:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Isso nos permite simplificar `Comment` ainda mais:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued)

Extrair componentes pode parecer um trabalho pesado no começo, mas ter uma paleta de componentes reutilizáveis compensa em aplicativos maiores. Uma boa regra é que se uma parte da sua UI for usada várias vezes (`Button`, `Panel`, `Avatar`) ou for complexa o suficiente por si só (`App`, `FeedStory`, `Comment`) é uma boa candidata a se tornar um componente reutilizável.

## Props são Somente Leitura {#props-are-read-only}

Independente se você declarar um componente [como uma função ou uma classe](#function-and-class-components), ele nunca deve modificar seus próprios props. Considere essa função `sum`:

```js
function sum(a, b) {
  return a + b;
}
```

Tais funções são chamadas ["puras"](https://en.wikipedia.org/wiki/Pure_function) porque elas não tentam alterar suas entradas e sempre retornam o mesmo resultado para as mesmas entradas.

Em contraste, essa função é impura porque altera sua própria entrada:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React é bastante flexível mas tem uma única regra estrita:

**Todos os componentes React tem que agir como funções puras em relação ao seus props.**

Obviamente, as UIs de aplicativos são dinâmicas e mudam com o tempo. Na [próxima seção](/docs/state-and-lifecycle.html), nós vamos introduzir um novo conceito de "state". O state permite aos componentes React alterar sua saída ao longo do tempo em resposta a ações do usuário, respostas de rede e quaisquer outras coisas, sem violar essa regra.
