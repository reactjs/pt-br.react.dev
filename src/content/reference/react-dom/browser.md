---
title: browser
---

<Intro>

`browser` permite que você marque um componente para ser renderizado apenas no navegador durante a renderização no servidor.

```js
use(browser(reason?))
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `browser(reason?)` {/*browser*/}

Chame `browser` dentro de [`use`](/reference/react/use) para marcar um componente para ser renderizado apenas no navegador durante a renderização no servidor:

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

Durante a renderização no servidor, `use(browser())` interrompe a renderização do componente e deixa em seu lugar o fallback do limite [`<Suspense>`](/reference/react/Suspense) mais próximo. No navegador, `use(browser())` retorna `undefined`, então o componente é renderizado normalmente.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* **opcional** `reason`: Uma string ou função que explica por que o conteúdo precisa ser renderizado no navegador. A string, ou o valor retornado pela função, se torna a `cause` do `Error` passado para [`onBrowserBailout`](#reporting-browser-only-rendering-on-the-server). O React chama uma função de motivo toda vez que um renderizador de servidor encontra o valor retornado por `browser`, mas não a chama no navegador. Se criar o motivo for custoso, passe uma função como `() => new Error(...)`.

#### Retornos {/*returns*/}

`browser` retorna um valor opaco que você pode passar para `use` em um componente ou usar como motivo ao [abortar uma renderização no servidor](#aborting-pending-server-rendering-for-the-browser). No navegador, passar esse valor para `use` retorna `undefined`.

#### Ressalvas {/*caveats*/}

* `use(browser())` deve estar dentro de um limite `<Suspense>` durante a renderização no servidor. Sem ele, a renderização no servidor falha.
* `use(browser())` deve ser chamado a partir de um [Client Component](/reference/rsc/use-client), e não de um [Server Component](/reference/rsc/server-components).
* Chamar `browser()` sozinho não tem efeito. Para marcar um componente para ser renderizado apenas no navegador, passe o valor retornado por `browser` para `use`. Não o lance.

---

## Uso {/*usage*/}

### Renderizando conteúdo apenas no navegador {/*rendering-content-only-in-the-browser*/}

Chame `browser` dentro de `use` em um componente que deve ser renderizado apenas no navegador:

Você pode usar isso em vez de verificar `typeof window`, esperar que um [`Effect`](/reference/react/useEffect) defina um estado de "montado" ou usar uma opção do framework para desativar a renderização no servidor.

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

<Note>

`use(browser())` deve ser chamado a partir de um Client Component. Se o seu framework usa Server Components por padrão, adicione a diretiva [`'use client'`](/reference/rsc/use-client) a esse arquivo ou mova a chamada para um Client Component filho:

```js {1}
'use client';

import { use, useState } from 'react';
import { browser } from 'react-dom';

export default function SavedDraft() {
  use(browser('The saved draft is stored in localStorage.'));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}
```

</Note>

---

### Renderizando condicionalmente no servidor {/*conditionally-rendering-on-the-server*/}

Assim como outras chamadas a [`use`](/reference/react/use), `use(browser())` pode ser chamado dentro de uma instrução condicional ou após um retorno antecipado. Isso permite que um Componente ou Hook personalizado deixe de ser renderizado no servidor com base em uma condição, como o valor de uma prop.

Por exemplo, este Hook `useTimeZone` aceita um valor padrão opcional. Quando ele é fornecido, o React renderiza o valor padrão no HTML inicial e no navegador. Sem um valor padrão, o Componente suspende durante a renderização no servidor e mostra o fuso horário local do dispositivo no navegador.

Clique em **Reload** para ver o fallback de carregamento antes que o fuso horário do usuário apareça.

<Sandpack>

```js src/App.js
import { Suspense } from 'react';
import { useTimeZone } from './useTimeZone.js';

