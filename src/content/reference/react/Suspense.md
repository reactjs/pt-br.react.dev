---
title: <Suspense>
---

<Intro>

`<Suspense>` permite que você exiba um fallback até que seus filhos tenham terminado de carregar.

```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}
* `children`: A interface real que você pretende renderizar. Se `children` suspender durante a renderização, a fronteira do Suspense mudará para renderizar `fallback`.
* `fallback`: Uma interface alternativa para renderizar no lugar da interface real, se esta não tiver terminado de carregar. Qualquer nó React válido é aceito, embora na prática, um fallback seja uma visualização placeholder leve, como um spinner de carregamento ou esqueleto. O Suspense mudará automaticamente para `fallback` quando `children` suspender, e voltará para `children` quando os dados estiverem prontos. Se `fallback` suspender durante a renderização, ele ativará a fronteira de Suspense pai mais próxima.

#### Ressalvas {/*caveats*/}

- O React não preserva nenhum estado para renders que foram suspensas antes de poderem montar pela primeira vez. Quando o componente for carregado, o React tentará renderizar a árvore suspensa do zero.
- Se o Suspense estiver exibindo conteúdo para a árvore, mas depois suspender novamente, o `fallback` será exibido novamente, a menos que a atualização que o causou tenha sido causada por [`startTransition`](/reference/react/startTransition) ou [`useDeferredValue`](/reference/react/useDeferredValue).
- Se o React precisar ocultar o conteúdo já visível porque ele suspendeu novamente, ele limpará [Effects de layout](/reference/react/useLayoutEffect) na árvore de conteúdo. Quando o conteúdo estiver pronto para ser exibido novamente, o React acionará os Effects de layout novamente. Isso garante que os Effects que medem o layout do DOM não tentem fazer isso enquanto o conteúdo estiver oculto.
- O React inclui otimizações internas como *Streaming Server Rendering* e *Selective Hydration* que estão integradas com o Suspense. Leia [uma visão geral arquitetônica](https://github.com/reactwg/react-18/discussions/37) e assista [a uma palestra técnica](https://www.youtube.com/watch?v=pj5N-Khihgc) para saber mais.

---

## Uso {/*usage*/}

### Exibindo um fallback enquanto o conteúdo está carregando {/*displaying-a-fallback-while-content-is-loading*/}

Você pode envolver qualquer parte de sua aplicação com uma fronteira de Suspense:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

O React exibirá seu <CodeStep step={1}>fallback de carregamento</CodeStep> até que todo o código e dados necessários por <CodeStep step={2}>os filhos</CodeStep> tenham sido carregados.

No exemplo abaixo, o componente `Albums` *suspende* enquanto busca a lista de álbuns. Até que esteja pronto para renderizar, o React muda a fronteira de Suspense mais próxima acima para mostrar o fallback--seu componente `Loading`. Então, quando os dados carregam, o React oculta o fallback `Loading` e renderiza o componente `Albums` com dados.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Abrir página do artista The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Carregando...</h2>;
}
```

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

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

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Não implementado');
  }
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

</Sandpack>

<Note>

**Somente fontes de dados com suporte a Suspense ativarão o componente Suspense.** Elas incluem:

- Busca de dados com frameworks habilitados para Suspense, como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Carregamento dinâmico de código de componentes com [`lazy`](/reference/react/lazy)
- Lendo o valor de uma Promise com [`use`](/reference/react/use)

O Suspense **não** detecta quando os dados são buscados dentro de um Effect ou manipulador de eventos.

A maneira exata como você carregaria dados no componente `Albums` acima depende do seu framework. Se você usar um framework com suporte a Suspense, encontrará os detalhes na documentação de busca de dados dele.

A busca de dados habilitada para Suspense sem o uso de um framework opinativo ainda não é suportada. Os requisitos para implementar uma fonte de dados habilitada para Suspense são instáveis e não documentados. Uma API oficial para integrar fontes de dados com o Suspense será lançada em uma versão futura do React.

