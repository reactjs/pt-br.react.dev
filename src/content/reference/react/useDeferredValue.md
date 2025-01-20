---
title: useDeferredValue
---

<Intro>

`useDeferredValue` é um Hook do React que permite adiar a atualização de uma parte da interface do usuário.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Chame `useDeferredValue` no nível mais alto do seu componente para obter uma versão adiada desse valor.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `value`: O valor que você deseja adiar. Ele pode ter qualquer tipo.
* <CanaryBadge title="Esse recurso está disponível apenas no canal Canary" /> **opcional** `initialValue`: Um valor a ser utilizado durante a renderização inicial de um componente. Se esta opção for omitida, `useDeferredValue` não irá adiar durante a renderização inicial, pois não há uma versão anterior de `value` para renderizar em vez disso.


#### Retornos {/*returns*/}

- `currentValue`: Durante a renderização inicial, o valor adiado retornado será o mesmo que o valor fornecido. Durante as atualizações, o React primeiro tentará uma nova renderização com o valor antigo (portanto, retornará o valor antigo) e, em seguida, tentará outra renderização em segundo plano com o novo valor (portanto, retornará o valor atualizado).

<Canary>

Nas versões mais recentes do React Canary, `useDeferredValue` retorna o `initialValue` na renderização inicial e agenda uma nova renderização em segundo plano com o `value` retornado.

</Canary>

#### Ressalvas {/*caveats*/}

- Quando uma atualização está dentro de uma Transição, `useDeferredValue` sempre retorna o novo `value` e não gera uma renderização adiada, já que a atualização já está adiada.

- Os valores que você passa para `useDeferredValue` devem ser valores primitivos (como strings e números) ou objetos criados fora da renderização. Se você criar um novo objeto durante a renderização e imediatamente passá-lo para `useDeferredValue`, ele será diferente a cada renderização, causando renderizações em segundo plano desnecessárias.

