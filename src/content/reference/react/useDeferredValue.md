---
title: useDeferredValue
---

<Intro>

`useDeferredValue` é um Hook do React que permite adiar a atualização de uma parte da UI.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Chame `useDeferredValue` no nível superior do seu componente para obter uma versão adiada desse valor.

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
* **opcional** `initialValue`: Um valor a ser usado durante a renderização inicial de um componente. Se esta opção for omitida, `useDeferredValue` não adiará durante a renderização inicial, pois não há uma versão anterior de `value` que ele possa renderizar em vez disso.


#### Retorna {/*returns*/}

- `currentValue`: Durante a renderização inicial, o valor adiado retornado será o `initialValue` ou o mesmo que o valor fornecido. Durante as atualizações, o React tentará primeiro uma nova renderização com o valor antigo (então retornará o valor antigo) e, em seguida, tentará outra nova renderização em segundo plano com o novo valor (então retornará o valor atualizado).

#### Ressalvas {/*caveats*/}

- Quando uma atualização está dentro de uma Transition, `useDeferredValue` sempre retorna o novo `value` e não gera uma renderização adiada, pois a atualização já está adiada.

- Os valores que você passa para `useDeferredValue` devem ser valores primitivos (como strings e números) ou objetos criados fora da renderização. Se você criar um novo objeto durante a renderização e passá-lo imediatamente para `useDeferredValue`, ele será diferente em cada renderização, causando re-renderizações desnecessárias em segundo plano.

- Quando `useDeferredValue` recebe um valor diferente (comparado com [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), além da renderização atual (quando ainda usa o valor anterior), ele agenda uma nova renderização em segundo plano com o novo valor. A nova renderização em segundo plano é interrompível: se houver outra atualização para o `value`, o React reiniciará a nova renderização em segundo plano do zero. Por exemplo, se o usuário estiver digitando em uma entrada mais rápido do que um gráfico que recebe seu valor adiado pode renderizar novamente, o gráfico só renderizará novamente depois que o usuário parar de digitar.

- `useDeferredValue` está integrado com [`<Suspense>`.](/reference/react/Suspense) Se a atualização em segundo plano causada por um novo valor suspender a UI, o usuário não verá o fallback. Eles verão o valor adiado antigo até que os dados sejam carregados.

- `useDeferredValue` por si só não impede solicitações de rede extras.

- Não há atraso fixo causado pelo próprio `useDeferredValue`. Assim que o React terminar a renderização original, o React começará a trabalhar imediatamente na renderização em segundo plano com o novo valor adiado. Quaisquer atualizações causadas por eventos (como digitação) interromperão a nova renderização em segundo plano e terão prioridade sobre ela.

- A nova renderização em segundo plano causada por `useDeferredValue` não dispara Effects até que seja confirmada na tela. Se a nova renderização em segundo plano suspender, seus Effects serão executados após o carregamento dos dados e as atualizações da UI.

---

## Uso {/*usage*/}

### Exibindo conteúdo obsoleto enquanto o conteúdo novo está carregando {/*showing-stale-content-while-fresh-content-is-loading*/}

Chame `useDeferredValue` no nível superior do seu componente para adiar a atualização de parte da sua UI.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Durante a renderização inicial, o <CodeStep step={2}>valor adiado</CodeStep> será o mesmo que o <CodeStep step={1}>valor</CodeStep> que você forneceu.

Durante as atualizações, o <CodeStep step={2}>valor adiado</CodeStep> "ficará para trás" do <CodeStep step={1}>valor</CodeStep> mais recente. Em particular, o React primeiro renderizará novamente *sem* atualizar o valor adiado e, em seguida, tentará renderizar novamente em segundo plano com o valor recém-recebido.

**Vamos analisar um exemplo para ver quando isso é útil.**

<Note>

Este exemplo supõe que você use uma fonte de dados compatível com Suspense:

- Obtenção de dados com estruturas compatíveis com Suspense como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense)
- Carregamento lento do código do componente com [`lazy`](/reference/react/lazy)
- Leitura do valor de uma Promise com [`use`](/reference/react/use)

[Saiba mais sobre Suspense e suas limitações.](/reference/react/Suspense)

</Note>


Neste exemplo, o componente `SearchResults` [suspende](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) enquanto busca os resultados da pesquisa. Tente digitar `"a"`, esperar pelos resultados e, em seguida, editar para `"ab"`. Os resultados de `"a"` são substituídos pelo fallback de carregamento.

