---
title: renderToNodeStream
---

<Deprecated>

Essa API será removida em uma futura versão major do React. Prefira usar [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

</Deprecated>

<Intro>

`renderToNodeStream` renderiza uma árvore React para um [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `renderToNodeStream(reactNode, options?)` {/*rendertonodestream*/}

Pelo servidor, chame `renderToNodeStream` para obter um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que você pode encadear para a resposta.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

Pelo cliente, chame [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para tornar o HTML gerado pelo servidor interativo.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `reactNode`: Um nó React que você quer renderizar para HTML. Por exemplo, um elemento JSX como `<App />`.
* **optional** `options`: Um objeto para renderizador de servidor.
  * **optional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos quando usando múltiplas raizes na mesma página. Deve ser o mesmo prefixo passado para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Retorna {/*returns*/}

Um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que possui uma string HTML como saída.

#### Ressalvas {/*caveats*/}

* Esse método esperará todas [Suspense boundaries](/reference/react/Suspense) completarem antes de retornar qualquer saída.

* No React 18, esse método coloca em buffer toda sua saída, então não proporciona nenhum benefício de fluxo de dados. É por isso que é recomendado que você migre para [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

* O fluxo retornado é um fluxo de byte codificado em utf-8. Se você precisa de um fluxo em outra codificação, veja um projeto como [iconv-lite](https://www.npmjs.com/package/iconv-lite), que providencia transformação de fluxos para transcodificação.

---

## Uso {/*usage*/}

### Renderizar uma árvore React para HTML para um Node.js Readable Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Chame `renderToNodeStream` para obter um [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) que você pode encadear para a resposta de seu servidor:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

Esse fluxo produzirá a saída de HTML não-interativa inicial de seus componentes React. Pelo cliente, você precisará chamar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para *hidratar* esse HTML gerado pelo servidor e torná-lo interativo.
