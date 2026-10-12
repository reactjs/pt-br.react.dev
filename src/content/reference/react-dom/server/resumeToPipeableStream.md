---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream` transmite uma árvore React pré-renderizada para um [Stream do Node.js](https://nodejs.org/api/stream.html) "pipeable".

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API é específica para o Node.js. Ambientes com [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) como Deno e runtimes de edge modernos, devem usar [`resume`](/reference/react-dom/server/renderToReadableStream) em vez disso.

</Note>

---

## Referência {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

<<<<<<< HEAD
Chame `resume` para retomar a renderização de uma árvore React pré-renderizada como HTML em um [Stream do Node.js.](https://nodejs.org/api/stream.html#writable-streams)
=======
Call `resumeToPipeableStream` to resume rendering a pre-rendered React tree as HTML into a [Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams)
>>>>>>> 046f17d04295ba047bb5739026b4ac3110f17028

```js
import { resumeToPipeableStream } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

<<<<<<< HEAD
* `reactNode`: O nó React com o qual você chamou `prerender`. Por exemplo, um elemento JSX como `<App />`. Espera-se que ele represente o documento inteiro, então o componente `App` deve renderizar a tag `<html>`.
* `postponedState`: O objeto opaco `postpone` retornado por uma [API de prerender](/reference/react-dom/static/index), carregado de onde quer que você o tenha armazenado (por exemplo, redis, um arquivo ou S3).
* **opcional** `options`: Um objeto com opções de streaming.
  * **opcional** `nonce`: Uma string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) para permitir scripts para [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `signal`: Um [sinal abortar](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar a renderização do servidor](#aborting-server-rendering) e renderizar o restante no cliente.
  * **opcional** `onError`: Um callback que é acionado sempre que ocorre um erro no servidor, seja [recuperável](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ou [não.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Por padrão, isso apenas chama `console.error`. Se você o substituir para [registrar relatórios de falha,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`.
  * **opcional** `onShellReady`: Um callback que é acionado logo após a [shell](#specifying-what-goes-into-the-shell) ter terminado. Você pode chamar `pipe` aqui para começar a transmitir. O React [transmitirá o conteúdo adicional](#streaming-more-content-as-it-loads) após a shell, juntamente com as tags `<script>` inline que substituem os fallbacks de carregamento HTML pelo conteúdo.
  * **opcional** `onShellError`: Um callback que é acionado se ocorrer um erro ao renderizar a shell. Ele recebe o erro como argumento. Nenhum byte foi emitido do stream ainda, e nem `onShellReady` nem `onAllReady` serão chamados, então você pode [gerar uma shell HTML de fallback](#recovering-from-errors-inside-the-shell) ou usar o prelúdio.
=======
* `reactNode`: The React node you called `prerender` with. For example, a JSX element like `<App />`. It is expected to represent the entire document, so the `App` component should render the `<html>` tag.
* `postponedState`: The opaque `postpone` object returned from a [prerender API](/reference/react-dom/static/index), loaded from wherever you stored it (e.g. redis, a file, or S3).
* **optional** `options`: An object with streaming options.
  * **optional** `nonce`: A [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string to allow scripts for [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **optional** `onAllReady`: A callback that fires when all rendering is complete, including both the shell and all additional content. You can call `pipe` here instead of in `onShellReady` for crawlers and static generation. The stream will contain the final HTML.
  * **optional** `onBrowserBailout`: A callback React calls when it recovers from [`browser()`](/reference/react-dom/browser) by leaving a Suspense fallback for the browser to replace. It receives an `Error` describing the browser-only render and an `errorInfo` object containing the `componentStack`. If a reason was passed to `browser`, it is available as `error.cause`. By default, React does nothing. [See how to report browser-only rendering.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **optional** `onError`: A callback that fires whenever there is a server error, whether [recoverable](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) or [not.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) By default, this only calls `console.error`. If you override it to [log crash reports,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) make sure that you still call `console.error`.
  * **optional** `onShellReady`: A callback that fires right after the [shell](#specifying-what-goes-into-the-shell) has finished. You can call `pipe` here to start streaming. React will [stream the additional content](#streaming-more-content-as-it-loads) after the shell along with the inline `<script>` tags that replace the HTML loading fallbacks with the content.
  * **optional** `onShellError`: A callback that fires if there was an error rendering the shell. It receives the error as an argument. No bytes were emitted from the stream yet, and neither `onShellReady` nor `onAllReady` will get called, so you can [output a fallback HTML shell](#recovering-from-errors-inside-the-shell) or use the prelude.
>>>>>>> 046f17d04295ba047bb5739026b4ac3110f17028


#### Retorna {/*returns*/}

<<<<<<< HEAD
`resume` retorna um objeto com dois métodos:
=======
`resumeToPipeableStream` returns an object with two methods:
>>>>>>> 046f17d04295ba047bb5739026b4ac3110f17028

* `pipe` gera o HTML no [Stream do Node.js Gravável](https://nodejs.org/api/stream.html#writable-streams) fornecido. Chame `pipe` em `onShellReady` se quiser habilitar o streaming, ou em `onAllReady` para crawlers e geração estática.
* `abort` permite [abortar a renderização do servidor](#aborting-server-rendering) e renderizar o restante no cliente.

#### Ressalvas {/*caveats*/}

- `resumeToPipeableStream` não aceita opções para `bootstrapScripts`, `bootstrapScriptContent` ou `bootstrapModules`. Em vez disso, você precisa passar essas opções para a chamada `prerender` que gera o `postponedState`. Você também pode injetar conteúdo bootstrap no stream gravável manualmente.
- `resumeToPipeableStream` não aceita `identifierPrefix`, pois o prefixo precisa ser o mesmo em `prerender` e `resumeToPipeableStream`.
- Como `nonce` não pode ser fornecido ao prerender, você só deve fornecer `nonce` a `resumeToPipeableStream` se não estiver fornecendo scripts ao prerender.
- `resumeToPipeableStream` re-renderiza da raiz até encontrar um componente que não foi totalmente pré-renderizado. Apenas Componentes totalmente pré-renderizados (o Componente e seus filhos terminaram de pré-renderizar) são pulados inteiramente.

## Uso {/*usage*/}

### Leitura adicional {/*further-reading*/}

O resumo se comporta como `renderToReadableStream`. Para mais exemplos, confira a [seção de uso de `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
A [seção de uso de `prerender`](/reference/react-dom/static/prerender#usage) inclui exemplos de como usar `prerenderToNodeStream` especificamente.