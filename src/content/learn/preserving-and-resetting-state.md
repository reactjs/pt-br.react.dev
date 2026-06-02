---
title: Preserving and Resetting State
---

<Intro>

O estado é isolado entre componentes. O React acompanha qual estado pertence a qual componente com base em sua posição na árvore de UI. Você pode controlar quando preservar o estado e quando redefini-lo entre as re-renderizações.

</Intro>

<YouWillLearn>

* Quando o React escolhe preservar ou redefinir o estado
* Como forçar o React a redefinir o estado de um componente
* Como as chaves e os tipos afetam se o estado é preservado

</YouWillLearn>

## O estado está vinculado a uma posição na árvore de renderização {/*state-is-tied-to-a-position-in-the-tree*/}

O React constrói [árvores de renderização](learn/understanding-your-ui-as-a-tree#the-render-tree) para a estrutura de componentes em sua UI.

Quando você dá estado a um componente, pode pensar que o estado "vive" dentro do componente. Mas o estado é, na verdade, mantido dentro do React. O React associa cada pedaço de estado que está mantendo ao componente correto pela sua posição na árvore de renderização.

Aqui, há apenas uma tag JSX `<Counter />`, mas ela é renderizada em duas posições diferentes:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Veja como eles se parecem como uma árvore:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado 'div' e tem dois filhos. Cada um dos filhos é rotulado 'Counter' e ambos contêm uma bolha de estado rotulada 'count' com valor 0.">

Árvore do React

</Diagram>

</DiagramGroup>

**Estes são dois contadores separados porque cada um é renderizado em sua própria posição na árvore.** Você normalmente não precisa pensar nessas posições para usar o React, mas pode ser útil entender como funciona.

No React, cada componente na tela tem um estado totalmente isolado. Por exemplo, se você renderizar dois componentes `Counter` lado a lado, cada um deles receberá seu próprio estado `score` e `hover` independente.

Tente clicar em ambos os contadores e observe que eles não afetam um ao outro:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Como você pode ver, quando um contador é atualizado, apenas o estado desse componente é atualizado:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado 'div' e tem dois filhos. O filho esquerdo é rotulado 'Counter' e contém uma bolha de estado rotulada 'count' com valor 0. O filho direito é rotulado 'Counter' e contém uma bolha de estado rotulada 'count' com valor 1. A bolha de estado do filho direito está destacada em amarelo para indicar que seu valor foi atualizado.">

Atualizando o estado

</Diagram>

</DiagramGroup>


O React manterá o estado ativo enquanto você renderizar o mesmo componente na mesma posição na árvore. Para ver isso, incremente ambos os contadores, depois remova o segundo componente desmarcando a caixa de seleção "Renderizar o segundo contador" e, em seguida, adicione-o de volta marcando-a novamente:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Note como no momento em que você para de renderizar o segundo contador, seu estado desaparece completamente. Isso ocorre porque, quando o React remove um componente, ele destrói seu estado.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado 'div' e tem dois filhos. O filho esquerdo é rotulado 'Counter' e contém uma bolha de estado rotulada 'count' com valor 0. O filho direito está faltando e em seu lugar há uma imagem de 'poof' amarela, destacando o componente sendo excluído da árvore.">

Excluindo um componente

</Diagram>

</DiagramGroup>

Quando você marca "Renderizar o segundo contador", um segundo `Counter` e seu estado são inicializados do zero (`score = 0`) e adicionados ao DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado 'div' e tem dois filhos. O filho esquerdo é rotulado 'Counter' e contém uma bolha de estado rotulada 'count' com valor 0. O filho direito é rotulado 'Counter' e contém uma bolha de estado rotulada 'count' com valor 0. Todo o nó filho direito está destacado em amarelo, indicando que ele acabou de ser adicionado à árvore.">

Adicionando um componente

</Diagram>

</DiagramGroup>

**O React preserva o estado de um componente enquanto ele estiver sendo renderizado em sua posição na árvore de UI.** Se ele for removido, ou um componente diferente for renderizado na mesma posição, o React descarta seu estado.

## O mesmo componente na mesma posição preserva o estado {/*same-component-at-the-same-position-preserves-state*/}

Neste exemplo, existem duas tags `<Counter />` diferentes:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Quando você marca ou desmarca a caixa de seleção, o estado do contador não é redefinido. Se `isFancy` for `true` ou `false`, você sempre terá um `<Counter />` como o primeiro filho do `div` retornado do componente raiz `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagrama com duas seções separadas por uma seta fazendo a transição entre elas. Cada seção contém um layout de componentes com um pai rotulado 'App' contendo uma bolha de estado rotulada isFancy. Este componente tem um filho rotulado 'div', que leva a uma bolha de props contendo isFancy (destacada em roxo) passada para o único filho. O último filho é rotulado 'Counter' e contém uma bolha de estado com o rótulo 'count' e valor 3 em ambos os diagramas. Na seção esquerda do diagrama, nada está destacado e o valor do estado pai isFancy é falso. Na seção direita do diagrama, o valor do estado pai isFancy mudou para true e ele está destacado em amarelo, assim como a bolha de props abaixo, que também mudou seu valor isFancy para true.">

Atualizar o estado do `App` não redefine o `Counter` porque o `Counter` permanece na mesma posição

</Diagram>

</DiagramGroup>


É o mesmo componente na mesma posição, então, da perspectiva do React, é o mesmo contador.

<Pitfall>

Lembre-se de que **é a posição na árvore de UI — não no markup JSX — que importa para o React!** Este componente tem duas cláusulas `return` com tags JSX `<Counter />` diferentes dentro e fora do `if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Você pode esperar que o estado seja redefinido ao marcar a caixa de seleção, mas não é! Isso ocorre porque **ambas essas tags `<Counter />` são renderizadas na mesma posição.** O React não sabe onde você coloca as condições em sua função. Tudo o que ele "vê" é a árvore que você retorna.

Em ambos os casos, o componente `App` retorna um `<div>` com `<Counter />` como primeiro filho. Para o React, esses dois contadores têm o mesmo "endereço": o primeiro filho do primeiro filho da raiz. É assim que o React os associa entre a renderização anterior e a próxima, independentemente de como você estrutura sua lógica.

</Pitfall>

## Componentes diferentes na mesma posição redefinem o estado {/*different-components-at-the-same-position-reset-state*/}

Neste exemplo, marcar a caixa de seleção substituirá `<Counter>` por um `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Aqui, você alterna entre tipos de componentes _diferentes_ na mesma posição. Inicialmente, o primeiro filho do `<div>` continha um `Counter`. Mas quando você trocou por um `p`, o React removeu o `Counter` da árvore de UI e destruiu seu estado.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagrama com três seções, com uma seta fazendo a transição entre cada seção. A primeira seção contém um componente React rotulado 'div' com um único filho rotulado 'Counter' contendo uma bolha de estado rotulada 'count' com valor 3. A seção do meio tem o mesmo pai 'div', mas o componente filho foi excluído, indicado por uma imagem 'poof' amarela. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'p', destacado em amarelo.">

Quando `Counter` muda para `p`, o `Counter` é excluído e o `p` é adicionado

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagrama com três seções, com uma seta fazendo a transição entre cada seção. A primeira seção contém um componente React rotulado 'p'. A seção do meio tem o mesmo pai 'div', mas o componente filho foi excluído, indicado por uma imagem 'poof' amarela. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'Counter' contendo uma bolha de estado rotulada 'count' com valor 0, destacado em amarelo.">

Ao alternar de volta, o `p` é excluído e o `Counter` é adicionado

</Diagram>

</DiagramGroup>

Além disso, **quando você renderiza um componente diferente na mesma posição, ele redefine o estado de toda a sua subárvore.** Para ver como isso funciona, incremente o contador e depois marque a caixa de seleção:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} />
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

O estado do contador é redefinido quando você clica na caixa de seleção. Embora você renderize um `Counter`, o primeiro filho do `div` muda de uma `section` para um `div`. Quando o `section` filho foi removido do DOM, toda a árvore abaixo dele (incluindo o `Counter` e seu estado) também foi destruída.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagrama com três seções, com uma seta fazendo a transição entre cada seção. A primeira seção contém um componente React rotulado 'div' com um único filho rotulado 'section', que tem um único filho rotulado 'Counter' contendo uma bolha de estado rotulada 'count' com valor 3. A seção do meio tem o mesmo pai 'div', mas os componentes filhos foram excluídos, indicado por uma imagem 'poof' amarela. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'div', destacado em amarelo, também com um novo filho rotulado 'Counter' contendo uma bolha de estado rotulada 'count' com valor 0, todos destacados em amarelo.">

Quando `section` muda para `div`, o `section` é excluído e o novo `div` é adicionado

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagrama com três seções, com uma seta fazendo a transição entre cada seção. A primeira seção contém um componente React rotulado 'div' com um único filho rotulado 'div', que tem um único filho rotulado 'Counter' contendo uma bolha de estado rotulada 'count' com valor 0. A seção do meio tem o mesmo pai 'div', mas os componentes filhos foram excluídos, indicado por uma imagem 'poof' amarela. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'section', destacado em amarelo, também com um novo filho rotulado 'Counter' contendo uma bolha de estado rotulada 'count' com valor 0, todos destacados em amarelo.">

Ao alternar de volta, o `div` é excluído e o novo `section` é adicionado

</Diagram>

</DiagramGroup>

Como regra geral, **se você quiser preservar o estado entre as re-renderizações, a estrutura da sua árvore precisa "corresponder"** de uma renderização para outra. Se a estrutura for diferente, o estado é destruído porque o React destrói o estado quando remove um componente da árvore.

<Pitfall>

É por isso que você não deve aninhar definições de funções de componentes.

Aqui, a função do componente `MyTextField` é definida *dentro* de `MyComponent`:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}}
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


Toda vez que você clica no botão, o estado do input desaparece! Isso ocorre porque uma função `MyTextField` *diferente* é criada para cada renderização de `MyComponent`. Você está renderizando um componente *diferente* na mesma posição, então o React redefine todo o estado abaixo. Isso leva a bugs e problemas de desempenho. Para evitar esse problema, **sempre declare funções de componentes no nível superior e não aninhe suas definições.**

</Pitfall>

## Resetando o estado na mesma posição {/*resetting-state-at-the-same-position*/}

Por padrão, o React preserva o estado de um componente enquanto ele permanece na mesma posição. Geralmente, é exatamente isso que você deseja, então faz sentido como comportamento padrão. Mas, às vezes, você pode querer resetar o estado de um componente. Considere este aplicativo que permite que dois jogadores acompanhem suas pontuações em cada turno:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Próximo jogador!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Pontuação de {person}: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Adicionar um
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Atualmente, ao trocar de jogador, a pontuação é preservada. Os dois `Counter`s aparecem na mesma posição, então o React os considera o *mesmo* `Counter` cuja prop `person` foi alterada.

Mas conceitualmente, neste aplicativo, eles deveriam ser dois contadores separados. Eles podem aparecer no mesmo lugar na UI, mas um é um contador para Taylor e outro é para Sarah.

Existem duas maneiras de resetar o estado ao alternar entre eles:

1. Renderizar componentes em posições diferentes
2. Dar a cada componente uma identidade explícita com `key`


### Opção 1: Renderizando um componente em posições diferentes {/*option-1-rendering-a-component-in-different-positions*/}

Se você deseja que esses dois `Counter`s sejam independentes, pode renderizá-los em duas posições diferentes:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Próximo jogador!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Pontuação de {person}: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Adicionar um
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Inicialmente, `isPlayerA` é `true`. Portanto, a primeira posição contém o estado do `Counter`, e a segunda está vazia.
* Ao clicar no botão "Próximo jogador", a primeira posição é limpa, mas a segunda agora contém um `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagrama com uma árvore de componentes React. O pai é rotulado 'Scoreboard' com uma bolha de estado rotulada isPlayerA com o valor 'true'. O único filho, organizado à esquerda, é rotulado Counter com uma bolha de estado rotulada 'count' e valor 0. Todo o filho esquerdo está destacado em amarelo, indicando que foi adicionado.">

Estado inicial

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagrama com uma árvore de componentes React. O pai é rotulado 'Scoreboard' com uma bolha de estado rotulada isPlayerA com o valor 'false'. A bolha de estado está destacada em amarelo, indicando que foi alterada. O filho esquerdo é substituído por uma imagem de 'poof' amarela indicando que foi excluído e há um novo filho à direita, destacado em amarelo indicando que foi adicionado. O novo filho é rotulado 'Counter' e contém uma bolha de estado rotulada 'count' com valor 0.">

Clicando em "próximo"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagrama com uma árvore de componentes React. O pai é rotulado 'Scoreboard' com uma bolha de estado rotulada isPlayerA com o valor 'true'. A bolha de estado está destacada em amarelo, indicando que foi alterada. Há um novo filho à esquerda, destacado em amarelo indicando que foi adicionado. O novo filho é rotulado 'Counter' e contém uma bolha de estado rotulada 'count' com valor 0. O filho direito é substituído por uma imagem de 'poof' amarela indicando que foi excluído.">

Clicando em "próximo" novamente

</Diagram>

</DiagramGroup>

O estado de cada `Counter` é destruído toda vez que ele é removido do DOM. É por isso que eles resetam toda vez que você clica no botão.

Esta solução é conveniente quando você tem apenas alguns componentes independentes renderizados no mesmo local. Neste exemplo, você tem apenas dois, então não é um incômodo renderizá-los separadamente no JSX.

### Opção 2: Resetando o estado com uma chave {/*option-2-resetting-state-with-a-key*/}

Há também outra maneira, mais genérica, de resetar o estado de um componente.

Você pode ter visto `key`s ao [renderizar listas.](/learn/rendering-lists#keeping-list-items-in-order-with-key) As chaves não servem apenas para listas! Você pode usar chaves para fazer o React distinguir entre quaisquer componentes. Por padrão, o React usa a ordem dentro do pai ("primeiro contador", "segundo contador") para discernir entre componentes. Mas as chaves permitem que você diga ao React que este não é apenas um *primeiro* contador, ou um *segundo* contador, mas um contador específico - por exemplo, o contador *de Taylor*. Dessa forma, o React saberá o contador *de Taylor* onde quer que ele apareça na árvore!

Neste exemplo, os dois `<Counter />`s não compartilham estado, mesmo que apareçam no mesmo lugar no JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Próximo jogador!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Pontuação de {person}: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Adicionar um
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Alternar entre Taylor e Sarah não preserva o estado. Isso ocorre porque **você deu a eles `key`s diferentes**:

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Especificar uma `key` diz ao React para usar a própria `key` como parte da posição, em vez de sua ordem dentro do pai. É por isso que, mesmo que você os renderize no mesmo lugar no JSX, o React os vê como dois contadores diferentes, e assim eles nunca compartilharão estado. Toda vez que um contador aparece na tela, seu estado é criado. Toda vez que ele é removido, seu estado é destruído. Alternar entre eles reseta seus estados repetidamente.

<Note>

Lembre-se que as chaves não são globalmente únicas. Elas apenas especificam a posição *dentro do pai*.

</Note>

### Resetando um formulário com uma chave {/*resetting-a-form-with-a-key*/}

Resetar o estado com uma chave é particularmente útil ao lidar com formulários.

Neste aplicativo de chat, o componente `<Chat>` contém o estado da entrada de texto:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Tente digitar algo na entrada e, em seguida, pressione "Alice" ou "Bob" para escolher um destinatário diferente. Você notará que o estado da entrada é preservado porque o `<Chat>` é renderizado na mesma posição na árvore.

**Em muitos aplicativos, este pode ser o comportamento desejado, mas não em um aplicativo de chat!** Você não quer permitir que o usuário envie uma mensagem que já digitou para a pessoa errada devido a um clique acidental. Para corrigir isso, adicione uma `key`:

```js
<Chat key={to.id} contact={to} />
```

Isso garante que, ao selecionar um destinatário diferente, o componente `<Chat>` será recriado do zero, incluindo qualquer estado na árvore abaixo dele. O React também recriará os elementos DOM em vez de reutilizá-los.

Agora, alternar o destinatário sempre limpa o campo de texto:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### Preservando o estado para componentes removidos {/*preserving-state-for-removed-components*/}

Em um aplicativo de chat real, você provavelmente gostaria de recuperar o estado da entrada quando o usuário selecionar o destinatário anterior novamente. Existem algumas maneiras de manter o estado "vivo" para um componente que não está mais visível:

- Você poderia renderizar _todos_ os chats em vez de apenas o atual, mas ocultar todos os outros com CSS. Os chats não seriam removidos da árvore, então seu estado local seria preservado. Essa solução funciona bem para interfaces de usuário simples. Mas pode ficar muito lento se as árvores ocultas forem grandes e contiverem muitos nós DOM.
- Você poderia [elevar o estado](/learn/sharing-state-between-components) e manter a mensagem pendente para cada destinatário no componente pai. Dessa forma, quando os componentes filhos forem removidos, não importa, pois é o pai que mantém as informações importantes. Esta é a solução mais comum.
- Você também pode usar uma fonte diferente além do estado do React. Por exemplo, você provavelmente quer que um rascunho de mensagem persista mesmo que o usuário feche acidentalmente a página. Para implementar isso, você pode fazer o componente `Chat` inicializar seu estado lendo do [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), e salvar os rascunhos lá também.

Não importa qual estratégia você escolha, um chat _com Alice_ é conceitualmente distinto de um chat _com Bob_, então faz sentido dar uma `key` à árvore `<Chat>` com base no destinatário atual.

</DeepDive>

<Recap>

- O React mantém o estado enquanto o mesmo componente for renderizado na mesma posição.
- O estado não é mantido em tags JSX. Ele está associado à posição da árvore onde você colocou esse JSX.
- Você pode forçar uma subárvore a redefinir seu estado dando a ela uma chave diferente.
- Não aninhe definições de componentes, ou você redefinirá o estado acidentalmente.

</Recap>



<Challenges>

#### Corrigir o texto de entrada desaparecendo {/*fix-disappearing-input-text*/}

Este exemplo mostra uma mensagem quando você pressiona o botão. No entanto, pressionar o botão também redefine acidentalmente a entrada. Por que isso acontece? Corrija para que pressionar o botão não redefina o texto da entrada.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

O problema é que `Form` é renderizado em posições diferentes. No ramo `if`, ele é o segundo filho do `<div>`, mas no ramo `else`, ele é o primeiro filho. Portanto, o tipo do componente em cada posição muda. A primeira posição muda entre conter um `p` e um `Form`, enquanto a segunda posição muda entre conter um `Form` e um `button`. O React redefine o estado toda vez que o tipo do componente muda.

A solução mais fácil é unificar os ramos para que `Form` sempre seja renderizado na mesma posição:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Tecnicamente, você também poderia adicionar `null` antes de `<Form />` no ramo `else` para corresponder à estrutura do ramo `if`:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

Dessa forma, `Form` é sempre o segundo filho, então ele permanece na mesma posição e mantém seu estado. Mas essa abordagem é muito menos óbvia e introduz o risco de alguém remover esse `null`.

</Solution>

#### Trocar dois campos de formulário {/*swap-two-form-fields*/}

Este formulário permite que você insira o primeiro e o último nome. Ele também tem uma caixa de seleção que controla qual campo vai primeiro. Quando você marca a caixa de seleção, o campo "Last name" aparecerá antes do campo "First name".

Quase funciona, mas há um bug. Se você preencher o campo "First name" e marcar a caixa, o texto permanecerá no primeiro campo (que agora é "Last name"). Corrija para que o texto da entrada também se mova ao reverter a ordem.

<Hint>

Parece que para esses campos, sua posição dentro do pai não é suficiente. Existe alguma maneira de dizer ao React como associar o estado entre as renderizações?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" />
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" />
        <Field label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Dê uma `key` a ambos os componentes `<Field>` em ambos os ramos `if` e `else`. Isso diz ao React como "associar" o estado correto para qualquer `<Field>`, mesmo que sua ordem dentro do pai mude:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" />
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" />
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Redefinir um formulário de detalhes {/*reset-a-detail-form*/}

Esta é uma lista de contatos editável. Você pode editar os detalhes do contato selecionado e, em seguida, pressionar "Save" para atualizá-lo ou "Reset" para desfazer suas alterações.

Quando você seleciona um contato diferente (por exemplo, Alice), o estado é atualizado, mas o formulário continua mostrando os detalhes do contato anterior. Corrija para que o formulário seja redefinido quando o contato selecionado mudar.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Dê `key={selectedId}` ao componente `EditContact`. Dessa forma, alternar entre diferentes contatos redefinirá o formulário:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Limpar uma imagem enquanto ela está carregando {/*clear-an-image-while-its-loading*/}

Quando você pressiona "Next", o navegador começa a carregar a próxima imagem. No entanto, como ela é exibida na mesma tag `<img>`, por padrão você ainda veria a imagem anterior até que a próxima carregasse. Isso pode ser indesejável se for importante que o texto sempre corresponda à imagem. Altere para que, no momento em que você pressionar "Next", a imagem anterior seja limpa imediatamente.

<Hint>

Existe uma maneira de dizer ao React para recriar o DOM em vez de reutilizá-lo?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Você pode fornecer uma `key` à tag `<img>`. Quando essa `key` mudar, o React recriará o nó DOM `<img>` do zero. Isso causa um breve flash quando cada imagem carrega, então não é algo que você queira fazer para cada imagem em seu aplicativo. Mas faz sentido se você quiser garantir que a imagem sempre corresponda ao texto.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Corrigir estado mal posicionado na lista {/*fix-misplaced-state-in-the-list*/}

Nesta lista, cada `Contact` tem um estado que determina se "Mostrar e-mail" foi pressionado para ele. Pressione "Mostrar e-mail" para Alice e, em seguida, marque a caixa de seleção "Mostrar em ordem inversa". Você notará que é o e-mail de _Taylor_ que está expandido agora, mas o de Alice - que se moveu para o final - aparece recolhido.

Corrija para que o estado expandido seja associado a cada contato, independentemente da ordem escolhida.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Mostrar em ordem inversa
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Esconder' : 'Mostrar'} e-mail
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

O problema é que este exemplo estava usando o índice como `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

No entanto, você quer que o estado seja associado a _cada contato específico_.

Usar o ID do contato como `key` em vez disso corrige o problema:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Mostrar em ordem inversa
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Esconder' : 'Mostrar'} e-mail
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

O estado é associado à posição na árvore. Uma `key` permite que você especifique uma posição nomeada em vez de depender da ordem.

</Solution>

</Challenges>