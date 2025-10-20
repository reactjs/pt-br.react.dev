---
title: prerender
---

<Intro>

`prerender` renderiza uma árvore React em uma string HTML estática usando um [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const {prelude, postponed} = await prerender(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API depende de [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Para Node.js, use [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) em vez disso.

</Note>

---

## Referência {/*reference*/}

### `prerender(reactNode, options?)` {/*prerender*/}

Chame `prerender` para renderizar seu app em HTML estático.

```js
import { prerender } from 'react-dom/static';

async function handler(request, response) {
  const {prelude} = await prerender(<App />, {
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

* `reactNode`: Um nó React que você quer renderizar em HTML. Por exemplo, um nó JSX como `<App />`. Espera-se que ele represente o documento inteiro, então o componente App deve renderizar a tag `<html>`.

* **opcional** `options`: Um objeto com opções de geração estática.
  * **opcional** `bootstrapScriptContent`: Se especificado, esta string será colocada em uma tag `<script>` inline.
  * **opcional** `bootstrapScripts`: Uma array de URLs de string para as tags `<script>` a serem emitidas na página. Use isso para incluir o `<script>` que chama [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omita-o se você não quiser executar o React no cliente.
  * **opcional** `bootstrapModules`: Como `bootstrapScripts`, mas emite [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) em vez disso.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar múltiplos roots na mesma página. Deve ser o mesmo prefixo do que aquele passado para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **opcional** `namespaceURI`: Uma string com a raiz [URI do namespace](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) para o fluxo. O padrão é HTML comum. Passe `'http://www.w3.org/2000/svg'` para SVG ou `'http://www.w3.org/1998/Math/MathML'` para MathML.
  * **opcional** `onError`: Um retorno de chamada que é disparado sempre que há um erro de servidor, seja ele [recuperável](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ou [não.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) Por padrão, isso chama apenas `console.error`. Se você substituí-lo para [registrar relatórios de falhas,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`. Você também pode usá-lo para [ajustar o código de status](/reference/react-dom/server/renderToReadableStream#setting-the-status-code) antes da emissão do shell.
  * **opcional** `progressiveChunkSize`: O número de bytes em um bloco. [Saiba mais sobre a heurística padrão.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **opcional** `signal`: Um [sinal de aborto](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar a pré-renderização](#aborting-prerendering) e renderizar o restante no cliente.

#### Retorna {/*returns*/}

<<<<<<< HEAD
`prerender` retorna uma Promise:
- Se a renderização for bem-sucedida, a Promise resolverá para um objeto contendo:
  - `prelude`: um [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) de HTML. Você pode usar este stream para enviar uma resposta em chunks, ou você pode ler todo o stream em uma string.
- Se a renderização falhar, a Promise será rejeitada. [Use isso para gerar um shell de fallback.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)
=======
`prerender` returns a Promise:
- If rendering the is successful, the Promise will resolve to an object containing:
  - `prelude`: a [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) of HTML. You can use this stream to send a response in chunks, or you can read the entire stream into a string.
  - `postponed`: a JSON-serializeable, opaque object that can be passed to [`resume`](/reference/react-dom/server/resume) if `prerender` did not finish. Otherwise `null` indicating that the `prelude` contains all the content and no resume is necessary.
- If rendering fails, the Promise will be rejected. [Use this to output a fallback shell.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

#### Ressalvas {/*caveats*/}

<<<<<<< HEAD
`nonce` não é uma opção disponível ao fazer pré-renderização. Nonces devem ser únicos por requisição e se você usar nonces para proteger sua aplicação com [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), seria inadequado e inseguro incluir o valor do nonce na própria pré-renderização.

=======
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c
<Note>

### Quando devo usar `prerender`? {/*when-to-use-prerender*/}

A API estática `prerender` é usada para geração estática do lado do servidor (SSG). Diferente de `renderToString`, `prerender` aguarda todo o carregamento dos dados antes de resolver. Isso o torna adequado para gerar HTML estático para uma página inteira, incluindo dados que precisam ser buscados usando Suspense. Para transmitir conteúdo conforme ele carrega, use uma API de renderização do lado do servidor (SSR) por streaming como [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

`prerender` can be aborted and later either continued with `resumeAndPrerender` or resumed with `resume` to support partial pre-rendering.

</Note>

---

## Uso {/*usage*/}

### Renderizando uma árvore React em um stream de HTML estático {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

Chame `prerender` para renderizar sua árvore React em HTML estático em um [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream):

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Junto com o <CodeStep step={1}>componente root</CodeStep>, você precisa fornecer uma lista de <CodeStep step={2}>caminhos de `<script>` de bootstrap</CodeStep>. Seu componente root deve retornar **todo o documento incluindo a tag `<html>` root.**

Por exemplo, pode se parecer com isso:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

O React vai injetar o [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) e suas <CodeStep step={2}>tags de `<script>` de bootstrap</CodeStep> no stream HTML resultante:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

No cliente, seu script de bootstrap deve [hidratar todo o `document` com uma chamada para `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Isso vai anexar event listeners ao HTML estático gerado pelo servidor e torná-lo interativo.

<DeepDive>

#### Lendo os caminhos de assets CSS e JS da saída da build {/*reading-css-and-js-asset-paths-from-the-build-output*/}

As URLs dos assets finais (como arquivos JavaScript e CSS) são frequentemente hasheadas após a build. Por exemplo, em vez de `styles.css` você pode acabar com `styles.123456.css`. Hashear nomes de arquivos de assets estáticos garante que cada build distinto do mesmo asset terá um nome de arquivo diferente. Isso é útil porque permite que você habilite o cache de longo prazo com segurança para ativos estáticos: um arquivo com um determinado nome nunca mudaria o conteúdo.

No entanto, se você não souber as URLs dos assets até depois da build, não haverá como colocá-los no código-fonte. Por exemplo, codificar `"/styles.css"` em JSX como antes não funcionaria. Para mantê-los fora do seu código-fonte, seu componente root pode ler os nomes reais dos arquivos de um mapa passado como uma prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

No servidor, renderize `<App assetMap={assetMap} />` e passe o seu `assetMap` com as URLs dos assets:

```js {1-5,8,9}
// Você precisa obter este JSON de sua ferramenta de build, por exemplo, ler da saída da build.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Como seu servidor agora está renderizando `<App assetMap={assetMap} />`, você precisa renderizá-lo com `assetMap` no cliente também para evitar erros de hidratação. Você pode serializar e passar `assetMap` para o cliente assim:

```js {9-10}
// Você precisa obter este JSON de sua ferramenta de build.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    // Cuidado: é seguro stringificar() isto porque estes dados não são gerados pelo usuário.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

No exemplo acima, a opção `bootstrapScriptContent` adiciona uma tag `<script>` inline extra que define a variável global `window.assetMap` no cliente. Isso permite que o código do cliente leia o mesmo `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Tanto o cliente quanto o servidor renderizam `App` com a mesma prop `assetMap`, então não há erros de hidratação.

</DeepDive>

---

### Renderizando uma árvore React em uma string de HTML estático {/*rendering-a-react-tree-to-a-string-of-static-html*/}

Chame `prerender` para renderizar seu app em uma string HTML estática:

```js
import { prerender } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  const reader = prelude.getReader();
  let content = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      return content;
    }
    content += Buffer.from(value).toString('utf8');
  }
}
```

Isso irá produzir a saída HTML inicial não interativa de seus componentes React. No cliente, você precisará chamar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para *hidratar* aquele HTML gerado pelo servidor e torná-lo interativo.

---

### Esperando todos os dados carregarem {/*waiting-for-all-data-to-load*/}

`prerender` espera todos os dados carregarem antes de finalizar a geração do HTML estático e resolver. Por exemplo, considere uma página de perfil que mostra uma capa, uma barra lateral com amigos e fotos e uma lista de posts:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Imagine que `<Posts />` precisa carregar alguns dados, o que leva algum tempo. Idealmente, você gostaria de esperar até os posts terminarem para que fossem incluídos no HTML. Para fazer isso, você pode usar Suspense para suspender nos dados, e `prerender` vai esperar o conteúdo suspenso acabar antes de resolver o HTML estático.

<Note>

**Somente fontes de dados habilitadas para Suspense ativarão o componente Suspense.** Elas incluem:

-   Busca de dados com frameworks habilitados para Suspense como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
-   Carregamento lento do código do componente com [`lazy`](/reference/react/lazy)
-   Lendo o valor de uma Promise com [`use`](/reference/react/use)

Suspense **não** detecta quando os dados são buscados dentro de um Effect ou manipulador de eventos.

A maneira exata de como você carregaria dados no componente `Posts` acima depende do seu framework. Se você usa um framework habilitado para Suspense, você encontrará os detalhes na documentação de busca de dados dele.

A busca de dados habilitada para Suspense sem o uso de um framework que dê opiniões ainda não é suportada. Os requisitos para implementar uma fonte de dados habilitada para Suspense são instáveis e não documentados. Uma API oficial para integrar fontes de dados com Suspense será lançada em uma versão futura do React.

</Note>

---

### Abortando a pré-renderização {/*aborting-prerendering*/}

Você pode forçar a pré-renderização a "desistir" após um timeout:

```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // o prelude conterá todo o HTML que foi pré-renderizado
    // antes do controller abortar.
    const {prelude} = await prerender(<App />, {
      signal: controller.signal,
    });
    //...
```

Quaisquer limites de Suspense com filhos incompletos serão incluídos no prelude no estado de fallback.

This can be used for partial prerendering together with [`resume`](/reference/react-dom/server/resume) or [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender).

## Solução de problemas {/*troubleshooting*/}

### Meu stream não começa até que o app inteiro seja renderizado {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

A resposta de `prerender` espera a renderização completa de todo o aplicativo, incluindo a espera pela resolução de todos os limites de Suspense, antes de resolver. Ele é projetado para a geração estática de sites (SSG) com antecedência e não suporta o streaming de mais conteúdo conforme ele carrega.

Para transmitir conteúdo conforme ele carrega, use uma API de renderização de servidor por streaming como [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).
