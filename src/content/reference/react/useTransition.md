---
title: useTransition
---

<Intro>

<<<<<<< HEAD
`useTransition` é um Hook do React que permite você atualizar o state (estado) sem bloquear a UI.
=======
`useTransition` is a React Hook that lets you render a part of the UI in the background.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useTransition()` {/*usetransition*/}

Chame `useTransition` no nível superior do seu componente para marcar algumas atualizações de estado como Transições.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Abaixo, você encontrará mais exemplos.](#usage)

#### Parâmetros {/*parameters*/}

`useTransition` não recebe parâmetros.

#### Retornos {/*returns*/}

`useTransition` retorna um array com exatamente dois itens:

<<<<<<< HEAD
1. O atributo `isPending` que informa se há uma Transição pendente
2. A função [`startTransition`](#starttransition) que permite marcar uma atualização de estado como uma Transição.

---

### `startTransition()` {/*starttransition*/}

A função `startTransition` retornado pelo hook `useTransition` permite marcar uma atualização de estado como uma Transição.
=======
1. The `isPending` flag that tells you whether there is a pending Transition.
2. The [`startTransition` function](#starttransition) that lets you mark updates as a Transition.

---

### `startTransition(action)` {/*starttransition*/}

The `startTransition` function returned by `useTransition` lets you mark an update as a Transition.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<<<<<<< HEAD
#### Parâmetros {/*starttransition-parameters*/}

* `scope`: Uma função que atualiza o state chamando uma ou mais [funções `set`](/reference/react/useState#setstate)  O React executa imediatamente essa função `scope` sem parâmetros e marca todas as atualizações de state agendadas de forma síncrona durante a chamada da função `scope` como transições.  Essas transições nâo são [obrigatórias](#marking-a-state-update-as-a-non-blocking-transition) e [indicadores de carregamento indesejados.](#preventing-unwanted-loading-indicators)
=======
<Note>
#### Functions called in `startTransition` are called "Actions". {/*functions-called-in-starttransition-are-called-actions*/}

The function passed to `startTransition` is called an "Action". By convention, any callback called inside `startTransition` (such as a callback prop) should be named `action` or include the "Action" suffix:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>



#### Parameters {/*starttransition-parameters*/}

* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls that are awaited in the `action` will be included in the Transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators](#preventing-unwanted-loading-indicators).
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

#### Retorno {/*starttransition-returns*/}

`startTransition` não possui valor de retorno.

#### Caveats {/*starttransition-caveats*/}

* `useTransition`  é um Hook, portanto, deve ser chamado dentro de componentes ou Hooks personalizados. Se você precisar iniciar uma transição em outro lugar (por exemplo, a partir de uma biblioteca de dados), chame a função independente [`startTransition`](/reference/react/startTransition) em vez disso.

* Você só pode envolver uma atualização em uma transição se tiver acesso à função `set` daquele state. Se você deseja iniciar uma transição em resposta a alguma propriedade ou valor de um Hook personalizado, tente utilizar [`useDeferredValue`](/reference/react/useDeferredValue)  em vez disso.

<<<<<<< HEAD
* A função que você passa para  `startTransition` deve ser síncrona. O React executa imediatamente essa função, marcando todas as atualizações de state que acontecem enquanto ela é executada como transições. Se você tentar executar mais atualizações de state  posteriormente (por exemplo, em um timeout), elas não serão marcadas como transições.
=======
* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* The `startTransition` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

* Uma atualização de state marcada como uma transição pode ser interrompida por outras atualizações de state. Por exemplo, se você atualizar um componente de gráfico dentro de uma transição, mas depois começar a digitar em uma entrada enquanto o gráfico estiver no meio de uma nova renderização, o React reiniciará o trabalho de renderização no componente de gráfico após lidar com a atualização da entrada.

* As atualizações de transição não podem ser usadas para controlar entradas de texto.

<<<<<<< HEAD
* Se houver várias transições em andamento, o React atualmente as agrupa em lotes. Essa é uma limitação que provavelmente será removida em uma versão futura.

---
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

## Uso {/*usage*/}

<<<<<<< HEAD
### Marcando uma atualização de state como uma transição não bloqueante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Chame `useTransition` o nível superior do seu componente para marcar as atualizações de state como *Transições* sem bloqueio.
=======
### Perform non-blocking updates with Actions {/*perform-non-blocking-updates-with-actions*/}

Call `useTransition` at the top of your component to create Actions, and access the pending state:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` retorna um array com exatamente dois itens:

<<<<<<< HEAD
1. O sinalizador <CodeStep step={1}>`isPending`</CodeStep> que indica se existe uma transição pendente.
2.  O sinalizador <CodeStep step={2}>`startTransition` function</CodeStep> que permite que você marque uma atualização de state como uma transição.

Pode então marcar uma atualização de state como uma transição desta forma:
=======
1. The <CodeStep step={1}>`isPending` flag</CodeStep> that tells you whether there is a pending Transition.
2. The <CodeStep step={2}>`startTransition` function</CodeStep> that lets you create an Action.

To start a Transition, pass a function to `startTransition` like this:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

<<<<<<< HEAD
As transições permitem manter as atualizações da interface do usuário com capacidade de resposta, mesmo em dispositivos lentos.

Com uma transição, sua interface do usuário permanece reactiva no meio de uma nova renderização. Por exemplo, se o usuário clicar em uma guia, mas depois mudar de ideia e clicar em outra guia, eles podem fazer isso sem esperar que a primeira renderização termine.

<Recipes titleText="A diferença entre o uso de useTransition e atualizações regulares de state" titleId="examples">

#### Atualizando a guia atual em uma transição {/*updating-the-current-tab-in-a-transition*/}

Neste exemplo, a guia "Posts" é **artificialmente retardada** para que leve pelo menos um segundo para ser renderizada.

Clique em "Posts" e depois clique imediatamente em "Contato". Observe que isso interrompe a renderização lenta de "Posts". A guia "Contato" é exibida imediatamente. Como essa atualização de state é marcada como uma transição, uma lenta re-renderização não congela a interface do usuário.
=======
The function passed to `startTransition` is called the "Action". You can update state and (optionally) perform side effects within an Action, and the work will be done in the background without blocking user interactions on the page. A Transition can include multiple Actions, and while a Transition is in progress, your UI stays responsive. For example, if the user clicks a tab but then changes their mind and clicks another tab, the second click will be immediately handled without waiting for the first update to finish. 

