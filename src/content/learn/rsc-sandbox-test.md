---
title: RSC Sandbox Test
---

## Componente de Servidor Básico {/*basic-server-component*/}

<SandpackRSC>

```js src/App.js
export default function App() {
  return <h1>Hello from a Server Component!</h1>;
}
```

</SandpackRSC>

## Componentes de Servidor + Cliente {/*server-client*/}

<SandpackRSC>

```js src/App.js
import Counter from './Counter';

export default function App() {
  return (
    <div>
      <h1>Server Component</h1>
      <p>This text is rendered on the server.</p>
      <Counter />
    </div>
  );
}
```

```js src/Counter.js
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

</SandpackRSC>

## Componente de Servidor Assíncrono com Suspense {/*async-suspense*/}

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import Albums from './Albums';

export default function App() {
  return (
    <div>
      <h1>Music</h1>
      <Suspense fallback={<p>Loading albums...</p>}>
        <Albums />
      </Suspense>
    </div>
  );
}
```

```js src/Albums.js
async function fetchAlbums() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ['Abbey Road', 'Let It Be', 'Revolver'];
}

export default async function Albums() {
  const albums = await fetchAlbums();
  return (
    <ul>
      {albums.map(album => (
        <li key={album}>{album}</li>
      ))}
    </ul>
  );
}
```

</SandpackRSC>

## Prova de Streaming {/*streaming-proof*/}

Esta demonstração prova que o streaming é incremental. A "shell" renderiza instantaneamente com um fallback `<Suspense>`. Após 2 segundos, o componente assíncrono é transmitido e o substitui — sem re-renderizar o conteúdo externo. Os timestamps mostram a diferença.

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import SlowData from './SlowData';
import Timestamp from './Timestamp';

export default function App() {
  return (
    <div>
      <h1>Streaming Proof</h1>
      <p>Shell rendered at: <Timestamp /></p>
      <Suspense fallback={<p>⏳ Waiting for data to stream in...</p>}>
        <SlowData />
      </Suspense>
    </div>
  );
}
```

```js src/SlowData.js
import Timestamp from './Timestamp';

async function fetchData() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return ['Chunk A', 'Chunk B', 'Chunk C'];
}

export default async function SlowData() {
  const items = await fetchData();
  return (
    <div>
      <p>Data streamed in at: <Timestamp /></p>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/Timestamp.js
'use client';

export default function Timestamp() {
  return <strong>{new Date().toLocaleTimeString()}</strong>;
}
```

</SandpackRSC>

## Tipos de Dados do Flight {/*flight-data-types*/}

Esta demonstração passa Map, Set, Date e BigInt de um componente de servidor através do stream Flight para um componente de cliente, provando que o sistema de tipos completo do protocolo Flight funciona de ponta a ponta.

<SandpackRSC>

```js src/App.js
import DataViewer from './DataViewer';

export default function App() {
  const map = new Map([
    ['alice', 100],
    ['bob', 200],
  ]);
  const set = new Set(['react', 'next', 'remix']);
  const date = new Date('2025-06-15T12:00:00Z');
  const big = 9007199254740993n;

  return (
    <div>
      <h1>Flight Data Types</h1>
      <DataViewer map={map} set={set} date={date} big={big} />
    </div>
  );
}
```

```js src/DataViewer.js
'use client';

export default function DataViewer({ map, set, date, big }) {
  const checks = [
    ['Map', map instanceof Map, () => (
      <ul>{[...map.entries()].map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>
    )],
    ['Set', set instanceof Set, () => (
      <ul>{[...set].map(v => <li key={v}>{v}</li>)}</ul>
    )],
    ['Date', date instanceof Date, () => (
      <p>{date.toISOString()}</p>
    )],
    ['BigInt', typeof big === 'bigint', () => (
      <p>{big.toString()}</p>
    )],
  ];

  return (
    <div>
      {checks.map(([label, passed, render]) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <strong>{label}: {passed ? 'pass' : 'FAIL'}</strong>
          {render()}
        </div>
      ))}
    </div>
  );
}
```

</SandpackRSC>

## Streaming de Promessas com use() {/*promise-streaming-use*/}

O servidor cria uma promessa (resolve em 2s) e a passa como prop através de um componente pai assíncrono que suspende por 3s. Quando o pai revela por volta de 3s, a promessa já está resolvida — então `use()` retorna instantaneamente sem um fallback interno. O tempo decorrido deve ser de ~3000ms (o atraso do pai), não ~5000ms (o que significaria que a promessa reiniciou no cliente).

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import SlowParent from './SlowParent';
import UserCard from './UserCard';

async function fetchUser() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { name: 'Alice', role: 'Engineer' };
}

function now() {
  return Date.now();
}

export default function App() {
  const serverTime = now();
  const userPromise = fetchUser();
  return (
    <div>
      <h1>Promise Streaming</h1>
      <p>Promise resolves in 2s. Parent suspends for 3s.</p>
      <Suspense fallback={<p>Outer: waiting for parent (3s)...</p>}>
        <SlowParent>
          <Suspense fallback={<p>Inner: waiting for data (should not appear!)</p>}>
            <UserCard userPromise={userPromise} serverTime={serverTime} />
          </Suspense>
        </SlowParent>
      </Suspense>
    </div>
  );
}
```

```js src/SlowParent.js
export default async function SlowParent({ children }) {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return <div>{children}</div>;
}
```

```js src/UserCard.js
'use client';
import { use } from 'react';

function now() {
  return Date.now();
}
export default function UserCard({ userPromise, serverTime }) {
  const user = use(userPromise);
  const elapsed = now() - serverTime;
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 16,
    }}>
      <strong>{user.name}</strong>
      <p>{user.role}</p>
      <p style={{ fontSize: 13 }}>
        Rendered {elapsed}ms after server created the promise.
      </p>
      <p style={{ color: '#666', fontSize: 12 }}>
        ~3000ms = promise already resolved, waited only for parent.
        ~5000ms would mean the promise restarted on the client.
      </p>
    </div>
  );
}
```

</SandpackRSC>

## Tipos de Dados do Flight em Ações de Servidor {/*flight-data-types-actions*/}

Esta demonstração envia Map, Set, Date e BigInt de um componente de cliente *para* uma ação de servidor via `encodeReply`/`decodeReply`, e então verifica se os tipos sobreviveram à viagem de ida e volta.

<SandpackRSC>

```js src/App.js
import { testTypes, getResults } from './actions';
import TestButton from './TestButton';

export default async function App() {
  const results = await getResults();
  return (
    <div>
      <h1>Flight Types in Server Actions</h1>
      <TestButton testTypes={testTypes} />
      {results ? (
        <div>
          {results.map(r => (
            <div key={r.label} style={{ marginBottom: 12 }}>
              <strong>{r.label}: {r.ok ? 'pass' : 'FAIL'}</strong>
              <p>{r.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Click the button to send typed data to the server action.</p>
      )}
    </div>
  );
}
```

```js src/actions.js
'use server';

let results = null;

export async function testTypes(map, set, date, big) {
  results = [
    {
      label: 'Map',
      ok: map instanceof Map,
      detail: map instanceof Map
        ? 'entries: ' + JSON.stringify([...map.entries()])
        : 'received: ' + typeof map,
    },
    {
      label: 'Set',
      ok: set instanceof Set,
      detail: set instanceof Set
        ? 'values: ' + JSON.stringify([...set])
        : 'received
