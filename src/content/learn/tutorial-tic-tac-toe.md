---
title: 'Tutorial: Jogo da Velha'
---

<Intro>

Você construirá um pequeno jogo da velha durante este tutorial. Este tutorial não assume qualquer conhecimento prévio em React. As técnicas que você aprenderá no tutorial são fundamentais à construção de qualquer aplicativo React, e o entendimento destas lhe dará conhecimentos aprofundados sobre o React.

</Intro>

<Note>

Este tutorial foi criado para pessoas as quais preferem **aprender na prática** e querem tentar fazer algo tangível rapidamente. Se você prefere aprender cada conceito passo a passo, comece por [Descrevendo a UI.](/learn/describing-the-ui)

</Note>

O tutorial é dividido em diversas seções:

- [Preparação para o tutorial](#setup-for-the-tutorial) dará **um ponto de partida** para seguir o tutorial.
- [Visão geral](#overview) ensinará os **fundamentos** do React: componentes, *props*, e *state*.
- [Completando o jogo](#completing-the-game) ensinará a você **as técnicas mais comuns** no desenvolvimento React.
- [Adicionando viagem no tempo](#adding-time-travel) dará **uma visão aprofundada** sobre os pontos fortes únicos do React.

### O quê você está construindo? {/*what-are-you-building*/}

Neste tutorial, você construirá um jogo interativo de jogo da velha com React.

Você pode ver com o que ele se parecerá quando você tiver terminado aqui:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Se o código não faz sentido para você ainda, ou se você não tem familiaridade com a sintaxe do código, não se preocupe! O objetivo deste tutorial é ajudá-lo a entender o React e a sua sintaxe.

Nós recomendamos que você cheque o jogo da velha acima antes de continuar com o tutorial. Uma das funções que você perceberá é a de que existe uma lista numerada à direita do tabuleiro do jogo. Essa lista fornece um histórico de todos os movimentos que ocorreram no jogo, e é atualizada conforme o jogo progride.

Uma vez que você tenha brincado com o jogo da velha finalizado, continue rolando a página. Você iniciará com um modelo mais simples neste tutorial. Nosso próximo passo é prepará-lo para que você possa começar a construir o jogo.

## Preparação para o tutorial {/*setup-for-the-tutorial*/}

No editor de código abaixo, clique em **Fork** no canto superior direito para abri-lo em uma nova aba usando o site CodeSandbox. O CodeSandbox permite que você escreva código em seu navegador e pré-visualize como os seus usuários verão o aplicativo que você criou. A nova aba deve exibir um quadrado vazio e o código inicial para este tutorial.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Você também pode seguir esse tutorial usando o seu ambiente de desenvolvimento local. Para fazer isso, você precisará:

<<<<<<< HEAD
1. Instalar [Node.js](https://nodejs.org/en/)
1. Na aba do CodeSandbox que você abriu anteriormente, pressione o botão no canto superior esquerdo para abrir o menu e então escolha **Arquivo > Exportar como ZIP** naquele menu para baixar os arquivos localmente
1. Descompacte o arquivo, então abra um terminal e execute `cd` até o diretório em que você os descompactou
1. Instale as dependências com `npm install`
1. Execute `npm start` para iniciar um servidor local e siga os prompts para ver o código rodando em um navegador
=======
1. Install [Node.js](https://nodejs.org/en/)
1. In the CodeSandbox tab you opened earlier, press the top-left corner button to open the menu, and then choose **Download Sandbox** in that menu to download an archive of the files locally
1. Unzip the archive, then open a terminal and `cd` to the directory you unzipped
1. Install the dependencies with `npm install`
1. Run `npm start` to start a local server and follow the prompts to view the code running in a browser
>>>>>>> 5de85198a3c575d94a395138e3f471cc7172a51c

Se você tiver problemas, não deixe com que isso lhe pare! Ao invés disso continue online e tente novamente em ambiente local mais tarde.

</Note>

## Visão geral {/*overview*/}

Agora que você está preparado, vamos ter uma visão geral to React!

### Inspecionando o código inicial {/*inspecting-the-starter-code*/}

No CodeSandbox você verá três seções principais:

![CodeSandbox com código inicial](../images/tutorial/react-starter-code-codesandbox.png)

1. A seção *Arquivos* com uma lista de arquivos como `App.js`, `index.js`, `styles.css` e uma pasta chamada `public`
1. O *editor de código* onde você verá o código fonte de seu arquivo selecionado
1. A seção de *navegador* onde você verá como o código que você escreveu será exibido

O arquivo `App.js` deve ser selecionado na seção *Arquivos*. Os conteúdos daquele arquivo no *editor de código* devem ser:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

A seção *navegador* deve estar exibindo um quadrado com um X em seu interior desta forma:

![quadrado preenchido por um x](../images/tutorial/x-filled-square.png)

Agora vamos dar uma olhada nos arquivos do código inicial.

#### `App.js` {/*appjs*/}

O código em `App.js` cria um *componente*. No React, um componente é uma peça de código reutilizável a qual representa uma parte de sua interface de usuário. Componentes são usados para renderizar, administrar, e atualizar os elementos de UI na sua aplicação. Vamos ler o componente linha a linha para entender o que está acontecendo:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

A primeira linha define uma função chamada `Square`. A palavra-chave do JavaScript `export` torna essa função acessível fora deste arquivo. O termo `default` diz aos outros arquivos usando seu código que essa é a função principal em seu arquivo.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

A segunda linha retorna um botão. A palavra-chave `return` do JavaScript significa que qualquer coisa que venha após ela é retornada como um valor para quem chamar esta função. `<button>` é um *elemento JSX*. Um elemento JSX é uma combinação de código JavaScript e tags HTML a qual descreve o que você quer exibir. `className="square"` é uma propriedade do botão ou *prop* que diz à CSS como estilizar o botão. `X` é o texto a ser exibido dentro do botão e `</button>` fecha o elemento JSX para indicar que qualquer conteúdo após isso não deve ser colocado dentro do botão.

#### `styles.css` {/*stylescss*/}

Clique no arquivo denominado `styles.css` na seção *Arquivos* do CodeSandbox. Esse arquivo define os estilos para a sua aplicação React. Os primeiros dois *seletores CSS* (`*` e `body`) definem o estilo de grandes parte do seu aplicativo enquanto o seletor `.square` define o estilo de qualquer componente onde a propriedade `className` esteja definida como `square`. Em seu código, isso se refere ao botão de seu componente Square no arquivo `App.js`.

#### `index.js` {/*indexjs*/}

Clique no arquivo denominado `index.js` na seção *Arquivos* de seu CodeSandbox. Você não editará este arquivo durante o tutorial mas ele é a ponte entre o componente que você criou no arquivo `App.js` e o navegador.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

<<<<<<< HEAD
As linhas 1-5 juntam todas as peças necessárias:
=======
Lines 1-5 bring all the necessary pieces together: 
>>>>>>> 5de85198a3c575d94a395138e3f471cc7172a51c

- React
- a biblioteca do React para conversar com navegadores de internet (React DOM)
- os estilos de seus componentes
- o componente que você criou em `App.js`.

O restante do arquivo junta todas as partes e injeta o produto final em `index.html` na pasta `public`.

### Construindo o tabuleiro {/*building-the-board*/}

Vamos voltar ao `App.js`. É aqui que você passará o restante do tutorial.

Atualmente o tabuleiro é apenas um único quadrado, mas você precisa de nove! Se você simplesmente tentar copiar e colar seu quadrado para fazer dois quadrados desta forma:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Você receberá este erro:

<ConsoleBlock level="error">

<<<<<<< HEAD
/src/App.js: Elementos JSX adjacentes devem ser envolvidos em uma tag externa. Você queria um fragment JSX `<>...</>`?

</ConsoleBlock>

Componentes do React precisam retornar um único elemento JSX e não múltiplos elementos JSX adjacentes como dois botões. Para consertar isso você pode usar *fragments* (`<>` e `</>`) para envolver múltiplos elementos JSX adjacentes desta forma:
=======
/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

React components need to return a single JSX element and not multiple adjacent JSX elements like two buttons. To fix this you can use *Fragments* (`<>` and `</>`) to wrap multiple adjacent JSX elements like this:
>>>>>>> 5de85198a3c575d94a395138e3f471cc7172a51c

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Agora você deve ver:

![dois quadrados preenchidos por x](../images/tutorial/two-x-filled-squares.png)

Ótimo! Agora você só precisa copiar e colar algumas vezes para adicionar nove quadrados e...

![nove quadrados preenchidos por x em uma linha](../images/tutorial/nine-x-filled-squares.png)

Ah não! Os quadrados estão todos em uma única linha, não em uma grade como você precisa para nosso tabuleiro. Para consertar isso, você precisará agrupar seus quadrados em linhas com `div`s e adicionar algumas classes CSS. Enquanto você o faz, dê a cada quadrado um número para certificar-se de que você sabe onde cada quadrado está sendo exibido.

No arquivo `App.js`, atualize o componente `Square` para que se pareça com isto:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

A CSS definida em `styles.css` estiliza as divs com o `className` de `board-row`. Agora que você agrupou os seus componentes em linhas com as `div`s estilizadas você tem seu tabuleiro de jogo da velha:

![tabuleiro de jogo da velha preenchido com os números de 1 a 9](../images/tutorial/number-filled-board.png)

Mas agora você tem um problema. Seu componente chamado `Square`, na verdade não é mais um quadrado. Vamos arrumar isso trocando o nome para `Board`:

```js {1}
export default function Board() {
  //...
}
```

A esse ponto seu código deve se parecer com isto:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Pssss... Isso é bastante para se digitar! É OK copiar e colar código desta página. Entretanto, se você está disposto a topar um desafio, nós recomendamos apenas copiar código que você mesmo já escreveu manualmente antes.

</Note>

### Passando dados através de *props* {/*passing-data-through-props*/}

Após isso, você gostará de mudar o valor de um quadrado de vazio para "X" quando o usuário clicar no quadrado. Com a maneira em que você construiu o tabuleiro até agora você teria que copiar e colar o código que atualiza o quadrado nove vezes (uma para cada quadrado que você tem)! Ao invés de copiar e colar, a arquitetura de componentes do React permite que você crie um componente reutilizável para evitar código bagunçado e duplicado.

Primeiro, você irá copiar a linha definindo o seu primeiro quadrado (`<button className="square">1</button>`) de seu componente `Board` a um novo componente `Square`:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Então você atualizará o componente do tabuleiro para renderizar aquele componente `Square` usando a sintaxe JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Perceba como diferentes das `div`s do navegador, os componentes `Board` e `Square` pertencem a você e devem começar com uma letra maiúscula.

Vamos dar uma olhada:

![tabuleiro preenchido pela número 1](../images/tutorial/board-filled-with-ones.png)

Ah não! Você perdeu os quadrados numerados que tinha antes. Agora cada quadrado diz "1". Para consertar isso, você usará *props* para passar o valor que cada quadrado deve ter a partir de seu componente pai (`Board`) para seus filhos (`Square`).

Atualize o componente `Square` para ler a *prop* `value` que você irá passar a partir de `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` indica que o componente Square aceita receber uma *prop* chamada `value`.

Agora você quer exibir aquele `value` ao invés de `1` dentro de cada quadrado. Tente fazer isso desta forma:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Ops, isto não é o que você queria:

![tabuleiro preenchido com "value"](../images/tutorial/board-filled-with-value.png)

Você queria renderizar a variável JavaScript chamada `value` a partir de seu componente, não a palavra "value". Para "escapar ao JavaScript" a partir da JSX, você precisa de chaves. Adicione chaves ao redor de `value` na JSX desta forma:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Por enquanto, você deve ver um tabuleiro vazio:

![tabuleiro vazio](../images/tutorial/empty-board.png)

Isso é porque o componente `Board` não passou a *prop* `value` a cada componente `Square` que ele renderiza ainda. Para consertar isso você adicionará a *prop* `value` a cada componente `Square` renderizado pelo componente `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Agora você deve ver uma grade de números novamente:

![tabuleiro de jogo da velha preenchido com números de 1 a 9](../images/tutorial/number-filled-board.png)

O seu código atualizado deve se parecer com isto:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Fazendo um componente interativo {/*making-an-interactive-component*/}

Vamos preencher o componente `Square` com um `X` quando você o clicar. Declare uma função chamada `handleClick` dentro de `Square`. Então, adicione `onClick` às *props* do elemento JSX `button` retornado de `Square`:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Agora se você clica no quadrado, deve ver um registro dizendo `"clicked!"` na aba *Console* na parte inferior da seção *Navegador* do CodeSandbox. Clicar no quadrado mais de uma vez irá registrar `"clicked!"` novamente. Registros repetidos no console com a mesma mensagem não criarão mais linhas no console. Em vez disso, você verá um contador incrementando próximo ao seu primeiro registro `"clicked!"`.

<Note>

Se você está seguindo este tutorial usando o seu ambiente de desenvolvimento local, você precisa abrir o console de seu navegador. Por exemplo, se você usa o navegador Chrome, você pode ver o Console com o atalho de teclado **Shift + Ctrl + J** (no Windows/Linux) ou **Option + ⌘ + J** (no macOS).

</Note>

Como um próximo passo, você quer que o componente Square "lembre-se" de que ele foi clicado, e preenchê-lo com uma marca de "X". Para "lembrar-se" de coisas, componentes usam *state*.

O React fornece uma função especial chamada `useState` a qual você pode chamar a partir de seu componente para permitir que ele "lembre-se" de coisas. Vamos armazenar o valor atual do `Square` em *state*, e mudá-lo quando o `Square` for clicado.

Importe `useState` no topo do arquivo. Remova a *prop* `value` do componente `Square`. Em vez disso, adicione uma nova linha no começo de `Square` que chame `useState`. Faça com que ela retorne uma variável de *state* chamada `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` salva o valor e `setValue` é a função que pode ser usada para mudar esse valor. O `null` passado para `useState` é usado como o valor inicial desta variável de *state*, então aqui `value` começa sendo igual a `null`.

Já que o componente `Square` não mais aceita *props*, você irá remover a *prop* `value` de todos os nove componentes Square criados pelo componente Board:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Agora você irá mudar `Square` para que exiba um "X" quando clicado. Substitua o manipulador de eventos `console.log("clicked!");` com `setValue('X');`. Agora o seu componente `Square` se parece com isto:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Ao chamar essa função `set` a partir de um manipulador `onClick`, você está dizendo ao React para rerrenderizar aquele `Square` sempre que o seu `<button>` for clicado. Depois da atualização, o `value` de `Square` será `'X'`, então você verá o "X" no tabuleiro do jogo. Clique em qualquer Square, e "X" deve aparecer:

![adicionando x ao tabuleiro](../images/tutorial/tictac-adding-x-s.gif)

Cada Square tem seu próprio *state*: o `value` armazenado em cada Square é completamente independente dos outros. Quando você chama a função `set` em um componente, o React automaticamente atualiza os componentes filhos dentro dele também.

Após ter feito as mudanças acima, seu código deve se parecer com isto:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Ferramentas do Desenvolvedor React {/*react-developer-tools*/}

As DevTools do React permitem que você cheque as *props* e o *state* de seus componentes React. Você pode encontrar a aba de DevTools do React na parte inferior da seção *navegador* no CodeSandbox:

![React DevTools no CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Para inspecionar um componente em particular na tela, use o botão no canto superior esquerdo das DevTools do React:

![Selecionando componente na página com as DevTools do React](../images/tutorial/devtools-select.gif)

<Note>

Para desenvolvimento local, as DevTools do React estão disponíveis como extensões de navegador para [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), e [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). Instale-as, e a aba *Components* irá aparecer nas ferramentas de desenvolvedor do seu navegador para sites utilizando React.

</Note>

## Completando o jogo {/*completing-the-game*/}

Até aqui, você já tem todos os blocos de construção básicos para o seu jogo da velha. Para completar o jogo, você agora precisa alternar a colocação de "X"s e "O"s no tabuleiro, e você precisa de uma maneira de determinar um vencedor.

### Elevando o *state* {/*lifting-state-up*/}

Atualmente, cada componente `Square` mantém uma parte do *state* do jogo. Para checar por um vencedor em um jogo da velha, o `Board` precisaria de alguma maneira de conhecer o *state* de cada um dos 9 componentes `Square`.

Como você abordaria isso? Em um primeiro momento, você pode imaginar que o `Board` precisa "pedir" para cada `Square` pelo *state* daquele `Square`. Por mais que essa abordagem seja tecnicamente possível em React, nós a desencorajamos porque o código se torna difícil de entender, susceptível a bugs, e difícil de refatorar. Em vez disso, a melhor abordagem é armazenar o *state* do jogo no componente pai `Board` ao invés de em cada `Square`. O componente `Board` pode dizer a cada `Square` o que exibir passando uma *prop*, como você fez quando passou um número para cada Square.

**Para coletar dados de múltiplos filhos, ou fazer com que dois componentes filhos comuniquem-se entre si, em vez disso declare *state* compartilhado no componente pai. O componente pai pode passar esse *state* de volta aos filhos via *props*. Isso mantém os componentes filhos sincronizados um com o outro e com seu pai.**

Elevar *state* em um componente pai é comum quando componentes React são refatorados.

Vamos aproveitar esta oportunidade para tentar fazer isso. Edite o componente `Board` para que ele declare uma variável de *state* denominada `squares` a qual possua um array com 9 nulls por padrão correspondendo aos 9 quadrados:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` cria um array com nove elementos e define cada um deles como `null`. A chamada `useState()` ao redor dele declara uma variável de *state* `squares` a qual é inicialmente definida àquele array. Cada valor no array corresponde ao valor de um quadrado. Quando você preencher o tabuleiro mais tarde, o array `squares` se parecerá com isto:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Agora o componente `Board` precisa passar a *prop* `value` para cada `Square` que renderiza:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

A seguir, você editará o componente `Square` para que receba a *prop* `value` do componente Board. Isso precisará da remoção do próprio monitoramento sobre `value` do componente Square e a *prop* `onClick` do botão:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

Nesta altura você deve ver um tabuleiro vazio de jogo da velha:

![tabuleiro vazio](../images/tutorial/empty-board.png)

E seu código deve se parecer com isto:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Cada Square agora irá receber uma *prop* `value` a qual será `'X'`, `'O'`, ou `null` para quadrados vazios.

A seguir, você precisará mudar o que acontece quando um `Square` é clicado. O componente `Board` agora mantêm quais dos quadrados estão preenchidos. Você precisará criar uma maneira para que o `Square` atualize o *state* de `Board`. Já que o *state* é privado ao componente que o define, você não pode atualizar o *state* de `Board` diretamente de `Square`.

Em vez disso, você passará uma função do componente `Board` ao componente `Square`, e você fará com que `Square` chame essa função quando um quadrado for clicado. Você começará com a função que o componente `Square` chamará quando for clicado. Você chamará a função `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

A seguir, você adicionará a função `onSquareClick` às *props* do componente `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Agora você conectará a *prop* `onSquareClick` a uma função no componente `Board` que você chamará de `handleClick`. Para conectar a *prop* `onSquareClick` a `handleClick` você passará a função à *prop* `onSquareClick` do primeiro componente `Square`:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Por fim, você irá definir a função `handleClick` dentro do componente Board para atualizar o array `squares` o qual armazena o *state* de seu tabuleiro:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

A função `handleClick` cria uma cópia do array `squares` (`nextSquares`) com o método de Array JavaScript `slice()`. Então, `handleClick` atualiza o array `nextSquares` para adicionar `X` ao primeiro (índice `[0]`) quadrado.

Chamar a função `setSquares` permite que o React saiba que o *state* do componente mudou. Isso irá acionar uma rerrenderização dos componentes que usa o *state* `squares` (`Board`) bem como seus componentes filhos (os componentes `Square` que fazem parte do tabuleiro).

<Note>

O JavaScript possui suporte a [closures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Closures) o que significa que uma função interna (por exemplo, `handleClick`) tem acesso às variáveis e funções definidas em uma função externa (por exemplo, `Board`). A função `handleClick` pode ler o *state* `squares` e chamar o método `setSquares` porque eles são ambos definidos dentro da função `Board`.

</Note>

Agora você pode adicionar X's ao tabuleiro... mas apenas no quadrado superior esquerdo. A sua função `handleClick` está codificada a atualizar o índice do quadrado superior esquerdo (`0`). Vamos atualizar `handleClick` para que seja capaz de atualizar qualquer quadrado. Adicione um argumento `i` à função `handleClick` que recebe o índice de qual quadrado atualizar:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

A seguir, você precisará passar aquele `i` a `handleClick`. Você pode tentar definir a *prop* `onSquareClick` de cada quadrado para `handleClick(0)` diretamente na JSX desta forma, mas isto não funcionará:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Aqui está o razão pela qual isso não funciona. A chamada `handleClick(0)` será parte da renderização do componente do tabuleiro. Como `handleClick(0)` altera o *state* do componente do tabuleiro ao chamar `setSquares`, seu componente de tabuleiro todo será rerrenderizado novamente. Mas isso executa `handleClick(0)` de novo, levando a um um loop infinito:

<ConsoleBlock level="error">

Muitas rerrenderizações. O React limita o número de renderizações para previnir um loop infinito.

</ConsoleBlock>

Por que esse problema não aconteceu antes?

Quando você estava passando `onSquareClick={handleClick}`, você passava a função `handleClick` como uma *prop*. Você não a chamava! Mas agora você está *chamando* aquela função imediatamente--perceba os parênteses em `handleClick(0)`--e é por isso que ela é executada muito cedo. Você não *quer* chamar `handleClick` até que o usuário clique!

Você poderia consertar isso criando uma função como `handleFirstSquareClick` que chama `handleClick(0)`, um função como `handleSecondSquareClick` que chama `handleClick(1)`, e assim por diante. Você passaria (ao invés de chamar) essas funções como *props* assim: `onSquareClick={handleFirstSquareClick}`. Isso resolveria o loop infinito.

Entretanto, definir nove funções diferentes e dar um nome a cada uma delas é muito verboso. Em vez disso, vamos fazer isto:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Perceba a nova sintaxe `() =>`. Aqui, `() => handleClick(0)` é uma *arrow function*, a qual é uma maneira mais curta de definir funções. Quando o quadrado é clicado, o código depois da "flecha" `=>` irá executar, chamando `handleClick(0)`.

Agora você precisa atualizar os outros oito quadrados para chamarem `handleClick` através das arrow functions que você passa. Certifique-se de que cada argumento para cada chamada de `handleClick` corresponda ao índice do quadrado correto:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Agora você pode novamente adicionar X's a qualquer quadrado do tabuleiro os clicando:

![preenchendo o tabuleiro com X](../images/tutorial/tictac-adding-x-s.gif)

Mas desta vez toda a manipulação de *state* é feita pelo componente `Board`!

Seu código deve se parecer com isto:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Agora que sua manipulação de *state* está no componente `Board`, o componente pai `Board` passa*props* aos componentes filhos `Square` para que eles possam ser exibidos corretamente. Ao clicar em um `Square`, o componente filho `Square` agora pede ao componente pai `Board` que atualize o *state* do tabuleiro. Quando o *state* de `Board` muda, ambos o componente `Board` e cada filho `Square` rerrenderizam automaticamente. Manter o *state* de todos os quadrados no componente `Board` o permitirá determinar o vencedor no futuro.

Vamos recapitular o que acontece quando um usuário clica no quadrado superior esquerdo em seu tabuleiro para adicionar um `X` a ele:

1. Clicar no quadrado superior esquerdo executra a função que `button` recebeu como sua *prop* `onClick` de `Square`. O componente `Square` receber aquela função como sua *prop* `onSquareClick` de `Board`. O componente `Board` definiu aquela função diretamente na JSX. Ela chama `handleClick`com um argumento de `0`.
1. `handleClick` usa o argumento (`0`) para atualizar o primeiro elemento do array `squares` de `null` para `X`.
1. O *state* `square` do componente `Board` foi atualizado, então `Board` e todos os seus filhos rerrenderizam. Isso faz com que a *prop* `value` do componente `Square` de índice `0` mude de `null` para `X`.

No final o usuário vê que o quadrado superior esquerdo mudou de vazio para ter um `X` depois de clicar nele.

<Note>

O atributo `onClick` do elemento do DOM `<button>` tem um significado especial ao React porque ele é um componente embutido. Para componentes customizados como Square, a nomeação depende de você. Você poderia dar qualquer nome à *prop* `onSquareClick` de `Square` ou à função `handleClick` de `Board`, e o código funcionaria da mesma forma. No React, é convenção o uso de nomes `onAlgo` para *props* as quais representam eventos e `handleAlgo` para definições de funções as quais manipulam tais eventos.

</Note>

### Por quê imutabilidade é importante {/*why-immutability-is-important*/}

Perceba como em `handleClick`, você chama `.slice()` para criar uma cópia do array `squares` em vez de modificar o array existente. Para explicar o porquê, nós precisamos discutir imutabilidade e por que imutabilidade é importante de se aprender.

Há geralmente duas abordagens para alterar dados. A primeira abordagem é *mutar* os dados alterando diretamente os seus valores. A segunda abordagem é substituir os dados com uma nova cópia a qual tem as mudanças desejadas. Veja como isso se pareceria se você mutasse o array `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Agora `squares` é ["X", null, null, null, null, null, null, null, null];
```

E aqui está como isso se pareceria se você alterasse os dados sem mutar o array `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Agora `squares` segue não modificado, mas o primeiro elemento de `nextSquares` é 'X' em vez de `null`
```

O resultado é o mesmo mas ao não mutar (alterar os dados subjacentes) diretamente, você ganha diversos benefícios.

Imutabilidade torna recursos complexos muito mais fáceis de se implementar. Mais tarde neste tutorial, você implementará uma função de "viagem no tempo" a qual permite que você avalie o histórico do jogo e "pule de volta" a movimentos passados. Essa funcionalidade não é específica aos jogos--a habilidade de desfazer e refazer certas ações é um requerimento comum para aplicativos. Evitar a mutação direta de dados permite que você mantenha versões prévias dos dados intactas e as reutilize mais tarde.

Há também outro benefício da imutabilidade. Por padrão, todos os componentes filhos rerrenderizam automaticamente quando o *state* de um componente pai muda. Isso inclui até os componentes filhos que não foram afetados pela mudança. Mesmo que a rerrenderização em si não seja perceptível ao usuário (você não deveria ativamente tentar evitá-la), você pode querer pular a rerrenderização de uma parte da árvore que claramente não foi afetada por razões de performance. Imutabilidade torna muito barato para os componentes compararem se seus dados foram alterados ou não. Você pode aprender mais sobre como o React escolhe quando rerrenderizar um componente na [referência da API `memo`](/reference/react/memo).

### Revezando {/*taking-turns*/}

Agora é hora de consertarmos um grande defeito neste jogo da velha: os "O"s não podem ser marcados no tabuleiro.

Você definirá o primeiro movimento como "X" por padrão. Vamos acompanhar isso adicionando outra peça de *state* ao componente Board:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

A cada vez que um jogador fizer um movimento, `xIsNext` (um booleano) será invertido para determinar qual o próximo jogador e o *state* do jogo será salvo. Você atualizará a função `handleClick` de `Board` para inverter o valor de `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Agora, ao clicar em diferentes quadrados, eles alternarão entre `X` e `O`, como deveriam!

Mas calma, há um problema. Tente clicar no mesmo quadrado múltiplas vezes:

![O sobrescrevendo um X](../images/tutorial/o-replaces-x.gif)

O `X` é sobrescrito por um `O`! À medida que isso adicionaria uma reviravolta interessante ao jogo, nós vamos nos limitar às regras originais por enquanto.

Quando você marca um quadrado com um `X` ou um `O` você não está primeiro checando se o quadrado já possui um valor `X` ou `O`. Você pode consertar isso *retornando cedo*. Você checará se um quadrado já possui `X` ou `O`. Se o quadrado já estiver preenchido, você chamará `return` na função `handleClick` cedo--antes que ela tente atualizar o *state* do tabuleiro.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Agora você pode apenas adicionar `X`'s ou `O`'s a quadrados vazios! Veja como o seu código deveria estar a esse ponto:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Declarando um vencedor {/*declaring-a-winner*/}

Agora que os jogadores podem trocar de vez, você vai querer exibir quando o jogo for vencido e não existam mais turnos a fazer. Para fazer isso você adicionará uma função ajudante chamada `calculateWinner` a qual recebe um array de 9 quadrados, checa por um vencedor e retorna `'X'`, `'O'`, ou `null` apropriadamente. Não se preocupe muito com a função `calculateWinner`; ela não é específica ao React:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
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

<Note>

Não importa se você define `calculateWinner` antes ou depois de `Board`. Vamos colocá-la no final para que você não tenha que passar por ela toda vez que quiser editar seus componentes.

</Note>

Você chamará `calculateWinner(squares)` na função `handleClick` do componente `Board` para checar se um jogador venceu. Você pode realizar essa checagem ao mesmo tempo em que checa se um usuário clicou em um quadrado que já possui um `X` ou um `O`. Nós gostaríamos de retornar cedo em ambos os casos:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Para deixar que os jogadores saibam quando o jogo terminou, você pode exibir texto como "Vencedor: X" ou "Vencedor: O". Para fazer isso, você adicionará uma seção `status` ao componente `Board`. O status exibirá o vencedor do jogo se o ele tiver terminado e se o jogo estiver em andamento exibirá de qual jogador é o próximo turno:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Parabéns! Você agora tem um jogo da velha funcional. E você também acabou de aprender os básicos do React. Então *você* é o verdadeiro vencedor aqui. Veja como seu código deve ser parecer:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Adicionando viagem no tempo {/*adding-time-travel*/}

Como um exercício final, vamos tornar possível "ir de volta no tempo" aos movimentos anteriores no jogo.

### Armazenando um histórico de movimentos {/*storing-a-history-of-moves*/}

Se você tivesse mutado o array `squares`, implementar viagem no tempo seria muito difícil.

Entretanto, você usou `slice()` para criar uma nova cópia do array de `squares` depois de cada movimento, e o tratou como imutável. Isso permitirá que você armazene cada versão passada do array `squares` e navegue entre os turnos que já aconteceram.

Você armazenará os arrays `squares` antigos em outro array chamado `history`, o qual você armazenará como uma nova variável de *state*. O array de `history` representa todos os *states* do tabuleiro, do primeiro ao último movimento, e possui uma forma parecida com isto:

```jsx
[
  // Antes do primeiro movimento
  [null, null, null, null, null, null, null, null, null],
  // Depois do primeiro movimento
  [null, null, null, null, 'X', null, null, null, null],
  // Depois do segundo movimento
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Elevando *state*, novamente {/*lifting-state-up-again*/}

Agora você irá escrever um novo componente de nível do topo `Game` para exibir uma lista de movimentos passados. É ali que você colocará o *state* `history` contendo todo o histórico do jogo.

Colocar o *state* `history` no componente `Game` permitirá que você remova o *state* `squares` de seu componente filho `Board`. Assim como você "elevou *state*" do componente `Square` ao componente `Board`, você agora o elevará de `Board` ao componente de nível superior `Game`. Isso dá ao componente `Game` controle total sobre os dados de `Board` e permite-o instruir `Board` a renderizar turnos anteriores a partir de `history`.

Primeiro, adicione um componente `Game` com `export default`. Faça-o renderizar o componente `Board` e alguma marcação HTML:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Perceba que você está removendo as palavras-chave `export default` antes da declaração `function Board() {` e adicionando-as antes da declaração `function Game() {`. Isso diz ao seu arquivo `index.js` para usar o componente `Game` como o componente do nível do topo ao invés do componente `Board`. As `div`s adicionais retornadas pelo componente `Game` estão fazendo espaço para a informação de jogo que você adicionará ao tabuleiro mais tarde.

Adicione algum *state* ao componente `Game` para acompanhar qual é o próximo jogador e o histórico de movimentos:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Perceba como `[Array(9).fill(null)]` é um array com um único item, o qual é em si um array de 9 `null`s.

Para renderizar os quadrados do movimento atual, você terá que ler os últimos quadrados do array a partir de `history`. Você não precisa de `useState` para isso--você já tem informação o suficiente para calculá-lo durante a renderização:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

A seguir, crie uma função `handlePlay` dentro do componente `Game` a qual será chamada pelo componente `Board` para atualizar o jogo. Passe `xIsNext`, `currentSquares` e `handlePlay` como *props* ao componente `Board`:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Vamos tornar o componente `Board` completamente controlado pelas *props* que recebe. Mude o componente `Board` para que receba três *props*: `xIsNext`, `squares`, e a nova função `onPlay` que `Board` pode chamar com os quadrados atualizados quando um jogador fizer um movimento. A seguir, remova as duas primeiras linhas da função `Board` que chamam `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Agora substitua as chamadas a `setSquares` e `setXIsNext` em `handleClick` no componente `Board` com uma única chamada a sua nova função `onPlay` para que o componente `Game` possa atualizar `Board` quando o usuário clicar em um quadrado:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

O componente `Board` é completamente controlado pelas *props* passadas a ele pelo componente `Game`. Você precisará implementar a função `handlePlay` no componente `Game` para fazer com que o jogo funcione novamente.

O que `handlePlay` deveria fazer quando chamada? Lembre-se que Board costumava chamar `setSquares` com um array atualizado; agora ele passa o array `squares` atualizado a `onPlay`.

A função `handlePlay` precisa atualizar o *state* de `Game` para acionar uma rerrenderização, mas você não tem mais uma função `setSquares` a qual possa chamar--agora você está usando a variável de *state* `history` para armazenar essa informação. Você vai querer atualizar `history` anexando o array atualizado `squares` como uma nova entrada no histórico. Você também gostará de alternar `xIsNext`, assim como Board costumava fazer:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Aqui, `[...history, nextSquares]` cria um novo array que contêm todos os items em `history`, seguido de `nextSquares`. (Você pode ler a [*sintaxe espalhada*](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...history` como "enumere todos os items em `history`".)

Por exemplo, se `history` é `[[null,null,null], ["X",null,null]]` e `nextSquares` é `["X",null,"O"]` então o novo array `[...history, nextSquares]` será `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

Até agora, você moveu o *state* para viver no componente `Game`, e a UI deve estar funcionando por completo, assim como estava antes da refatoração. Veja com o que o seu código deve se parecer a esse ponto:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Exibindo movimentos passados {/*showing-the-past-moves*/}

Já que você está gravando o histórico do jogo da velha, você agora pode exibir uma lista com os movimentos passados ao jogador.

Elementos React como `<button>` são objetos comuns do JavaScript; você pode movê-los dentro de sua aplicação. Para renderizar múltiplos items em React, você pode usar um array de elementos React.

Você já tem um array de movimentos `history` no *state*, então agora você precisa transformá-lo em um array de elementos React. Em JavaScript, para transformar um array em outro, você pode usar o [método de array `map`:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Você usará `map` para transformar seu `history` de movimentos em elementos React representando botões na tela, e exibir a lista de botões para "pular" para movimentos anteriores. Vamos usar `map` sobre `history` no componente Game:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

<<<<<<< HEAD
Você pode ver como seu código deve se parecer abaixo. Perceba que você deve ver um erro em seu console nas ferramentas de desenvolvedor que diz: ``Aviso: Cada filho em um array ou iterador deve ter uma *prop* "key" única. Cheque o método render de `Game`.`` Você consertará esse erro na próxima seção.
=======
You can see what your code should look like below. Note that you should see an error in the developer tools console that says: 

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>
  
You'll fix this error in the next section.
>>>>>>> 5de85198a3c575d94a395138e3f471cc7172a51c

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

À medida em que você itera sobre o array `history` dentro da função que você passou ao `map`, o argumento `squares` vai a cada elemento de `history` e o argumento `move` vai a cada índice do array: `0`, `1`, `2`, …. (Na maior parte dos casos, você precisaria dos elementos do array em si, mas para renderizar uma lista de movimento você precisará apenas dos índices).

Para cada movimento no histórico do jogo da velha, você cria um item de lista `<li>` o qual contém um botão `<button>`. O botão tem um manipulador `onClick` o qual chama a função denominada `jumpTo` (que você ainda não implementou).

Por enquanto, você deve ver uma lista de movimentos que ocorreram no jogo e um erro no console das ferramentas do desenvolvedor. Vamos discutir o que o error de "key" significa.

### Escolhendo uma key {/*picking-a-key*/}

Quando você renderiza uma lista, o React salva alguma informação sobre cada item da lista renderizado. Quando você atualiza uma lista, o React precisa determinar o que mudou. Você poderia ter adicionado, removido, reposicionado, ou atualizado os items da lista.

Imagine transicionar de

```html
<li>Alexa: 7 tarefas restantes</li>
<li>Ben: 5 tarefas restantes</li>
```

para

```html
<li>Ben: 9 tarefas restantes</li>
<li>Claudia: 8 tarefas restantes</li>
<li>Alexa: 5 tarefas restantes</li>
```

<<<<<<< HEAD
Em adição às contagens atualizadas, um humano lendo isso provavelmente diria que você trocou a ordem de Alexa e Ben e inseriu Claudia entre Alexa e Ben. Entretanto, o React é um programa de computador e não pode saber quais as suas intenções, então você precisa especificar uma propriedade *key* para cada item da lista para diferenciar cada item da lista de seus irmãos. Se seus dados vêm de uma base de dados, os IDs de Alexa, Ben e Claudia vindos da base de dados podem ser usadas como keys.
=======
In addition to the updated counts, a human reading this would probably say that you swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what you intended, so you need to specify a _key_ property for each list item to differentiate each list item from its siblings. If your data was from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.
>>>>>>> 5de85198a3c575d94a395138e3f471cc7172a51c

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tarefas restantes
</li>
```

Quando uma lista é rerrenderizada, o React usa a key de cada item da lista e procura nos itens da lista anterior por uma chave que combine. Se a lista atual possui uma key que não existia antes, o React cria um componente. Se na lista atual está faltando uma chave que existia na lista anterior, o React destrói o componente anterior. Se duas chaves são iguais, o componente correspondente é movido.

Keys dizem ao React sobre a identidade de cada componente, o que permite ao React manter o *state* entre rerrenderizações. Se a key de um componente muda, o componente será destruído e recriado com um novo *state*.

`key` é uma propriedade especial e reservada em React. Quando um elemento é criado, o React extrai a propriedade `key` e a salva diretamente no elemento retornado. Mesmo que a `key` possa parecer como se fosse passada como uma *prop*, o React automaticamente usa `key` para decidir quais componente a atualizar. Não há maneira para que um componente peça qual `key` seu pai especificou.

**É fortemente recomendado que você designe keys apropriadas sempre que estiver construindo listas dinâmicas.** Se você não tiver uma key apropriada, você pode considerar a reestruturação de seus dados para que você tenha.

Se nenhuma key é especificada, o React irá reportar um erro e usará o índice do array como key por padrão. Usar o índice do array como key é problemático ao tentar re-ordenar os items de uma lista ou inserindo/removendo items da lista. Passar explicitamente `key={i}` silencia esses erros mas tem os mesmo problemas que índices de array e não é recomendado na maioria dos casos.

Keys não precisam ser globalmente únicas; elas só precisam ser únicas entre componentes e seus filhos.

### Implementando viagem no tempo {/*implementing-time-travel*/}

No histórico do jogo da velha, cada movimento passado possui um ID único associado com ele: é o número sequencial do movimento. Movimentos nunca serão reordenados, excluídos, ou inseridos no meio, então é seguro usar o índice do movimento como key.

Na função `Game`, você pode adicionar a key como `<li key={move}>`, e se você recarregar o jogo renderizado, o erro de "key" do React deveria desaparecer:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Antes que você possa implementar `jumpTo`, você precisa que o componente `Game` acompanhe qual passo o usuário está vendo atualmente. Para fazer isso, defina uma nova variável de *state* chamada `currentMove`, definida por padrão como `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

A seguir, atualize a função `jumpTo` dentro de `Game` para atualizar o `currentMove`. Você também definirá `xIsNext` como `true` se o número para o qual você está mudando `currentMove` seja par.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Você agora irá fazer duas mudanças à função `handlePlay` de `Game`  em que é chamada quando você clica no quadrado.

- Se você "ir de volta no tempo" e então fazer um novo movimento a partir daquele ponto, você só gostará manter o histórico até aquele ponto. Em vez de adicionar `nextSquares` depois de todos os items (sintaxe espalhada `...`) em `history`, você o adicionará em `history.slice(0, currentMove + 1)` para que você esteja mantendo apenas aquela porção do histórico antigo.
- A cada vez que um movimento seja feito, você precisará atualizar `currentMove` para apontar à última entrada do histórico.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Finalmente, você irá modificar o componente `Game` para renderizar o movimento atualmente selecionado, em vez de sempre renderizar o movimento final:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Se você clicar em qualquer passo no histórico do jogo, o tabuleiro de jogo da velha deve atualizar imediatamente para mostrar como o tabuleiro se parecia depois que aquele movimento ocorreu.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Limpeza final {/*final-cleanup*/}

Se você olhar para o código bastante atenção, pode perceber que `xIsNext === true` quando `currentMove` é par e `xIsNext === false` quando `currentMove` é ímpar. Em outras palavras, se você sabe o valor de `currentMove`, então você sempre pode descobrir o que `xIsNext` deveria ser.

Não há razão para armazenar ambos em *state*. De fato, sempre tente evitar *state* redundante. A simplificação do que você armazena em *state* reduz bugs e faz do seu código mais fácil de entender. Mude `Game` para que ele não armazene mais `xIsNext` como uma variável de *state* separada e em vez disso a descubra com base em `currentMove`:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

Você não mais precisa da declaração de *state* `xIsNext` ou as chamadas de `setXIsNext`. Agora, não há chance de que `xIsNext` dessincronize com `currentMove`, mesmo se vocẽ fizer um erro enquanto programa os componentes.

### Concluindo {/*wrapping-up*/}

Parabéns! Você criou um jogo da velha que:

- Deixa que você jogue jogo da velha,
- Indica quando um jogador venceu o jogo,
- Armazena o histórico do jogo em um histórico enquanto o jogo progride,
- Permite aos jogadores revisar o histórico de um jogo e ver versões anteriores do tabuleiro do jogo.

Bom Trabalho! Nós esperamos que agora você sinta que tem um bom entendimento sobre como o React funciona.

Cheque o resultado final aqui:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Se você tem tempo extra ou quer praticar suas novas habilidades de React, aqui estão algumas ideias de melhorias que você poderia fazer ao jogo da velha, listadas em ordem de dificuldade crescente:

1. Apenas para o movimento atual, mostre "Você está no movimento #..." em vez de um botão.
1. Reescreva `Board` para que use dois loops que façam quadrados em vez de codificá-los.
1. Adicione um botão alternador que permite que você ordene os movimento em ordem ascendente ou descendente.
1. Quando alguém ganhar, sublinhe os três quadrados que causaram a vitória (e quando ninguém ganhar, exiba uma mensagem sobre o resultado ter sido um empate).
1. Exiba a localização de cada movimento no formato (linha, coluna) e mova a lista do histórico.

Ao longo desse tutorial, você entrou em contato com conceitos do React incluindo elementos, componentes, *props* e *state*. Agora que você viu como esses conceitos funcionam construindo um jogo, veja [Pensando em React](/learn/thinking-in-react) para entender como os mesmos conceitos do React funcionam ao construir a UI de um aplicativo.
