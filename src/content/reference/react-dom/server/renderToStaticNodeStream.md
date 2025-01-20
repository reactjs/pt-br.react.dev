---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` renderiza uma árvore React não interativa para um [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToStaticNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToStaticNodeStream(reactNode, options?)` {/*rendertostaticnodestream*/}

No servidor, chame `renderToStaticNodeStream` para obter um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams).

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[Veja mais exemplos abaixo.](#usage)

O stream produzirá uma saída HTML não interativa de seus componentes React.

#### Parameters {/*parameters*/}

* `reactNode`: Um nó React que você deseja renderizar em HTML. Por exemplo, um elemento JSX como `<Page />`.

* **opcional** `options`: Um objeto para a renderização do servidor.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar múltiplas raízes na mesma página.

#### Returns {/*returns*/}

Um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que produz uma string HTML. O HTML resultante não pode ser hidratado no cliente.

#### Caveats {/*caveats*/}

* A saída de `renderToStaticNodeStream` não pode ser hidratada.

* Este método aguardará que todas as [Suspense boundaries](/reference/react/Suspense) sejam concluídas antes de retornar qualquer saída.

* A partir do React 18, este método armazena em buffer toda a sua saída, portanto, na verdade, não fornece nenhum benefício de streaming.

* O stream retornado é um stream de bytes codificado em utf-8. Se você precisar de um stream em outra codificação, dê uma olhada em um projeto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que fornece streams de transformação para transcodificar texto.

---

## Usage {/*usage*/}

### Rendering a React tree as static HTML to a Node.js Readable Stream {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

Chame `renderToStaticNodeStream` para obter um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que você pode enviar para a resposta do seu servidor:

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// A sintaxe do manipulador de rota depende do seu framework de backend
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

O stream produzirá a saída HTML inicial não interativa de seus componentes React.

<Pitfall>

Este método renderiza **HTML não interativo que não pode ser hidratado.** Isso é útil se você quiser usar o React como um simples gerador de páginas estáticas, ou se estiver renderizando conteúdo completamente estático como e-mails.

Aplicativos interativos devem usar [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) no servidor e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) no cliente.

</Pitfall>