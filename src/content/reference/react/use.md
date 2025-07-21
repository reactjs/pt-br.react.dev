---
title: use
---

<Intro>

`use` é uma API do React que permite que você leia o valor de um recurso como uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou um [contexto](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `use(resource)` {/*use*/}

Chame `use` em seu componente para ler o valor de um recurso como uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou [contexto](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

Ao contrário dos React Hooks, `use` pode ser chamado dentro de loops e instruções condicionais como `if`. Como os React Hooks, a função que chama `use` deve ser um Componente ou Hook.

Quando chamado com uma Promise, a API `use` se integra com [`Suspense`](/reference/react/Suspense) e [error boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). O componente que chama `use` *suspende* enquanto a Promise passada para `use` está pendente. Se o componente que chama `use` for encapsulado em um limite Suspense, o fallback será exibido. Uma vez que a Promise for resolvida, o fallback Suspense é substituído pelos componentes renderizados usando os dados retornados pela API `use`. Se a Promise passada para `use` for rejeitada, o fallback do Error Boundary mais próximo será exibido.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `resource`: esta é a fonte dos dados de onde você deseja ler um valor. Um recurso pode ser uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou um [contexto](/learn/passing-data-deeply-with-context).

#### Retornos {/*returns*/}

A API `use` retorna o valor que foi lido do recurso, como o valor resolvido de uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou [contexto](/learn/passing-data-deeply-with-context).

#### Ressalvas {/*caveats*/}

* A API `use` deve ser chamada dentro de um Componente ou um Hook.
* Ao buscar dados em um [Server Component](/reference/rsc/server-components), prefira `async` e `await` em vez de `use`. `async` e `await` retomam a renderização do ponto em que `await` foi invocado, enquanto `use` renderiza novamente o componente após os dados serem resolvidos.
* Prefira criar Promises em [Server Components](/reference/rsc/server-components) e passá-las para [Client Components](/reference/rsc/use-client) em vez de criar Promises em Client Components. Promises criadas em Client Components são recriadas a cada renderização. Promises passadas de um Server Component para um Client Component são estáveis em todas as re-renderizações. [Veja este exemplo](#streaming-data-from-server-to-client).

---

## Uso {/*usage*/}

### Lendo o contexto com `use` {/*reading-context-with-use*/}

Quando um [contexto](/learn/passing-data-deeply-with-context) é passado para `use`, ele funciona de forma semelhante a [`useContext`](/reference/react/useContext). Enquanto `useContext` deve ser chamado no nível superior do seu componente, `use` pode ser chamado dentro de condicionais como `if` e loops como `for`. `use` é preferível a `useContext` porque é mais flexível.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` retorna o <CodeStep step={2}>valor do contexto</CodeStep> para o <CodeStep step={1}>contexto</CodeStep> que você passou. Para determinar o valor do contexto, o React pesquisa na árvore de componentes e encontra **o provider de contexto mais próximo acima** para aquele contexto específico.

Para passar o contexto para um `Button`, envolva-o ou um de seus componentes pai no provider de contexto correspondente.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Não importa quantas camadas de componentes existam entre o provider e o `Button`. Quando um `Button` *em qualquer lugar* dentro de `Form` chama `use(ThemeContext)`, ele receberá `"dark"` como o valor.

Ao contrário de [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> pode ser chamado em condicionais e loops como <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> é chamado de dentro de uma instrução <CodeStep step={1}>`if`</CodeStep>, permitindo que você leia condicionalmente valores de um Contexto.

<Pitfall>

Como `useContext`, `use(context)` sempre procura o provider de contexto mais próximo *acima* do componente que o chama. Ele pesquisa para cima e **não** considera os providers de contexto no componente de onde você está chamando `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Streaming de dados do servidor para o cliente {/*streaming-data-from-server-to-client*/}

Os dados podem ser transmitidos do servidor para o cliente passando uma Promise como uma prop de um <CodeStep step={1}>Server Component</CodeStep> para um <CodeStep step={2}>Client Component</CodeStep>.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

O <CodeStep step={2}>Client Component</CodeStep> então pega <CodeStep step={4}>a Promise que recebeu como prop</CodeStep> e a passa para a API <CodeStep step={5}>`use`</CodeStep>. Isso permite que o <CodeStep step={2}>Client Component</CodeStep> leia o valor da <CodeStep step={4}>Promise</CodeStep> que foi inicialmente criada pelo Server Component.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
Como o <CodeStep step={2}>`Message`</CodeStep> é encapsulado em <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, o fallback será exibido até que a Promise seja resolvida. Quando a Promise for resolvida, o valor será lido pela API <CodeStep step={5}>`use`</CodeStep> e o componente <CodeStep step={2}>`Message`</CodeStep> substituirá o fallback Suspense.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<Note>

Ao passar uma Promise de um Server Component para um Client Component, seu valor resolvido deve ser serializável para passar entre o servidor e o cliente. Tipos de dados como funções não são serializáveis e não podem ser o valor resolvido de tal Promise.

</Note>


<DeepDive>

#### Devo resolver uma Promise em um Server ou Client Component? {/*resolve-promise-in-server-or-client-component*/}

Uma Promise pode ser passada de um Server Component para um Client Component e resolvida no Client Component com a API `use`. Você também pode resolver a Promise em um Server Component com `await` e passar os dados necessários para o Client Component como uma prop.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

<<<<<<< HEAD
Mas usar `await` em um [Server Component](/reference/react/components#server-components) bloqueará sua renderização até que a instrução `await` seja finalizada. Passar uma Promise de um Server Component para um Client Component impede que a Promise bloqueie a renderização do Server Component.
=======
But using `await` in a [Server Component](/reference/rsc/server-components) will block its rendering until the `await` statement is finished. Passing a Promise from a Server Component to a Client Component prevents the Promise from blocking the rendering of the Server Component.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

</DeepDive>

### Lidando com Promises rejeitadas {/*dealing-with-rejected-promises*/}

Em alguns casos, uma Promise passada para `use` pode ser rejeitada. Você pode lidar com Promises rejeitadas de duas formas:

1. [Exibir um erro para os usuários com um error boundary.](#displaying-an-error-to-users-with-error-boundary)
2. [Fornecer um valor alternativo com `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` não pode ser chamado em um bloco try-catch. Em vez de um bloco try-catch [envolva seu componente em um Error Boundary](#displaying-an-error-to-users-with-error-boundary), ou [forneça um valor alternativo para usar com o método `.catch` da Promise](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Exibindo um erro para os usuários com um error boundary {/*displaying-an-error-to-users-with-error-boundary*/}

Se você deseja exibir um erro para seus usuários quando uma Promise é rejeitada, pode usar um [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Para usar um error boundary, envolva o componente onde você está chamando a API `use` em um error boundary. Se a Promise passada para `use` for rejeitada, o fallback para o error boundary será exibido.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
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
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Fornecendo um valor alternativo com `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

Se você deseja fornecer um valor alternativo quando a Promise passada para `use` é rejeitada, você pode usar o método <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> da Promise.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Para usar o método <CodeStep step={1}>`catch`</CodeStep> da Promise, chame <CodeStep step={1}>`catch`</CodeStep> no objeto Promise. <CodeStep step={1}>`catch`</CodeStep> recebe um único argumento: uma função que recebe uma mensagem de erro como um argumento. Qualquer coisa que for <CodeStep step={2}>retornada</CodeStep> pela função passada para <CodeStep step={1}>`catch`</CodeStep> será usada como o valor resolvido da Promise.

---

## Solução de problemas {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

Você está chamando `use` fora de um Componente ou função Hook do React, ou chamando `use` em um bloco try-catch. Se você estiver chamando `use` dentro de um bloco try-catch, envolva seu componente em um error boundary, ou chame o `catch` da Promise para capturar o erro e resolver a Promise com outro valor. [Veja estes exemplos](#dealing-with-rejected-promises).

Se você estiver chamando `use` fora de um Componente ou função Hook do React, mova a chamada `use` para um Componente ou função Hook do React.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ a função que chama `use` não é um Componente ou Hook
    const message = use(messagePromise);
    // ...
```

Em vez disso, chame `use` fora de quaisquer fechamentos de componente, onde a função que chama `use` é um Componente ou Hook.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` está sendo chamado de um componente. 
  const message = use(messagePromise);
  // ...
```