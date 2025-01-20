---
title: Preservando e Reinicializando o Estado
---

<Intro>

O estado é isolado entre os componentes. O React controla a qual estado pertence a qual componente com base em sua posição na árvore da UI. Você pode controlar quando preservar o estado e quando reiniciá-lo entre renderizações.

</Intro>

<YouWillLearn>

* Quando o React escolhe preservar ou reiniciar o estado
* Como forçar o React a reiniciar o estado do componente
* Como chaves e tipos afetam se o estado é preservado

</YouWillLearn>

## O estado está associado a uma posição na árvore de renderização {/*state-is-tied-to-a-position-in-the-tree*/}

O React constrói [árvores de renderização](learn/understanding-your-ui-as-a-tree#the-render-tree) para a estrutura do componente em sua UI.

Quando você dá um estado a um componente, pode pensar que o estado "vive" dentro do componente. Mas o estado é, na verdade, mantido dentro do React. O React associa cada parte do estado que está armazenando com o componente correto pela posição em que esse componente se encontra na árvore de renderização.

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
        Adicionar um
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

Veja como isso fica como uma árvore:    

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado como 'div' e tem dois filhos. Cada um dos filhos é rotulado como 'Counter' e ambos contêm uma bolha de estado rotulada como 'count' com valor 0.">

Árvore React

</Diagram>

</DiagramGroup>

**Esses são dois contadores separados porque cada um é renderizado em sua própria posição na árvore.** Você não costuma precisar pensar sobre essas posições ao usar o React, mas pode ser útil entender como funciona.

No React, cada componente na tela tem estado totalmente isolado. Por exemplo, se você renderizar dois componentes `Counter` lado a lado, cada um deles terá seus próprios estados `score` e `hover`, independentes.

Tente clicar em ambos os contadores e perceba que eles não afetam um ao outro:

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
        Adicionar um
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

Como você pode ver, quando um contador é atualizado, apenas o estado daquele componente é atualizado:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado como 'div' e tem dois filhos. O filho da esquerda é rotulado como 'Counter' e contém uma bolha de estado rotulada como 'count' com valor 0. O filho da direita é rotulado como 'Counter' e contém uma bolha de estado rotulada como 'count' com valor 1. A bolha de estado do filho da direita é destacada em amarelo para indicar que seu valor foi atualizado.">

Atualizando estado

</Diagram>

</DiagramGroup>


O React manterá o estado enquanto você renderizar o mesmo componente na mesma posição na árvore. Para ver isso, incremente ambos os contadores, em seguida, remova o segundo componente desmarcando a caixa "Renderizar o segundo contador" e, em seguida, adicione-o novamente marcando-a:

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
        Renderizar o segundo contador
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
        Adicionar um
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

Perceba como no momento em que você para de renderizar o segundo contador, seu estado desaparece completamente. Isso ocorre porque quando o React remove um componente, ele destrói seu estado.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado como 'div' e tem dois filhos. O filho da esquerda é rotulado como 'Counter' e contém uma bolha de estado rotulada como 'count' com valor 0. O filho da direita está ausente e em seu lugar há uma imagem amarelo 'poof', destacando o componente sendo deletado da árvore.">

Deletando um componente

</Diagram>

</DiagramGroup>

Quando você marca "Renderizar o segundo contador", um segundo `Counter` e seu estado são inicializados do zero (`score = 0`) e adicionados ao DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagrama de uma árvore de componentes React. O nó raiz é rotulado como 'div' e tem dois filhos. O filho da esquerda é rotulado como 'Counter' e contém uma bolha de estado rotulada como 'count' com valor 0. O filho da direita é rotulado como 'Counter' e contém uma bolha de estado rotulada como 'count' com valor 0. O node filho da direita inteiro é destacado em amarelo, indicando que foi adicionado recentemente à árvore.">

Adicionando um componente

</Diagram>

</DiagramGroup>

**O React preserva o estado de um componente enquanto ele é renderizado em sua posição na árvore da UI.** Se ele for removido, ou um componente diferente for renderizado na mesma posição, o React descarta seu estado.

## O mesmo componente na mesma posição preserva o estado {/*same-component-at-the-same-position-preserves-state*/}

Neste exemplo, há duas tags `<Counter />` diferentes:

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
        Usar estilo elegante
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
        Adicionar um
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

Quando você marca ou desmarca a caixa de seleção, o estado do contador não é reinicializado. Se `isFancy` for `true` ou `false`, você sempre terá um `<Counter />` como primeiro filho do componente raiz `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagrama com duas seções separadas por uma seta transitando entre elas. Cada seção contém um layout de componentes com um pai rotulado como 'App' contendo uma bolha de estado rotulada isFancy. Este componente tem um filho rotulado como 'div', que leva a uma bolha de prop contendo isFancy (destacada em roxo) passada para baixo para o único filho. O último filho é rotulado como 'Counter' e contém uma bolha de estado com rótulo 'count' e valor 3 em ambos os diagramas. Na seção esquerda do diagrama, nada está destacado e o valor do estado pai isFancy é falso. Na seção direita do diagrama, o valor do estado pai isFancy mudou para verdadeiro e está destacado em amarelo, assim como a bolha de props abaixo, que também mudou seu valor isFancy para verdadeiro.">

Atualizando o estado do `App` não reinicializa o `Counter` porque `Counter` permanece na mesma posição

</Diagram>

</DiagramGroup>


É o mesmo componente na mesma posição, então do ponto de vista do React, é o mesmo contador.

<Pitfall>

Lembre-se de que **é a posição na árvore da UI--não na marcação JSX--que importa para o React!** Este componente tem duas cláusulas `return` com diferentes tags JSX `<Counter />` dentro e fora do `if`:

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
          Usar estilo elegante
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
        Usar estilo elegante
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
        Adicionar um
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

Você pode esperar que o estado seja reinicializado ao marcar a caixa, mas não é! Isso acontece porque **ambas as tags `<Counter />` são renderizadas na mesma posição.** O React não sabe onde você coloca as condições em sua função. Tudo o que ele "vê" é a árvore que você retorna.

Em ambos os casos, o componente `App` retorna uma `<div>` com `<Counter />` como primeiro filho. Para o React, esses dois contadores têm o mesmo "endereço": o primeiro filho do primeiro filho da raiz. É assim que o React os compara entre as renderizações anterior e seguinte, independentemente de como você estrutura sua lógica.

</Pitfall>

## Componentes diferentes na mesma posição reinicializam o estado {/*different-components-at-the-same-position-reset-state*/}

Neste exemplo, ao marcar a caixa de seleção, você substituirá `<Counter>` por um `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>Até mais!</p> 
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
        Fazer uma pausa
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
        Adicionar um
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

Aqui, você alterna entre tipos de componentes _diferentes_ na mesma posição. Inicialmente, o primeiro filho da `<div>` continha um `Counter`. Mas quando você trocou por um `p`, o React removeu o `Counter` da árvore da UI e destruiu seu estado.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagrama com três seções, com uma seta transitando entre cada seção. A primeira seção contém um componente React rotulado como 'div' com um único filho rotulado 'Counter' contendo uma bolha de estado rotulada como 'count' com valor 3. A seção do meio tem o mesmo pai 'div', mas o componente filho agora foi deletado, indicado por uma imagem amarela 'poof'. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'p', destacado em amarelo.">

Quando `Counter` muda para `p`, o `Counter` é deletado e o `p` é adicionado

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagrama com três seções, com uma seta transitando entre cada seção. A primeira seção contém um componente React rotulado 'p'. A seção do meio tem o mesmo pai 'div', mas o componente filho agora foi deletado, indicado por uma imagem amarela 'poof'. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'Counter' contendo uma bolha de estado rotulada como 'count' com valor 0, destacado em amarelo.">

Quando você alterna de volta, o `p` é deletado e o `Counter` é adicionado

</Diagram>

</DiagramGroup>

Além disso, **quando você renderiza um componente diferente na mesma posição, isso reinicializa o estado de toda a sua subárvore.** Para ver como isso funciona, incremente o contador e, em seguida, marque a caixa de seleção:

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
        Usar estilo elegante
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
        Adicionar um
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

O estado do contador é reinicializado quando você clica na caixa de seleção. Embora você renderize um `Counter`, o primeiro filho da `div` muda de `div` para `section`. Quando o filho `div` foi removido do DOM, toda a árvore abaixo dele (incluindo o `Counter` e seu estado) também foi destruída.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagrama com três seções, com uma seta transitando entre cada seção. A primeira seção contém um componente React rotulado 'div' com um único filho rotulado 'section', que tem um único filho rotulado 'Counter' contendo uma bolha de estado rotulada como 'count' com valor 3. A seção do meio tem o mesmo pai 'div', mas os componentes filhos agora foram deletados, indicado por uma imagem amarela 'poof'. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'div', destacado em amarelo, também com um novo filho rotulado 'Counter' contendo uma bolha de estado rotulada como 'count' com valor 0, todos destacados em amarelo.">

Quando 'section' muda para 'div', a 'section' é deletada e o novo 'div' é adicionado

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagrama com três seções, com uma seta transitando entre cada seção. A primeira seção contém um componente React rotulado 'div' com um único filho rotulado 'div', que tem um único filho rotulado 'Counter' contendo uma bolha de estado rotulada como 'count' com valor 0. A seção do meio tem o mesmo pai 'div', mas os componentes filhos agora foram deletados, indicado por uma imagem amarela 'poof'. A terceira seção tem o mesmo pai 'div' novamente, agora com um novo filho rotulado 'section', destacado em amarelo, também com um novo filho rotulado 'Counter' contendo uma bolha de estado rotulada como 'count' com valor 0, todos destacados em amarelo.">

Quando alterna de volta, o 'div' é deletado e a nova 'section' é adicionada

</Diagram>

</DiagramGroup>

Como regra geral, **se você quiser preservar o estado entre renderizações, a estrutura da sua árvore precisa "combinar" de uma renderização para outra.** Se a estrutura for diferente, o estado é destruído porque o React destrói o estado quando remove um componente da árvore.

<Pitfall>

Esse é o motivo pelo qual você não deve aninhar definições de funções de componentes.

Aqui, a função de componente `MyTextField` é definida *dentro* de `MyComponent`:

<Sandpack>

```js
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
      }}>Clicado {counter} vezes</button>
    </>
  );
}
```

</Sandpack>


Toda vez que você clica no botão, o estado de entrada desaparece! Isso acontece porque uma *nova* função `MyTextField` é criada a cada renderização de `MyComponent`. Você está renderizando um *componente diferente* na mesma posição, então o React reinicializa todo o estado abaixo disso. Isso leva a bugs e problemas de desempenho. Para evitar esse problema, **declare sempre funções de componentes no nível superior e não aninhe suas definições.**

</Pitfall>

## Reinicializando o estado na mesma posição {/*resetting-state-at-the-same-position*/}

Por padrão, o React preserva o estado de um componente enquanto ele permanece na mesma posição. Normalmente, isso é exatamente o que você deseja, então faz sentido como o comportamento padrão. Mas às vezes, você pode querer reinicializar o estado de um componente. Considere este aplicativo que permite que dois jogadores mantenham o controle de suas pontuações durante cada turno:

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
      <h1>{person}'s score: {score}</h1>
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

Atualmente, quando você muda de jogador, a pontuação é preservada. Os dois `Counter`s aparecem na mesma posição, então o React os vê como *o mesmo* `Counter` cujo prop `person` mudou.

Mas, conceitualmente, neste aplicativo, eles deveriam ser dois contadores separados. Eles podem aparecer no mesmo lugar na UI, mas um é um contador para Taylor e outro é um contador para Sarah.

Existem duas maneiras de reinicializar o estado ao alternar entre eles:

1. Renderizar componentes em posições diferentes
2. Dar a cada componente uma identidade explícita com `key`


### Opção 1: Renderizando um componente em posições diferentes {/*option-1-rendering-a-component-in-different-positions*/}

Se você quer que esses dois `Counter`s sejam independentes, pode renderizá-los em duas posições diferentes:

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
      <h1>{person}'s score: {score}</h1>
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

* Inicialmente, `isPlayerA` é `true`. Assim, a primeira posição contém o estado do `Counter`, e a segunda está vazia.
* Quando você clica no botão "Próximo jogador", a primeira posição é limpa, mas a segunda agora contém um `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagrama com uma árvore de componentes React. O pai é rotulado 'Scoreboard' com uma bolha de estado rotulada isPlayerA com valor 'true'. O único filho, arranjado à esquerda, é rotulado como Counter com uma bolha de estado rotulada como 'count' com valor 0. Todos os filhos à esquerda estão destacados em amarelo, indicando que foram adicionados.">

Estado inicial

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagrama com uma árvore de componentes React. O pai é rotulado 'Scoreboard' com uma bolha de estado rotulada isPlayerA com valor 'false'. A bolha de estado está destacada em amarelo, indicando que mudou. O filho à esquerda é substituído por uma imagem amarela 'poof' indicando que foi deletado e há um novo filho à direita, destacado em amarelo, indicando que foi adicionado. O novo filho é rotulado como 'Counter' e contém uma bolha de estado rotulada como 'count' com valor 0.">

Clicando em "próximo"

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagrama com uma árvore de componentes React. O pai é rotulado 'Scoreboard' com uma bolha de estado rotulada isPlayerA com valor 'true'. A bolha de estado está destacada em amarelo, indicando que mudou. Existe um novo filho à esquerda, destacado em amarelo, indicando que foi adicionado. O novo filho é rotulado 'Counter' e contém uma bolha de estado rotulada como 'count' com valor 0. O filho à direita é substituído por uma imagem amarela 'poof' indicando que foi deletado.">

Clicando em "próximo" novamente

</Diagram>

</DiagramGroup>

Cada estado do `Counter` é destruído toda vez que ele é removido do DOM. Essa é a razão pela qual eles são reinicializados toda vez que você clica no botão.

Essa solução é conveniente quando você tem apenas alguns componentes independentes renderizados no mesmo lugar. Neste exemplo, você tem apenas dois, então não é um problema renderizá-los separadamente no JSX.

### Opção 2: Reinicializando o estado com uma chave {/*option-2-resetting-state-with-a-key*/}

Há também outra maneira mais genérica de reinicializar o estado de um componente.

Você pode ter visto `keys` ao [renderizar listas.](/learn/rendering-lists#keeping-list-items-in-order-with-key) As chaves não são apenas para listas! Você pode usar chaves para fazer o React distinguir entre quaisquer componentes. Por padrão, o React usa a ordem dentro do pai ("primeiro contador", "segundo contador") para discernir entre os componentes. Mas as chaves permitem que você diga ao React que este não é apenas um *primeiro* contador, ou um *segundo* contador, mas um contador específico--por exemplo, o contador *de Taylor*. Dessa forma, o React saberá qual é o contador *de Taylor* onde quer que apareça na árvore!

Neste exemplo, os dois `<Counter />` não compartilham estado, mesmo que apareçam no mesmo lugar no JSX:

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
      <h1>{person}'s score: {score}</h1>
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

Alternar entre Taylor e Sarah não preserva o estado. Isso acontece porque **você deu a eles chaves diferentes:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Especificar uma `key` diz ao React para usar a `key` em si como parte da posição, em vez de sua ordem dentro do pai. É por isso que, mesmo que você os renderize no mesmo lugar no JSX, o React os vê como dois contadores diferentes, e assim eles nunca compartilharão estado. Cada vez que um contador aparece na tela, seu estado é criado. Cada vez que é removido, seu estado é destruído. Alternar entre eles reinicializa seu estado repetidamente.

<Note>

Lembre-se de que as chaves não são globalmente únicas. Elas apenas especificam a posição *dentro do pai*.

</Note>

### Reinicializando um formulário com uma chave {/*resetting-a-form-with-a-key*/}

Reinicializar o estado com uma chave é particularmente útil quando se trata de formulários.

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
        placeholder={'Converse com ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Enviar para {contact.email}</button>
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

Tente digitar algo na entrada e, em seguida, pressione "Alice" ou "Bob" para escolher um destinatário diferente. Você notará que o estado de entrada é preservado porque o `<Chat>` é renderizado na mesma posição na árvore.

**Em muitos aplicativos, esse pode ser o comportamento desejado, mas não em um aplicativo de chat!** Você não quer que o usuário envie uma mensagem que ele já digitou para uma pessoa errada devido a um clique acidental. Para consertar isso, adicione uma `key`:

```js
<Chat key={to.id} contact={to} />
```

Isso garante que, ao selecionar um destinatário diferente, o componente `Chat` seja recriado do zero, incluindo qualquer estado na árvore abaixo dele. O React também recriará os elementos DOM em vez de reutilizá-los.

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
        placeholder={'Converse com ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Enviar para {contact.email}</button>
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

Em um aplicativo de chat real, você provavelmente vai querer recuperar o estado de entrada quando o usuário selecionar novamente o destinatário anterior. Existe uma série de maneiras de manter o estado "vivo" para um componente que não está mais visível:

- Você poderia renderizar _todos_ os chats em vez de apenas o atual, mas ocultar todos os outros com CSS. Os chats não seriam removidos da árvore, então seu estado local seria preservado. Essa solução funciona muito bem para UIs simples. Mas pode ficar muito devagar se as árvores ocultas forem grandes e conterem muitos nós DOM.
- Você poderia [elevar o estado](/learn/sharing-state-between-components) e manter a mensagem pendente para cada destinatário no componente pai. Dessa forma, quando os componentes filhos forem removidos, não importa, porque é o pai que mantém as informações importantes. Esta é a solução mais comum.
- Você também pode usar uma fonte diferente além do estado do React. Por exemplo, você pode querer que um rascunho de mensagem persista mesmo que o usuário feche acidentalmente a página. Para implementar isso, você poderia fazer o componente `Chat` inicializar seu estado lendo do [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) e salvar os rascunhos lá também.

Não importa qual estratégia você escolha, um chat _com Alice_ é conceitualmente distinto de um chat _com Bob_, então faz sentido dar uma `key` à árvore `<Chat>` com base no destinatário atual.

</DeepDive>

<Recap>

- O React mantém o estado enquanto o mesmo componente é renderizado na mesma posição.
- O estado não é mantido nas tags JSX. Está associado à posição da árvore em que você colocou esse JSX.
- Você pode forçar uma subárvore a reinicializar seu estado dando-lhe uma chave diferente.
- Não aninhe definições de componentes, ou você reinicializará o estado acidentalmente.

</Recap>



<Challenges>

#### Corrigir o desaparecimento do texto da entrada {/*fix-disappearing-input-text*/}

Este exemplo mostra uma mensagem quando você pressiona o botão. No entanto, pressionar o botão também redefine acidentalmente a entrada. Por que isso acontece? Corrija para que pressionar o botão não redefina o texto de entrada.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Dica: Sua cidade favorita?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Esconder dica</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Mostrar dica</button>
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

O problema é que o `Form` está sendo renderizado em posições diferentes. Na cláusula `if`, ele é o segundo filho da `<div>`, mas na cláusula `else`, ele é o primeiro filho. Portanto, o tipo de componente em cada posição muda. A primeira posição muda entre segurar um `p` e um `Form`, enquanto a segunda posição muda entre segurar um `Form` e um `button`. O React redefine o estado toda vez que o tipo de componente muda.

A solução mais simples é unificar as cláusulas para que `Form` seja sempre renderizado na mesma posição:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Dica: Sua cidade favorita?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Esconder dica</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Mostrar dica</button>
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


Tecnicamente, você também poderia adicionar `null` antes de `<Form />` na ramo `else` para combinar com a estrutura do ramo `if`:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Dica: Sua cidade favorita?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Esconder dica</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Mostrar dica</button>
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

Dessa forma, `Form` é sempre o segundo filho, então fica na mesma posição e mantém seu estado. Mas essa abordagem é muito menos óbvia e apresenta o risco de que alguém remoção esse `null`.

</Solution>

#### Trocar dois campos de formulário {/*swap-two-form-fields*/}

Este formulário permite que você insira primeiro e sobrenome. Ele também tem uma caixa de seleção controlando qual campo vai primeiro. Quando você marca a caixa de seleção, o campo "Sobrenome" aparecerá antes do campo "Primeiro nome".

Funciona quase, mas há um bug. Se você preencher a entrada "Primeiro nome" e marcar a caixa de seleção, o texto ficará na primeira entrada (que agora é "Sobrenome"). Corrija para que o texto da entrada *também* se mova quando você inverter a ordem.

<Dica>

Parece que, para esses campos, a posição deles dentro do pai não é suficiente. Existe alguma maneira de dizer ao React como combinar o estado entre renderizações?

</Dica>

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
      Inverter ordem
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Sobrenome" /> 
        <Field label="Primeiro nome" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="Primeiro nome" /> 
        <Field label="Sobrenome" />
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

Dê uma `key` para ambos os componentes `<Field>` em ambos os ramos `if` e `else`. Isso diz ao React como "combinar" o estado correto para cada `<Field>` mesmo que sua ordem dentro do pai mude:

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
      Inverter ordem
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Sobrenome" /> 
        <Field key="firstName" label="Primeiro nome" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="Primeiro nome" /> 
        <Field key="lastName" label="Sobrenome" />
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

#### Reinicializar um formulário de detalhes {/*reset-a-detail-form*/}

Esta é uma lista de contatos editável. Você pode editar os detalhes do contato selecionado e depois pressionar "Salvar" para atualizá-lo ou "Reinicializar" para desfazer suas alterações.

Quando você seleciona um contato diferente (por exemplo, Alice), o estado é atualizado, mas o formulário continua mostrando os detalhes do contato anterior. Corrija para que o formulário seja reinicializado quando o contato selecionado mudar.

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
        Nome:{' '}
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
        Salvar
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reinicializar
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

Dê `key={selectedId}` para o componente `EditContact`. Dessa forma, alternar entre diferentes contatos irá reinicializar o formulário:

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
        Nome:{' '}
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
        Salvar
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reinicializar
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

#### Limpar uma imagem enquanto está carregando {/*clear-an-image-while-its-loading*/}

Quando você pressiona "Próximo", o navegador começa a carregar a próxima imagem. No entanto, como ela é exibida na mesma tag `<img>`, por padrão, você ainda verá a imagem anterior até a próxima ser carregada. Isso pode ser indesejável se for importante que o texto sempre corresponda à imagem. Mude para que, no momento em que você pressionar "Próximo", a imagem anterior seja imediatamente limpa.

<Dica>

Há alguma maneira de dizer ao React para recriar o DOM em vez de reutilizá-lo?

</Dica>

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
        Próximo
      </button>
      <h3>
        Imagem {index + 1} de {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malásia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisboa, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Espanha',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Suíça',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Praga, República Checa',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Liubliana, Eslovênia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Você pode fornecer uma `key` para a tag `<img>`. Quando essa `key` muda, o React recriará o nó DOM `<img>` do zero. Isso causa um breve flash quando cada imagem carrega, então não é algo que você gostaria de fazer para cada imagem em seu aplicativo. Mas faz sentido se você quiser garantir que a imagem sempre corresponda ao texto.

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
        Próximo
      </button>
      <h3>
        Imagem {index + 1} de {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malásia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisboa, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Espanha',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Suíça',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Praga, República Checa',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Liubliana, Eslovênia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Corrigir estado deslocado na lista {/*fix-misplaced-state-in-the-list*/}

Nesta lista, cada `Contact` tem um estado que determina se "Mostrar email" foi pressionado para ele. Pressione "Mostrar email" para Alice e, em seguida, marque a caixa "Mostrar em ordem inversa". Você notará que é o email _de Taylor_ que agora está expandido, mas o de Alice--que se deslocou para a parte inferior--aparece colapsado.

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
          value={reverse}
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
        {expanded ? 'Esconder' : 'Mostrar'} email
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

Usar o ID do contato como `key` resolve o problema:

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
          value={reverse}
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
        {expanded ? 'Esconder' : 'Mostrar'} email
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

O estado está associado à posição da árvore. Uma `key` permite que você especifique uma posição nomeada em vez de depender da ordem.

</Solution>