function TimeZone({label, defaultTimeZone}) {
  const timeZone = useTimeZone(defaultTimeZone);
  return <p>{label}: <strong>{timeZone}</strong></p>;
}

export default function App() {
  return (
    <>
      <h1>Event details</h1>
      <TimeZone
        label="Event time zone"
        defaultTimeZone="America/New_York"
      />
      <Suspense fallback={<p>Loading your time zone...</p>}>
        <TimeZone label="Your time zone" />
      </Suspense>
    </>
  );
}
```

```js src/useTimeZone.js active
import { use } from 'react';
import { browser } from 'react-dom';

export function useTimeZone(defaultTimeZone) {
  if (defaultTimeZone !== undefined) {
    return defaultTimeZone;
  }

  use(browser('No default time zone was provided.'));
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
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
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
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

Você pode aplicar um padrão semelhante para evitar condicionalmente a renderização no servidor ao usar uma biblioteca de busca de dados habilitada para Suspense:

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser('useBrowserQuery: No initial data was provided.'));
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

Com `initialData`, o React renderiza o Componente em HTML no servidor. Sem ele, o React deixa no HTML o fallback do limite [`<Suspense>`](/reference/react/Suspense) mais próximo. No navegador, `useQuery` pode buscar os dados ou lê-los do seu cache no cliente, como de costume.

---

### Reportando no servidor a renderização apenas no navegador {/*reporting-browser-only-rendering-on-the-server*/}

Passe um callback `onBrowserBailout` para o renderizador de servidor para reportar a renderização apenas no navegador. Quando o React deixa um fallback do Suspense para o navegador, ele não chama o callback `onError` do renderizador de servidor nem o callback [`onRecoverableError` de `hydrateRoot`](/reference/react-dom/client/hydrateRoot#error-logging-in-production). Este exemplo também passa um motivo, que fica disponível como a `cause` do erro reportado:

```js
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

function SavedDraft() {
  use(browser(() => new Error('The saved draft is stored in localStorage.')));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}

function App() {
  return (
    <Suspense fallback={<p>Loading saved draft...</p>}>
      <SavedDraft />
    </Suspense>
  );
}

const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
  },
  onBrowserBailout(error, errorInfo) {
    logBrowserBailout(error, errorInfo);
  }
});
```

`onBrowserBailout` recebe dois argumentos:

1. Um `Error` descrevendo a renderização apenas no navegador. Se você passou um motivo para `browser`, ele fica disponível como a `cause` do erro.
2. Um objeto `errorInfo` com uma `componentStack` mostrando onde a renderização apenas no navegador ocorreu.

A função de motivo pode retornar qualquer valor. Retorne um novo `Error` para dar à causa a sua própria stack sem criar o `Error` no navegador. O React não serializa o motivo no HTML.

Se não houver um limite de Suspense para fornecer um fallback, a renderização no servidor falha. O React reporta a falha pelos callbacks de erro habituais do renderizador em vez de `onBrowserBailout`.

---

### Abortando a renderização pendente no servidor em favor do navegador {/*aborting-pending-server-rendering-for-the-browser*/}

Se você chama uma API de renderização no servidor diretamente, pode parar de esperar pelo conteúdo pendente e deixar que o navegador termine de renderizá-lo. Passe o valor retornado por `browser` como motivo ao abortar a renderização no servidor. O React então deixa os limites de Suspense pendentes em seu estado de fallback e renderiza o conteúdo deles no navegador:

```js {1,8}
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
    setTimeout(() => {
      abort(browser('The server render timed out.'));
    }, 10000);
  }
});
```

Um motivo de abort criado com `browser` não dispara o callback `onError` do renderizador de servidor nem o callback `onRecoverableError` de `hydrateRoot`. Em vez disso, o renderizador de servidor reporta cada limite de Suspense recuperado para `onBrowserBailout`.

Para APIs de renderização no servidor que aceitam um [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), passe `browser()` como motivo para [`AbortController.abort`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
