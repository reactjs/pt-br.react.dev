---
title: use
---

<Intro>

`use` é uma API do React que permite que você leia um recurso durante a renderização, como uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou um [contexto](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `use(context)` {/*use-context*/}

Chame `use` com um [contexto](/learn/passing-data-deeply-with-context) para ler o seu valor. Ao contrário de [`useContext`](/reference/react/useContext), `use` pode ser chamado dentro de loops e instruções condicionais como `if`.

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

[Veja mais exemplos abaixo.](#usage-context)

#### Parâmetros {/*context-parameters*/}

* `context`: Um [contexto](/learn/passing-data-deeply-with-context) criado com [`createContext`](/reference/react/createContext).

#### Retornos {/*context-returns*/}

O valor do contexto passado, determinado pelo provider de contexto mais próximo acima do componente que faz a chamada. Se não houver provider, o valor retornado é o `defaultValue` passado para [`createContext`](/reference/react/createContext).

#### Ressalvas {/*context-caveats*/}

* `use` deve ser chamado dentro de um Componente ou de um Hook.
* Ler contexto com `use` não é suportado em [Server Components](/reference/rsc/server-components).

---

### `use(promise)` {/*use-promise*/}

Chame `use` com uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) para ler o seu valor resolvido. O componente que chama `use` *suspende* enquanto a Promise está pendente. Apesar do nome, `use` não é um Hook. Ao contrário dos Hooks, ele pode ser chamado dentro de loops e instruções condicionais como `if`.

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  // ...
```

Se o componente que chama `use` for encapsulado em um limite de [Suspense](/reference/react/Suspense), o fallback será exibido enquanto a Promise estiver pendente. Uma vez que a Promise for resolvida, o fallback do Suspense é substituído pelos componentes renderizados usando os dados retornados por `use`. Se a Promise for rejeitada, o fallback do [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) mais próximo será exibido.

[Veja mais exemplos abaixo.](#usage-promises)

#### Parâmetros {/*promise-parameters*/}

* `promise`: Uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) cujo valor resolvido você deseja ler. A Promise deve estar [em cache](#caching-promises-for-client-components) para que a mesma instância seja reutilizada entre re-renderizações.

#### Retornos {/*promise-returns*/}

O valor resolvido da Promise.

#### Ressalvas {/*promise-caveats*/}

* `use` deve ser chamado dentro de um Componente ou de um Hook.
* `use` não pode ser chamado dentro de um bloco try-catch. Em vez disso, envolva seu componente em um [Error Boundary](#displaying-an-error-with-an-error-boundary) para capturar o erro e exibir um fallback.
* Promises passadas para `use` devem estar em cache para que a mesma instância de Promise seja reutilizada entre re-renderizações. [Veja como armazenar Promises em cache abaixo.](#caching-promises-for-client-components)
* Ao passar uma Promise de um Server Component para um Client Component, seu valor resolvido deve ser [serializável](/reference/rsc/use-client#serializable-types).

---

### `use(browser())` {/*use-browser*/}

Chame `use` com o valor retornado por [`browser`](/reference/react-dom/browser) em um componente que deve ser renderizado apenas no navegador:

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

Durante a renderização no servidor, o componente que chama `use(browser())` suspende e o React inclui no HTML o fallback do limite [`<Suspense>`](/reference/react/Suspense) mais próximo. No navegador, `use(browser())` retorna `undefined`, então o componente é renderizado normalmente.

[Veja um exemplo abaixo.](#rendering-a-component-only-in-the-browser)

#### Parâmetros {/*browser-parameters*/}

* `browserValue`: O valor retornado por [`browser`](/reference/react-dom/browser).

#### Retornos {/*browser-returns*/}

`use(browser())` retorna `undefined` no navegador.

#### Ressalvas {/*browser-caveats*/}

* O componente que chama `use(browser())` deve estar dentro de um limite `<Suspense>` durante a renderização no servidor. Sem ele, a renderização no servidor falha.
* Em um app com React Server Components, `use(browser())` deve ser chamado a partir de um [Client Component](/reference/rsc/use-client), e não de um [Server Component](/reference/rsc/server-components).

---

## Uso (Contexto) {/*usage-context*/}

### Lendo o contexto com `use` {/*reading-context-with-use*/}

Quando um [contexto](/learn/passing-data-deeply-with-context) é passado para `use`, ele funciona de forma semelhante a [`useContext`](/reference/react/useContext). Enquanto `useContext` deve ser chamado no nível superior do seu componente, `use` pode ser chamado dentro de condicionais como `if` e loops como `for`.

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

### Lendo uma Promise a partir do contexto {/*reading-a-promise-from-context*/}

Para compartilhar dados assíncronos sem prop drilling, defina uma Promise como valor de contexto, depois leia-a com `use(context)` e resolva-a com `use(promise)`:

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

Instead, pass a Promise from a cache, a [Suspense-enabled framework](/reference/react/Suspense#suspense-enabled-frameworks), or a Server Component:

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

The way you cache Promises depends on the framework you use with Suspense. Frameworks typically provide built-in caching mechanisms. If you don't use a framework, you can use a simple module-level cache like the one above, or a [Suspense-enabled data source](/reference/react/Suspense#what-activates-a-suspense-boundary).

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

##### Don't skip calling `use` based on whether a Promise is already settled. {/*conditional-use*/}

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

O Client Component então pega a Promise que recebeu como prop e a passa para a API `use`. Isso permite que o Client Component leia o valor da Promise que foi inicialmente criada pelo Server Component.

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
Como `Message` está encapsulado em um limite de [Suspense](/reference/react/Suspense), o fallback será exibido até que a Promise seja resolvida. Quando a Promise for resolvida, o valor será lido pela API `use` e o componente `Message` substituirá o fallback do Suspense.

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

<DeepDive>

#### Devo resolver uma Promise em um Server ou Client Component? {/*resolve-promise-in-server-or-client-component*/}

Se você tem uma Promise, em algum momento precisa desembrulhá-la para ler o seu valor. Você a desembrulha com `await` em um Server Component, e com `use` em um Client Component.

Normalmente, a opção mais simples é usar `await` na Promise onde você a cria. O Server Component suspende até que os dados estejam prontos, e tudo abaixo dele também espera:

```js
// Server Component
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />;
}
```

No entanto, você não precisa desembrulhá-la imediatamente. Você pode passar a Promise para baixo como uma prop e desembrulhá-la mais fundo na árvore. O componente que lê a Promise ainda suspende, mas apenas aquela parte da árvore espera pelos dados. Envolva esse componente em um limite [`<Suspense>`](/reference/react/Suspense) para mostrar um fallback enquanto o restante da página é renderizado imediatamente.

Por exemplo, um Server Component mais profundo pode usar `await` na Promise que recebe:

```js
import { Suspense } from 'react';

