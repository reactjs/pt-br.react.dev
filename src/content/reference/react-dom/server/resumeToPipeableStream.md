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

Chame `resume` para retomar a renderização de uma árvore React pré-renderizada como HTML em um [Stream do Node.js.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { resume } from 'react-dom/server';
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

* `reactNode`: O nó React com o qual você chamou `prerender`. Por exemplo, um elemento JSX como `<App />`. Espera-se que ele represente o documento inteiro, então o componente `App` deve renderizar a tag `<html>`.
* `postponedState`: O objeto opaco `postpone` retornado por uma [API de prerender](/reference/react-dom/static/index), carregado de onde quer que você o tenha armazenado (por exemplo, redis, um arquivo ou S3).
* **opcional** `options`: Um objeto com opções de streaming.
  * **opcional** `nonce`: Uma string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) para permitir scripts para [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `signal`: Um [sinal abortar](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar a renderização do servidor](#aborting-server-rendering) e renderizar o restante no cliente.
  * **opcional** `onError`: Um callback que é acionado sempre que ocorre um erro no servidor, seja [recuperável](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ou [não.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Por padrão, isso apenas chama `console.error`. Se você o substituir para [registrar relatórios de falha,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`.
  * **opcional** `onShellReady`: Um callback que é acionado logo após a [shell](#specifying-what-goes-into-the-shell) ter terminado. Você pode chamar `pipe` aqui para começar a transmitir. O React [transmitirá o conteúdo adicional](#streaming-more-content-as-it-loads) após a shell, juntamente com as tags `<script>` inline que substituem os fallbacks de carregamento HTML pelo conteúdo.
  * **opcional** `onShellError`: Um callback que é acionado se ocorrer um erro ao renderizar a shell. Ele recebe o erro como argumento. Nenhum byte foi emitido do stream ainda, e nem `onShellReady` nem `onAllReady` serão chamados, então você pode [gerar uma shell HTML de fallback](#recovering-from-errors-inside-the-shell) ou usar o prelúdio.


#### Retorna {/*returns*/}

`resume` retorna um objeto com dois métodos:

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