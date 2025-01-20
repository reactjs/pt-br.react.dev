---
title: "Apresentando react.dev"
author: Dan Abramov and Rachel Nabors
date: 2023/03/16
description: Hoje estamos entusiasmados em lançar o react.dev, o novo lar do React e sua documentação. Neste post, gostaríamos de fazer um tour pelo novo site.
---

<<<<<<< HEAD
16 de março de 2023 por [Dan Abramov](https://twitter.com/dan_abramov) e [Rachel Nabors](https://twitter.com/rachelnabors)
=======
March 16, 2023 by [Dan Abramov](https://bsky.app/profile/danabra.mov) and [Rachel Nabors](https://twitter.com/rachelnabors)
>>>>>>> b22cbc3fed310b39c99fdd0f01621ac1903d1e8e

---

<Intro>

Hoje estamos muito felizes em lançar [react.dev](https://react.dev), a nova casa para o React e sua documentação. Neste post, gostaríamos de fazer um tour pelo novo site.

</Intro>

---

## tl;dr {/*tldr*/}

* O novo site do React ([react.dev](https://react.dev)) ensina o React moderno com componentes de função e Hooks.
* Incluímos diagramas, ilustrações, desafios, e mais de 600 novos exemplos interativos.
* O site anterior de documentação do React foi movido para [legacy.reactjs.org](https://pt-br.legacy.reactjs.org).

## Novo site, novo domínio, nova página inicial {/*new-site-new-domain-new-homepage*/}

Primeiro, um pouco de limpeza.

Para celebrar o lançamento da nova documentação e, mais importante ainda, para separar claramente o conteúdo antigo do novo, mudamos para o domínio mais curto [react.dev](https://react.dev). O antigo domínio [reactjs.org](https://reactjs.org) agora redirecionará para cá.

A antiga documentação do React agora está arquivada em [legacy.reactjs.org](https://pt-br.legacy.reactjs.org). Todos os links existentes para o conteúdo antigo serão redirecionados automaticamente para lá, a fim de evitar "quebrar a web", mas o site legado não receberá mais muitas atualizações.

Acredite ou não, o React vai fazer dez anos de idade em breve. Em anos de JavaScript, é como se fosse um século inteiro! Atualizamos a [página inicial do React](https://react.dev) para refletir o porquê achamos que o React é uma ótima maneira de criar interfaces de usuário atualmente e atualizamos os guias de introdução para mencionar com mais destaque os frameworks modernos baseados em React.

Se ainda não viu a nova página inicial, veja!

## Apostando tudo no React moderno com Hooks {/*going-all-in-on-modern-react-with-hooks*/}

Quando lançamos o React Hooks em 2018, os documentos do Hooks assumiram que o leitor estava familiarizado com componentes de classe. Isso ajudou a comunidade a adotar Hooks muito rapidamente, mas depois de um tempo os documentos antigos falharam em servir os novos leitores. Novos leitores tiveram que aprender React duas vezes: uma vez com componentes de classe e outra vez com Hooks.

**A nova documentação ensina React com Hooks desde o início.** A documentação está dividida em duas seções principais:

* **[Aprenda React](/learn)** é um curso individualizado que ensina React do zero.
* **[Referências de API](/reference)** fornece os detalhes e exemplos de uso para cada API React.

Vamos ver mais detalhadamente o que pode encontrar em cada seção.

<Note>

Ainda existem alguns casos raros de uso de componentes de classe que ainda não possuem um equivalente baseado em Hook. Os componentes de classe continuam a ser suportados, e estão documentados na seção [Legacy API](/reference/react/legacy) do novo site.

</Note>

## Início rápido {/*quick-start*/}

A seção Aprender começa com a página [Início Rápido](/learn). É um pequeno tour introdutório do React. Ele introduz a sintaxe para conceitos como componentes, props (propriedades) e state (estado), mas não entra em muitos detalhes sobre como usá-los.

Se você gosta de aprender fazendo, recomendamos que confira o [Tutorial: Jogo da Velha](/learn/tutorial-tic-tac-toe) a seguir. Ele o orienta na construção de um pequeno jogo com React, enquanto ensina as habilidades que você usará todos os dias. Aqui está o que você vai construir:

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

Nós também gostaríamos de destacar [Pensando em React](/learn/thinking-in-react)—esse é o tutorial que fez o React "clicar" para muitos de nós. **Atualizamos esses dois tutoriais clássicos para usar componentes de função e Hooks,** para que fiquem como novos.

<Note>

O exemplo acima é uma *sandbox*. Adicionamos muitas sandboxes—mais de 600!—em todo o site. Você pode editar qualquer sandbox, ou pressionar "Fork" no canto superior direito para abri-la em uma aba separada. As sandboxes permitem que você brinque rapidamente com as APIs do React, explore suas ideias e verifique seu entendimento.

</Note>

## Aprenda React passo a passo {/*learn-react-step-by-step*/}

Gostaríamos que todos no mundo tivessem a mesma oportunidade de aprender React de graça por conta própria.

É por isso que a seção Aprenda está organizada como um curso individualizado dividido em capítulos. Os dois primeiros capítulos descrevem os fundamentos do React. Se você é novo no React, ou quer refrescar sua memória, comece aqui:

- **[Descrevendo a IU](/learn/describing-the-ui)** ensina a exibir informações com componentes.
- **[Adicionando Interatividade](/learn/adding-interactivity)** ensina como atualizar a tela em resposta à entrada do usuário.

Os próximos dois capítulos são mais avançados e fornecerão uma compreensão mais profunda das partes mais complicadas:

- **[Gerenciando o Estado](/learn/managing-state)** ensina como organizar sua lógica à medida que seu aplicativo se torna mais complexo.
- **[Saídas de Emergência](/learn/escape-hatches)** ensina como você pode 'sair do escopo' do React e quando isso faz mais sentido.

Cada capítulo consiste em várias páginas relacionadas. A maioria dessas páginas ensina uma habilidade específica ou uma técnica—por exemplo, [Escrevendo Tags com JSX](/learn/writing-markup-with-jsx), [Atualizando Objetos no State](/learn/updating-objects-in-state), ou [Compartilhando State Entre Componentes](/learn/sharing-state-between-components). Algumas das páginas focam na explicação de uma idéia—como [Renderizar e Confirmar](/learn/render-and-commit), ou [State como uma Foto Instantânea](/learn/state-as-a-snapshot). E há alguns, como [Talvez você não precise de um Effect](/learn/you-might-not-need-an-effect), que compartilham nossas sugestões com base no que aprendemos ao longo desses anos.

Você não precisa ler esses capítulos em sequência. Quem tem tempo para isso?! Mas você pode. As páginas na seção Aprender dependem apenas dos conceitos introduzidos nas páginas anteriores. Se você quiser ler como um livro, vá em frente!

### Verifique a sua compreensão através de desafios {/*check-your-understanding-with-challenges*/}

A maioria das páginas da seção Aprender termina com alguns desafios para verificar a sua compreensão. Por exemplo, aqui estão alguns desafios da página sobre [Renderização condicional](/learn/conditional-rendering#challenges).

Você não precisa resolvê-los agora! A menos que você *realmente* queira.

<Challenges noTitle={true}>

#### Mostre um ícone para itens incompletos com `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Use o operador condicional (`cond ? a : b`) para renderizar um ❌ se `isPacked` não for `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Mostrar a importância do item com `&&` {/*show-the-item-importance-with-*/}

Neste exemplo, cada `Item` recebe uma prop `importance` numérica. Use o operador `&&` para renderizar "_(Relevância: X)_" em itálico, mas apenas para os itens que têm relevância diferente de zero. Sua lista de itens deve ficar assim:

* Traje espacial _(Relevância: 9)_
* Capacete com folha dourada
* Foto de Tam _(Relevância: 6)_

Não se esqueça de adicionar um espaço entre as duas etiquetas!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Isso deve resolver o problema:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Observe que você deve escrever `importance > 0 && ...` ao invés de `importance && ...` para que, se `importance` for `0`, `0` não seja renderizado como resultado!

Nessa solução, duas condições separadas são usadas para inserir um espaço entre o nome e a etiqueta de relevância. Alternativamente, você pode usar um fragmento com um espaço inicial: `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

</Challenges>

Observe o botão "Show Solution" no canto inferior esquerdo. É útil se você quiser verificar por si mesmo!

### Desenvolva uma intuição com diagramas e ilustrações {/*build-an-intuition-with-diagrams-and-illustrations*/}

Quando não conseguimos descobrir como explicar algo apenas com código e palavras, adicionamos diagramas que ajudam a fornecer alguma intuição. Por exemplo, aqui está um dos diagramas de [Preservando e Redefinindo State](/learn/preserving-and-resetting-state):

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagrama com três seções, com uma seta fazendo a transição entre cada seção. A primeira seção contém um componente React chamado 'div' com um único filho chamado 'section', que tem um único filho chamado 'Counter' contendo uma bolha de estado chamada 'count' com valor 3. A seção do meio tem o mesmo pai 'div', mas os componentes filhos foram excluídos, indicados por uma imagem amarela de 'prova'. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'div', destacado em amarelo, também com um novo filho rotulado 'Counter' contendo uma bolha de estado rotulada 'count' com valor 0, todos destacados em amarelo.">

Quando `section` muda para `div`, a `section` é apagada e a nova `div` é adicionada

</Diagram>

Você também verá algumas ilustrações ao longo da documentação--Aqui está uma delas [navegador pintando a tela](/learn/render-and-commit#epilogue-browser-paint):

<Illustration alt="Um navegador pintando 'natureza morta com elemento de cartão'." src="/images/docs/illustrations/i_browser-paint.png" />

Confirmamos com os desenvolvedores de navegadores que esta representação é 100% cientificamente precisa.

## Um novo e detalhado Guia de Referência da API. {/*a-new-detailed-api-reference*/}

Na [API de Referência](/reference/react), cada API React tem agora uma página dedicada. Isso inclui todos os tipos de APIs:

- Hooks incorporados como [`useState`](/reference/react/useState).
- Componentes incorporados como [`<Suspense>`](/reference/react/Suspense).
- Componentes do navegador incorporados como [`<input>`](/reference/react-dom/components/input).
- APIs orientadas para frameworks como[`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream).
- Outras APIs do React como [`memo`](/reference/react/memo).

Você perceberá que cada página de API é dividida em pelo menos dois segmentos: *Referência* e *Uso*.

[Referência](/reference/react/useState#reference) descreve a assinatura formal da API, listando seus argumentos e valores de retorno. É concisa, mas pode parecer um pouco abstrata se não estiver familiarizado com essa API. Ela descreve o que uma API faz, mas não como usá-la.

[Uso](/reference/react/useState#usage) mostra por que e como você usaria essa API na prática, como um colega ou um amigo poderia explicar. Ele mostra os **cenários canônicos de como cada API deve ser usada pela equipe do React.** Adicionamos trechos codificados por cores, exemplos de uso de diferentes APIs juntas e receitas que você pode copiar e colar:

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### Contador (número) {/*counter-number*/}

Neste exemplo, a variável state `count` armazena um número. Ao clicar no botão, ele é incrementado.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Caixa de texto (string) {/*text-field-string*/}

Neste exemplo, a variável state `text` armazena uma string. Quando você digita, `handleChange` lê o valor de entrada mais recente do elemento DOM de entrada do navegador e chama `setText` para atualizar o state. Isso permite que você exiba o `text` atual abaixo.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Caixa de seleção (boolean) {/*checkbox-boolean*/}

Neste exemplo, a variável state `liked` armazena um valor booleano. Quando você clica no input, `setLiked` atualiza a variável state `liked` com base em se a caixa de seleção do navegador está marcada. A variável `liked` é usada para renderizar o texto abaixo da caixa de seleção.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Formulário (duas variáveis) {/*form-two-variables*/}

Você pode declarar mais de uma variável state no mesmo componente. Cada variável state é completamente independente.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

Algumas páginas da API também incluem [Solução de problemas](/reference/react/useEffect#troubleshooting) (para problemas comuns) e [Alternativas](/reference/react-dom/findDOMNode#alternatives) (para APIs obsoletas).

Esperamos que esta abordagem torne a referência da API útil não só como uma forma de procurar um argumento, mas também como uma forma de ver todas as coisas diferentes que pode fazer com uma determinada API - e como esta se liga às outras.

## O que vem a seguir? {/*whats-next*/}

E assim termina nosso pequeno tour! Dê uma olhada no novo site, veja o que você gosta ou não gosta e continue enviando feedback em nosso [rastreador de problemas](https://github.com/reactjs/reactjs.org/issues).

Reconhecemos que este projeto demorou muito tempo a ser lançado. Nós queríamos manter um alto nível de qualidade que a comunidade React merece. Enquanto escrevíamos essa documentação e criávamos todos os exemplos, encontramos erros em algumas de nossas próprias explicações, bugs no React e até mesmo lacunas no design do React que agora estamos trabalhando para resolver. Esperamos que a nova documentação nos ajude a manter o próprio React em um nível mais alto no futuro.

Ouvimos muitos dos seus pedidos para expandir o conteúdo e a funcionalidade do site, por exemplo:

- Fornecimento de uma versão TypeScript para todos os exemplos;
- Criar os guias atualizados de desempenho, teste e acessibilidade;
- Documentar os componentes do React Server independentemente dos frameworks que os suportam;
- Trabalhar com nossa comunidade internacional para traduzir os novos documentos;
- Adicionar recursos ausentes ao novo site (por exemplo, RSS para este blog).

Agora que o [react.dev](https://react.dev/) foi lançado, seremos capazes de mudar nosso foco de "acompanhar" os recursos educacionais de terceiros sobre o React para adicionar novas informações e melhorar ainda mais nosso novo site.

Nós achamos que nunca houve um momento melhor para aprender React.

## Quem trabalhou nisso? {/*who-worked-on-this*/}

<<<<<<< HEAD
Na equipe do React, [Rachel Nabors](https://twitter.com/rachelnabors/) liderou o projeto (e forneceu as ilustrações), e [Dan Abramov](https://twitter.com/dan_abramov) elaborou o currículo. Eles também foram coautores da maior parte do conteúdo.
=======
On the React team, [Rachel Nabors](https://twitter.com/rachelnabors/) led the project (and provided the illustrations), and [Dan Abramov](https://bsky.app/profile/danabra.mov) designed the curriculum. They co-authored most of the content together as well.
>>>>>>> b22cbc3fed310b39c99fdd0f01621ac1903d1e8e

É claro que nenhum projeto desse porte acontece isoladamente. Temos que agradecer a muitas pessoas!

[Sylwia Vargas](https://twitter.com/SylwiaVargas) reformulou nossos exemplos para ir além de "foo/bar/baz" e gatinhos, e apresentamos cientistas, artistas e cidades de todo o mundo. [Maggie Appleton](https://twitter.com/Mappletons) transformou nossos rabiscos em um sistema de diagrama claro.

Agradecimentos a [David McCabe](https://twitter.com/mcc_abe), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), e [Matt Carroll](https://twitter.com/mattcarrollcode) por outras contribuições escritas. Também gostaríamos de agradecer a [Natalia Tepluhina](https://twitter.com/n_tepluhina) e [Sebastian Markbåge](https://twitter.com/sebmarkbage) por suas ideias e feedback.

Obrigado a [Dan Lebowitz](https://twitter.com/lebo) pelo design do site e [Razvan Gradinar](https://dribbble.com/GradinarRazvan) pelo design da sandbox.

Na frente de desenvolvimento, obrigado a [Jared Palmer](https://twitter.com/jaredpalmer) pelo desenvolvimento de protótipos. Agradecimentos a [Dane Grant](https://twitter.com/danecando) e [Dustin Goodman](https://twitter.com/dustinsgoodman) de [ThisDotLabs](https://www.thisdot.co/) por seu apoio no desenvolvimento da UI. Agradecimentos a [Ives van Hoorne](https://twitter.com/CompuIves), [Alex Moldovan](https://twitter.com/alexnmoldovan), [Jasper De Moor](https://twitter.com/JasperDeMoor), e [Danilo Woznica](https://twitter.com/danilowoz) de [CodeSandbox](https://codesandbox.io/) por seu trabalho com a integração da sandbox. Agradecimentos a [Rick Hanlon](https://twitter.com/rickhanlonii) para o trabalho de desenvolvimento e design, aprimorando nossas cores e detalhes mais finos. Agradecimentos a [Harish Kumar](https://www.strek.in/) e [Luna Ruan](https://twitter.com/lunaruan) por adicionar novos recursos ao site e ajudar a mantê-lo.

Agradecemos imensamente às pessoas que ofereceram seu tempo para participar do programa de testes alfa e beta. Seu entusiasmo e seu inestimável feedback nos ajudaram a moldar esses documentos. Um agradecimento especial à nossa beta tester, [Debbie O'Brien](https://twitter.com/debs_obrien), que deu uma palestra sobre sua experiência usando os documentos do React na React Conf 2021.

Finalmente, obrigado à comunidade React por ser a inspiração por trás deste esforço. Você é a razão de fazermos isso e esperamos que os novos documentos o ajudem a usar o React para construir qualquer interface de usuário que desejar.