</Note>

---

### Revelando conteúdo junto de uma só vez {/*revealing-content-together-at-once*/}

Por padrão, toda a árvore dentro do Suspense é tratada como uma única unidade. Por exemplo, mesmo que *apenas um* desses componentes suspender enquanto espera por alguns dados, *todos* eles juntos serão substituídos pelo indicador de carregamento:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Então, depois que todos estiverem prontos para serem exibidos, aparecerão juntos de uma só vez.

No exemplo abaixo, tanto `Biography` quanto `Albums` buscam alguns dados. No entanto, como estão agrupados sob uma única fronteira de Suspense, esses componentes sempre "aparecem" juntos ao mesmo tempo.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Abrir página do artista The Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Carregando...</h2>;
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

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
```

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

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

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Não implementado');
  }
}

async function getBio() {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles eram uma banda de rock inglesa, 
    formada em Liverpool em 1960, composta por 
    John Lennon, Paul McCartney, George Harrison e 
    Ringo Starr.`;
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
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

As fronteiras de Suspense permitem que você coordene quais partes da sua interface devem sempre "aparecer" juntas ao mesmo tempo, e quais partes devem revelar progressivamente mais conteúdo em uma sequência de estados de carregamento. Você pode adicionar, mover ou excluir fronteiras de Suspense em qualquer lugar da árvore sem afetar o comportamento do resto do seu aplicativo.

Não coloque uma fronteira de Suspense ao redor de cada componente. As fronteiras de Suspense não devem ser mais granulares do que a sequência de carregamento que você deseja que o usuário experimente. Se você trabalhar com um designer, pergunte a eles onde os estados de carregamento devem ser colocados--é provável que eles já os incluíram em suas wireframes de design.

---

### Exibindo conteúdo obsoleto enquanto o conteúdo novo está carregando {/*showing-stale-content-while-fresh-content-is-loading*/}

Neste exemplo, o componente `SearchResults` suspende enquanto busca os resultados da pesquisa. Digite `"a"`, espere pelos resultados e depois edite para `"ab"`. Os resultados para `"a"` serão substituídos pelo fallback de carregamento.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
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
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Pesquisar álbuns:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Carregando...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Sem correspondências para <i>"{query}"</i></p>;
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

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Não implementado');
  }
}

async function getSearchResults(query) {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
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

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Um padrão alternativo comum de interface é *adiar* a atualização da lista e manter exibindo os resultados anteriores até que os novos resultados estejam prontos. O Hook [`useDeferredValue`](/reference/react/useDeferredValue) permite que você passe uma versão adiada da consulta:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Pesquisar álbuns:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Carregando...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

A `query` será atualizada imediatamente, então a entrada exibirá o novo valor. No entanto, a `deferredQuery` manterá seu valor anterior até que os dados sejam carregados, então `SearchResults` mostrará os resultados obsoletos por um tempo.

Para deixar mais óbvio para o usuário, você pode adicionar uma indicação visual quando a lista de resultados obsoleta é exibida:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Digite `"a"` no exemplo abaixo, espere pelos resultados carregarem e, em seguida, edite a entrada para `"ab"`. Note como, em vez do fallback do Suspense, agora você vê a lista de resultados obsoletos esmaecida até que os novos resultados tenham carregado:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
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
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Pesquisar álbuns:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Carregando...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Sem correspondências para <i>"{query}"</i></p>;
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

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Não implementado');
  }
}

