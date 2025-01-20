---
title: renderToNodeStream
---

<Deprecated>

Esta API será removida em uma futura versão principal do React. Use [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) em vez disso.

</Deprecated>

<Intro>

`renderToNodeStream` renderiza uma árvore React para um [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToNodeStream(reactNode, options?)` {/*rendertonodestream*/}

No servidor, chame `renderToNodeStream` para obter um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que você pode enviar na resposta.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

No cliente, chame [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para tornar o HTML gerado pelo servidor interativo.

[Veja mais exemplos abaixo.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: Um nó React que você deseja renderizar em HTML. Por exemplo, um elemento JSX como `<App />`.

* **opcional** `options`: Um objeto para renderização no servidor.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar múltiplas raízes na mesma página. Deve ser o mesmo prefixo passado para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Returns {/*returns*/}

Um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que produz uma string HTML.

#### Caveats {/*caveats*/}

* Este método aguardará todas as [limites de Suspense](/reference/react/Suspense) serem concluídos antes de retornar qualquer saída.

* A partir do React 18, este método armazena em buffer toda a sua saída, portanto, não fornece realmente benefícios de streaming. É por isso que é recomendado migrar para [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) em vez disso.

* O stream retornado é um stream de bytes codificado em utf-8. Se você precisar de um stream em outra codificação, dê uma olhada em um projeto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que fornece streams de transformação para transcodificação de texto.

---

## Usage {/*usage*/}

### Rendering a React tree as HTML to a Node.js Readable Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Chame `renderToNodeStream` para obter um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que você pode enviar na resposta do seu servidor:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// A sintaxe do manipulador de rotas depende do seu framework de backend
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

O stream produzirá a saída HTML inicial não interativa dos seus componentes React. No cliente, você precisará chamar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para *hidratar* aquele HTML gerado pelo servidor e torná-lo interativo.