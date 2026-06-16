---
title: resumeAndPrerender
---

<Intro>

`resumeAndPrerender` continua uma árvore React pré-renderizada para uma string HTML estática usando um [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const { prelude,postpone } = await resumeAndPrerender(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API depende de [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Para Node.js, use [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) em vez disso.

</Note>

---

## Referência {/*reference*/}

### `resumeAndPrerender(reactNode, postponedState, options?)` {/*resumeandprerender*/}

Chame `resumeAndPrerender` para continuar uma árvore React pré-renderizada para uma string HTML estática.

```js
import { resumeAndPrerender } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, response) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerender(<App />, postponedState, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

No cliente, chame [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para tornar o HTML gerado pelo servidor interativo.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `reactNode`: O nó React que você chamou `prerender` (ou um `resumeAndPrerender` anterior) com. Por exemplo, um elemento JSX como `<App />`. Espera-se que ele represente o documento inteiro, então o componente `App` deve renderizar a tag `<html>`.
* `postponedState`: O objeto `postpone` opaco retornado de uma [API de pré-renderização](/reference/react-dom/static/index), carregado de onde quer que você o tenha armazenado (por exemplo, redis, um arquivo ou S3).
* **opcional** `options`: Um objeto com opções de streaming.
  * **opcional** `signal`: Um [sinal de abortar](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar a renderização do servidor](#aborting-server-rendering) e renderizar o restante no cliente.
  * **opcional** `onError`: Uma função de callback que é acionada sempre que ocorre um erro no servidor, seja [recuperável](#recovering-from-errors-outside-the-shell) ou [não.](#recovering-from-errors-inside-the-shell) Por padrão, isso apenas chama `console.error`. Se você o substituir para [registrar relatórios de falha,](#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`.

#### Retorna {/*returns*/}

`prerender` retorna uma Promise:
- Se a renderização for bem-sucedida, a Promise será resolvida para um objeto contendo:
  - `prelude`: um [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) de HTML. Você pode usar este stream para enviar uma resposta em pedaços, ou pode ler o stream inteiro em uma string.
  - `postponed`: um objeto opaco e serializável em JSON que pode ser passado para [`resume`](/reference/react-dom/server/resume) ou [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) se `prerender` for abortado.
- Se a renderização falhar, a Promise será rejeitada. [Use isso para gerar um shell de fallback.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Ressalvas {/*caveats*/}

`nonce` não é uma opção disponível ao pré-renderizar. Nonces devem ser únicos por solicitação e se você usar nonces para proteger sua aplicação com [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) seria inadequado e inseguro incluir o valor do nonce na própria pré-renderização.

<Note>

### Quando devo usar `resumeAndPrerender`? {/*when-to-use-prerender*/}

A API estática `resumeAndPrerender` é usada para geração estática do lado do servidor (SSG). Ao contrário de `renderToString`, `resumeAndPrerender` espera que todos os dados sejam carregados antes de resolver. Isso o torna adequado para gerar HTML estático para uma página inteira, incluindo dados que precisam ser buscados usando Suspense. Para transmitir conteúdo à medida que ele é carregado, use uma API de renderização do lado do servidor (SSR) de streaming como [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`resumeAndPrerender` pode ser abortado e, posteriormente, continuado com outro `resumeAndPrerender` ou retomado com `resume` para suportar pré-renderização parcial.

</Note>

---

## Uso {/*usage*/}

### Leitura adicional {/*further-reading*/}

`resumeAndPrerender` se comporta de forma semelhante a [`prerender`](/reference/react-dom/static/prerender), mas pode ser usado para continuar um processo de pré-renderização iniciado anteriormente que foi abortado.
Para mais informações sobre como continuar uma árvore pré-renderizada, veja a [documentação do resume](/reference/react-dom/server/resume#resuming-a-prerender).