async function getSearchResults(query) {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
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

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<Note>

Tanto valores adiados quanto [Transições](#preventing-already-revealed-content-from-hiding) permitem que você evite mostrar o fallback do Suspense em favor de indicadores inline. Transições marcam toda a atualização como não urgente, então geralmente são usadas por frameworks e bibliotecas de roteamento para navegação. Valores adiados, por outro lado, são principalmente úteis em código de aplicação onde você deseja marcar uma parte da interface como não urgente e deixar que "atrasem" o restante da interface.

</Note>

---

### Impedindo que conteúdo já revelado seja ocultado {/*preventing-already-revealed-content-from-hiding*/}

Quando um componente suspende, a fronteira de Suspense pai mais próxima muda para mostrar o fallback. Isso pode levar a uma experiência do usuário abrupta se já estava exibindo algum conteúdo. Tente pressionar este botão:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
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
import { Suspense, useState } from 'react';
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

  function navigate(url) {
    setPage(url);
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
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Carregando...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Navegador de Música
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
      Abrir página do artista The Beatles
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

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

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

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
```

```js src/Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Não implementado');
  }
}

async function getBio() {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles eram uma banda de rock inglesa, 
    formada em Liverpool em 1960, composta por 
    John Lennon, Paul McCartney, George Harrison e 
    Ringo Starr.`;
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

Quando você pressionou o botão, o componente `Router` renderizou `ArtistPage` em vez de `IndexPage`. Um componente dentro de `ArtistPage` suspendeu, então a fronteira de Suspense mais próxima começou a mostrar o fallback. A fronteira mais próxima de Suspense estava perto da raiz, então todo o layout do site foi substituído por `BigSpinner`.

Para impedir isso, você pode marcar a atualização de navegação como uma *Transição* com [`startTransition`](/reference/react/startTransition):

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

Isso diz ao React que a transição do estado não é urgente, e é melhor continuar exibindo a página anterior em vez de ocultar qualquer conteúdo já revelado. Agora, clicar no botão "aguarda" o carregamento da `Biography`:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
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
import { Suspense, startTransition, useState } from 'react';
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
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Carregando...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Navegador de Música
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
      Abrir página do artista The Beatles
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

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

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

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
```

```js src/Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Não implementado');
  }
}

async function getBio() {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles eram uma banda de rock inglesa, 
    formada em Liverpool em 1960, composta por 
    John Lennon, Paul McCartney, George Harrison e 
    Ringo Starr.`;
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

A Transição não espera que *todo* o conteúdo carregue. Ela espera o tempo suficiente para evitar ocultar conteúdo já revelado. Por exemplo, o layout do site já estava revelado, portanto seria ruim ocultá-lo atrás de um spinner de carregamento. No entanto, a fronteira de Suspense aninhada ao redor de `Albums` é nova, então a Transição não espera por ela.

<Note>

Roteadores habilitados para Suspense devem envolver as atualizações de navegação em Transições por padrão.

</Note>

---

### Indicando que uma Transição está acontecendo {/*indicating-that-a-transition-is-happening*/}

No exemplo acima, uma vez que você clica no botão, não há indicação visual de que uma navegação está em andamento. Para adicionar um indicador, você pode substituir [`startTransition`](/reference/react/startTransition) por [`useTransition`](/reference/react/useTransition), que fornece um valor booleano `isPending`. No exemplo abaixo, ele é usado para mudar o estilo do cabeçalho do site enquanto uma Transição está acontecendo:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
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
        Navegador de Música
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
      Abrir página do artista The Beatles
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

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

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

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Nota: este componente é escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, experimente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Esta é uma solução para um erro para fazer a demonstração funcionar.
// TODO: substituir por implementação real quando o erro for corrigido.
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
```

```js src/Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Não implementado');
  }
}

