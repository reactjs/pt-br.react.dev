---
title: useActionState
---

<Intro>

`useActionState` é um Hook do React que permite que você atualize o estado com efeitos colaterais usando [Ações](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useActionState(reducerAction, initialState, permalink?)` {/*useactionstate*/}

Chame `useActionState` no nível superior do seu componente para criar um estado para o resultado de uma Ação.

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `reducerAction`: A função a ser chamada quando a Ação é acionada. Quando chamada, ela recebe o estado anterior (inicialmente o `initialState` que você forneceu, depois seu valor de retorno anterior) como seu primeiro argumento, seguido pelo `actionPayload` passado para `dispatchAction`.
* `initialState`: O valor que você deseja que o estado seja inicialmente. O React ignora este argumento após `dispatchAction` ser invocado pela primeira vez.
* **opcional** `permalink`: Uma string contendo a URL exclusiva da página que este formulário modifica.
  * Para uso em páginas com [Componentes de Servidor React](/reference/rsc/server-components) com aprimoramento progressivo.
  * Se `reducerAction` é uma [Função de Servidor](/reference/rsc/server-functions) e o formulário é enviado antes do carregamento do bundle JavaScript, o navegador navegará para a URL de permalink especificada, em vez da URL da página atual.

#### Retornos {/*returns*/}

`useActionState` retorna um array com exatamente três valores:

1. O estado atual. Durante a primeira renderização, ele corresponderá ao `initialState` que você passou. Depois que `dispatchAction` for invocado, ele corresponderá ao valor retornado pela `reducerAction`.
2. Uma função `dispatchAction` que você chama dentro de [Ações](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
3. A flag `isPending` que informa se alguma Ação despachada para este Hook está pendente.

#### Ressalvas {/*caveats*/}

* `useActionState` é um Hook, portanto você só pode chamá-lo **no nível superior do seu componente** ou de seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se precisar disso, extraia um novo componente e mova o estado para ele.
* O React enfileira e executa múltiplas chamadas para `dispatchAction` sequencialmente. Cada chamada para `reducerAction` recebe o resultado da chamada anterior.
* A função `dispatchAction` tem uma identidade estável, então você frequentemente a verá omitida das dependências de Efeitos, mas incluí-la não fará o Efeito disparar. Se o linter permitir omitir uma dependência sem erros, é seguro fazê-lo. [Saiba mais sobre remoção de dependências de Efeitos.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* Ao usar a opção `permalink`, garanta que o mesmo componente de formulário seja renderizado na página de destino (incluindo a mesma `reducerAction` e `permalink`) para que o React saiba como passar o estado. Assim que a página se tornar interativa, este parâmetro não tem efeito.
* Ao usar Funções de Servidor, `initialState` precisa ser [serializável](/reference/rsc/use-server#serializable-parameters-and-return-values) (valores como objetos simples, arrays, strings e números).
* Se `dispatchAction` lançar um erro, o React cancela todas as ações enfileiradas e mostra o [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) mais próximo.
* Se houver múltiplas Ações em andamento, o React as agrupa. Esta é uma limitação que pode ser removida em uma versão futura.

<Note>

`dispatchAction` deve ser chamado de dentro de uma Ação.

Você pode envolvê-lo em [`startTransition`](/reference/react/startTransition), ou passá-lo para uma [prop de Ação](/reference/react/useTransition#exposing-action-props-from-components). Chamadas fora desse escopo não serão tratadas como parte da Transition e [registrarão um erro](#async-function-outside-transition) no modo de desenvolvimento.

</Note>

---

### Função `reducerAction` {/*reduceraction*/}

A função `reducerAction` passada para `useActionState` recebe o estado anterior e retorna um novo estado.

Ao contrário dos reducers em `useReducer`, a `reducerAction` pode ser assíncrona e realizar efeitos colaterais:

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

Cada vez que você chama `dispatchAction`, o React chama a `reducerAction` com o `actionPayload`. O reducer realizará efeitos colaterais como postar dados e retornará o novo estado. Se `dispatchAction` for chamado várias vezes, o React enfileira e executa-os em ordem, para que o resultado da chamada anterior seja passado como `previousState` para a chamada atual.

#### Parâmetros {/*reduceraction-parameters*/}

* `previousState`: O último estado. Inicialmente, é igual ao `initialState`. Após a primeira chamada para `dispatchAction`, é igual ao último estado retornado.

* **opcional** `actionPayload`: O argumento passado para `dispatchAction`. Pode ser um valor de qualquer tipo. Seguindo as convenções de `useReducer`, geralmente é um objeto com uma propriedade `type` que o identifica e, opcionalmente, outras propriedades com informações adicionais.

#### Retorna {/*reduceraction-returns*/}

`reducerAction` retorna o novo estado e aciona uma Transition para re-renderizar com esse estado.

#### Ressalvas {/*reduceraction-caveats*/}

* `reducerAction` pode ser síncrona ou assíncrona. Pode realizar ações síncronas como mostrar uma notificação, ou ações assíncronas como postar atualizações em um servidor.
* `reducerAction` não é invocada duas vezes no `<StrictMode>` pois `reducerAction` foi projetada para permitir efeitos colaterais.
* O tipo de retorno de `reducerAction` deve corresponder ao tipo de `initialState`. Se o TypeScript inferir uma incompatibilidade, pode ser necessário anotar explicitamente o tipo de seu estado.
* Se você definir estado após `await` na `reducerAction`, atualmente você precisa envolver a atualização de estado em um `startTransition` adicional. Veja a documentação de [startTransition](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) para mais informações.
* Ao usar Funções de Servidor, `actionPayload` precisa ser [serializável](/reference/rsc/use-server#serializable-parameters-and-return-values) (valores como objetos simples, arrays, strings e números).

<DeepDive>

#### Por que se chama `reducerAction`? {/*why-is-it-called-reduceraction*/}

A função passada para `useActionState` é chamada de *reducer action* (ação redutora) porque:

- Ela *reduz* o estado anterior em um novo estado, como `useReducer`.
- É uma *Ação* porque é chamada dentro de uma Transition e pode realizar efeitos colaterais.

Conceitualmente, `useActionState` é como `useReducer`, mas você pode fazer efeitos colaterais no reducer.

</DeepDive>

---

## Uso {/*usage*/}

### Adicionando estado a uma Ação {/*adding-state-to-an-action*/}

Chame `useActionState` no nível superior do seu componente para criar um estado para o resultado de uma Ação.

```js [[1, 7, "count"], [2, 7, "dispatchAction"], [3, 7, "isPending"]]
import { useActionState } from 'react';

async function addToCartAction(prevCount) {
  // ...
}
function Counter() {
  const [count, dispatchAction, isPending] = useActionState(addToCartAction, 0);

  // ...
}
```

`useActionState` retorna um array com exatamente três itens:

1. O <CodeStep step={1}>estado atual</CodeStep>, inicialmente definido como o estado inicial que você forneceu.
2. O <CodeStep step={2}>dispatcher de ação</CodeStep> que permite acionar a `reducerAction`.
3. Um <CodeStep step={3}>estado pendente</CodeStep> que informa se a Ação está em progresso.

Para chamar `addToCartAction`, chame o <CodeStep step={2}>dispatcher de ação</CodeStep>. O React enfileirará chamadas para `addToCartAction` com o count anterior.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
    return await addToCart(prevCount)
  }, 0);

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>Qty: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Add Ticket{isPending ? ' 🌀' : '  '}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row button {
  margin-left: auto;
  min-width: 150px;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
```

</Sandpack>

Cada vez que você clica em "Add Ticket", o React enfileira uma chamada para `addToCartAction`. O React mostra o estado pendente até que todos os ingressos sejam adicionados e então renderiza novamente com o estado final.

<DeepDive>

#### Como funciona o enfileiramento do `useActionState` {/*how-useactionstate-queuing-works*/}

Tente clicar em "Add Ticket" várias vezes. Cada vez que você clica, um novo `addToCartAction` é enfileirado. Como há um atraso artificial de 1 segundo, isso significa que 4 cliques levarão ~4 segundos para serem concluídos.

**Isso é intencional no design do `useActionState`.**

Temos que aguardar o resultado anterior de `addToCartAction` para passar o `prevCount` para a próxima chamada de `addToCartAction`. Isso significa que o React precisa esperar que a Ação anterior termine antes de chamar a próxima Ação.

Você normalmente pode resolver isso [usando com useOptimistic](/reference/react/useActionState#using-with-useoptimistic), mas para casos mais complexos você pode considerar [cancelar ações enfileiradas](#cancelling-queued-actions) ou não usar `useActionState`.

</DeepDive>

---

### Usando múltiplos tipos de Ação {/*using-multiple-action-types*/}

Para lidar com múltiplos tipos, você pode passar um argumento para `dispatchAction`.

Por convenção, é comum escrevê-lo como uma instrução switch. Para cada caso no switch, calcule e retorne algum próximo estado. O argumento pode ter qualquer forma, mas é comum passar objetos com uma propriedade `type` identificando a ação.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="qty">{isPending ? '🌀' : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Quando você clica para aumentar ou diminuir a quantidade, um `"ADD"` ou `"REMOVE"` é despachado. Na `reducerAction`, APIs diferentes são chamadas para atualizar a quantidade.

Neste exemplo, usamos o estado pendente das Ações para substituir tanto a quantidade quanto o total. Se você quiser dar um feedback imediato, como atualizar a quantidade na hora, pode usar `useOptimistic`.

<DeepDive>

#### Qual é a diferença entre `useActionState` e `useReducer`? {/*useactionstate-vs-usereducer*/}

Você pode notar que este exemplo se parece muito com `useReducer`, mas eles servem a propósitos diferentes:

- **Use `useReducer`** para gerenciar o estado da sua UI. O reducer deve ser puro.

- **Use `useActionState`** para gerenciar o estado das suas Ações. O reducer pode executar efeitos colaterais.

Você pode pensar em `useActionState` como um `useReducer` para efeitos colaterais de Ações do usuário. Como ele calcula a próxima Ação a executar com base na Ação anterior, ele precisa [ordenar as chamadas sequencialmente](/reference/react/useActionState#how-useactionstate-queuing-works). Se você quiser executar Ações em paralelo, use `useState` e `useTransition` diretamente.

</DeepDive>

---

### Usando com `useOptimistic` {/*using-with-useoptimistic*/}

Você pode combinar `useActionState` com [`useOptimistic`](/reference/react/useOptimistic) para mostrar um feedback imediato na UI:


<Sandpack>

```js src/App.js
import { useActionState, startTransition, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  function handleAdd() {
    startTransition(() => {
      setOptimisticCount(c => c + 1);
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      setOptimisticCount(c => c - 1);
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>


`setOptimisticCount` atualiza a quantidade imediatamente, e `dispatchAction()` enfileira a `updateCartAction`. Um indicador pendente aparece tanto na quantidade quanto no total para avisar o usuário de que a atualização ainda está sendo aplicada.

---


### Usando com props de Ação {/*using-with-action-props*/}

Quando você passa a função `dispatchAction` para um componente que expõe uma [prop de Ação](/reference/react/useTransition#exposing-action-props-from-components), não precisa chamar `startTransition` nem `useOptimistic` você mesmo.

Este exemplo mostra o uso das props `increaseAction` e `decreaseAction` de um componente QuantityStepper:

<Sandpack>

```js src/App.js
import { useActionState } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function addAction() {
    dispatchAction({type: 'ADD'});
  }

  function removeAction() {
    dispatchAction({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Como `<QuantityStepper>` já tem suporte embutido a Transitions, estado pendente e atualização otimista da contagem, você só precisa dizer à Ação _o que_ mudar; _como_ mudar fica por conta dele.

---

### Cancelando Ações enfileiradas {/*cancelling-queued-actions*/}

Você pode usar um `AbortController` para cancelar Ações pendentes:

<Sandpack>

```js src/App.js
import { useActionState, useRef } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
  }

  async function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'REMOVE', signal: abortRef.current.signal });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      try {
        return await addToCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return prevCount + 1;
      }
    }
    case 'REMOVE': {
      try {
        return await removeFromCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return Math.max(0, prevCount - 1);
      }
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
          <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
class AbortError extends Error {
  name = 'AbortError';
  constructor(message = 'The operation was aborted') {
    super(message);
  }
}

function sleep(ms, signal) {
  if (!signal) return new Promise((resolve) => setTimeout(resolve, ms));
  if (signal.aborted) return Promise.reject(new AbortError());

  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(id);
      reject(new AbortError());
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}
export async function addToCart(count, opts) {
  await sleep(1000, opts?.signal);
  return count + 1;
}

export async function removeFromCart(count, opts) {
  await sleep(1000, opts?.signal);
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Tente clicar em aumentar ou diminuir várias vezes e observe que o total é atualizado em até 1 segundo, não importa quantas vezes você clique. Isso funciona porque o exemplo usa um `AbortController` para "concluir" a Ação anterior, de modo que a próxima Ação possa prosseguir.

<Pitfall>

Abortar uma Ação nem sempre é seguro.

Por exemplo, se a Ação executa uma mutação (como escrever em um banco de dados), abortar a requisição de rede não desfaz a mudança no lado do servidor. É por isso que `useActionState` não aborta por padrão. Só é seguro quando você sabe que o efeito colateral pode ser ignorado ou repetido com segurança.

</Pitfall>

---

### Usando com props de Ação do `<form>` {/*use-with-a-form*/}

Você pode passar a função `dispatchAction` como a prop `action` de um `<form>`.

Quando usada dessa forma, o React envolve automaticamente o envio em uma Transition, então você não precisa chamar `startTransition` você mesmo. A `reducerAction` recebe o estado anterior e o `FormData` enviado:

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return dispatchAction(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </form>
  );
}

async function updateCartAction(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Neste exemplo, quando o usuário clica nas setas do seletor de quantidade, o botão envia o formulário e `useActionState` chama `updateCartAction` com os dados do formulário. O exemplo usa `useOptimistic` para mostrar a nova quantidade imediatamente enquanto o servidor confirma a atualização.

<RSC>

Quando usado com uma [Função de Servidor](/reference/rsc/server-functions), `useActionState` permite que a resposta do servidor seja exibida antes que a hidratação (quando o React se conecta ao HTML renderizado no servidor) termine. Você também pode usar o parâmetro opcional `permalink` para aprimoramento progressivo (permitindo que o formulário funcione antes de o JavaScript carregar) em páginas com conteúdo dinâmico. Normalmente, o seu framework cuida disso para você.

</RSC>

Veja a documentação de [`<form>`](/reference/react-dom/components/form#handle-form-submission-with-a-server-function) para mais informações sobre o uso de Ações com formulários.

---

### Tratando erros {/*handling-errors*/}

Há duas formas de tratar erros com `useActionState`.

Para erros conhecidos, como erros de validação do seu backend do tipo "quantidade indisponível", você pode retorná-los como parte do estado da sua `reducerAction` e exibi-los na UI.

Para erros desconhecidos, como `undefined is not a function`, você pode lançar um erro. O React cancelará todas as Ações enfileiradas e mostrará o [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) mais próximo, relançando o erro a partir do Hook `useActionState`.

<Sandpack>

```js src/App.js
import {useActionState, startTransition} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {addToCart} from './api';
import Total from './Total';

function Checkout() {
  const [state, dispatchAction, isPending] = useActionState(
    async (prevState, quantity) => {
      const result = await addToCart(prevState.count, quantity);
      if (result.error) {
        // Retorne o erro da API como estado
        return {...prevState, error: `Could not add quanitiy ${quantity}: ${result.error}`};
      }

      if (!isPending) {
        // Limpe o estado de erro no primeiro dispatch.
        return {count: result.count, error: null};
      }

      // Retorne a nova contagem e quaisquer erros que tenham ocorrido.
      return {count: result.count, error: prevState.error};


    },
    {
      count: 0,
      error: null,
    }
  );

  function handleAdd(quantity) {
    startTransition(() => {
      dispatchAction(quantity);
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>
          {isPending && '🌀 '}Qty: {state.count}
        </span>
      </div>
      <div className="buttons">
        <button onClick={() => handleAdd(1)}>Add 1</button>
        <button onClick={() => handleAdd(10)}>Add 10</button>
        <button onClick={() => handleAdd(NaN)}>Add NaN</button>
      </div>
      {state.error && <div className="error">{state.error}</div>}
      <hr />
      <Total quantity={state.count} isPending={isPending} />
    </div>
  );
}



export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({resetErrorBoundary}) => (
        <div className="checkout">
          <h2>Something went wrong</h2>
          <p>The action could not be completed.</p>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}>
      <Checkout />
    </ErrorBoundary>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>
        {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
      </span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count, quantity) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (quantity > 5) {
    return {error: 'Quantity not available'};
  } else if (isNaN(quantity)) {
    throw new Error('Quantity must be a number');
  }
  return {count: count + quantity};
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.buttons {
  display: flex;
  gap: 8px;
}

.error {
  color: red;
  font-size: 14px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

Neste exemplo, "Add 10" simula uma API que retorna um erro de validação, que `updateCartAction` guarda no estado e exibe junto ao formulário. "Add NaN" gera uma contagem inválida, então `updateCartAction` lança um erro, que se propaga por `useActionState` até o `ErrorBoundary` e mostra uma UI para reiniciar.


---

## Solução de problemas {/*troubleshooting*/}

### Minha flag `isPending` não está sendo atualizada {/*ispending-not-updating*/}

Se você estiver chamando `dispatchAction` manualmente (não por meio de uma prop de Ação), certifique-se de envolver a chamada em [`startTransition`](/reference/react/startTransition):

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ Correto: envolva em startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

Quando `dispatchAction` é passado para uma prop de Ação, o React automaticamente o envolve em uma Transition.

---

### Minha Ação não consegue ler os dados do formulário enviado {/*action-cannot-read-form-data*/}

Quando você usa `useActionState`, a `reducerAction` recebe um argumento extra como seu primeiro argumento: o estado anterior ou inicial. Os dados do formulário enviado são, portanto, seu *segundo* argumento em vez de seu primeiro.

```js {2,7}
// Sem useActionState
function action(formData) {
  const name = formData.get('name');
}

// Com useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

---

### Minhas ações estão sendo ignoradas {/*actions-skipped*/}

Se você chamar `dispatchAction` várias vezes e algumas delas não executarem, pode ser porque uma chamada anterior de `dispatchAction` lançou um erro.

Quando uma `reducerAction` lança um erro, o React ignora todas as chamadas de `dispatchAction` subsequentemente enfileiradas.

Para lidar com isso, capture erros dentro da sua `reducerAction` e retorne um estado de erro em vez de lançar:

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ Retorne o estado de erro em vez de lançar
    return { success: false, error: error.message };
  }
}
```

---

### Meu estado não é resetado {/*reset-state*/}

`useActionState` não fornece uma função de reset embutida. Para resetar o estado, você pode projetar sua `reducerAction` para lidar com um sinal de reset:

```js
const initialState = { name: '', error: null };

async function formAction(prevState, payload) {
  // Lidar com reset
  if (payload === null) {
    return initialState;
  }
  // Lógica normal de ação
  const result = await submitData(payload);
  return result;
}

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(formAction, initialState);

  function handleReset() {
    startTransition(() => {
      dispatchAction(null); // Passe null para acionar o reset
    });
  }

  // ...
}
```

Alternativamente, você pode adicionar uma prop `key` ao componente que usa `useActionState` para forçá-lo a remontar com estado novo, ou uma prop `action` do `<form>`, que é resetada automaticamente após o envio.

---

### Estou recebendo um erro: "An async function with useActionState was called outside of a transition." {/*async-function-outside-transition*/}

Um erro comum é esquecer de chamar `dispatchAction` de dentro de uma Transition:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.

</ConsoleLogLine>
</ConsoleBlockMulti>


Este erro ocorre porque `dispatchAction` deve ser executado dentro de uma Transition:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ❌ Errado: chamando dispatchAction fora de uma Transition
    dispatchAction();
  }

  // ...
}
```

Para corrigir, envolva a chamada em [`startTransition`](/reference/react/startTransition):

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ✅ Correto: envolva em startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

Ou passe `dispatchAction` para uma prop de Ação, que é chamada em uma Transition:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  // ✅ Correto: a prop action envolve em uma Transition para você
  return <Button action={dispatchAction}>...</Button>;
}
```

---

### Estou recebendo um erro: "Cannot update action state while rendering" {/*cannot-update-during-render*/}

Você não pode chamar `dispatchAction` durante a renderização:

<ConsoleBlock level="error">

Cannot update action state while rendering.

</ConsoleBlock>

Isso causa um loop infinito porque chamar `dispatchAction` agenda uma atualização de estado, que aciona uma re-renderização, que chama `dispatchAction` novamente.

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  // ❌ Errado: chamando dispatchAction durante a renderização
  dispatchAction();

  // ...
}
```

Para corrigir, chame `dispatchAction` apenas em resposta a eventos do usuário (como envios de formulário ou cliques de botão).
