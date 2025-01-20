---
title: Enfileirando uma Série de Atualizações de Estado
---

<Intro>

Definir uma variável de estado enfileirará outra renderização. Mas às vezes você pode querer executar várias operações no valor antes de enfileirar a próxima renderização. Para fazer isso, é útil entender como o React agrupa atualizações de estado.

</Intro>

<YouWillLearn>

* O que é "agrupamento" e como o React o utiliza para processar várias atualizações de estado
* Como aplicar várias atualizações à mesma variável de estado em sequência

</YouWillLearn>

## O React agrupa atualizações de estado {/*react-batches-state-updates*/}

Você pode esperar que clicar no botão "+3" incremente o contador três vezes porque chama `setNumber(number + 1)` três vezes:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

No entanto, como você pode se recordar da seção anterior, [os valores de estado de cada renderização são fixos](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), então o valor de `number` dentro do manipulador de eventos da primeira renderização é sempre `0`, não importa quantas vezes você chame `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Mas há um outro fator em jogo aqui. **O React aguarda até que *todo* o código nos manipuladores de eventos tenha sido executado antes de processar suas atualizações de estado.** É por isso que a re-renderização acontece *apenas* após todas essas chamadas de `setNumber()`.

Isso pode lembrá-lo de um garçom anotando um pedido no restaurante. Um garçom não corre para a cozinha ao mencionar seu primeiro prato! Em vez disso, ele deixa você terminar seu pedido, permite que você faça alterações e até aceita pedidos de outras pessoas da mesa.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Um cursor elegante em um restaurante faz múltiplos pedidos com o React, interpretando o garçom. Depois que ela chama setState() várias vezes, o garçom anota o último que ela pediu como seu pedido final." />

Isso permite que você atualize várias variáveis de estado -- mesmo de múltiplos componentes -- sem acionar muitas [re-renderizações](/learn/render-and-commit#re-renders-when-state-updates). Mas isso também significa que a UI não será atualizada até _depois_ que seu manipulador de eventos, e qualquer código nele, for concluído. Esse comportamento, também conhecido como **agrupamento,** faz com que seu aplicativo React funcione muito mais rápido. Também evita lidar com "renders inacabadas" confusas, onde apenas algumas das variáveis foram atualizadas.

**O React não agrupa em *múltiplos* eventos intencionais como cliques** -- cada clique é tratado separadamente. Fique tranquilo que o React apenas faz agrupamento quando é geralmente seguro fazê-lo. Isso garante que, por exemplo, se o primeiro clique no botão desabilitar um formulário, o segundo clique não o enviará novamente.

## Atualizando o mesmo estado várias vezes antes da próxima renderização {/*updating-the-same-state-multiple-times-before-the-next-render*/}

É um uso incomum, mas se você quiser atualizar a mesma variável de estado várias vezes antes da próxima renderização, em vez de passar o *próximo valor de estado* como `setNumber(number + 1)`, você pode passar uma *função* que calcula o próximo estado com base no anterior na fila, como `setNumber(n => n + 1)`. É uma maneira de dizer ao React para "fazer algo com o valor do estado" em vez de apenas substituí-lo.

Tente incrementar o contador agora:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Aqui, `n => n + 1` é chamada de **função atualizadora.** Quando você a passa para um setter de estado:

1. O React coloca essa função na fila para ser processada após todo o outro código no manipulador de eventos ter sido executado.
2. Durante a próxima renderização, o React percorre a fila e fornece o estado final atualizado.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Veja como o React trabalha através dessas linhas de código enquanto executa o manipulador de eventos:

1. `setNumber(n => n + 1)`: `n => n + 1` é uma função. O React a adiciona a uma fila.
1. `setNumber(n => n + 1)`: `n => n + 1` é uma função. O React a adiciona a uma fila.
1. `setNumber(n => n + 1)`: `n => n + 1` é uma função. O React a adiciona a uma fila.

Quando você chama `useState` durante a próxima renderização, o React percorre a fila. O estado anterior de `number` era `0`, então é isso que o React passa para a primeira função atualizadora como argumento `n`. Então o React pega o valor retornado da sua função atualizadora anterior e o passa para a próxima atualizadora como `n`, e assim por diante:

|  atualização enfileirada | `n` | retorna |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

O React armazena `3` como o resultado final e o retorna de `useState`.

É por isso que clicar em "+3" no exemplo acima corretamente incrementa o valor em 3.
### O que acontece se você atualizar o estado após substituí-lo {/*what-happens-if-you-update-state-after-replacing-it*/}

E quanto a este manipulador de eventos? O que você acha que será `number` na próxima renderização?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Aumentar o número</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Aqui está o que esse manipulador de eventos diz ao React para fazer:

1. `setNumber(number + 5)`: `number` é `0`, então `setNumber(0 + 5)`. O React adiciona *"substituir por `5`"* à sua fila.
2. `setNumber(n => n + 1)`: `n => n + 1` é uma função atualizadora. O React adiciona *essa função* à sua fila.

Durante a próxima renderização, o React percorre a fila de estado:

|   atualização enfileirada       | `n` | retorna |
|--------------|---------|-----|
| "substituir por `5`" | `0` (não utilizado) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

O React armazena `6` como o resultado final e o retorna de `useState`. 

<Note>

Você pode ter notado que `setState(5)` funciona na verdade como `setState(n => 5)`, mas `n` não é utilizado!

</Note>

### O que acontece se você substituir o estado após atualizá-lo {/*what-happens-if-you-replace-state-after-updating-it*/}

Vamos tentar mais um exemplo. O que você acha que será `number` na próxima renderização?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Aumentar o número</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Veja como o React trabalha através dessas linhas de código enquanto executa este manipulador de eventos:

1. `setNumber(number + 5)`: `number` é `0`, então `setNumber(0 + 5)`. O React adiciona *"substituir por `5`"* à sua fila.
2. `setNumber(n => n + 1)`: `n => n + 1` é uma função atualizadora. O React adiciona *essa função* à sua fila.
3. `setNumber(42)`: O React acrescenta *"substituir por `42`"* à sua fila.

Durante a próxima renderização, o React percorre a fila de estado:

|   atualização enfileirada       | `n` | retorna |
|--------------|---------|-----|
| "substituir por `5`" | `0` (não utilizado) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "substituir por `42`" | `6` (não utilizado) | `42` |

Então o React armazena `42` como o resultado final e o retorna de `useState`.

Para resumir, aqui está como você pode pensar sobre o que está passando para o setter de estado `setNumber`:

* **Uma função atualizadora** (por exemplo, `n => n + 1`) é adicionada à fila.
* **Qualquer outro valor** (por exemplo, o número `5`) adiciona "substituir por `5`" à fila, ignorando o que já está enfileirado.

Depois que o manipulador de eventos é concluído, o React acionará uma nova renderização. Durante a nova renderização, o React processará a fila. Funções atualizadoras são executadas durante a renderização, então **as funções atualizadoras devem ser [puramente](/learn/keeping-components-pure)** e apenas *retornar* o resultado. Não tente definir o estado de dentro delas ou executar outros efeitos colaterais. No Modo Estrito, o React executará cada função atualizadora duas vezes (mas descartará o segundo resultado) para ajudar a encontrar erros.

### Convenções de nomenclatura {/*naming-conventions*/}

É comum nomear o argumento da função atualizadora com as primeiras letras da variável de estado correspondente:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Se você preferir um código mais verboso, outra convenção comum é repetir o nome completo da variável de estado, como `setEnabled(enabled => !enabled)`, ou usar um prefixo como `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Definir o estado não altera a variável na renderização existente, mas solicita uma nova renderização.
* O React processa atualizações de estado após a conclusão da execução dos manipuladores de eventos. Isso é chamado de agrupamento.
* Para atualizar algum estado várias vezes em um evento, você pode usar a função atualizadora `setNumber(n => n + 1)`.

