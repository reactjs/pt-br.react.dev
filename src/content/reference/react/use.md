---
title: use
---

<Intro>

<<<<<<< HEAD
`use` é uma API do React que permite que você leia o valor de um recurso como uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou um [contexto](/learn/passing-data-deeply-with-context).
=======
`use` is a React API that lets you read the value of a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `use(context)` {/*use-context*/}

<<<<<<< HEAD
Chame `use` em seu componente para ler o valor de um recurso como uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou [contexto](/learn/passing-data-deeply-with-context).
=======
Call `use` with a [context](/learn/passing-data-deeply-with-context) to read its value. Unlike [`useContext`](/reference/react/useContext), `use` can be called within loops and conditional statements like `if`.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

<<<<<<< HEAD
Ao contrário dos React Hooks, `use` pode ser chamado dentro de loops e instruções condicionais como `if`. Como os React Hooks, a função que chama `use` deve ser um Componente ou Hook.

Quando chamado com uma Promise, a API `use` se integra com [`Suspense`](/reference/react/Suspense) e [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). O componente que chama `use` *suspende* enquanto a Promise passada para `use` está pendente. Se o componente que chama `use` for encapsulado em um limite Suspense, o fallback será exibido. Uma vez que a Promise for resolvida, o fallback Suspense é substituído pelos componentes renderizados usando os dados retornados pela API `use`. Se a Promise passada para `use` for rejeitada, o fallback do Error Boundary mais próximo será exibido.

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
=======
[See more examples below.](#usage-context)

#### Parameters {/*context-parameters*/}

* `context`: A [context](/learn/passing-data-deeply-with-context) created with [`createContext`](/reference/react/createContext).

#### Returns {/*context-returns*/}

The context value for the passed context, determined by the closest context provider above the calling component. If there is no provider, the returned value is the `defaultValue` passed to [`createContext`](/reference/react/createContext).

#### Caveats {/*context-caveats*/}

* `use` must be called inside a Component or a Hook.
* Reading context with `use` is not supported in [Server Components](/reference/rsc/server-components).

---

### `use(promise)` {/*use-promise*/}

Call `use` with a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value. The component calling `use` *suspends* while the Promise is pending. Despite its name, `use` is not a Hook. Unlike Hooks, it can be called inside loops and conditional statements like `if`.

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  // ...
```

If the component that calls `use` is wrapped in a [Suspense](/reference/react/Suspense) boundary, the fallback will be displayed while the Promise is pending. Once the Promise is resolved, the Suspense fallback is replaced by the rendered components using the data returned by `use`. If the Promise is rejected, the fallback of the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) will be displayed.

[See more examples below.](#usage-promises)

#### Parameters {/*promise-parameters*/}

* `promise`: A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) whose resolved value you want to read. The Promise must be [cached](#caching-promises-for-client-components) so that the same instance is reused across re-renders.

#### Returns {/*promise-returns*/}

The resolved value of the Promise.

#### Caveats {/*promise-caveats*/}

* `use` must be called inside a Component or a Hook.
* `use` cannot be called inside a try-catch block. Instead, wrap your component in an [Error Boundary](#displaying-an-error-with-an-error-boundary) to catch the error and display a fallback.
* Promises passed to `use` must be cached so the same Promise instance is reused across re-renders. [See caching Promises below.](#caching-promises-for-client-components)
* When passing a Promise from a Server Component to a Client Component, its resolved value must be [serializable](/reference/rsc/use-client#serializable-types).

---

## Usage (Context) {/*usage-context*/}
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

### Lendo o contexto com `use` {/*reading-context-with-use*/}

<<<<<<< HEAD
Quando um [contexto](/learn/passing-data-deeply-with-context) é passado para `use`, ele funciona de forma semelhante a [`useContext`](/reference/react/useContext). Enquanto `useContext` deve ser chamado no nível superior do seu componente, `use` pode ser chamado dentro de condicionais como `if` e loops como `for`. `use` é preferível a `useContext` porque é mais flexível.
=======
When a [context](/learn/passing-data-deeply-with-context) is passed to `use`, it works similarly to [`useContext`](/reference/react/useContext). While `useContext` must be called at the top level of your component, `use` can be called inside conditionals like `if` and loops like `for`.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

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

<<<<<<< HEAD
### Streaming de dados do servidor para o cliente {/*streaming-data-from-server-to-client*/}

Os dados podem ser transmitidos do servidor para o cliente passando uma Promise como uma prop de um <CodeStep step={1}>Server Component</CodeStep> para um <CodeStep step={2}>Client Component</CodeStep>.
=======
### Reading a Promise from context {/*reading-a-promise-from-context*/}

To share asynchronous data without prop drilling, set a Promise as a context value, then read it with `use(context)` and resolve it with `use(promise)`:
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

```js
import { use } from 'react';
import { UserContext } from './UserContext';

function Profile() {
  const userPromise = use(UserContext);
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
```

Reading the value requires two `use` calls because the context value itself isn't awaited. See [Before you use context](/learn/passing-data-deeply-with-context#before-you-use-context) for alternatives to consider before reaching for context.

Wrap the components that read the Promise in a [Suspense](/reference/react/Suspense) boundary so only that subtree suspends while the Promise is pending. See [Usage (Promises)](#usage-promises) below for more on reading Promises with `use`.

<Pitfall>

When this pattern is used with [Server Components](/reference/rsc/server-components), refetching the Promise requires refetching the Server Component that sets the Promise in context. Avoid setting the Promise in context high in the tree, since that would refetch large parts of the app unnecessarily.

</Pitfall>

---

## Usage (Promises) {/*usage-promises*/}

### Reading a Promise with `use` {/*reading-a-promise-with-use*/}

Call `use` with a Promise to read its resolved value. The component will [suspend](/reference/react/Suspense) while the Promise is pending.

```js [[1, 4, "use(albumsPromise)"]]
import { use } from 'react';

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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

Wrap the component that calls <CodeStep step={1}>`use`</CodeStep> in a [Suspense](/reference/react/Suspense) boundary so React can show a fallback while the Promise is pending. The closest Suspense boundary above the suspending component shows its fallback. Once the Promise resolves, React reads the value with `use` and replaces the fallback with the rendered component.

<Recipes titleText="Reading a Promise with use vs fetching in an Effect" titleId="examples-promise">

#### Fetching data with `use` {/*fetching-data-with-use*/}

In this example, `Albums` calls `use` with a cached Promise. The component suspends while the Promise is pending, and React displays the nearest Suspense fallback. Rejected Promises propagate to the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

<Sandpack>

```js src/App.js active
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ErrorBoundary fallback={<p>Could not fetch albums.</p>}>
      <Suspense fallback={<Loading />}>
        <Albums />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
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

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
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

<Solution />

#### Fetching data with `useEffect` {/*fetching-data-with-useeffect*/}

Before `use`, a common approach was to fetch data in an Effect and update state when the data arrives. Compared to `use`, this approach requires managing loading and error states manually. For more details on why fetching in an Effect is discouraged, see [You Might Not Need an Effect](/learn/you-might-not-need-an-effect#fetching-data).

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { fetchAlbums } from './data.js';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums()
      .then(data => {
        setAlbums(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

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

```js src/data.js hidden
export async function fetchAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

##### Promises passed to `use` must be cached {/*promises-must-cached*/}

Promises created during render are recreated on every render, which causes React to show the Suspense fallback repeatedly and prevents content from appearing.

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));
  // ...
}
```

Instead, pass a Promise from a cache, a Suspense-enabled framework, or a Server Component:

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</Pitfall>

<DeepDive>

#### Why are Promises recreated on every render? {/*why-promises-recreated*/}

[React doesn't preserve state for renders that suspended before mounting](/reference/react/Suspense#caveats). After each suspension, React retries rendering from scratch, so any Promise created during render is recreated.

Common ways a Promise can be unintentionally recreated during render:

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));

  // 🔴 Uncached `async` function calls create a new Promise on every render.
  const albums = use((async () => {
    const res = await fetch('/albums');
    return res.json();
  })());

  // 🔴 Adding `.then` returns a new Promise on every render,
  // even if `fetchData` is cached.
  const albums = use(fetchData('/albums').then(res => res.json()));
  // ...
}
```

