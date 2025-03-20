---
title: Enfileirando uma Série de Atualizações de Estado
---

<Intro>

Definir uma variável de estado enfileirará outra renderização. Mas às vezes você pode querer realizar várias operações no valor antes de enfileirar a próxima renderização. Para fazer isso, é útil entender como o React agrupa atualizações de estado.

</Intro>

<YouWillLearn>

* O que é "agrupamento" e como o React o usa para processar várias atualizações de estado
* Como aplicar várias atualizações à mesma variável de estado em sequência

</YouWillLearn>

## React agrupa atualizações de estado {/*react-batches-state-updates*/}

Você pode esperar que clicar no botão "+3" incremente o contador três vezes porque ele chama `setNumber(number + 1)` três vezes:

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

No entanto, como você pode se lembrar da seção anterior, [os valores de estado de cada renderização são fixos](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), então o valor de `number` dentro do manipulador de eventos da primeira renderização é sempre `0`, não importa quantas vezes você chame `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Mas há um outro fator em jogo aqui. **React espera até que *todo* o código nos manipuladores de eventos seja executado antes de processar suas atualizações de estado.** É por isso que a re-renderização só acontece *depois* de todas estas chamadas `setNumber()`.

Isso pode lembrá-lo de um garçom fazendo um pedido no restaurante. Um garçom não corre para a cozinha ao mencionar seu primeiro prato! Em vez disso, eles deixam você terminar seu pedido, permitem que você faça alterações e até mesmo recebem pedidos de outras pessoas na mesa.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Um cursor elegante em um restaurante faz um pedido várias vezes com o React, desempenhando o papel de garçom. Depois que ela chama setState() várias vezes, o garçom anota o último que ela solicitou como seu pedido final." />

Isso permite que você atualize várias variáveis de estado - mesmo de vários componentes - sem acionar muitas [re-renderizações.](/learn/render-and-commit#re-renders-when-state-updates) Mas isso também significa que a UI não será atualizada até _depois_ que o seu manipulador de eventos, e qualquer código nele, for concluído. Este comportamento, também conhecido como **agrupamento,** faz com que seu aplicativo React execute muito mais rápido. Ele também evita lidar com renderizações "semi-acabadas" confusas, onde apenas algumas das variáveis foram atualizadas.

**O React não agrupa em *vários* eventos intencionais como cliques** - cada clique é tratado separadamente. Tenha certeza de que o React só faz agrupamento quando geralmente é seguro fazê-lo. Isso garante que, por exemplo, se o primeiro clique em um botão desabilitar um formulário, o segundo clique não o enviará novamente.

## Atualizando o mesmo estado várias vezes antes da próxima renderização {/*updating-the-same-state-multiple-times-before-the-next-render*/}

É um caso de uso incomum, mas se você deseja atualizar a mesma variável de estado várias vezes antes da próxima renderização, em vez de passar o *próximo valor de estado* como `setNumber(number + 1)`, você pode passar uma *função* que calcula o próximo estado com base no anterior na fila, como `setNumber(n => n + 1)`. É uma forma de dizer ao React para "fazer algo com o valor do estado" em vez de apenas substituí-lo.

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

Aqui, `n => n + 1` é chamado de **função atualizadora.** Quando você a passa para um setter de estado:

1. React enfileira esta função para ser processada após a execução de todo o outro código no manipulador de eventos.
2. Durante a próxima renderização, o React passa pela fila e fornece o estado final atualizado.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Veja como o React funciona com estas linhas de código enquanto executa o manipulador de eventos:

1. `setNumber(n => n + 1)`: `n => n + 1` é uma função. React adiciona-a a uma fila.
1. `setNumber(n => n + 1)`: `n => n + 1` é uma função. React adiciona-a a uma fila.
1. `setNumber(n => n + 1)`: `n => n + 1` é uma função. React adiciona-a a uma fila.

Quando você chama `useState` durante a próxima renderização, o React passa pela fila. O estado `number` anterior era `0`, então é isso que o React passa para a primeira função atualizadora como o argumento `n`. Então o React pega o valor de retorno da sua função atualizadora anterior e o passa para a próxima atualizadora como `n`, e assim por diante:

| atualização enfileirada | `n` | retorna |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React armazena `3` como o resultado final e o retorna de `useState`.

É por isso que clicar em "+3" no exemplo acima incrementa corretamente o valor em 3.
### O que acontece se você atualizar o estado após substituí-lo {/*what-happens-if-you-update-state-after-replacing-it*/}

E quanto a este manipulador de eventos? O que você acha que `number` será na próxima renderização?

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
      }}>Aumente o número</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Aqui está o que este manipulador de eventos diz ao React para fazer:

1. `setNumber(number + 5)`: `number` é `0`, então `setNumber(0 + 5)`. React adiciona *"substituir por `5`"* à sua fila.
2. `setNumber(n => n + 1)`: `n => n + 1` é uma função atualizadora. React adiciona *essa função* à sua fila.

Durante a próxima renderização, o React percorre a fila de estado:

|   atualização enfileirada       | `n` | retorna |
|--------------|---------|-----|
| "substituir por `5`" | `0` (não usado) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React armazena `6` como o resultado final e o retorna de `useState`.

<Note>

Você pode ter notado que `setState(5)` realmente funciona como `setState(n => 5)`, mas `n` não é usado!

</Note>

### O que acontece se você substituir o estado após atualizá-lo {/*what-happens-if-you-replace-state-after-updating-it*/}

Vamos tentar mais um exemplo. O que você acha que `number` será na próxima renderização?

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
      }}>Aumente o número</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Veja como o React trabalha com estas linhas de código enquanto executa este manipulador de eventos:

1. `setNumber(number + 5)`: `number` é `0`, então `setNumber(0 + 5)`. React adiciona *"substituir por `5`"* à sua fila.
2. `setNumber(n => n + 1)`: `n => n + 1` é uma função atualizadora. React adiciona *essa função* à sua fila.
3. `setNumber(42)`: React adiciona *"substituir por `42`"* à sua fila.

Durante a próxima renderização, o React percorre a fila de estado:

|   atualização enfileirada       | `n` | retorna |
|--------------|---------|-----|
| "substituir por `5`" | `0` (não usado) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "substituir por `42`" | `6` (não usado) | `42` |

Então React armazena `42` como o resultado final e o retorna de `useState`.

Para resumir, aqui está como você pode pensar sobre o que você está passando para o setter de estado `setNumber`:

*   **Uma função atualizadora** (por exemplo, `n => n + 1`) é adicionada à fila.
*   **Qualquer outro valor** (por exemplo, o número `5`) adiciona "substituir por `5`" à fila, ignorando o que já está enfileirado.

Após a conclusão do manipulador de eventos, o React acionará uma nova renderização. Durante a re-renderização, o React processará a fila. As funções atualizadoras são executadas durante a renderização, portanto, **as funções atualizadoras devem ser [puras](/learn/keeping-components-pure)** e apenas *retornar* o resultado. Não tente definir o estado de dentro delas ou executar outros efeitos colaterais. No Modo Strict, o React executará cada função atualizadora duas vezes (mas descartará o segundo resultado) para ajudar você a encontrar erros.

### Convenções de nomenclatura {/*naming-conventions*/}

É comum nomear o argumento da função atualizadora pelas primeiras letras da variável de estado correspondente:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Se você preferir um código mais verboso, outra convenção comum é repetir o nome completo da variável de estado, como `setEnabled(enabled => !enabled)`, ou usar um prefixo como `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Definir o estado não altera a variável na renderização existente, mas solicita uma nova renderização.
* React processa atualizações de estado após a conclusão da execução dos manipuladores de eventos. Isso é chamado de agrupamento.
* Para atualizar algum estado várias vezes em um evento, você pode usar a função atualizadora `setNumber(n => n + 1)`.

