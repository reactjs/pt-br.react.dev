---
title: resume
---

<Intro>

`resume` transmite uma árvore React pré-renderizada para um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await resume(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API depende de [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Para Node.js, use [`resumeToNodeStream`](/reference/react-dom/server/renderToPipeableStream) em vez disso.

</Note>

---

## Referência {/*reference*/}

### `resume(node, postponedState, options?)` {/*resume*/}

Chame `resume` para retomar a renderização de uma árvore React pré-renderizada como HTML em um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `reactNode`: O nó React com o qual você chamou `prerender`. Por exemplo, um elemento JSX como `<App />`. Espera-se que ele represente o documento inteiro, então o componente `App` deve renderizar a tag `<html>`.
* `postponedState`: O objeto opaco `postpone` retornado de uma [API de prerender](/reference/react-dom/static/index), carregado de onde quer que você o tenha armazenado (por exemplo, redis, um arquivo ou S3).
* **opcional** `options`: Um objeto com opções de streaming.
  * **opcional** `nonce`: Uma string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) para permitir scripts para [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `signal`: Um [sinal de abortar](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar a renderização do servidor](#aborting-server-rendering) e renderizar o restante no cliente.
  * **opcional** `onError`: Um callback que é acionado sempre que ocorre um erro no servidor, seja [recuperável](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ou [não.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Por padrão, isso apenas chama `console.error`. Se você o substituir para [registrar relatórios de falhas,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`.


#### Retorna {/*returns*/}

`resume` retorna uma Promise:

- Se `resume` produziu com sucesso uma [shell](/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell), essa Promise será resolvida para um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) que pode ser encadeado a um [Writable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).
- Se ocorrer um erro na shell, a Promise será rejeitada com esse erro.

O stream retornado tem uma propriedade adicional:

* `allReady`: Uma Promise que resolve quando toda a renderização é concluída. Você pode `await stream.allReady` antes de retornar uma resposta [para crawlers e geração estática.](/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Se você fizer isso, não obterá nenhum carregamento progressivo. O stream conterá o HTML final.

#### Ressalvas {/*caveats*/}

- `resume` não aceita opções para `bootstrapScripts`, `bootstrapScriptContent` ou `bootstrapModules`. Em vez disso, você precisa passar essas opções para a chamada `prerender` que gera o `postponedState`. Você também pode injetar o conteúdo bootstrap no stream gravável manualmente.
- `resume` não aceita `identifierPrefix`, pois o prefixo precisa ser o mesmo em `prerender` e `resume`.
- Como `nonce` não pode ser fornecido ao prerender, você só deve fornecer `nonce` ao `resume` se não estiver fornecendo scripts ao prerender.
- `resume` re-renderiza da raiz até encontrar um componente que não foi totalmente pré-renderizado. Apenas Componentes totalmente pré-renderizados (o Componente e seus filhos terminaram o pré-renderização) são pulados inteiramente.

## Uso {/*usage*/}

### Retomando um prerender {/*resuming-a-prerender*/}

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```js src/index.js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // In a real app, this is where you would put your html and body.
  // We're just using tags here we can include in an existing body for demonstration purposes
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Layer 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // We're immediately aborting in a macrotask.
  // Any data fetching that's not available synchronously, or in a microtask, will not have finished.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Layer 2
  // Just waiting here for demonstration purposes.
  // In a real app, the prelude and postponed state would've been serialized in Layer 1 and Layer would deserialize them.
  // The prelude content could be flushed immediated as plain HTML while
  // React is continuing to render from where the prerender left off.
  await sleep(2000);

  // You would get the cookies from the incoming HTTP request
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Layer 3
  // Just waiting here for demonstration purposes.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

```js src/demo-helpers.js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  for await (const chunk of readable) {
    const partialHTML = decoder.