Ideally, Promises are created before rendering, such as in an event handler, a route loader, or a Server Component, and passed to the component that calls `use`. Fetching lazily in render delays network requests and can create waterfalls.

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</DeepDive>

---

### Caching Promises for Client Components {/*caching-promises-for-client-components*/}

Promises passed to `use` in Client Components must be cached so the same Promise instance is reused across re-renders. If a new Promise is created directly in render, React will display the Suspense fallback on every re-render.

```js
// ✅ Cache the Promise so the same one is reused across renders
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

The `fetchData` function returns the same Promise each time it's called with the same URL. When `use` receives the same Promise on a re-render, it reads the already-resolved value synchronously without suspending.

<Note>

The way you cache Promises depends on the framework you use with Suspense. Frameworks typically provide built-in caching mechanisms. If you don't use a framework, you can use a simple module-level cache like the one above, or a [Suspense-enabled data source](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading).

</Note>

In the example below, clicking "Re-render" updates state in `App` and triggers a re-render. Because `fetchData` returns the same cached Promise, `Albums` reads the value synchronously instead of showing the Suspense fallback again.

<Sandpack>

```js src/App.js active
import { use, Suspense, useState } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render
      </button>
      <p>Render count: {count}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Albums />
      </Suspense>
    </>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
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

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

