---
title: useTransition
---

<Intro>

`useTransition` é um Hook do React que permite renderizar uma parte da interface do usuário em segundo plano.

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

1. O sinalizador `isPending` que indica se existe uma Transição pendente.
2. A [função `startTransition`](#starttransition) que permite marcar atualizações como uma Transição.

---

### `startTransition(action)` {/*starttransition*/}

A função `startTransition` retornada por `useTransition` permite marcar uma atualização como uma Transição.

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

<Note>
#### Funções chamadas em `startTransition` são chamadas de "Ações". {/*functions-called-in-starttransition-are-called-actions*/}

A função passada para `startTransition` é chamada de "Ação". Por convenção, qualquer callback chamado dentro de `startTransition` (como um callback prop) deve ser nomeado como `action` ou incluir o sufixo "Action":

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>

#### Parâmetros {/*starttransition-parameters*/}

* `action`: Uma função que atualiza algum estado chamando uma ou mais [funções `set`](/reference/react/useState#setstate). O React chama `action` imediatamente sem parâmetros e marca todas as atualizações de estado agendadas de forma síncrona durante a chamada da função `action` como Transições. Quaisquer chamadas assíncronas que sejam aguardadas na `action` serão incluídas na Transição, mas atualmente requerem envolver quaisquer funções `set` após o `await` em um `startTransition` adicional (veja [Solução de Problemas](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Atualizações de estado marcadas como Transições serão [não bloqueantes](#marking-a-state-update-as-a-non-blocking-transition) e [não exibirão indicadores de carregamento indesejados](#preventing-unwanted-loading-indicators).

#### Retorno {/*starttransition-returns*/}

<<<<<<< HEAD
`startTransition` não possui valor de retorno.
=======
* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls that are awaited in the `action` will be included in the Transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#perform-non-blocking-updates-with-actions) and [will not display unwanted loading indicators](#preventing-unwanted-loading-indicators).

#### Returns {/*starttransition-returns*/}

`startTransition` does not return anything.
>>>>>>> a1ddcf51a08cc161182b90a24b409ba11289f73e

#### Caveats {/*starttransition-caveats*/}

* `useTransition`  é um Hook, portanto, deve ser chamado dentro de componentes ou Hooks personalizados. Se você precisar iniciar uma transição em outro lugar (por exemplo, a partir de uma biblioteca de dados), chame a função independente [`startTransition`](/reference/react/startTransition) em vez disso.

* Você só pode envolver uma atualização em uma transição se tiver acesso à função `set` daquele state. Se você deseja iniciar uma transição em resposta a alguma propriedade ou valor de um Hook personalizado, tente utilizar [`useDeferredValue`](/reference/react/useDeferredValue)  em vez disso.

* A função que você passa para `startTransition` é chamada imediatamente, marcando todas as atualizações de estado que acontecem enquanto ela é executada como Transições. Se você tentar realizar atualizações de estado em um `setTimeout`, por exemplo, elas não serão marcadas como Transições.

* Você deve envolver quaisquer atualizações de estado após qualquer solicitação assíncrona em outro `startTransition` para marcá-las como Transições. Esta é uma limitação conhecida que iremos corrigir no futuro (veja [Solução de Problemas](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* A função `startTransition` tem uma identidade estável, então você frequentemente verá ela omitida das dependências de Efeito, mas incluí-la não fará com que o Efeito seja disparado. Se o linter permitir que você omita uma dependência sem erros, é seguro fazê-lo. [Saiba mais sobre remover dependências de Efeito.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Uma atualização de state marcada como uma transição pode ser interrompida por outras atualizações de state. Por exemplo, se você atualizar um componente de gráfico dentro de uma transição, mas depois começar a digitar em uma entrada enquanto o gráfico estiver no meio de uma nova renderização, o React reiniciará o trabalho de renderização no componente de gráfico após lidar com a atualização da entrada.

* As atualizações de transição não podem ser usadas para controlar entradas de texto.

* Se houver várias Transições em andamento, o React atualmente as agrupa. Esta é uma limitação que pode ser removida em uma versão futura.

## Uso {/*usage*/}

### Realizar atualizações não bloqueantes com Ações {/*perform-non-blocking-updates-with-actions*/}

Chame `useTransition` no topo do seu componente para criar Ações e acessar o estado pendente:

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` retorna um array com exatamente dois itens:

1. O <CodeStep step={1}>sinalizador `isPending`</CodeStep> que indica se existe uma Transição pendente.
2. A <CodeStep step={2}>função `startTransition`</CodeStep> que permite criar uma Ação.

Para iniciar uma Transição, passe uma função para `startTransition` assim:

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
A função passada para `startTransition` é chamada de "Ação". Você pode atualizar o estado e (opcionalmente) realizar efeitos colaterais dentro de uma Ação, e o trabalho será feito em segundo plano sem bloquear as interações do usuário na página. Uma Transição pode incluir várias Ações, e enquanto uma Transição está em andamento, sua interface do usuário permanece responsiva. Por exemplo, se o usuário clicar em uma aba, mas depois mudar de ideia e clicar em outra aba, o segundo clique será imediatamente tratado sem esperar que a primeira atualização termine.
=======
The function passed to `startTransition` is called the "Action". You can update state and (optionally) perform side effects within an Action, and the work will be done in the background without blocking user interactions on the page. A Transition can include multiple Actions, and while a Transition is in progress, your UI stays responsive. For example, if the user clicks a tab but then changes their mind and clicks another tab, the second click will be immediately handled without waiting for the first update to finish.
>>>>>>> a1ddcf51a08cc161182b90a24b409ba11289f73e

Para dar feedback ao usuário sobre Transições em andamento, o estado `isPending` muda para `true` na primeira chamada para `startTransition`, e permanece `true` até que todas as Ações sejam concluídas e o estado final seja mostrado ao usuário. As Transições garantem que os efeitos colaterais nas Ações sejam concluídos em ordem para [prevenir indicadores de carregamento indesejados](#preventing-unwanted-loading-indicators), e você pode fornecer feedback imediato enquanto a Transição está em andamento com `useOptimistic`.

<Recipes titleText="A diferença entre Ações e manipulação de eventos regular">

#### Atualizando a quantidade em uma Ação {/*updating-the-quantity-in-an-action*/}

Neste exemplo, a função `updateQuantity` simula uma solicitação ao servidor para atualizar a quantidade do item no carrinho. Esta função é *artificialmente desacelerada* para que leve pelo menos um segundo para concluir a solicitação.

Atualize a quantidade várias vezes rapidamente. Observe que o estado pendente "Total" é mostrado enquanto qualquer solicitação está em andamento, e o "Total" é atualizado apenas após a solicitação final ser concluída. Como a atualização está em uma Ação, a "quantidade" pode continuar a ser atualizada enquanto a solicitação está em andamento.

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
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
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
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
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

This is a basic example to demonstrate how Actions work, but this example does not handle requests completing out of order. When updating the quantity multiple times, it's possible for the previous requests to finish after later requests causing the quantity to update out of order. This is a known limitation that we will fix in the future (see [Troubleshooting](#my-state-updates-in-transitions-are-out-of-order) below).

For common use cases, React provides built-in abstractions such as:
- [`useActionState`](/reference/react/useActionState)
- [`<form>` actions](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

These solutions handle request ordering for you. When using Transitions to build your own custom hooks or libraries that manage async state transitions, you have greater control over the request ordering, but you must handle it yourself.

<Solution />

#### Atualizando a quantidade sem uma Ação {/*updating-the-users-name-without-an-action*/}

Neste exemplo, a função `updateQuantity` também simula uma solicitação ao servidor para atualizar a quantidade do item no carrinho. Esta função é *artificialmente desacelerada* para que leve pelo menos um segundo para concluir a solicitação.

Atualize a quantidade várias vezes rapidamente. Observe que o estado pendente "Total" é mostrado enquanto qualquer solicitação está em andamento, mas o "Total" é atualizado várias vezes para cada vez que a "quantidade" foi clicada:

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

### Expondo a prop `action` de componentes {/*exposing-action-props-from-components*/}

Você pode expor uma prop `action` de um componente para permitir que um componente pai chame uma Ação.

Por exemplo, este componente `TabButton` envolve sua lógica `onClick` em uma prop `action`:

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

Como o componente pai atualiza seu estado dentro da `action`, essa atualização de estado é marcada como uma Transição. Isso significa que você pode clicar em "Posts" e, em seguida, clicar imediatamente em "Contato" sem bloquear as interações do usuário:

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
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
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

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
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
.pending { color: #777; }
```

</Sandpack>

<Note>

When exposing an `action` prop from a component, you should `await` it inside the transition.

This allows the `action` callback to be either synchronous or asynchronous without requiring an additional `startTransition` to wrap the `await` in the action.

</Note>

---

### Exibindo um estado visual pendente {/*displaying-a-pending-visual-state*/}

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
      startTransition(async () => {
        await action();
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

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
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

Neste exemplo, o componente `PostsTab` busca alguns dados usando [use](/reference/react/use). Quando você clica na aba "Posts", o componente `PostsTab` *suspende*, fazendo com que o fallback de carregamento mais próximo apareça:

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

Ocultar todo o contêiner da aba para mostrar um indicador de carregamento leva a uma experiência de usuário brusca. Se você adicionar `useTransition` ao `TabButton`, você pode exibir o estado pendente no próprio botão da aba.

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
      startTransition(async () => {
        await action();
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

Transições só "esperam" o suficiente para evitar ocultar o conteúdo *já revelado* (como o contêiner da aba). Se a aba de Posts tivesse um [limite `<Suspense>` aninhado,](/reference/react/Suspense#revealing-nested-content-as-it-loads) a Transição não "esperaria" por ele.

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

Isso é recomendado por três razões:

<<<<<<< HEAD
- [As transições são interrompíveis,](#marking-a-state-update-as-a-non-blocking-transition) o que permite que o usuário clique em outro lugar sem esperar a re-renderização ser concluída.
- [As transições evitam indicadores de carregamento indesejados,](#preventing-unwanted-loading-indicators) o que permite que o usuário evite saltos bruscos na navegação.
- [As transições esperam por todas as ações pendentes](#perform-non-blocking-updates-with-actions) o que permite que o usuário espere que os efeitos colaterais sejam concluídos antes que a nova página seja exibida.
=======
- [Transitions are interruptible,](#perform-non-blocking-updates-with-actions) which lets the user click away without waiting for the re-render to complete.
- [Transitions prevent unwanted loading indicators,](#preventing-unwanted-loading-indicators) which lets the user avoid jarring jumps on navigation.
- [Transitions wait for all pending actions](#perform-non-blocking-updates-with-actions) which lets the user wait for side effects to complete before the new page is shown.
>>>>>>> a1ddcf51a08cc161182b90a24b409ba11289f73e

Aqui está um exemplo simplificado de roteador usando Transições para navegações.

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
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
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

Se uma função passada para `startTransition` lançar um erro, você pode exibir um erro para o seu usuário com um [limite de erro](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Para usar um limite de erro, envolva o componente onde você está chamando o `useTransition` em um limite de erro. Uma vez que a função passada para `startTransition` gerar um erro, o fallback para o limite de erro será exibido.

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

A função que você passa para `startTransition` deve ser síncrona. Você não pode marcar uma atualização como uma Transição desta forma:

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

---

### O React não trata minha atualização de estado após `await` como uma Transição {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

Quando você usa `await` dentro de uma função `startTransition`, as atualizações de estado que acontecem após o `await` não são marcadas como Transições. Você deve envolver as atualizações de estado após cada `await` em uma chamada `startTransition`:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Not using startTransition after await
  setPage('/about');
});
```

No entanto, isso funciona em vez disso:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
});
```

Esta é uma limitação do JavaScript devido ao React perder o escopo do contexto assíncrono. No futuro, quando o [AsyncContext](https://github.com/tc39/proposal-async-context) estiver disponível, essa limitação será removida.

---

### Desejo acessar chamar  `useTransition` de fora de um componente. {/*i-want-to-call-usetransition-from-outside-a-component*/}

Você não pode chamar `useTransition` fora de um componente porque ele é um Hook.  Neste caso, utilize o método independente [`startTransition`](/reference/react/startTransition) Ele funciona da mesma forma, mas não fornece o indicador `isPending`.

---

### A função que passo para `startTransition` é executada imediatamente. {/*the-function-i-pass-to-starttransition-executes-immediately*/}

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

### Minhas atualizações de estado em Transições estão fora de ordem {/*my-state-updates-in-transitions-are-out-of-order*/}

Se você usar `await` dentro de `startTransition`, pode ver as atualizações acontecerem fora de ordem.

Neste exemplo, a função `updateQuantity` simula uma solicitação ao servidor para atualizar a quantidade do item no carrinho. Esta função *artificialmente retorna todas as outras solicitações após a anterior* para simular condições de corrida para solicitações de rede.

Tente atualizar a quantidade uma vez, depois atualize rapidamente várias vezes. Você pode ver o total incorreto:

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
    startTransition(async () => {
      await action(e.target.value);
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


Quando clicar várias vezes, é possível que as solicitações anteriores sejam concluídas após as solicitações posteriores. Quando isso acontece, o React atualmente não tem como saber a ordem pretendida. Isso ocorre porque as atualizações são agendadas de forma assíncrona, e o React perde o contexto da ordem através do limite assíncrono.

Isso é esperado, porque Ações dentro de uma Transição não garantem a ordem de execução. Para casos de uso comuns, o React fornece abstrações de nível superior como [`useActionState`](/reference/react/useActionState) e ações de [`<form>`](/reference/react-dom/components/form) que lidam com a ordenação para você. Para casos de uso avançados, você precisará implementar sua própria lógica de fila e abortar para lidar com isso.


Example of `useActionState` handling execution order:

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
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

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