<Sandpack>

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

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Nenhuma correspondência para <i>"{query}"</i></p>;
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
// Observação: a forma como você faria a obtenção de dados depende de
// da estrutura que você usa junto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de uma estrutura.

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
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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

<<<<<<< HEAD
Um padrão de UI alternativo comum é *adiar* a atualização da lista de resultados e continuar mostrando os resultados anteriores até que os novos resultados estejam prontos. Chame `useDeferredValue` para passar uma versão adiada da consulta:
=======
A common alternative UI pattern is to *defer* updating the list of results and to keep showing the previous results until the new results are ready. Call `useDeferredValue` to pass a deferred version of the query down:
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

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

O `query` atualizará imediatamente, para que a entrada exiba o novo valor. No entanto, o `deferredQuery` manterá seu valor anterior até que os dados sejam carregados, então `SearchResults` mostrará os resultados obsoletos por um tempo.

Digite `"a"` no exemplo abaixo, espere os resultados carregarem e, em seguida, edite a entrada para `"ab"`. Observe como, em vez do fallback Suspense, você agora vê a lista de resultados obsoletos até que os novos resultados sejam carregados:

<Sandpack>

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

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Nenhuma correspondência para <i>"{query}"</i></p>;
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
// Observação: a forma como você faria a obtenção de dados depende de
// da estrutura que você usa junto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de uma estrutura.

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
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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

#### Como adiar um valor funciona por baixo dos panos? {/*how-does-deferring-a-value-work-under-the-hood*/}

Você pode pensar que isso acontece em duas etapas:

<<<<<<< HEAD
1. **Primeiro, o React renderiza novamente com o novo `query` (`"ab"`) mas com o `deferredQuery` antigo (ainda `"a"`)** O valor `deferredQuery`, que você passa para a lista de resultados, é *adiado:* ele "fica para trás" do valor `query`.
=======
1. **First, React re-renders with the new `query` (`"ab"`) but with the old `deferredQuery` (still `"a"`).** The `deferredQuery` value, which you pass to the result list, is *deferred:* it "lags behind" the `query` value.
>>>>>>> 49c2d26722fb1b5865ce0221a4cadc71b615e4cf

2. **Em segundo plano, o React tenta renderizar novamente com *ambos* `query` e `deferredQuery` atualizados para `"ab"`** Se esta nova renderização for concluída, o React exibirá na tela. No entanto, se ele suspender (os resultados de `"ab"` ainda não foram carregados), o React abandonará esta tentativa de renderização e tentará novamente esta nova renderização após o carregamento dos dados. O usuário continuará vendo o valor adiado obsoleto até que os dados estejam prontos.

A renderização "em segundo plano" adiada é interrompível. Por exemplo, se você digitar na entrada novamente, o React a abandonará e reiniciará com o novo valor. O React sempre usará o valor fornecido mais recente.

Observe que ainda há uma solicitação de rede por cada pressionamento de tecla. O que está sendo adiado aqui é a exibição de resultados (até que estejam prontos), não as próprias solicitações de rede. Mesmo que o usuário continue digitando, as respostas de cada pressionamento de tecla são armazenadas em cache, portanto, pressionar Backspace é instantâneo e não busca novamente.

</DeepDive>

---

### Indicando que o conteúdo está obsoleto {/*indicating-that-the-content-is-stale*/}

No exemplo acima, não há indicação de que a lista de resultados para a última consulta ainda está carregando. Isso pode ser confuso para o usuário se os novos resultados demorarem um pouco para carregar. Para tornar mais óbvio para o usuário que a lista de resultados não corresponde à consulta mais recente, você pode adicionar uma indicação visual quando a lista de resultados obsoleta for exibida:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Com essa alteração, assim que você começar a digitar, a lista de resultados obsoleta fica ligeiramente esmaecida até que a nova lista de resultados carregue. Você também pode adicionar uma transição CSS para atrasar o esmaecimento para que pareça gradual, como no exemplo abaixo:

<Sandpack>

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

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Nenhuma correspondência para <i>"{query}"</i></p>;
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
// Observação: a forma como você faria a obtenção de dados depende de
// da estrutura que você usa junto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de uma estrutura.

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
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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

### Adiar a nova renderização de uma parte da UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Você também pode aplicar `useDeferredValue` como uma otimização de desempenho. É útil quando uma parte da sua UI é lenta para renderizar novamente, não há uma maneira fácil de otimizá-la e você deseja impedir que ela bloqueie o restante da UI.

Imagine que você tem um campo de texto e um componente (como um gráfico ou uma lista longa) que renderiza dinamicamente a cada pressionamento de tecla:

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