</Sandpack>

<DeepDive>

#### How to implement a promise cache {/*how-to-implement-a-promise-cache*/}

A basic cache stores the Promise keyed by URL so the same instance is reused across renders. To also avoid unnecessary Suspense fallbacks when data is already available, you can set `status` and `value` (or `reason`) fields on the Promise. React checks these fields when `use` is called: if `status` is `'fulfilled'`, it reads `value` synchronously without suspending. If `status` is `'rejected'`, it throws `reason`. If the field is missing or `'pending'`, it suspends.

```js
let cache = new Map();

function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}
```

This is primarily useful for library authors building Suspense-compatible data layers. React will set the `status` field itself on Promises that don't have it, but setting it yourself avoids an extra render when the data is already available.

This cache pattern is the foundation for [re-fetching data](#re-fetching-data-in-client-components) (where changing the cache key triggers a new fetch) and [preloading data on hover](#preloading-data-on-hover) (where calling `fetchData` early means the Promise may already be resolved by the time `use` reads it).

</DeepDive>

<Pitfall>

Don't skip calling `use` based on whether a Promise is already settled.

Unlike other hooks, `use` can be called inside conditions and loops — but it must always be called for the Promise itself. Never read `promise.status` or `promise.value` directly to bypass `use`; always pass the Promise to `use` and let React handle it.


```js
// 🔴 Don't bypass `use` by reading promise status directly
if (promise.status === 'fulfilled') {
  return promise.value;
}
const value = use(promise);
```

```js
// ✅ Pass the promise to `use` and let React track the promise
const value = use(promise);
```

Bypassing `use` this way can break React Suspense optimizations and Suspense features for React DevTools. You can `use(promise)` conditionally, but don't conditionally `use(promise)` based on the promise itself.

</Pitfall>

---

### Re-fetching data in Client Components {/*re-fetching-data-in-client-components*/}

To refresh data at the same URL (for example, with a "Refresh" button), invalidate the cache entry and start a new fetch inside a [`startTransition`](/reference/react/startTransition). Store the resulting Promise in state to trigger a re-render. While the new Promise is pending, React keeps showing the existing content because the update is inside a Transition.

```js
function App() {
  const [albumsPromise, setAlbumsPromise] = useState(fetchData('/albums'));
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/albums'));
    });
  }
  // ...
}
```

`refetchData` clears the old cache entry and starts a new fetch at the same URL. Storing the resulting Promise in state triggers a re-render inside the Transition. On re-render, `Albums` receives the new Promise and `use` suspends on it while React keeps showing the old content.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import { use } from 'react';
import { fetchData, refetchData } from './data.js';

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <>
      <button
        onClick={handleRefresh}
        disabled={isPending}
      >
        {isPending ? 'Refreshing...' : 'Refresh'}
      </button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<Loading />}>
          <Albums albumsPromise={albumsPromise} />
        </Suspense>
      </div>
    </>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  return fetchData(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

<Note>

Frameworks that support Suspense typically provide their own caching and invalidation mechanisms. The custom cache above is useful for understanding the pattern, but in practice prefer your framework's data fetching solution.

</Note>

---

### Preloading data on hover {/*preloading-data-on-hover*/}

You can start loading data before it's needed by calling `fetchData` during a hover event. Since `fetchData` caches the Promise, the data may already be available by the time the user clicks. If the Promise has resolved by the time `use` reads it, React renders the component immediately without showing a Suspense fallback.

```js
<button
  onMouseEnter={() => fetchData(`/${id}/albums`)}
  onClick={() => {
    startTransition(() => {
      setArtistId(id);
    });
  }}
>
```

In this example, hovering over an artist button starts fetching their albums in the background. Without hovering first, clicking shows a loading fallback. Try hovering over a button for a moment before clicking to see the difference.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import Albums from './Albums.js';
import { fetchData } from './data.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        {['the-beatles', 'led-zeppelin', 'pink-floyd'].map(id => (
          <button
            key={id}
            onMouseEnter={() => {
              fetchData(`/${id}/albums`);
            }}
            onClick={() => {
              startTransition(() => {
                setArtistId(id);
              });
            }}
          >
            {id === 'the-beatles' ? 'The Beatles' :
             id === 'led-zeppelin' ? 'Led Zeppelin' :
             'Pink Floyd'}
          </button>
        ))}
      </div>
      <Suspense key={artistId} fallback={<Loading />}>
        <Albums artistId={artistId} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/Albums.js