</Recap>

<Challenges>

#### Corrija um contador de solicitações {/*fix-a-request-counter*/}

Você está trabalhando em um aplicativo de mercado de arte que permite ao usuário enviar várias ordens para um item de arte ao mesmo tempo. Cada vez que o usuário pressiona o botão "Comprar", o contador "Pendentes" deve aumentar em um. Depois de três segundos, o contador "Pendentes" deve diminuir, e o contador "Concluídos" deve aumentar.

No entanto, o contador "Pendentes" não se comporta como pretendido. Quando você pressiona "Comprar", ele diminui para `-1` (o que não deveria ser possível!). E se você clicar rapidamente duas vezes, ambos os contadores parecem se comportar de forma imprevisível.

Por que isso acontece? Conserte ambos os contadores.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pendentes: {pending}
      </h3>
      <h3>
        Concluídos: {completed}
      </h3>
      <button onClick={handleClick}>
        Comprar     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Dentro do manipulador de eventos `handleClick`, os valores de `pending` e `completed` correspondem ao que eram no momento do evento de clique. Para a primeira renderização, `pending` era `0`, então `setPending(pending - 1)` se torna `setPending(-1)`, o que está errado. Uma vez que você quer *incrementar* ou *decrementar* os contadores, em vez de defini-los a um valor concreto determinado durante o clique, você pode passar as funções atualizadoras:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pendentes: {pending}
      </h3>
      <h3>
        Concluídos: {completed}
      </h3>
      <button onClick={handleClick}>
        Comprar     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Isso garante que quando você incrementar ou decrementar um contador, você o faz em relação ao seu *último* estado, em vez de ao estado que era no momento do clique.

</Solution>

#### Implemente a fila de estado você mesmo {/*implement-the-state-queue-yourself*/}

Neste desafio, você irá reimplementar uma pequena parte do React do zero! Não é tão difícil quanto parece.

Role para baixo na pré-visualização do sandbox. Note que ele mostra **quatro casos de teste.** Eles correspondem aos exemplos que você viu anteriormente nesta página. Sua tarefa é implementar a função `getFinalState` para que ela retorne o resultado correto para cada um desses casos. Se você implementá-la corretamente, todos os quatro testes deverão passar.

Você receberá dois argumentos: `baseState` é o estado inicial (como `0`), e a `queue` é um array que contém uma mistura de números (como `5`) e funções atualizadoras (como `n => n + 1`) na ordem em que foram adicionadas.

Sua tarefa é retornar o estado final, exatamente como as tabelas nesta página mostram!

<Hint>

Se você estiver se sentindo preso, comece com esta estrutura de código:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: aplique a função atualizadora
    } else {
      // TODO: substitua o estado
    }
  }

  return finalState;
}
```

Preencha as linhas faltantes!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: faça algo com a fila...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Estado base: <b>{baseState}</b></p>
      <p>Fila: <b>[{queue.join(', ')}]</b></p>
      <p>Resultado esperado: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Seu resultado: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correto' :
          'errado'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Este é o exato algoritmo descrito nesta página que o React usa para calcular o estado final:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Aplique a função atualizadora.
      finalState = update(finalState);
    } else {
      // Substitua o próximo estado.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Estado base: <b>{baseState}</b></p>
      <p>Fila: <b>[{queue.join(', ')}]</b></p>
      <p>Resultado esperado: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Seu resultado: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correto' :
          'errado'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Agora você sabe como esta parte do React funciona!

</Solution>

</Challenges>