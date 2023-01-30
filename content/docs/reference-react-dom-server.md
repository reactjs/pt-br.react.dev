---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

O objeto `ReactDOMServer` permite que você renderize componentes para markup estático. Normalmente, é usado em um servidor Node:

```js
// ES modules
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Visão Geral {#overview}

Esses métodos estão disponíveis apenas nos **ambientes com [Node.js Streams](https://nodejs.org/api/stream.html):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

Esses métodos estão disponíveis apenas nos **ambientes com [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (isso inclui navegadores, Deno e alguns modernos tempos de execução de borda):

- [`renderToReadableStream()`](#rendertoreadablestream)

Os métodos a seguir podem ser usados tanto em ambiente de servidor como de navegador:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

## Referência {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

> Try the new React documentation for [`renderToPipeableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToPipeableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Renderize um elemento React em seu HTML inicial. Retorna um stream com um método `pipe(res)` para canalizar a saída e `abort()` para abortar a requisição. Totalmente compatível com Suspense e streaming de HTML com blocos de conteúdo "atrasados" "aparecendo" por meio de tags `<script>` embutidas posteriormente. [Leia mais](https://github.com/reactwg/react-18/discussions/37)

Se você chamar [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) em um nó que já possui essa marcação renderizada pelo servidor, o React irá preservá-lo e apenas anexar manipuladores de eventos, permitindo que você para ter uma experiência de primeira carga de alto desempenho.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

Veja a [lista completa de opções](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Nota:
>
> Esta é uma API específica do Node.js. Ambientes com [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), como Deno e modern edge runtimes, devem usar [`renderToReadableStream`](#rendertoreadablestream).
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

> Try the new React documentation for [`renderToReadableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToReadableStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

Transmite um elemento React para seu HTML inicial. Retorna uma Promise que resolve para um [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Suporta totalmente Suspense e streaming de HTML. [Leia mais](https://github.com/reactwg/react-18/discussions/127)

Se você chamar [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) em um nó que já possui essa marcação renderizada pelo servidor, o React irá preservá-lo e apenas anexar manipuladores de eventos, permitindo que você para ter uma experiência de primeira carga de alto desempenho.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

> Try the new React documentation for [`renderToNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderize um elemento React em seu HTML inicial. Retorna um [fluxo legível do Node.js](https://nodejs.org/api/stream.html#stream_readable_streams) que gera uma string HTML. A saída HTML desse fluxo é exatamente igual ao que [`ReactDOMServer.renderToString`](#rendertostring) retornaria. Você pode usar esse método para gerar HTML no servidor e enviar a marcação para baixo na solicitação inicial para carregamentos de página mais rápidos e para permitir que os mecanismos de pesquisa rastreiem suas páginas para fins de SEO.

Se você chamar [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) em um nó que já possui essa marcação renderizada pelo servidor, o React irá preservá-lo e apenas anexar manipuladores de eventos, permitindo que você para ter uma experiência de primeira carga de alto desempenho.

> Nota:
>
> Apenas para servidor. Esta API não está disponível no navegador.
>
> O stream retornado deste método retornará um stream de bytes codificado em utf-8. Se você precisar de um stream em outra codificação, dê uma olhada em um projeto como o [iconv-lite](https://www.npmjs.com/package/iconv-lite), que fornece streams de transformação para transcodificação de texto.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

> Try the new React documentation for [`renderToStaticNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticNodeStream).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Semelhante a [`renderToNodeStream`](#rendertonodestream), exceto que este não cria atributos DOM extras que o React usa internamente, como `data-reactroot`. Isso é útil se você quiser usar o React como um simples gerador de páginas estáticas, já que remover os atributos extras pode economizar alguns bytes.

A saída HTML desse stream é exatamente igual ao que [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) retornaria.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.

> Nota:
>
> Apenas para servidor. Esta API não está disponível no navegador.
>
> O fluxo retornado desse método retornará um fluxo de bytes codificado em utf-8. Se você precisar de um fluxo em outra codificação, dê uma olhada em um projeto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que fornece fluxos de transformação para transcodificação de texto.

* * *

### `renderToString()` {#rendertostring}

> Try the new React documentation for [`renderToString`](https://beta.reactjs.org/reference/react-dom/server/renderToString).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToString(element)
```

Renderize um elemento React em seu HTML inicial. React retornará uma string HTML. Você pode usar esse método para gerar HTML no servidor e enviar a marcação para baixo na solicitação inicial para carregamentos de página mais rápidos e para permitir que os mecanismos de pesquisa rastreiem suas páginas para fins de SEO.

Se você chamar [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) em um nó que já possui essa marcação renderizada pelo servidor, o React irá preservá-lo e apenas anexar manipuladores de eventos, permitindo que você para ter uma experiência de primeira carga de alto desempenho.

> Nota
>
> Esta API tem suporte limitado ao Suspense e não oferece suporte a streaming.
>
> No servidor, é recomendável usar [`renderToPipeableStream`](#rendertopipeablestream) (para Node.js) ou [`renderToReadableStream`](#rendertoreadablestream) (para Web Streams).

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

> Try the new React documentation for [`renderToStaticMarkup`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticMarkup).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Semelhante a [`renderToString`](#rendertostring), exceto que isso não cria atributos DOM extras que o React usa internamente, como `data-reactroot`. Isso é útil se você quiser usar o React como um simples gerador de página estática, pois remover os atributos extras pode economizar alguns bytes.

Se você planeja usar o React no cliente para tornar a marcação interativa, não use este método. Em vez disso, use [`renderToString`](#rendertostring) no servidor e [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) no cliente.