import { use } from 'react';
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

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    // Set status fields so React can read the value
    // synchronously if the Promise resolves before
    // `use` is called (e.g. when preloading on hover).
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums('the-beatles');
  } else if (url.startsWith('/led-zeppelin/albums')) {
    return await getAlbums('led-zeppelin');
  } else if (url.startsWith('/pink-floyd/albums')) {
    return await getAlbums('pink-floyd');
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums(artistId) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });

  if (artistId === 'the-beatles') {
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
    }];
  } else if (artistId === 'led-zeppelin') {
    return [{
      id: 10,
      title: 'Coda',
      year: 1982
    }, {
      id: 9,
      title: 'In Through the Out Door',
      year: 1979
    }, {
      id: 8,
      title: 'Presence',
      year: 1976
    }];
  } else {
    return [{
      id: 7,
      title: 'The Wall',
      year: 1979
    }, {
      id: 6,
      title: 'Animals',
      year: 1977
    }, {
      id: 5,
      title: 'Wish You Were Here',
      year: 1975
    }];
  }
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

---

### Streaming data from server to client {/*streaming-data-from-server-to-client*/}

Data can be streamed from the server to the client by passing a Promise as a prop from a Server Component to a Client Component.

```js
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

<<<<<<< HEAD
O <CodeStep step={2}>Client Component</CodeStep> então pega <CodeStep step={4}>a Promise que recebeu como prop</CodeStep> e a passa para a API <CodeStep step={5}>`use`</CodeStep>. Isso permite que o <CodeStep step={2}>Client Component</CodeStep> leia o valor da <CodeStep step={4}>Promise</CodeStep> que foi inicialmente criada pelo Server Component.
=======
The Client Component then takes the Promise it received as a prop and passes it to the `use` API. This allows the Client Component to read the value from the Promise that was initially created by the Server Component.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
<<<<<<< HEAD
Como o <CodeStep step={2}>`Message`</CodeStep> é encapsulado em <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, o fallback será exibido até que a Promise seja resolvida. Quando a Promise for resolvida, o valor será lido pela API <CodeStep step={5}>`use`</CodeStep> e o componente <CodeStep step={2}>`Message`</CodeStep> substituirá o fallback Suspense.
=======
Because `Message` is wrapped in a [Suspense](/reference/react/Suspense) boundary, the fallback will be displayed until the Promise is resolved. When the Promise is resolved, the value will be read by the `use` API and the `Message` component will replace the Suspense fallback.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

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

<<<<<<< HEAD
<Note>

Ao passar uma Promise de um Server Component para um Client Component, seu valor resolvido deve ser serializável para passar entre o servidor e o cliente. Tipos de dados como funções não são serializáveis e não podem ser o valor resolvido de tal Promise.

</Note>


=======
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61
<DeepDive>

#### Devo resolver uma Promise em um Server ou Client Component? {/*resolve-promise-in-server-or-client-component*/}

<<<<<<< HEAD
Uma Promise pode ser passada de um Server Component para um Client Component e resolvida no Client Component com a API `use`. Você também pode resolver a Promise em um Server Component com `await` e passar os dados necessários para o Client Component como uma prop.
=======
A Promise can be resolved with `await` in a Server Component, or passed as a prop to a Client Component and resolved there with `use`.

Using `await` in a Server Component suspends the Server Component itself, and the Client Component receives the resolved value as a prop:
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

```js
// Server Component
export default async function App() {
  // Will suspend the Server Component.
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />;
}
```

<<<<<<< HEAD
Mas usar `await` em um [Server Component](/reference/rsc/server-components) bloqueará sua renderização até que a instrução `await` seja finalizada. Passar uma Promise de um Server Component para um Client Component impede que a Promise bloqueie a renderização do Server Component.

</DeepDive>

### Lidando com Promises rejeitadas {/*dealing-with-rejected-promises*/}

Em alguns casos, uma Promise passada para `use` pode ser rejeitada. Você pode lidar com Promises rejeitadas de duas formas:

1. [Exibir um erro para os usuários com um Error Boundary.](#displaying-an-error-to-users-with-error-boundary)
2. [Fornecer um valor alternativo com `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` não pode ser chamado em um bloco try-catch. Em vez de um bloco try-catch [envolva seu componente em um Error Boundary](#displaying-an-error-to-users-with-error-boundary), ou [forneça um valor alternativo para usar com o método `.catch` da Promise](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Exibindo um erro para os usuários com um Error Boundary {/*displaying-an-error-to-users-with-error-boundary*/}

Se você deseja exibir um erro para seus usuários quando uma Promise é rejeitada, pode usar um [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Para usar um Error Boundary, envolva o componente onde você está chamando a API `use` em um Error Boundary. Se a Promise passada para `use` for rejeitada, o fallback para o Error Boundary será exibido.
=======
A Server Component can also start a Promise without awaiting it and pass the Promise to a Client Component. The Server Component returns immediately, and the Client Component suspends when it calls `use`:

```js
// Server Component
export default function App() {
  // Not awaited: starts here, resolves on the client.
  const messagePromise = fetchMessage();
  return <Message messagePromise={messagePromise} />;
}
```

```js
// Client Component
'use client';
import { use } from 'react';

