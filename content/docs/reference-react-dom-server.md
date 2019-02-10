---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

O objeto `ReactDOMServer` permite que você renderize componentes para markup estático. Normalmente, é usado em um servidor Node:

```js
// Módulos ES
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Visão Geral {#overview}

Os métodos a seguir podem ser usados tanto em ambiente de servidor como de navegador:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Estes métodos adicionais dependem do pacote (`stream`) que **só está disponível no servidor** e não irão funcionar no navegador.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Referência {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Renderiza um elemento React para o seu HTML inicial. O React retornará uma string HTML. Você pode usar este método para gerar HTML no servidor e enviar o markup no request inicial para ter carregamentos de páginas mais rápidos e para permitir que motores de pesquisa rastreiem suas páginas para fins de SEO.

Se você invocar [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) em um nó que já tem o seu markup processado pelo servidor, o React vai preservá-lo e apenas atribuir manipuladores de eventos, permitindo que você tenha uma experiência de primeiro carregamento muito eficiente.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Semelhante a [`renderToString`](#rendertostring), exceto que este não cria atributos DOM extras que o React usa internamente, como `data-reactroot`. Isso é útil se você quiser usar o React como um simples gerador de páginas estáticas, já que remover os atributos extras pode economizar alguns bytes.

Se você planeja usar o React no cliente para tornar o markup interativo, não use este método. Em vez disso, use [`renderToString`](#rendertostring) no servidor e [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) no cliente.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Renderiza um elemento React para seu HTML inicial. Retorna um [Readable Stream](https://nodejs.org/api/stream.html#stream_readable_streams) que gera uma string HTML. A saída HTML desse stream é exatamente igual à que [`ReactDOMServer.renderToString`](#rendertostring) retornaria. Você pode usar este método para gerar HTML no servidor e enviar o markup no request inicial para ter carregamentos de página mais rápidos e para permitir que motores de busca rastreiem suas páginas para fins de SEO.

Se você invocar [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) em um nó que já tem o seu markup processado pelo servidor, o React vai preservá-lo e apenas atribuir manipuladores de eventos, permitindo que você tenha uma experiência de primeiro carregamento muito eficiente.

> Nota:
>
> Apenas para servidor. Esta API não está disponível no navegador.
>
> O stream retornado deste método retornará um stream de bytes codificado em utf-8. Se você precisar de um stream em outra codificação, dê uma olhada em um projeto como o [iconv-lite](https://www.npmjs.com/package/iconv-lite), que fornece streams de transformação para transcodificação de texto.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Semelhante a [`renderToNodeStream`](#rendertonodestream), exceto que este não cria atributos DOM extras que o React usa internamente, como `data-reactroot`. Isso é útil se você quiser usar o React como um simples gerador de páginas estáticas, já que remover os atributos extras pode economizar alguns bytes.

A saída HTML desse stream é exatamente igual ao que [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) retornaria.

Se você planeja usar o React no cliente para tornar o markup interativo, não use este método. Em vez disso, use [`renderToNodeStream`](#rendertonodestream) no servidor e [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) no cliente.

> Nota:
>
> Apenas para servidor. Esta API não está disponível no navegador.
>
> O stream retornado deste método retornará um stream de bytes codificado em utf-8. Se você precisar de um stream em outra codificação, dê uma olhada em um projeto como o [iconv-lite](https://www.npmjs.com/package/iconv-lite), que fornece streams de transformação para transcodificação de texto.