async function getBio() {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles eram uma banda de rock inglesa, 
    formada em Liverpool em 1960, composta por 
    John Lennon, Paul McCartney, George Harrison e 
    Ringo Starr.`;
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

Uma Transição não espera que *todos* os conteúdos carreguem. Ela apenas espera o tempo suficiente para evitar ocultar conteúdo já revelado. Por exemplo, o layout do site já estava visível, portanto seria ruim ocultá-lo atrás de um carregando spinner. No entanto, a fronteira de Suspense aninhada em `Albums` é nova, então a Transição não espera por ela.

<Note>

Roteadores habilitados para Suspense devem envolver suas atualizações em Transições automaticamente.

</Note>

---

### Resetando fronteiras de Suspense na navegação {/*resetting-suspense-boundaries-on-navigation*/}

Durante uma Transição, o React evitará ocultar conteúdo já revelado. No entanto, se você navegar para uma rota com parâmetros diferentes, pode querer informar ao React que é conteúdo *diferente*. Você pode expressar isso com uma `key`:

```js
<ProfilePage key={queryParams.id} />
```

Imagine que você está navegando dentro de uma página de perfil de usuário, e algo suspende. Se essa atualização estiver envolta em uma Transição, não acionará o fallback para conteúdo já visível. Esse é o comportamento esperado.

No entanto, agora imagine que você está navegando entre dois perfis de usuário diferentes. Nesse caso, faz sentido mostrar o fallback. Por exemplo, a linha do tempo de um usuário é *conteúdo diferente* da linha do tempo de outro usuário. Ao especificar uma `key`, você garante que o React trate perfis de usuários diferentes como componentes diferentes e redefina as fronteiras do Suspense durante a navegação. Roteadores integrados com Suspense devem fazer isso automaticamente.

---

### Fornecendo um fallback para erros de servidor e conteúdo somente do cliente {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Se você usar uma das [APIs de renderização de servidor com streaming](/reference/react-dom/server) (ou um framework que dependa delas), o React também usará suas fronteiras `<Suspense>` para lidar com erros no servidor. Se um componente lançar um erro no servidor, o React não abortará a renderização do servidor. Em vez disso, ele encontrará o componente `<Suspense>` mais próximo acima e incluirá seu fallback (como um spinner) no HTML gerado do servidor. O usuário verá um spinner no início.

No cliente, o React tentará renderizar o mesmo componente novamente. Se ocorrer um erro no cliente também, o React lançará o erro e exibirá o [error boundary](/reference/react/Component#static-getderivedstatefromerror) mais próximo. No entanto, se não houver erro no cliente, o React não exibirá o erro ao usuário, uma vez que o conteúdo foi eventualmente exibido com sucesso.

Você pode usar isso para optar por alguns componentes não renderizáveis no servidor. Para fazer isso, lance um erro no ambiente do servidor e, em seguida, envolva-os em uma fronteira `<Suspense>` para substituir seu HTML por fallbacks:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('O Chat deve ser renderizado apenas no cliente.');
  }
  // ...
}
```

O HTML do servidor incluirá o indicador de carregamento. Ele será substituído pelo componente `Chat` no cliente.

---

## Solução de Problemas {/*troubleshooting*/}

### Como posso impedir que a interface seja substituída por um fallback durante uma atualização? {/*preventing-unwanted-fallbacks*/}

Substituir a interface visível por um fallback cria uma experiência do usuário abrupta. Isso pode acontecer quando uma atualização faz com que um componente suspenda, e a fronteira de Suspense mais próxima já está exibindo conteúdo para o usuário.

Para evitar que isso aconteça, [marque a atualização como não urgente usando `startTransition`](#preventing-already-revealed-content-from-hiding). Durante uma Transição, o React aguardará até que dados suficientes tenham sido carregados para evitar que um fallback indesejado apareça:

```js {2-3,5}
function handleNextPageClick() {
  // Se esta atualização suspender, não oculte o conteúdo já exibido
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Isso evitará ocultar conteúdo existente. No entanto, qualquer nova fronteira de Suspense renderizada será exibida imediatamente com fallbacks para evitar bloquear a interface e permitir que o usuário veja o conteúdo à medida que ele se torne disponível.

**O React só impedirá fallbacks indesejados durante atualizações não urgentes**. Ele não atrasará uma renderização se for resultado de uma atualização urgente. Você deve optar por uma API como [`startTransition`](/reference/react/startTransition) ou [`useDeferredValue`](/reference/react/useDeferredValue).

Se o seu roteador estiver integrado com o Suspense, ele deve envolver suas atualizações em [`startTransition`](/reference/react/startTransition) automaticamente.