To give the user feedback about in-progress Transitions, to `isPending` state switches to `true` at the first call to `startTransition`, and stays `true` until all Actions complete and the final state is shown to the user. Transitions ensure side effects in Actions to complete in order to [prevent unwanted loading indicators](#preventing-unwanted-loading-indicators), and you can provide immediate feedback while the Transition is in progress with `useOptimistic`.

<Recipes titleText="The difference between Actions and regular event handling">

#### Updating the quantity in an Action {/*updating-the-quantity-in-an-action*/}

In this example, the `updateQuantity` function simulates a request to the server to update the item's quantity in the cart. This function is *artificially slowed down* so that it takes at least a second to complete the request.

Update the quantity multiple times quickly. Notice that the pending "Total" state is shown while any requests are in progress, and the "Total" updates only after the final request is complete. Because the update is in an Action, the "quantity" can continue to be updated while the request is in progress.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
<<<<<<< HEAD
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contato
      </TabButton>
=======
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, call the callback in startTransition.
    startTransition(async () => {
      action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

<<<<<<< HEAD
```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem-vindos ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Registrar uma vez. A desaceleração real está dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderizando 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não faz nada durante 1 ms por item para simular um código extremamente lento
  }

=======
```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

<<<<<<< HEAD
```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
=======
```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

This is a basic example to demonstrate how Actions work, but this example does not handle requests completing out of order. When updating the quantity multiple times, it's possible for the previous requests to finish after later requests causing the quantity to update out of order. This is a known limitation that we will fix in the future (see [Troubleshooting](#my-state-updates-in-transitions-are-out-of-order) below).

For common use cases, React provides built-in abstractions such as:
- [`useActionState`](/reference/react/useActionState)
- [`<form>` actions](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

These solutions handle request ordering for you. When using Transitions to build your own custom hooks or libraries that manage async state transitions, you have greater control over the request ordering, but you must handle it yourself.

<Solution />

<<<<<<< HEAD
#### Atualizando a guia atual sem uma transição {/*updating-the-current-tab-without-a-transition*/}

Neste exemplo, a guia "Posts" também é **artificialmente desacelerada** sopara que leve pelo menos um segundo para renderizar.Ao contrário do exemplo anterior, esta atualização de state **não é uma transição..**

Clique em "Posts" e, em seguida, clique imediatamente em "Contact". Observe Repare que a aplicação congela enquanto renderiza o separador mais lento, e a interface do usuário deixa de responder. Esta atualização de state não é uma transição, portanto, uma renderização lenta congela a interface do usuário.
=======
#### Updating the quantity without an Action {/*updating-the-users-name-without-an-action*/}

In this example, the `updateQuantity` function also simulates a request to the server to update the item's quantity in the cart. This function is *artificially slowed down* so that it takes at least a second to complete the request.

Update the quantity multiple times quickly. Notice that the pending "Total" state is shown while any requests is in progress, but the "Total" updates multiple times for each time the "quantity" was clicked:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
<<<<<<< HEAD

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

<<<<<<< HEAD
```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem vindo ao meu Perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
// Registrar uma vez. A desaceleração real está dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderização 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não fazer nada por 1 ms por item para simular um código extremamente lento
  }

=======
```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

<<<<<<< HEAD
```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
=======
```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

A common solution to this problem is to prevent the user from making changes while the quantity is updating:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

This solution makes the app feel slow, because the user must wait each time they update the quantity. It's possible to add more complex handling manually to allow the user to interact with the UI while the quantity is updating, but Actions handle this case with a straight-forward built-in API.

<Solution />

</Recipes>

---

<<<<<<< HEAD
### Atualizando o componente principal durante uma transição {/*updating-the-parent-component-in-a-transition*/}
Você também pode atualizar o state de um componente pai a partir da chamada `useTransition`. Por exemplo, este componente `TabButton`  envolve sua lógica de  `onClick` em uma transição:
=======
### Exposing `action` prop from components {/*exposing-action-props-from-components*/}

You can expose an `action` prop from a component to allow a parent to call an Action.


For example, this `TabButton` component wraps its `onClick` logic in an `action` prop:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js {8-10}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

<<<<<<< HEAD
Como o componente pai atualiza seu state dentro do manipulador de eventos `onClick`, essa atualização de state é marcada como uma transição. É por isso que, como no exemplo anterior, você pode clicar em "Posts" e imediatamente clicar em "Contact". A atualização da guia selecionada é marcada como uma transição, então ela não bloqueia as interações do usuário.
=======
Because the parent component updates its state inside the `action`, that state update gets marked as a Transition. This means you can click on "Posts" and then immediately click "Contact" and it does not block user interactions:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem vindo ao meu Perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Registrar uma vez. A desaceleração real está dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderização 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não fazer nada por 1 ms por item para simular um código extremamente lento  
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

<<<<<<< HEAD
### Apresentação de um state pendente durante a transição {/*displaying-a-pending-visual-state-during-the-transition*/}
=======
### Displaying a pending visual state {/*displaying-a-pending-visual-state*/}
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

Você pode usar o valor booleano `isPending` retornado por `useTransition` para indicar ao usuário que uma transição está em andamento. Por exemplo, o botão da guia pode ter um state visual especial de "pendente".

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Observe como clicar em "Publicações" agora parece mais reativo, porque o botão da guia em si é atualizado imediatamente:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (lento)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem-vindo ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Registrar apenas uma vez. A desaceleração real ocorre dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderizando 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não faz nada durante 1 ms por item para emular código extremamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Prevenindo indicadores de carregamento indesejados {/*preventing-unwanted-loading-indicators*/}

<<<<<<< HEAD
Neste exemplo, o componente PostsTab busca dados usando uma fonte de dados habilitada para [Suspense.](/reference/react/Suspense) Quando você clica na guia "Posts", o componente PostsTab suspende, fazendo com que o fallback de carregamento mais próximo apareça:
=======
In this example, the `PostsTab` component fetches some data using [use](/reference/react/use). When you click the "Posts" tab, the `PostsTab` component *suspends*, causing the closest loading fallback to appear:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Carregando...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bem-vindo ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD

// Nota: este componente foi escrito usando uma API experimental
// que ainda não está disponível em versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, tente um framework
// que esteja integrado com Suspense, como Relay ou Next.js.

=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
<<<<<<< HEAD

// Este é um contorno para um bug para fazer a demonstração funcionar.
// TODO: substituir por uma implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
      Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```js data.js hidden
// Observação: a forma como você realiza a busca de dados depende do 
// framework que você utiliza em conjunto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
// Adicione um atraso fake para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<<<<<<< HEAD
Ocultar todo o container de guias para mostrar um indicador de carregamento resulta em uma experiência de usuário desagradável. Se você adicionar `useTransition` ao `TabButton`, pode, em vez disso, indicar o state pendente no próprio botão da guia.
=======
Hiding the entire tab container to show a loading indicator leads to a jarring user experience. If you add `useTransition` to `TabButton`, you can instead display the pending state in the tab button instead.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

Observe que clicar em "Posts" já não substitui mais o contêiner da guia inteira por um indicador de carregamento:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Carregando...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bem-vindo ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Observação: este componente é escrito usando uma API experimental 
// que ainda não está disponível em versões estáveis do React.
 // Para um exemplo realista que você pode seguir hoje, tente um framework 
 // que esteja integrado com Suspense, como Relay ou Next.js.

=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
<<<<<<< HEAD

// Isso é uma solução temporária para um bug para fazer o demo funcionar. 
// TODO: substituir por pela implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
      Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```js data.js hidden
// Nota: a maneira como você  faz a busca de dados depende
// framework que você utiliza em conjunto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Não implementado');
  }
}

async function getPosts() {
// Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Read more about using Transitions with Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

<<<<<<< HEAD
As transições só "esperam" o tempo  tempo necessário para evitar ocultação *já revelada* com conteúdo (como o contêiner da guia). Se a guia Posts  tivesse um limite [tivesse um limite `<Suspense>`,](/reference/react/Suspense#revealing-nested-content-as-it-loads) a transição não "esperaria" por ele.
=======
Transitions only "wait" long enough to avoid hiding *already revealed* content (like the tab container). If the Posts tab had a [nested `<Suspense>` boundary,](/reference/react/Suspense#revealing-nested-content-as-it-loads) the Transition would not "wait" for it.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

</Note>

---

### Construir um router com suspense ativado {/*building-a-suspense-enabled-router*/}

Se estiver a construir uma estrutura React ou um router, recomendamos marcar as navegações de página como transições.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

This is recommended for three reasons:

<<<<<<< HEAD
- [Transições que podem ser interrompidas ,](#marking-a-state-update-as-a-non-blocking-transition) permite ao usuário clicar em outro lugar sem precisar esperar que a nova renderização esteja concluída.
- [Transições que evitam indicadores de carregamento indesejados,](#preventing-unwanted-loading-indicators)  o que permite ao usuário evitar saltos bruscos na navegação.

Aqui está um pequeno exemplo simplificado de um router que utiliza transições para as navegações.
=======
- [Transitions are interruptible,](#marking-a-state-update-as-a-non-blocking-transition) which lets the user click away without waiting for the re-render to complete.
- [Transitions prevent unwanted loading indicators,](#preventing-unwanted-loading-indicators) which lets the user avoid jarring jumps on navigation.
- [Transitions wait for all pending actions](#perform-non-blocking-updates-with-actions) which lets the user wait for side effects to complete before the new page is shown.

Here is a simplified router example using Transitions for navigations.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Carregando...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Navegador de música
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Abrir a página do artista dos Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Nota: este componente foi escrito usando uma API experimental
// que ainda não está disponível em versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, tente um framework
// que esteja integrado com Suspense, como Relay ou Next.js.

=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
<<<<<<< HEAD

// Esta é uma solução temporária para um bug para fazer a demonstração funcionar.
// TODO: substituir por uma implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Nota: este componente está escrito usando uma API experimental
// que ainda não está disponível em versões estáveis do React.
// Para um exemplo realista que você pode seguir hoje, tente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
<<<<<<< HEAD

// Este é um contorno para um bug para fazer a demonstração funcionar.
// TODO: substituir pela implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Nota: a forma como você faria a busca de dados depende de
// do framework que você usa  em conjunto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
// Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles foram uma banda de rock inglesa,
    formada em Liverpool em 1960, que era composta por
    John Lennon, Paul McCartney, George Harrison
    e Ringo Starr.`;
}

async function getAlbums() {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[Suspense-enabled](/reference/react/Suspense) Espera-se que os roteadores envolvam automaticamente as atualizações de navegação em transições por padrão.

</Note>

---

### Exibindo um erro para usuários com um limite de erro {/*displaying-an-error-to-users-with-error-boundary*/}

<<<<<<< HEAD
<Canary>

Atualmente, o limite de erro para useTransition está disponível apenas nos canais canário e experimental do React. Saiba mais sobre [canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

Se uma função passada para `startTransition` gerar um erro, você poderá exibir um erro ao seu usuário com um [limite de erro](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Para usar um limite de erro, envolva o componente onde você está chamando `useTransition` em um limite de erro. Depois que a função for passada para erros `startTransition`, o substituto para o limite do erro será exibido.
=======
If a function passed to `startTransition` throws an error, you can display an error to your user with an [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To use an error boundary, wrap the component where you are calling the `useTransition` in an error boundary. Once the function passed to `startTransition` errors, the fallback for the error boundary will be displayed.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // Para fins de demonstração, para mostrar o limite de erro
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Solução de problemas {/*troubleshooting*/}

### A atualização de uma entrada numa transição não funciona {/*updating-an-input-in-a-transition-doesnt-work*/}

Não é possível utilizar uma transição para uma variável de state que controla uma entrada:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌  Não é possível utilizar transições ao uma entrada de state controlada.
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Isso ocorre porque as transições não são bloqueantes, mas a atualização de uma entrada em resposta ao evento de alteração deve ocorrer de forma síncrona. Se você deseja executar uma transição em resposta à digitação, você tem duas opções:

1. Você pode declarar duas variáveis de state separadas: uma para o state da entrada (que sempre é atualizado de forma síncrona) e outra que você atualizará em uma transição. Isso permite que você controle a entrada usando o state síncrono e passe a variável de state de transição (que ficará "atrasada" em relação à entrada) para o restante da sua lógica de renderização.
2. Em alternativa, pode ter uma variável de state e adicionar [`useDeferredValue`](/reference/react/useDeferredValue) que ficará "atrasado" em relação ao valor real. Isso irá desencadear re-renderizações não bloqueantes para "alcançar" automaticamente o novo valor.
---

### O React não está tratando minha atualização de state como uma transição {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Quando você envolve uma atualização de state em uma transição, certifique-se de que ela ocorra *durante* a chamada de `startTransition`:

```js
startTransition(() => {
// ✅ Configurando o state *durante* a chamada de startTransition
  setPage('/about');
});
```

<<<<<<< HEAD
A função que você passa para `startTransition` deve ser síncrona.

Você não pode marcar uma atualização como uma transição dessa forma:
=======
The function you pass to `startTransition` must be synchronous. You can't mark an update as a Transition like this:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js
startTransition(() => {
// ❌ Configurando o state *após* a chamada de startTransition
setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Em vez disso, você pode fazer o seguinte:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Configurando st *durante* a chamada de startTransition.
    setPage('/about');
  });
}, 1000);
```

<<<<<<< HEAD
Da mesma forma, não é possível marcar uma atualização como uma transição dessa maneira:

=======
---

### React doesn't treat my state update after `await` as a Transition {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

When you use `await` inside a `startTransition` function, the state updates that happen after the `await` are not marked as Transitions. You must wrap state updates after each `await` in a `startTransition` call:
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js
startTransition(async () => {
  await someAsyncFunction();
<<<<<<< HEAD
// ❌ Configurando um state *depois* da chamada de startTransition
=======
  // ❌ Not using startTransition after await
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
  setPage('/about');
});
```

No entanto, isso funciona em vez disso:

```js
<<<<<<< HEAD
await someAsyncFunction();
startTransition(() => {
// ✅ Configurando state *durante* a chamada de startTransition
  setPage('/about');
=======
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
});
```

This is a JavaScript limitation due to React losing the scope of the async context. In the future, when [AsyncContext](https://github.com/tc39/proposal-async-context) is available, this limitation will be removed.

---

### Desejo acessar chamar  `useTransition` de fora de um componente. {/*i-want-to-call-usetransition-from-outside-a-component*/}

Você não pode chamar `useTransition` fora de um componente porque ele é um Hook.  Neste caso, utilize o método independente [`startTransition`](/reference/react/startTransition) Ele funciona da mesma forma, mas não fornece o indicador `isPending`.

---

### A função que passo para `startTransition` é executada imediatamente.{/*the-function-i-pass-to-starttransition-executes-immediately*/}

Se você executar este código, ele imprimirá 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**Espera-se que imprima 1, 2, 3.** A função passada para `startTransition` não sofre atrasos. Ao contrário do `setTimeout`, que não é executada posteriormente. O React executa sua função imediatamente, mas qualquer atualização de state agendada enquanto ele *está em execução* são marcadas como transições. Você pode imaginar que funciona assim:

```js
// Uma versão simplificada de como o React funciona

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... Agendar uma atualização do state de transição...
  } else {
    // ... Agendar uma atualização urgente do state...
  }
}
```

### My state updates in Transitions are out of order {/*my-state-updates-in-transitions-are-out-of-order*/}

If you `await` inside `startTransition`, you might see the updates happen out of order.

In this example, the `updateQuantity` function simulates a request to the server to update the item's quantity in the cart. This function *artificially returns the every other request after the previous* to simulate race conditions for network requests.

Try updating the quantity once, then update it quickly multiple times. You might see the incorrect total:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  
  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }  
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


When clicking multiple times, it's possible for previous requests to finish after later requests. When this happens, React currently has no way to know the intended order. This is because the updates are scheduled asynchronously, and React loses context of the order across the async boundary.

This is expected, because Actions within a Transition do not guarantee execution order. For common use cases, React provides higher-level abstractions like [`useActionState`](/reference/react/useActionState) and [`<form>` actions](/reference/react-dom/components/form) that handle ordering for you. For advanced use cases, you'll need to implement your own queuing and abort logic to handle this.


