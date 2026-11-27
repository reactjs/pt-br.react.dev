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

Ler o valor exige duas chamadas a `use` porque o próprio valor do contexto não é aguardado. Veja [Antes de usar contexto](/learn/passing-data-deeply-with-context#before-you-use-context) para conhecer alternativas a considerar antes de recorrer ao contexto.

Envolva os componentes que leem a Promise em um limite de [Suspense](/reference/react/Suspense) para que apenas essa subárvore suspenda enquanto a Promise estiver pendente. Veja [Uso (Promises)](#usage-promises) abaixo para saber mais sobre como ler Promises com `use`.

<Pitfall>

Quando esse padrão é usado com [Server Components](/reference/rsc/server-components), buscar a Promise novamente exige buscar novamente o Server Component que define a Promise no contexto. Evite definir a Promise no contexto em um ponto alto da árvore, pois isso faria com que grandes partes do app fossem buscadas novamente sem necessidade.

</Pitfall>

---

## Uso (Promises) {/*usage-promises*/}

### Lendo uma Promise com `use` {/*reading-a-promise-with-use*/}

Chame `use` com uma Promise para ler o seu valor resolvido. O componente vai [suspender](/reference/react/Suspense) enquanto a Promise estiver pendente.

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

Envolva o componente que chama <CodeStep step={1}>`use`</CodeStep> em um limite de [Suspense](/reference/react/Suspense) para que o React possa mostrar um fallback enquanto a Promise estiver pendente. O limite de Suspense mais próximo acima do componente que suspendeu mostra o seu fallback. Assim que a Promise for resolvida, o React lê o valor com `use` e substitui o fallback pelo componente renderizado.

<Recipes titleText="Lendo uma Promise com use vs. buscando dados em um Effect" titleId="examples-promise">

#### Buscando dados com `use` {/*fetching-data-with-use*/}

Neste exemplo, `Albums` chama `use` com uma Promise em cache. O componente suspende enquanto a Promise está pendente, e o React exibe o fallback do Suspense mais próximo. Promises rejeitadas se propagam para o [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) mais próximo.

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
// Nota: a forma como você faria a busca de dados depende do
// framework que você usa junto com o Suspense.
// Normalmente, a lógica de cache ficaria dentro de um framework.

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
  // Adicione um atraso falso para tornar a espera perceptível.
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

#### Buscando dados com `useEffect` {/*fetching-data-with-useeffect*/}

Antes de `use`, uma abordagem comum era buscar dados em um Effect e atualizar o estado quando os dados chegassem. Em comparação com `use`, essa abordagem exige gerenciar manualmente os estados de carregamento e de erro. Para mais detalhes sobre por que buscar dados em um Effect não é recomendado, veja [Você Pode Não Precisar de um Effect](/learn/you-might-not-need-an-effect#fetching-data).

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
  // Adicione um atraso falso para tornar a espera perceptível.
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

##### Promises passadas para `use` devem estar em cache {/*promises-must-cached*/}

Promises criadas durante a renderização são recriadas a cada renderização, o que faz o React mostrar o fallback do Suspense repetidamente e impede que o conteúdo apareça.

```js
function Albums() {
  // 🔴 `fetch` cria uma nova Promise a cada renderização.
  const albums = use(fetch('/albums'));
  // ...
}
```

Em vez disso, passe uma Promise vinda de um cache, de um [framework habilitado para Suspense](/reference/react/Suspense#suspense-enabled-frameworks) ou de um Server Component:

```js
// ✅ fetchData lê a Promise de um cache.
const albums = use(fetchData('/albums'));
```

</Pitfall>

<DeepDive>

#### Por que as Promises são recriadas a cada renderização? {/*why-promises-recreated*/}

[O React não preserva o estado de renderizações que suspenderam antes da montagem](/reference/react/Suspense#caveats). Após cada suspensão, o React tenta renderizar novamente do zero, então qualquer Promise criada durante a renderização é recriada.

Formas comuns de uma Promise ser recriada sem querer durante a renderização:

```js
function Albums() {
  // 🔴 `fetch` cria uma nova Promise a cada renderização.
  const albums = use(fetch('/albums'));

  // 🔴 Chamadas a funções `async` sem cache criam uma nova Promise a cada renderização.
  const albums = use((async () => {
    const res = await fetch('/albums');
    return res.json();
  })());

  // 🔴 Adicionar `.then` retorna uma nova Promise a cada renderização,
  // mesmo que `fetchData` esteja em cache.
  const albums = use(fetchData('/albums').then(res => res.json()));
  // ...
}
```

O ideal é que as Promises sejam criadas antes da renderização, como em um manipulador de eventos, em um loader de rota ou em um Server Component, e passadas para o componente que chama `use`. Buscar dados de forma tardia durante a renderização atrasa as requisições de rede e pode criar cascatas (waterfalls).

```js
// ✅ fetchData lê a Promise de um cache.
const albums = use(fetchData('/albums'));
```

</DeepDive>

---

### Armazenando Promises em cache para Client Components {/*caching-promises-for-client-components*/}

Promises passadas para `use` em Client Components devem estar em cache para que a mesma instância de Promise seja reutilizada entre re-renderizações. Se uma nova Promise for criada diretamente na renderização, o React exibirá o fallback do Suspense a cada re-renderização.

```js
// ✅ Armazene a Promise em cache para que a mesma seja reutilizada entre renderizações
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

A função `fetchData` retorna a mesma Promise toda vez que é chamada com a mesma URL. Quando `use` recebe a mesma Promise em uma re-renderização, ele lê o valor já resolvido de forma síncrona, sem suspender.

<Note>

A forma como você armazena Promises em cache depende do framework que você usa com o Suspense. Frameworks geralmente oferecem mecanismos de cache integrados. Se você não usa um framework, pode usar um cache simples no nível do módulo, como o mostrado acima, ou uma [fonte de dados habilitada para Suspense](/reference/react/Suspense#what-activates-a-suspense-boundary).

</Note>

No exemplo abaixo, clicar em "Re-render" atualiza o estado em `App` e dispara uma re-renderização. Como `fetchData` retorna a mesma Promise em cache, `Albums` lê o valor de forma síncrona em vez de mostrar o fallback do Suspense novamente.

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
// Nota: a forma como você faria a busca de dados depende do
// framework que você usa junto com o Suspense.
// Normalmente, a lógica de cache ficaria dentro de um framework.

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
  // Adicione um atraso falso para tornar a espera perceptível.
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

#### Como implementar um cache de Promises {/*how-to-implement-a-promise-cache*/}

Um cache básico armazena a Promise usando a URL como chave, para que a mesma instância seja reutilizada entre renderizações. Para também evitar fallbacks desnecessários do Suspense quando os dados já estão disponíveis, você pode definir os campos `status` e `value` (ou `reason`) na Promise. O React verifica esses campos quando `use` é chamado: se `status` for `'fulfilled'`, ele lê `value` de forma síncrona, sem suspender. Se `status` for `'rejected'`, ele lança `reason`. Se o campo estiver ausente ou for `'pending'`, ele suspende.

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

Isso é útil principalmente para autores de bibliotecas que constroem camadas de dados compatíveis com Suspense. O próprio React define o campo `status` em Promises que não o possuem, mas defini-lo você mesmo evita uma renderização extra quando os dados já estão disponíveis.

Esse padrão de cache é a base para [buscar dados novamente](#re-fetching-data-in-client-components) (em que mudar a chave do cache dispara uma nova busca) e para [pré-carregar dados ao passar o mouse](#preloading-data-on-hover) (em que chamar `fetchData` antecipadamente significa que a Promise pode já estar resolvida quando `use` a ler).

</DeepDive>

<Pitfall>

##### Não deixe de chamar `use` com base em uma Promise já estar finalizada. {/*conditional-use*/}

Ao contrário de outros Hooks, `use` pode ser chamado dentro de condições e loops — mas ele sempre deve ser chamado para a própria Promise. Nunca leia `promise.status` ou `promise.value` diretamente para contornar `use`; sempre passe a Promise para `use` e deixe o React lidar com ela.


```js
// 🔴 Não contorne `use` lendo o status da Promise diretamente
if (promise.status === 'fulfilled') {
  return promise.value;
}
const value = use(promise);
```

```js
// ✅ Passe a Promise para `use` e deixe o React acompanhá-la
const value = use(promise);
```

Contornar `use` dessa forma pode quebrar otimizações do Suspense no React e recursos de Suspense no React DevTools. Você pode chamar `use(promise)` condicionalmente, mas não condicione a chamada de `use(promise)` à própria Promise.

</Pitfall>

---

### Buscando dados novamente em Client Components {/*re-fetching-data-in-client-components*/}

Para atualizar os dados na mesma URL (por exemplo, com um botão "Refresh"), invalide a entrada do cache e inicie uma nova busca dentro de um [`startTransition`](/reference/react/startTransition). Armazene a Promise resultante no estado para disparar uma re-renderização. Enquanto a nova Promise estiver pendente, o React continua mostrando o conteúdo existente, porque a atualização está dentro de uma Transition.

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

`refetchData` limpa a entrada antiga do cache e inicia uma nova busca na mesma URL. Armazenar a Promise resultante no estado dispara uma re-renderização dentro da Transition. Na re-renderização, `Albums` recebe a nova Promise e `use` suspende nela enquanto o React continua mostrando o conteúdo antigo.

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
// Nota: a forma como você faria a busca de dados depende do
// framework que você usa junto com o Suspense.
// Normalmente, a lógica de cache ficaria dentro de um framework.

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
  // Adicione um atraso falso para tornar a espera perceptível.
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

Frameworks com suporte a Suspense geralmente oferecem seus próprios mecanismos de cache e invalidação. O cache personalizado acima é útil para entender o padrão, mas, na prática, prefira a solução de busca de dados do seu framework.

</Note>

---

### Pré-carregando dados ao passar o mouse {/*preloading-data-on-hover*/}

Você pode começar a carregar dados antes de precisar deles chamando `fetchData` durante um evento de hover. Como `fetchData` armazena a Promise em cache, os dados podem já estar disponíveis quando o usuário clicar. Se a Promise já tiver sido resolvida quando `use` a ler, o React renderiza o componente imediatamente, sem mostrar um fallback do Suspense.

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

Neste exemplo, passar o mouse sobre o botão de um artista começa a buscar os álbuns dele em segundo plano. Sem passar o mouse antes, clicar mostra um fallback de carregamento. Experimente passar o mouse sobre um botão por um momento antes de clicar para ver a diferença.

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
// Nota: a forma como você faria a busca de dados depende do
// framework que você usa junto com o Suspense.
// Normalmente, a lógica de cache ficaria dentro de um framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    // Define os campos de status para que o React possa ler o valor
    // de forma síncrona se a Promise for resolvida antes de
    // `use` ser chamado (por exemplo, ao pré-carregar no hover).
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
  // Adicione um atraso falso para tornar a espera perceptível.
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

### Streaming de dados do servidor para o cliente {/*streaming-data-from-server-to-client*/}

Os dados podem ser transmitidos do servidor para o cliente passando uma Promise como prop de um Server Component para um Client Component.

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
// Nota: a forma como você faria a busca de dados depende do
// framework que você usa junto com o Suspense.
// Normalmente, a lógica de cache ficaria dentro de um framework.

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
  // Adicione um atraso falso para tornar o estado de carregamento visível.
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (url === '/the-beatles/albums') {
    // Falha na primeira tentativa para demonstrar o Error Boundary
    // e tem sucesso na nova tentativa.
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

### Renderizando um componente apenas no navegador {/*rendering-a-component-only-in-the-browser*/}

Passe o valor retornado por [`browser`](/reference/react-dom/browser) para `use` dentro de um componente que deve ser renderizado apenas no navegador.

Clique em **Reload** para ver o fallback de carregamento no HTML inicial. Após a hidratação, o React exibe o rascunho carregado do `localStorage`.

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

  // Aguarda para que tanto o fallback quanto o conteúdo hidratado fiquem visíveis.
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

### Estou recebendo um erro: "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

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

Em vez disso, envolva o componente em um Error Boundary:

```jsx
function Albums({ albumsPromise }) {
  // ✅ Chame `use` sem try-catch
  const albums = use(albumsPromise);
  // ...
```

```jsx
// ✅ Use um Error Boundary para tratar os erros
<ErrorBoundary fallback={<p>Error</p>}>
  <Albums albumsPromise={albumsPromise} />
</ErrorBoundary>
```

---

### Estou recebendo um aviso: "A component was suspended by an uncached promise" {/*uncached-promise-error*/}

A Promise passada para `use` não está em cache, então o React não consegue reutilizá-la entre re-renderizações.

Isso costuma acontecer ao chamar `fetch` ou uma função `async` diretamente na renderização:

```js
function Albums() {
  // 🔴 Isso cria uma nova Promise a cada renderização
  const albums = use(fetch('/albums'));
  // ...
}
```

Para corrigir isso, armazene a Promise em cache para que a mesma instância seja reutilizada:

```js
// ✅ fetchData retorna a mesma Promise para a mesma URL
const albums = use(fetchData('/albums'));
```

Veja [armazenando Promises em cache para Client Components](#caching-promises-for-client-components) para mais detalhes.