- Quando `useDeferredValue` recebe um valor diferente (comparado com [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), além da renderização atual (quando ainda usa o valor anterior), ele agenda uma nova renderização em segundo plano com o novo valor. A nova renderização em segundo plano é interrompível: se houver outra atualização para o `value`, o React reiniciará a nova renderização em segundo plano do zero. Por exemplo, se o usuário estiver digitando em um campo de entrada mais rápido do que um gráfico recebendo seu valor adiado pode renderizar, o gráfico só será re-renderizado após o usuário parar de digitar.

- `useDeferredValue` é integrado com [`<Suspense>`](/reference/react/Suspense). Se a atualização em segundo plano causada por um novo valor suspender a interface do usuário, o usuário não verá a opção de recuperação. Eles verão o antigo valor adiado até que os dados sejam carregados.

- `useDeferredValue` não por si só impede requisições de rede extras.

- Não há um atraso fixo causado pelo próprio `useDeferredValue`. Assim que o React termina a renderização original, ele começará imediatamente a trabalhar na nova renderização em segundo plano com o novo valor adiado. Quaisquer atualizações causadas por eventos (como digitação) interromperão a nova renderização em segundo plano e terão prioridade sobre ela.

- A nova renderização em segundo plano causada por `useDeferredValue` não dispara Efeitos até que esteja comprometida na tela. Se a nova renderização em segundo plano for suspensa, seus Efeitos serão executados após os dados serem carregados e a interface do usuário for atualizada.

---

## Uso {/*usage*/}

### Mostrando conteúdo defasado enquanto o conteúdo fresco é carregado {/*showing-stale-content-while-fresh-content-is-loading*/}

Chame `useDeferredValue` no nível mais alto do seu componente para adiar a atualização de alguma parte da sua interface.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Durante a renderização inicial, o <CodeStep step={2}>valor adiado</CodeStep> será o mesmo que o <CodeStep step={1}>valor</CodeStep> que você forneceu.

Durante as atualizações, o <CodeStep step={2}>valor adiado</CodeStep> irá "atrasar-se" em relação ao <CodeStep step={1}>valor</CodeStep> mais recente. Em particular, o React primeiro re-renderizará *sem* atualizar o valor adiado e, em seguida, tentará re-renderizar com o novo valor recebido em segundo plano.

**Vamos percorrer um exemplo para ver quando isso é útil.**

<Note>

Este exemplo assume que você usa uma fonte de dados habilitada para Suspense:

- Busca de dados com frameworks habilitados para Suspense, como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Carregamento lento do código do componente com [`lazy`](/reference/react/lazy)
- Lendo o valor de uma Promise com [`use`](/reference/react/use)

[Saiba mais sobre Suspense e suas limitações.](/reference/react/Suspense)

</Note>


Neste exemplo, o componente `SearchResults` [suspende](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) enquanto busca os resultados da pesquisa. Tente digitar `"a"`, aguarde os resultados e então edite para `"ab"`. Os resultados para `"a"` são substituídos pela opção de recuperação de carregamento.

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

// Nota: este componente foi escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, tente um framework
// que seja integrado com Suspense, como Relay ou Next.js.

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

// Este é um trabalho em volta de um erro para fazer a demonstração funcionar.
// TODO: substituir por uma implementação real quando o erro for corrigido.
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
// Nota: a forma como você faria busca de dados depende do
// framework que você usa junto com Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

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
  // Adiciona um atraso falso para tornar a espera notável.
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

Um padrão comum de interface do usuário é *adicionar* a atualização da lista de resultados e continuar mostrando os resultados anteriores até que os novos resultados estejam prontos. Chame `useDeferredValue` para passar uma versão adiada da consulta para baixo: 

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

A `query` será atualizada imediatamente, então o campo de entrada exibirá o novo valor. No entanto, o `deferredQuery` manterá seu valor anterior até que os dados tenham sido carregados, de modo que `SearchResults` mostrará os resultados desatualizados por um tempo.

Digite `"a"` no exemplo abaixo, aguarde o carregamento dos resultados e, em seguida, edite a entrada para `"ab"`. Observe como, ao invés da opção de recuperação do Suspense, você agora vê a lista de resultados desatualizada até que os novos resultados tenham sido carregados:

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

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Nota: este componente foi escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, tente um framework
// que é integrado com Suspense, como Relay ou Next.js.

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

// Este é um trabalho em volta de um erro para fazer a demonstração funcionar.
// TODO: substituir por uma implementação real quando o erro for corrigido.
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
// Nota: a forma como você faria busca de dados depende do
// framework que você usa junto com Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

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
  // Adiciona um atraso falso para tornar a espera notável.
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

<DeepDive>

#### Como funciona o adiamento de um valor nos bastidores? {/*how-does-deferring-a-value-work-under-the-hood*/}

Você pode pensar que isso acontece em duas etapas:

1. **Primeiro, o React re-renderiza com a nova `query` (`"ab"`) mas com o antigo `deferredQuery` (ainda `"a"`).** O valor de `deferredQuery`, que você passa para a lista de resultados, está *adiado:* ele "atrasou-se" em relação ao valor de `query`.

2. **Em segundo plano, o React tenta re-renderizar com *os dois* `query` e `deferredQuery` atualizados para `"ab"`.** Se essa nova renderização for concluída, o React a mostrará na tela. No entanto, se ela suspender (os resultados para `"ab"` ainda não foram carregados), o React abandonará essa tentativa de renderização e tentará mais uma vez após os dados terem sido carregados. O usuário continuará vendo o valor adiado desatualizado até que os dados estejam prontos.

A renderização "em segundo plano" adiada é interrompível. Por exemplo, se você digitar no campo de entrada novamente, o React abandonará essa renderização e reiniciará com o novo valor. O React sempre usará o valor mais recente fornecido.

Observe que ainda existe uma requisição de rede para cada tecla digitada. O que está sendo adiado aqui é a exibição de resultados (até que estejam prontos), não as requisições de rede em si. Mesmo se o usuário continuar digitando, as respostas para cada tecla digitada são armazenadas em cache, então pressionar Backspace é instantâneo e não busca novamente.

</DeepDive>

---

### Indicando que o conteúdo está desatualizado {/*indicating-that-the-content-is-stale*/}

No exemplo acima, não há indicação de que a lista de resultados para a consulta mais recente ainda está carregando. Isso pode ser confuso para o usuário se os novos resultados demorarem a carregar. Para deixar mais óbvio para o usuário que a lista de resultados não corresponde à consulta mais recente, você pode adicionar uma indicação visual quando a lista de resultados desatualizada é exibida:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Com essa mudança, assim que você começar a digitar, a lista de resultados desatualizada será ligeiramente diminuída até que a nova lista de resultados carregue. Você também pode adicionar uma transição CSS para atrasar a diminuição de modo que se sinta gradual, como no exemplo abaixo:

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
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Nota: este componente foi escrito usando uma API experimental
// que ainda não está disponível nas versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, tente um framework
// que é integrado com Suspense, como Relay ou Next.js.

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

// Este é um trabalho em volta de um erro para fazer a demonstração funcionar.
// TODO: substituir por uma implementação real quando o erro for corrigido.
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
// Nota: a forma como você faria busca de dados depende do
// framework que você usa junto com Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

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
  // Adiciona um atraso falso para tornar a espera notável.
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

---

### Adiando re-renderizações para uma parte da interface do usuário {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Você também pode aplicar `useDeferredValue` como uma otimização de desempenho. Isso é útil quando uma parte da sua interface do usuário está lenta para re-renderizar, não há uma maneira fácil de otimizá-la e você deseja evitar que isso bloqueie o restante da interface.

Imagine que você tem um campo de texto e um componente (como um gráfico ou uma lista longa) que re-renderiza a cada tecla pressionada:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

Primeiro, otimize `SlowList` para pular a re-renderização quando suas props forem as mesmas. Para fazer isso, [envolva-o em `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

No entanto, isso só ajuda se as props do `SlowList` forem *as mesmas* que durante a renderização anterior. O problema que você enfrenta agora é que ele é lento quando são *diferentes*, e quando você realmente precisa mostrar uma saída visual diferente.

Concretamente, o principal problema de desempenho é que, sempre que você digita no campo de entrada, o `SlowList` recebe novas props e a re-renderização de toda a sua árvore faz com que a digitação pareça estranha. Nesse caso, `useDeferredValue` permite que você priorize a atualização do campo de entrada (que deve ser rápida) em relação à atualização da lista de resultados (que pode ser mais lenta):

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Isso não torna a re-renderização do `SlowList` mais rápida. No entanto, diz ao React que a re-renderização da lista pode ser despriorizada, para que isso não bloqueie as teclas digitadas. A lista irá "atrasar-se" em relação à entrada e depois "recuperar-se". Como antes, o React tentará atualizar a lista o mais rápido possível, mas não bloqueará o usuário de digitar.

<Recipes titleText="A diferença entre useDeferredValue e re-renderização não otimizada" titleId="examples">

#### Re-renderização adiada da lista {/*deferred-re-rendering-of-the-list*/}

Neste exemplo, cada item no componente `SlowList` é **artificialmente desacelerado** para que você possa ver como `useDeferredValue` permite que você mantenha a entrada responsiva. Digite no campo de entrada e note que a digitação parece rápida enquanto a lista "atrasada" é exibida.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log uma vez. A desaceleração real está dentro do SlowItem.
  console.log('[ARTIFICIALMENTE LENTO] Renderizando 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não faz nada por 1 ms por item para emular código extremamente lento
  }

  return (
    <li className="item">
      Texto: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Re-renderização não otimizada da lista {/*unoptimized-re-rendering-of-the-list*/}

Neste exemplo, cada item no componente `SlowList` é **artificialmente desacelerado**, mas não há `useDeferredValue`.

Note como digitar no campo de entrada parece muito estranho. Isso acontece porque, sem `useDeferredValue`, cada tecla pressionada força toda a lista a re-renderizar imediatamente de uma maneira não interrompível.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log uma vez. A desaceleração real está dentro do SlowItem.
  console.log('[ARTIFICIALMENTE LENTO] Renderizando 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não faz nada por 1 ms por item para emular código extremamente lento
  }

  return (
    <li className="item">
      Texto: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Essa otimização requer que `SlowList` seja envolto em [`memo`.](/reference/react/memo) Isso ocorre porque, sempre que o `text` muda, o React precisa ser capaz de re-renderizar rapidamente o componente pai. Durante essa re-renderização, `deferredText` ainda tem seu valor anterior, então `SlowList` é capaz de pular a re-renderização (suas props não mudaram). Sem [`memo`,](/reference/react/memo) ele teria que re-renderizar de qualquer maneira, o que anularia o propósito da otimização.

</Pitfall>

<DeepDive>

#### Como o adiamento de um valor é diferente de debouncing e throttling? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Existem duas técnicas comuns de otimização que você pode ter usado antes neste cenário:

- *Debouncing* significa que você esperaria o usuário parar de digitar (por exemplo, por um segundo) antes de atualizar a lista.
- *Throttling* significa que você atualizaria a lista de vez em quando (por exemplo, no máximo uma vez por segundo).

Embora essas técnicas sejam úteis em alguns casos, `useDeferredValue` é mais adequado para otimizar renderização porque está profundamente integrado com o próprio React e se adapta ao dispositivo do usuário.

Ao contrário de debouncing ou throttling, não requer que você escolha nenhum atraso fixo. Se o dispositivo do usuário for rápido (por exemplo, um laptop potente), a nova renderização adiada ocorreria quase imediatamente e não seria notável. Se o dispositivo do usuário for lento, a lista "atrasaria-se" em relação à entrada proporcionalmente à lentidão do dispositivo.

Além disso, ao contrário do debouncing ou throttling, as novas renderizações em segundo plano feitas por `useDeferredValue` são interrompíveis por padrão. Isso significa que, se o React estiver no meio da re-renderização de uma lista grande, mas o usuário fizer outra tecla, o React abandonará essa re-renderização, lidará com a tecla e, em seguida, começará a renderizar em segundo plano novamente. Em contraste, debouncing e throttling ainda produzem uma experiência estranha porque são *bloqueadores:* eles apenas postergam o momento em que a renderização bloqueia a tecla.

Se o trabalho que você está otimizando não acontecer durante a renderização, debouncing e throttling ainda são úteis. Por exemplo, eles podem permitir que você faça menos requisições de rede. Você também pode usar essas técnicas juntas.

</DeepDive>