export function Message({ messagePromise }) {
  // Will suspend until the data is available.
  const messageContent = use(messagePromise);
  return <p>{messageContent}</p>;
}
```

Prefer `await` in a Server Component when possible, since it keeps the data fetching on the server. If a Server Component above already awaits the data, pass the resolved value down as a prop instead of creating a new Promise to call `use`.

You can also pass promise as a prop to a Client Component without awaiting it, and then read it with `use(promise)` to suspend deeper in the tree. This allows more of the surrounding UI to complete while the Promise is pending. A common case is interactive content like popovers and tooltips, where the data is needed only after a hover or click. Client Components can't `await`, so they rely on `use` to suspend on a Promise.

In either case, wrap the component that reads the Promise in a Suspense boundary so React can show a fallback while the Promise is pending. See [Revealing content together at once](/reference/react/Suspense#revealing-content-together-at-once) for guidance on boundary placement.

</DeepDive>

---

### Displaying an error with an Error Boundary {/*displaying-an-error-with-an-error-boundary*/}

If the Promise passed to `use` is rejected, the error propagates to the nearest [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Wrap the component that calls `use` in an Error Boundary to display a fallback when the Promise is rejected.

In the example below, `fetchData` rejects on the first attempt and succeeds on retry. The Error Boundary catches the rejection and shows a fallback with a "Try again" button.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

<Sandpack>

```js src/App.js active
import { use, Suspense, useState, startTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchData, refetchData } from "./data.js";

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );

  function handleRetry() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <ErrorBoundary
      resetKeys={[albumsPromise]}
      fallbackRender={() => (
        <>
          <p>⚠️ Something went wrong loading the albums.</p>
          <button onClick={handleRetry}>Try again</button>
        </>
      )}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <Albums albumsPromise={albumsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();
let retried = false;

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  retried = true;
  return fetchData(url);
}