Primeiro, otimize `SlowList` para pular a nova renderização quando suas props forem as mesmas. Para fazer isso, [envolva-o em `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

No entanto, isso só ajuda se os props `SlowList` forem *os mesmos* que durante a renderização anterior. O problema que você está enfrentando agora é que é lento quando eles são *diferentes* e quando você realmente precisa mostrar uma saída visual diferente.

Especificamente, o principal problema de desempenho é que, sempre que você digita na entrada, o `SlowList` recebe novas props, e a nova renderização de toda a sua árvore torna a digitação desajeitada. Nesse caso, `useDeferredValue` permite que você priorize a atualização da entrada (que deve ser rápida) em vez de atualizar a lista de resultados (que pode ser mais lenta):

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

Isso não torna a nova renderização do `SlowList` mais rápida. No entanto, ele diz ao React que a nova renderização da lista pode ser despriorizada para que não bloqueie as teclas. A lista "ficará para trás" da entrada e, em seguida, "alcançará". Como antes, o React tentará atualizar a lista o mais rápido possível, mas não impedirá o usuário de digitar.

<Recipes titleText="A diferença entre useDeferredValue e nova renderização não otimizada" titleId="examples">

#### Nova renderização da lista adiada {/*deferred-re-rendering-of-the-list*/}

Neste exemplo, cada item no componente `SlowList` é **artificialmente desacelerado** para que você possa ver como `useDeferredValue` permite que você mantenha a entrada responsiva. Digite na entrada e observe que a digitação parece ágil enquanto a lista "fica para trás" dela.

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

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log uma vez. A desaceleração real está dentro de SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

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
    // Não faça nada por 1 ms por item para emular um código extremamente lento
  }

  return (
    <li className="item">
      Text: {text}
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

#### Nova renderização não otimizada da lista {/*unoptimized-re-rendering-of-the-list*/}

Neste exemplo, cada item no componente `SlowList` é **artificialmente desacelerado**, mas não há `useDeferredValue`.

Observe como a digitação na entrada parece muito instável. Isso ocorre porque, sem `useDeferredValue`, cada pressionamento de tecla força a renderização imediata de toda a lista de forma não interrompível.

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

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log uma vez. A desaceleração real está dentro de SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

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
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
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

Esta otimização exige que o `SlowList` seja envolvido em [`memo`.](/reference/react/memo) Isso ocorre porque sempre que o `text` muda, o React precisa ser capaz de renderizar novamente o componente pai rapidamente. Durante essa nova renderização, o `deferredText` ainda tem seu valor anterior, então `SlowList` é capaz de pular a nova renderização (seus props não foram alterados). Sem [`memo`,](/reference/react/memo) ele teria que renderizar novamente de qualquer maneira, derrotando o objetivo da otimização.

</Pitfall>

<DeepDive>

#### Como adiar um valor é diferente de debouncing e throttling? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Existem duas técnicas comuns de otimização que você pode ter usado antes neste cenário:

- *Debouncing* significa que você esperaria até que o usuário parasse de digitar (por exemplo, por um segundo) antes de atualizar a lista.
- *Throttling* significa que você atualizaria a lista de vez em quando (por exemplo, no máximo uma vez por segundo).

Embora essas técnicas sejam úteis em alguns casos, `useDeferredValue` é mais adequado para otimizar a renderização porque é profundamente integrado ao próprio React e se adapta ao dispositivo do usuário.

Ao contrário de debouncing ou throttling, ele não requer a escolha de nenhum atraso fixo. Se o dispositivo do usuário for rápido (por exemplo, um laptop poderoso), a nova renderização adiada aconteceria quase imediatamente e não seria perceptível. Se o dispositivo do usuário for lento, a lista "ficará para trás" da entrada proporcionalmente a quão lento é o dispositivo.

Além disso, ao contrário de debouncing ou throttling, as novas renderizações adiadas feitas pelo `useDeferredValue` são interrompíveis por padrão. Isso significa que, se o React estiver no meio de renderizar novamente uma lista grande, mas o usuário fizer outra pressionada de tecla, o React abandonará essa nova renderização, tratará a pressionada de tecla e, em seguida, começará a renderizar novamente em segundo plano. Em contraste, debouncing e throttling ainda produzem uma experiência instável porque são *bloqueantes:* eles meramente adiam o momento em que a renderização bloqueia a pressionada de tecla.

Se o trabalho que você está otimizando não acontecer durante a renderização, debouncing e throttling ainda são úteis. Por exemplo, eles podem permitir que você dispare menos solicitações de rede. Você também pode usar essas técnicas juntas.

</DeepDive>