// Server Component
export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// Server Component
async function Message({ messagePromise }) {
  const messageContent = await messagePromise;
  return <p>{messageContent}</p>;
}
```

Ou, em um arquivo separado, um Client Component pode desembrulhar a mesma Promise com `use`:

```js
// Client Component
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>{messageContent}</p>;
}
```

Passar a Promise para baixo funciona da mesma forma nos dois casos. Ambos suspendem onde a Promise é lida, e ambos desbloqueiam a UI acima. A única diferença é que Client Components não podem usar `await` durante a renderização, então desembrulham a Promise com `use`. Um caso comum é conteúdo interativo como popovers e tooltips, em que os dados só são necessários após um hover ou clique.

Veja [Revelando conteúdo todo de uma vez](/reference/react/Suspense#revealing-content-together-at-once) para orientações sobre onde posicionar os limites de Suspense.

</DeepDive>

---

### Exibindo um erro com um Error Boundary {/*displaying-an-error-with-an-error-boundary*/}

Se a Promise passada para `use` for rejeitada, o erro se propaga para o [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) mais próximo. Envolva o componente que chama `use` em um Error Boundary para exibir um fallback quando a Promise for rejeitada.

No exemplo abaixo, `fetchData` é rejeitada na primeira tentativa e é bem-sucedida na nova tentativa. O Error Boundary captura a rejeição e mostra um fallback com um botão "Try again".

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

---

## Uso (Navegador) {/*usage-browser*/}

### Rendering a component only in the browser {/*rendering-a-component-only-in-the-browser*/}

Pass the value returned by [`browser`](/reference/react-dom/browser) to `use` inside a component that should only render in the browser.

Click **Reload** to see the loading fallback in the initial HTML. After hydration, React displays the draft loaded from `localStorage`.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Durante a renderização no servidor, `use(browser())` suspende o componente e o React inclui no HTML o fallback do limite de Suspense mais próximo. No navegador, `use(browser())` retorna `undefined` e o rascunho salvo é renderizado normalmente.

---

## Solução de problemas {/*troubleshooting*/}

### I'm getting an error: "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

Você está chamando `use` dentro de um bloco try-catch. `use` lança internamente para se integrar ao Suspense, então não pode ser envolvido em try-catch. Em vez disso, envolva o componente que chama `use` em um [Error Boundary](#displaying-an-error-with-an-error-boundary) para tratar os erros.

```jsx
function Albums({ albumsPromise }) {
  try {
    // ❌ Não envolva `use` em try-catch
    const albums = use(albumsPromise);
  } catch (e) {
    return <p>Error</p>;
  }
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