async function getData(url) {
  // Add a fake delay to make the loading state visible.
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (url === '/the-beatles/albums') {
    // Fail the first attempt to demonstrate the Error Boundary,
    // then succeed on retry.
    if (!retried) {
      throw new Error('Example Error: Failed to fetch albums');
    }
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
    }];
  }
  throw new Error('Not implemented');
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

<<<<<<< HEAD
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

=======
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61
---

## Solução de problemas {/*troubleshooting*/}

### I'm getting an error: "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

<<<<<<< HEAD
Você está chamando `use` fora de um Componente ou função Hook do React, ou chamando `use` em um bloco try-catch. Se você estiver chamando `use` dentro de um bloco try-catch, envolva seu componente em um Error Boundary, ou chame o `catch` da Promise para capturar o erro e resolver a Promise com outro valor. [Veja estes exemplos](#dealing-with-rejected-promises).

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
=======
You are calling `use` inside a try-catch block. `use` throws internally to integrate with Suspense, so it cannot be wrapped in try-catch. Instead, wrap the component that calls `use` in an [Error Boundary](#displaying-an-error-with-an-error-boundary) to handle errors.

```jsx
function Albums({ albumsPromise }) {
  try {
    // ❌ Don't wrap `use` in try-catch
    const albums = use(albumsPromise);
  } catch (e) {
    return <p>Error</p>;
  }
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61
  // ...
```

Instead, wrap the component in an Error Boundary:

```jsx
function Albums({ albumsPromise }) {
  // ✅ Call `use` without try-catch
  const albums = use(albumsPromise);
  // ...
```

```jsx
// ✅ Use an Error Boundary to handle errors
<ErrorBoundary fallback={<p>Error</p>}>
  <Albums albumsPromise={albumsPromise} />
</ErrorBoundary>
```

---

### I'm getting a warning: "A component was suspended by an uncached promise" {/*uncached-promise-error*/}

The Promise passed to `use` is not cached, so React cannot reuse it across re-renders.

This commonly happens when calling `fetch` or an `async` function directly in render:

```js
function Albums() {
  // 🔴 This creates a new Promise on every render
  const albums = use(fetch('/albums'));
  // ...
}
```

To fix this, cache the Promise so the same instance is reused:

```js
// ✅ fetchData returns the same Promise for the same URL
const albums = use(fetchData('/albums'));
```

See [caching Promises for Client Components](#caching-promises-for-client-components) for more details.