</Recap>

<Challenges>

#### Corrigir um contador de solicitação {/*fix-a-request-counter*/}

Você está trabalhando em um aplicativo de mercado de arte que permite ao usuário enviar vários pedidos de um item de arte ao mesmo tempo. Toda vez que o usuário pressiona o botão "Comprar", o contador "Pendente" deve aumentar em um. Após três segundos, o contador "Pendente" deve diminuir e o contador "Concluído" deve aumentar.

No entanto, o contador "Pendente" não se comporta como o esperado. Quando você pressiona "Comprar", ele diminui para `-1` (o que não deveria ser possível!). E se você clicar duas vezes rapidamente, ambos os contadores parecem se comportar de forma imprevisível.

Por que isso acontece? Corrija ambos os contadores.

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
        Pendente: {pending}
      </h3>
      <h3>
        Concluído: {completed}
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

Dentro do manipulador de eventos `handleClick`, os valores de `pending` e `completed` correspondem ao que eram no momento do evento de clique. Para a primeira renderização, `pending` era `0`, então `setPending(pending - 1)` se torna `setPending(-1)`, o que está errado. Como você deseja *incrementar* ou *decrementar* os contadores, em vez de defini-los para um valor concreto determinado durante o clique, você pode, em vez disso, passar as funções atualizadoras:

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
        Pendente: {pending}
      </h3>
      <h3>
        Concluído: {completed}
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

Isso garante que, ao incrementar ou decrementar um contador, você o faz em relação ao seu estado *mais recente* em vez do que o estado era no momento do clique.

</Solution>

#### Implemente a fila de estado você mesmo {/*implement-the-state-queue-yourself*/}

Neste desafio, você reimplementará uma pequena parte do React do zero! Não é tão difícil quanto parece.

Role pela visualização do sandbox. Observe que ela mostra **quatro casos de teste.** Eles correspondem aos exemplos que você viu anteriormente nesta página. Sua tarefa é implementar a função `getFinalState` para que ela retorne o resultado correto para cada um desses casos. Se você implementá-la corretamente, os quatro testes deverão passar.

Você receberá dois argumentos: `baseState` é o estado inicial (como `0`), e a `queue` é uma matriz que contém uma mistura de números (como `5`) e funções atualizadoras (como `n => n + 1`) na ordem em que foram adicionados.

Sua tarefa é retornar o estado final, como mostram as tabelas nesta página!

<Hint>

Se você estiver com dificuldades, comece com esta estrutura de código:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Preencha as linhas ausentes!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

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
          'incorreto'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Este é o algoritmo exato descrito nesta página que o React usa para calcular o estado final:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Aplica a função atualizadora.
      finalState = update(finalState);
    } else {
      // Substitui o próximo estado.
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
          'incorreto'
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