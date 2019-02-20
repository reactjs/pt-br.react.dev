---
id: tutorial
title: "Tutorial: Introdução ao React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

Este tutorial não assume nenhum conhecimento existente do React.

## Antes de começarmos o tutorial {#before-we-start-the-tutorial}

Vamos construir um pequeno jogo durante este tutorial. **Você pode ficar tentado a ignorá-lo porque você não vai construir jogos - mas dê uma chance.** As técnicas que você aprenderá no tutorial são fundamentais para criar qualquer aplicativo React e o domínio delas lhe dará um profundo entendimento de React.

> Dica
>
> Este tutorial foi criado para pessoas que preferem ** aprender fazendo **. Se você preferir aprender conceitos do zero, confira nosso [step-by-step guide](/docs/hello-world.html). Você pode achar este tutorial e o guia complementares um ao outro.

O tutorial está dividido em várias seções:

* [Configuração do Tutorial](#setup-for-the-tutorial) lhe dará **um ponto de partida** para seguir o tutorial.
* [Visão geral](#overview) te ensinará **os fundamentos** do React: componentes, propriedades (_props_) e estado (_state_).
* [Completando o Jogo](#completing-the-game) te ensinará **as técnicas mais comuns** para desenvolver com React.
* [Adicionando Time Travel (viagem no tempo)](#adding-time-travel) lhe dará **uma visão mais profunda** dos pontos fortes exclusivos do React.

Você não precisa completar todas as seções de uma vez para entender tudo que o tutorial tem a oferecer. Tente chegar o mais longe possível, mesmo que seja uma ou duas seções.

Não há problema em copiar e colar o código enquanto você acompanha o tutorial. Mas, recomendamos que você o digite à mão. Isso ajudará você a desenvolver uma memória muscular e ter um entendimento mais forte.

### O que estamos construindo? {#what-are-we-building}

Neste tutorial, mostraremos como criar um jogo interativo de jogo-da-velha com React.

Você pode ver o que vamos construir aqui: **[Resultado Final](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Se o código não fizer sentido para você ou se você não estiver familiarizado com a sintaxe do código, não se preocupe! O objetivo deste tutorial é ajudár você a entender o React e sua sintaxe.

Recomendamos que você confira o jogo tic-tac-toe (jogo da velha) antes de continuar com o tutorial. Uma das características que você notará é que existe uma lista numerada à direita do tabuleiro do jogo. Esta lista fornece um histórico de todas as jogadas que ocorreram no jogo e é atualizada à medida que o jogo avança.

Você pode fechar o jogo da velha assim que estiver familiarizado com ele. Começaremos a partir de um modelo mais simples neste tutorial. Nosso próximo passo é prepará-lo para que você possa começar a desenvolver o jogo.

### Pré-requisitos {#prerequisites}

Vamos presumir que você já tenha alguma familiaridade com HTML e JavaScript. Porém, você deve ser capaz de acompanhá-lo mesmo que esteja vindo de uma linguagem de programação diferente. Também vamos presumir que você também já esteja familiarizado com conceitos de programação. Tais como: funções, objetos, matrizes em menor escala e classes.

Se você precisa revisar JavaScript, recomendamos ler [este guia](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Observe que também estamos usando alguns recursos do ES6 - uma versão recente do JavaScript. Neste tutorial, estamos usando [arrow function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [classes](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/let), e declarações [`const`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/const). Você pode usar o [Babel REPL] (babel://es5-syntax-example) para verificar o código ES6 compilado.

## Configuração para o tutorial {#setup-for-the-tutorial}

Há duas maneiras de concluir este tutorial: você pode escrever o código em seu navegador ou configurar um ambiente de desenvolvimento local em seu computador.

### Opção de Configuração 1: Desenvolvendo o Código no Navegador {#setup-option-1-write-code-in-the-browser}

Esta é a maneira mais rápida de começar!

Primeiro, abra este **[Código Inicial](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** em uma nova guia. A nova aba deve exibir um tabuleiro de tic-tac-toe (jogo da velha) vazio e o código React. Nós estaremos editando o código React neste tutorial.

Agora você pode ignorar a segunda opção de configuração e ir para a seção [Visão geral](#overview) para obter uma visão geral do React.

### Opção de instalação 2: ambiente de desenvolvimento local {#setup-option-2-local-development-environment}

Isto é completamente opcional e não é necessário para este tutorial!

<br>

<details>

<summary><b>Opcional: instruções para serem seguidas na sua máquina usando seu editor de texto preferido</b></summary>

Essa opção de configuração requer mais trabalho mas permite que você complete o tutorial utilizando um editor de sua preferência. Aqui estão os passos a serem seguidos:

1. Certifique-se de ter uma versão recente do [Node.js](https://nodejs.org/pt-br/) instalada.
2. Siga as [instruções de instalação do creat-react-app](/docs/create-a-new-react-app.html#create-react-app) para criar um novo projeto.

```bash
npx create-react-app my-app
```

3. Apague todos os arquivos na pasta `src/` do novo projeto

> Nota:
>
> **não exclua a pasta `src` inteira. Apenas os arquivos originais dentro dela.** Substituiremos os arquivos de origem padrão por exemplos deste projeto na próxima etapa.

```bash
cd my-app
cd src

# Se você estiver usando um Mac ou Linux:
rm -f *

# Ou, se você estiver no Windows:
del *

# E então, volte para a pasta do projeto
cd ..
```

4. Adicione um arquivo chamado `index.css` na pasta` src/`com [este código CSS](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Adicione um arquivo chamado `index.js` na pasta` src/`com [este código JS](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. Adicione estas três linhas ao topo do `index.js` na pasta `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Agora, se você executar o `npm start` na pasta do projeto e abrir `http://localhost:3000` no navegador, você verá um campo vazio de jogo da velha.

Recomendamos seguir [estas instruções](https://babeljs.io/docs/editors/) para configurar o realce de sintaxe para seu editor.

</details>

### Me Ajudem. Estou com Dificuldades! {#help-im-stuck}

Se você não conseguir proseguir no tutorial por algum motivo, confira os [recursos de suporte da comunidade](/community/support.html). Em particular, o [Reactiflux Chat](https://discord.gg/0ZcbPKXt5bZjGY5n) é uma ótima maneira de obter ajuda rapidamente. Se você não receber uma resposta ou se permanecer preso, registre um problema e nós ajudaremos você.

## Visão geral {#overview}

Agora que tudo está configurado, vamos obter uma visão geral do React!

### O que é React? {#what-is-react}

O React é uma biblioteca JavaScript declarativa, eficiente e flexível para criar interfaces com o usuário. Ele permite compor UIs complexas a partir de pequenos e isolados códigos chamados "componentes".

React possui alguns tipos diferentes de componentes, mas começaremos com subclasses `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Lista de compras para {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Exemplo de uso: <ShoppingList name="Mark" />
```

Nós falaremos sobre formatos engraçados de tags que possuem formato de XML em breve. Usamos componentes para dizer ao React o que queremos ver na tela. Quando nossos dados forem alterados, o React atualizará e renderizará novamente com eficiência nossos componentes.

Aqui, o ShoppingList é um **componente React de classe** ou **component React do tipo classe**. Um componente recebe parâmetros, chamados `props` (abreviação de propriedades), e retorna uma hierarquia de elementos para exibir através do método `render`.

O método `render` retorna uma *descrição* do que você deseja ver na tela. React recebe a descrição e exibe o resultado. Em particular, `render` retorna um **elemento React**, que é uma descrição simplificada do que renderizar. A maioria dos desenvolvedores do React usa uma sintaxe especial chamada "JSX", que facilita a escrita desses elementos. A sintaxe `<div />` é transformada em tempo de compilação para `React.createElement ('div')`. O exemplo acima é equivalente a:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... filhos de h1 ... */),
  React.createElement('ul', /* ... filhos de ul ... */)
);
```

[Veja a versão completa completa.](babel://tutorial-expanded-version)

Se você está curioso, o `createElement()` é descrito em mais detalhes na [referência da API](/docs/react-api.html#createelement), mas não iremos usá-lo neste tutorial. Em vez disso, continuaremos usando o JSX.

O JSX vem com todo o poder do JavaScript. Você pode colocar *quaisquer* expressões JavaScript dentro de chaves no JSX. Cada elemento React é um objeto JavaScript que você pode armazenar em uma variável ou passar em seu código.

O componente `ShoppingList` acima apenas renderiza componentes internos do DOM como `<div />` e ` <li />`. Mas você também pode compor e renderizar componentes React personalizados. Por exemplo, agora podemos nos referir a toda a lista de compras escrevendo `<ShoppingList />`. Cada componente React é encapsulado e pode operar de forma independente; Isso permite que você construa interfaces complexas a partir de componentes simples.

## Inspecting the Starter Code {#inspecting-the-starter-code}

Se você for trabalhar no tutorial **em seu navegador,** abra esse código em uma nova guia: **[Código Inicial](https://codepen.io/gaearon/pen/oWWQNa?editors=0010 )** Se você vai trabalhar no tutorial **localmente,** abra `src/index.js` em sua pasta de projeto (você já criou este arquivo durante a [configuração](#setup-option-2-local-development-environment)).

Este Código Inicial é a base do que estamos construindo. Fornecemos o estilo CSS para que você só precise se concentrar no aprendizado do React e na programação do jogo da velha.

Ao inspecionar o código, você notará que temos três componentes React:

* Quadrado(Square)
* Tabuleiro(Board)
* Jogo(Game)

O componente Square renderiza um único `<button>` e o Board renderiza 9 squares. O componente Game renderiza um Board com valores que modificaremos mais tarde. Atualmente não há componentes interativos.

### Passando dados através de props {#passing-data-through-props}

Para aquecer, vamos tentar passar alguns dados do nosso componente Board para o nosso componente Square.

No método `renderSquare` do Board, altere o código para passar um prop chamado `value` para o Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Altere o método `render` do Square para mostrar esse valor substituindo `{/ * TODO * /}` por `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

Antes:

![React Devtools](../images/tutorial/tictac-empty.png)

Depois: Você deve ver um número em cada quadrado na saída renderizada.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Ver o código completo até este momento](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Parabéns! Você acabou de passar um "prop" de um componente pai Board para um componente filho Square. Passar props é a forma como os dados fluem em aplicações React, de pais para filhos.

### Fazendo um componente interativo {#making-an-interactive-component}

Vamos preencher o componente Square com um "X" quando clicamos nele.
Primeiro, altere a tag `button` que é retornada na função `render ()` do componente Square para isto:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Se clicarmos em um quadrado agora, devemos receber um alerta em nosso navegador.

>Nota
>
>Para salvar a digitação e evitar o [comportamento confuso de `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/),vamos usar a sintaxe [arrow function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions) para manipuladores de eventos:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Note que com `onClick = {() => alert ('click')}`, estamos passando *uma função* como prop `onClick`. Ela só é acionada após um clique. Esquecer o `() =>` e escrever somente `onClick = {alert ('click')}` é um erro comum, e dispararia o alerta toda vez que o componente fosse renderizado novamente.

Como próximo passo, queremos que o componente Square "lembre" que foi clicado e preencha com um "X". Para "lembrar" as coisas, os componentes usam o **estado (_state_)**.

Os componentes React podem ter estado (_state_) configurando `this.state` em seus construtores. `this.state` deve ser considerado como privado para o componente React que o definiu. Vamos armazenar o valor atual do Square em `this.state` e alterá-lo quando o Square for clicado.

Primeiro, adicionaremos um construtor à classe para inicializar o estado:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Nota
>
>Em [classes JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes), você sempre precisa chamar `super` ao definir o construtor de uma subclasse. Todas os componentes de classe React que possuem um método `constructor` devem iniciá-lo com uma chamada `super (props)`.

Agora vamos mudar o método `render` do componente Square para exibir o valor do estado (_state_) atual quando clicado:

* Substitua `this.props.value` por` this.state.value` dentro da tag `<button>`.
* Substitua o manipulador de eventos `() => alert ()` por `() => this.setState ({value: 'X'})`.
* Coloque `className` e` onClick` em linhas separadas para melhor legibilidade.

Após estas mudanças, a tag `<button>` que é retornada pelo método `render` do Square deve se parecer com isto:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Ao chamar `this.setState` a partir de um manipulador `onClick` no método `render` do componente Square, nós dizemos ao React para renderizar novamente aquele Square sempre que seu` <button>` for clicado. Após a atualização, o `this.state.value` do Square será `'X'`, então vamos ver o `X` no tabuleiro do jogo. Se você clicar em qualquer quadrado, um `X` deve aparecer.

Quando você chama `setState` em um componente, o React atualiza automaticamente os componentes filhos dentro dele também.

**[Ver o código completo até este momento](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Developer Tools {#developer-tools}

A extensão React Devtools para [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) e [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) permite inspecionar uma árvore de componentes React com as ferramentas de desenvolvedor do seu navegador.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

O React DevTools permite que você verifique as props e o estado (_state_) de seus componentes React.

Depois de instalar o React DevTools, você pode clicar com o botão direito do mouse em qualquer elemento da página, clicar em "Inspecionar" para abrir as ferramentas de desenvolvedor, e a guia React aparecerá como a última guia à direita.

** No entanto, observe que há algumas etapas extras para a extensão funcionar com o CodePen: **

1. Faça o login ou registre-se e confirme seu e-mail (necessário para evitar spam).
2. Clique no botão "Fork".
3. Clique em "Change View" e escolha "Debug mode".
4. Na nova aba que se abre, o devtools deve agora ter uma aba React.

## Completing the Game {#completing-the-game}

We now have the basic building blocks for our tic-tac-toe game. To have a complete game, we now need to alternate placing "X"s and "O"s on the board, and we need a way to determine a winner.

### Lifting State Up {#lifting-state-up}

Currently, each Square component maintains the game's state. To check for a winner, we'll maintain the value of each of the 9 squares in one location.

We may think that Board should just ask each Square for the Square's state. Although this approach is possible in React, we discourage it because the code becomes difficult to understand, susceptible to bugs, and hard to refactor. Instead, the best approach is to store the game's state in the parent Board component instead of in each Square. The Board component can tell each Square what to display by passing a prop, [just like we did when we passed a number to each Square](#passing-data-through-props).

**To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.**

Lifting state into a parent component is common when React components are refactored -- let's take this opportunity to try it out. We'll add a constructor to the Board and set the Board's initial state to contain an array with 9 nulls. These 9 nulls correspond to the 9 squares:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

When we fill the board in later, the board will look something like this:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

The Board's `renderSquare` method currently looks like this:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

In the beginning, we [passed the `value` prop down](#passing-data-through-props) from the Board to show numbers from 0 to 8 in every Square. In a different previous step, we replaced the numbers with an "X" mark [determined by Square's own state](#making-an-interactive-component). This is why Square currently ignores the `value` prop passed to it by the Board.

We will now use the prop passing mechanism again. We will modify the Board to instruct each individual Square about its current value (`'X'`, `'O'`, or `null`). We have already defined the `squares` array in the Board's constructor, and we will modify the Board's `renderSquare` method to read from it:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Each Square will now receive a `value` prop that will either be `'X'`, `'O'`, or `null` for empty squares.

Next, we need to change what happens when a Square is clicked. The Board component now maintains which squares are filled. We need to create a way for the Square to update the Board's state. Since state is considered to be private to a component that defines it, we cannot update the Board's state directly from Square.

To maintain the Board's state's privacy, we'll pass down a function from the Board to the Square. This function will get called when a Square is clicked. We'll change the `renderSquare` method in Board to:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Note
>
>We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn't insert a semicolon after `return` and break our code.

Now we're passing down two props from Board to Square: `value` and `onClick`. The `onClick` prop is a function that Square can call when clicked. We'll make the following changes to Square:

* Replace `this.state.value` with `this.props.value` in Square's `render` method
* Replace `this.setState()` with `this.props.onClick()` in Square's `render` method
* Delete the `constructor` from Square because Square no longer keeps track of the game's state

After these changes, the Square component looks like this:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

When a Square is clicked, the `onClick` function provided by the Board is called. Here's a review of how this is achieved:

1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in Square's `render()` method.
3. This event handler calls `this.props.onClick()`. The Square's `onClick` prop was specified by the Board.
4. Since the Board passed `onClick={() => this.handleClick(i)}` to Square, the Square calls `this.handleClick(i)` when clicked.
5. We have not defined the `handleClick()` method yet, so our code crashes.

>Note
>
>The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component. For custom components like Square, the naming is up to you. We could name the Square's `onClick` prop or Board's `handleClick` method differently. In React, however, it is a convention to use `on[Event]` names for props which represent events and `handle[Event]` for the methods which handle the events.

When we try to click a Square, we should get an error because we haven't defined `handleClick` yet. We'll now add `handleClick` to the Board class:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

After these changes, we're again able to click on the Squares to fill them. However, now the state is stored in the Board component instead of the individual Square components. When the Board's state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.

Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they're clicked. In React terms, the Square components are now **controlled components**. The Board has full control over them.

Note how in `handleClick`, we call `.slice()` to create a copy of the `squares` array to modify instead of modifying the existing array. We will explain why we create a copy of the `squares` array in the next section.

### Why Immutability Is Important {#why-immutability-is-important}

In the previous code example, we suggested that you use the `.slice()` operator to create a copy of the `squares` array to modify instead of modifying the existing array. We'll now discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to *mutate* the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes.

#### Data Change with Mutation {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data Change without Mutation {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

The end result is the same but by not mutating (or changing the underlying data) directly, we gain several benefits described below.

#### Complex Features Become Simple {#complex-features-become-simple}

Immutability makes complex features much easier to implement. Later in this tutorial, we will implement a "time travel" feature that allows us to review the tic-tac-toe game's history and "jump back" to previous moves. This functionality isn't specific to games -- an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game's history intact, and reuse them later.

#### Detecting Changes {#detecting-changes}

Detecting changes in mutable objects is difficult because they are modified directly. This detection requires the mutable object to be compared to previous copies of itself and the entire object tree to be traversed.

Detecting changes in immutable objects is considerably easier. If the immutable object that is being referenced is different than the previous one, then the object has changed.

#### Determining When to Re-render in React {#determining-when-to-re-render-in-react}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build *pure components* by reading [Optimizing Performance](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Nos modificamos `this.props` para `props` nas duas vezes que ela aparece.

**[Veja o código completo até aqui](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Nota
>
>Quando modificamos Square para ser um componente funcional, também modificamos `onClick={() => this.props.onClick()}` para uma versão mais curta: `onClick={props.onClick}` (note a ausência dos parenteses em *ambos* os lados). Em uma classe, nós utilizamos uma arrow function para acessar o valor correto de `this`, mas para um componente funcional não precisamos nos preocupar com `this`.

### Trocando Turnos {#taking-turns}

Agora precisamos consertar um defeito óbvio em nosso Jogo da Velha: os "O"s não podem ser marcados no tabuleiro.

Vamos definir a primeira jogadas para ser "X" por padrão. Podemos definir esse padrão modificando o state inicial no construtor do nosso tabuleiro (Board)

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Sempre que um jogador fizer uma jogada, `xIsNext` (um boolean) será trocado para determinar qual jogador será o próximo e o state do jogo será  salvo. Nós atualizaremos a função `handleClick` do Board para trocar o valor de `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Com esse mudança,"X"s e "O"s podem trocar os turnos. Também vamos modificar o texto de "status" na função `render` do Board para que ela passe a exibir quem jogará o próximo turno. 

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // o restante não tem alterações
```

Depois de fazer essas mudanças, você deverá ter esse componente do Board:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Veja o código completo até aqui](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declarando um Vencedor {#declaring-a-winner}

Agora que mostramos quem jogará o próximo turno, também deveríamos mostrar quando o jogo foi vencido e que não há mais turnos a serem jogados. Podemos determinar um vencedor adicionando essa função auxiliar ao final do arquivo:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

Chamaremos `calculateWinner(squares)` na função `render` do Board para checar se um jogador venceu. Caso tenha vencido, podemos mostrar um texto como "Winner: X" ou "Winner: O". Vamos substituir a declaração de `status` na função `render` com esse código:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // o restante não tem alterações
```

Agora podemos modificar a função `handleClick` do Board para retornar antes, ignorando o click, caso alguém tenha vencido o jogo ou se o quadrado (square) já esteja ocupado:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[Veja o código completo até aqui](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Parabéns! Você agora tem um Jogo da Velha funcionando! E também acaba de aprender o básico de React. Então, *você* é provavelmente o verdadeiro vencedor aqui.

## Adicionando a Viagem no Tempo (Time Travel){#adding-time-travel}

Como um último exercício, vamos tornar possível fazer uma "volta no tempo" até as jogadas anteriores que aconteceram no jogo.
### Armazenando um Histórico de Jogadas {#storing-a-history-of-moves}

Se nós tivéssemos modificado o array `squares`, a implementação da volta no tempo seria muito difícil.

No entanto, nós utilizamos `slice()` para criar uma nova cópia do array `squares` após cada jogada e [tratamos ele como imutável](#why-immutability-is-important). Isso nos permitirá o armazenamento de cada versão anterior do array `squares` e que possamos navegar entre os turnos que já tenham acontecido. 

Vamos armazenar os arrays `squares` anteriores em um outro array chamado `history`. O array `history` representa todos os estados do tabuleiro, da primeira à última jogada, e tem uma forma parecida com essa:

```javascript
history = [
  // Antes da primeira jogada
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // Depois da primeira jogada
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // Depois da segunda jogada
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Agora precisamos decidir a qual componente pertencerá o state do `history`.

### Trazendo o State pra Cima, Novamente {#lifting-state-up-again}

Queremos que o componente Game, o de mais alto nível, mostre uma lista com as jogadas anteriores. Para poder fazer isso, ele precisará acessar o `history`, então, temos que trazer o state `history` para cima, colocando-o no componente de mais alto nível, o componente Game.

Colocar o state `history` no componente Game, nos permite remover o state `squares` de seu componente filho, Board. Assim como ["trouxemos para cima"](#trazendo-state-para-cima) o state do componente Square para o componente Board, agora estamos trazendo o state do componente Board para o componente de mais alto nível, Game. Isso dá ao componente Game total controle sobre os dados do Board e permite que instrua o Board a renderizar turnos anteriores a partir do `history`.

Primeiro, iremos configurar o state inicial para o componente Game em seu construtor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Em seguida, faremos com que o componente Board receba as props `squares` e `onClick` do componente Game. Agora, uma vez que temos apenas um manipulador de clique no Board para vários Squares, vamos precisar passar a localização de cada Square para o manipulador `onClick` para indicar qual Square foi clicado. Aqui estão os passos necessários para transformar o componente Board:

* Deletar o `contructor` do Board.
* Substituir `this.state.squares[i]` por `this.props.squares[i]` na função `renderSquare` do Board.
* Substituir `this.handleClick(i)` por `this.props.onClick(i)` na função `renderSquare` do Board.

O componente Board agora ficou assim:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Vamos atualizar a função `render` do componente Game para utilizar a entrada mais recente do histórico (history) para determinar e exibir o status do jogo.

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Uma vez que o componente Game agora está renderizando o status do jogo, nós podemos remover o código correspondente do método `render` do componente Board. Depois de refatorar, a função `render` do Board fica assim:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Finalmente, precisamos mover o método `handleClick` do componente Board para o componente Game. Nós também precisamos modificar `handelClick` pois o state do componente Game está estruturado de maneira diferente. No componente Game, dentro do método `handleClick`, nós concatenamos novas entradas do histórico de jogadas em `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Nota
>
>Ao contrário do método de arrays `push()`, que você talvez possa estar mais familiarizado, o método `concat()` não modifica o array original, por isso preferimos utilizá-lo. 

Nesse ponto, o componente Board necessita apenas dos métodos `renderSquare` e `render`. O state do jogo e o método `handleClick` devem estar no componente Game.

**[Veja o código completo até aqui](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Mostrando as Jogadas Anteriores{#showing-the-past-moves}

Uma vez que estamos gravando o histórico do Jogo da Velha, agora podemos mostrá-lo para o jogador como uma lista de jogadas anteriores.

Aprendemos anterioremente que os elementos React são objetos JavaScript de primeira classe; podemos passá-los livremente por nossas aplicações. Para renderizar múltiplos itens em React, podemos utilizar um array de elementos React.

Em JavaScript, arrays possuem um [método `map()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map) que é normalmente utilizado para mapear uma fonte de dados para outra fonte de dados, por exemplo:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
``` 

Utilizando o método `map`, nós podemos mapear nosso histórico de jogadas para elementos React, representando botões na tela, e mostrar uma lista de botões que "pulam" para os jogadas anteriores.

Vamos fazer um `map` sobre o `history` no método `render` do componente Game:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[Veja o código completo nessa etapa](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

Para cada jogada no histórico do Jogo da Velha, nós criamos um item de lista `<li>` que contém um botão `<button>`. O botão tem um manipulador `onClick` que chama um método chamado `this.jumpTo()`. Nós ainda não implementamos o método `jumpTo()`. Por agora, nós devemos ver uma lista das jogadas que já ocorreram no jogo e um aviso no console do developer tools que diz: 

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

em português:

>  Aviso:
>  Cada filho de um array ou iterator deve ter uma prop "key" única. Confira o método render de "Game"

Vamos discutir sobre o que o aviso acima significa:

### Definindo uma Key (Chave) {#picking-a-key}

Quando renderizamos uma lista, o React armazena algumas informações sobre cada item da lista renderizada. Quando atualizamos uma lista, o React precisa determinar o que mudou. Nós poderiamos ter adicionado, removido, rearranjado ou atualizado os itens da lista. 

Imagine uma transição de

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

para

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Além das contagens atualizadas, um humano lendo isso provavelmente iria dizer que nós trocamos a ordem de Alexa e Ben e inserimos Claudia entre eles. No entanto, React é um programa de computador e não sabe qual foi nossa intenção. Pelo fato do React não ter como saber nossas intenções, precisamos especificar uma propriedade *key* (chave) para cada item da lista para diferenciá-los entre si. Uma opção poderia ser a utilização das strings `alexa`, `ben`, `claudia`. Se tivéssemos mostrando dados a partir de um banco de dados, os ids de Alexa, Ben e Claudia no banco poderiam ser utilizados como as chaves. 

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

Quando uma lista é re-renderizada, o React pega cada chave e busca nos itens da lista anterior por uma chave correspondente. Se a lista atual tiver uma chave que ainda não existia, React cria um componente. Se na lista atual tiver faltando uma chave que já existia na lista anterior, React destrói o componente anterior. Se as duas chaves combinarem, o componente correspondente é movido. As chaves informam ao React sobre a identidade de cada componente, o que permite que ele mantenha o estado entre re-renderizações. Se a chave de um componente mudar, o componente será destruído e recriado com um novo estado (state).

`key` é uma propriedade especial e reservada do React (juntamente com `ref`, uma funcionalidade mais avançada). Quando um elemento é criado, React extrai a propriedade `key` e armazena como uma chave diretamente no elemento retornado. Ainda que pareça que `key` pertença a `props`, `key` não pode ser referenciado utilizando `this.props.keys`. React automaticamente utiliza `key` para decidir quais componentes atualizar. Um componente não pode acessar sua `key`.

**É fortemente recomendado que você defina adequadamente suas chaves sempre que construir listas dinâmicas**. Se não tiver uma chave apropriada, você talvez deva considerar restruturar seus dados para tê-la.

Se nenhuma chave for especificada, React vai mostrar um aviso e utilizar, por padrão, o índice do array como chave. Utilizar o índice do array como a chave é problemático quando se tenta reordenar os itens de uma lista ou inserir/remover itens. Passar `key={i}` explicitamente silencia o aviso, mas continua com os mesmos problemas dos índices do array e por isso não é recomendado na maioria dos casos.

Chaves não precisam ser globalmente únicas; elas precisam ser únicas apenas entre os componentes e seus irmãos (siblings).

### Implementando a Viagem no Tempo (Time Travel) {#implementing-time-travel}

No histórico do Jogo da Velha, cada jogada anterior tem um único ID associado a ela: é o número sequencial da jogada. As jogadas nunca são reordenadas, apagadas, ou inseridas no meio, entá é seguro utilizar o index da jogada como a chave.

No método `render` do componente Game, nós podemos adicionar a chave como `<li key={move}>` e o aviso do React sobre as chaves deve desaparecer.

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[Veja o código completo até aqui](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicar em quaisquer dos botões da lista vai causar um erro pois o método `jumpTo` não está definido. Antes de implementá-lo, vamos adicionar `stepNumber` ao state do componente Game para indicar qual passo estamos visualizando no momento.

Primeiro, adicione `stepNumber: 0` ao state inicial no `contructor` do componente Game. 

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Em seguida, definiremos o método `jumpTo` no componente Game para atualizar aquele `stepNumber`. Também definimos `xIsNext` para `true` caso o número que estejamos atribuindo a `stepNumber` seja par: 

```javascript{5-10}
  handleClick(i) {
    // esse método não mudou
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // esse método não mudou
  }
```

Agora faremos algumas modificações no método `handleClick` do componente Game, que é disparado quando você clica em um quadradado do tabuleiro (square).

O state `stepNumber` que adicionamos reflete a jogada mostrada ao usuário nesse momento. Após fizermos uma nova jogada, precisamos atualizar `stepNumber` adicionando `stepNumber: history.length` como parte do argumento de `this.setState`. Isso certifica que não ficaremos presos mostrando a mesma jogada após uma novo ter sido feita. 

Também iremos substituir a leitura de `this.state.history` por `this.state.history.slice(0, this.state.stepNumber + 1)`. Isso certifica que se nós "voltarmos no tempo", e então fizermos uma nova jogada a partir daquele ponto, descartamos todo o histórico do "futuro" que agora se tornaria incorreto.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Por fim, modificaremos o método `render` do componente Game para deixar de renderizar sempre a última jogada e passar a renderizar apenas a jogada selecionada atualmente, de acordo com `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // o resto não foi modificado
```

Se clicarmos em qualquer passo no histórico do jogo, o tabuleiro do Jogo da Velha deve atualizar imediatamente para mostrar como ficou depois que aquele passo ocorreu.

**[Veja o código completo nessa etapa](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Recapitulando {#wrapping-up}

Parabéns! Você criou um jogo que:

* Te permite jogar o Jogo da Velha,
* Indica quando um dos jogadores ganhou o jogo,
* Armazena um histórico do jogo à medida que ele avança,
* Permite aos jogadores revisarem o histórico do jogo e verem versões anteriores do tabuleiro.

Belo trabalho! Esperamos que agora você esteja sentindo como se tivesse uma boa noção de como React funciona.

Dê uma olhada on resultado final aqui: **[Resultado Final](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Se você tiver algum tempo extra e quiser praticar suas habilidades no React, aqui estão algumas ideias de melhorias que você poderia adicionar a seu Jogo da Velha, listadas em ordem crescente de dificuldade.

1. Mostrar a localização de cada jogada no formato (col,row), para cada jogada no histórico.
2. Estilizar com negrito o item da lista de jogadas que está selecionado no momento.
3. Reescrever o componente Board para utilizar 2 loops para fazer os quadrados, em vez de deixá-los hardcoded.
4. Adicionar um botão de toggle que lhe permita ordenar os jogadas em ordem ascendente ou descendente.
5. Quando alguém ganhar, destaque os 3 quadrados que causaram a vitória.
6. Quando ninguém ganhar, exiba uma mensagem informando que o resultado foi um empate.

Ao longo dessa tutorial, abordamos conceitos de React incluindo elementos, componentes, props e state. Para uma explicação mais detalhada de cada um desses tópicos, confira [o restante da documentação](/docs/hello-world.html). Para aprender mais sobre definição de componentes, confira a [API de Referência do `React.Component`](/docs/react-component.html).
