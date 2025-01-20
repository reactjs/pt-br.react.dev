---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` renderiza uma árvore React para um [Node.js Stream.](https://nodejs.org/api/stream.html)

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API é específica para Node.js. Ambientes com [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) como Deno e runtimes modernos de edge, devem usar [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) em vez disso.

</Note>

---

## Reference {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Chame `renderToPipeableStream` para renderizar sua árvore React como HTML em um [Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

No cliente, chame [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para tornar o HTML gerado pelo servidor interativo.

[Veja mais exemplos abaixo.](#usage)

#### Parameters {/*parameters*/

* `reactNode`: Um nó React que você deseja renderizar como HTML. Por exemplo, um elemento JSX como `<App />`. Espera-se que represente o documento inteiro, então o componente `App` deve renderizar a tag `<html>`.

* **opcional** `options`: Um objeto com opções de streaming.
  * **opcional** `bootstrapScriptContent`: Se especificado, esta string será colocada em uma tag `<script>` inline.
  * **opcional** `bootstrapScripts`: Um array de URLs em string para as tags `<script>` a serem emitidas na página. Use isso para incluir o `<script>` que chama [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Oculte se você não quiser executar o React no cliente.
  * **opcional** `bootstrapModules`: Como `bootstrapScripts`, mas emite [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) em vez disso.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar várias raízes na mesma página. Deve ser o mesmo prefixo passado para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **opcional** `namespaceURI`: Uma string com o root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) para o stream. O padrão é HTML regular. Passe `'http://www.w3.org/2000/svg'` para SVG ou `'http://www.w3.org/1998/Math/MathML'` para MathML.
  * **opcional** `nonce`: Uma string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) para permitir scripts para [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `onAllReady`: Um callback que é acionado quando toda a renderização está completa, incluindo tanto o [shell](#specifying-what-goes-into-the-shell) quanto todo o [conteúdo adicional.](#streaming-more-content-as-it-loads) Você pode usar isso em vez de `onShellReady` [para crawlers e geração estática.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Se você começar a stream aqui, não obterá nenhum carregamento progressivo. O stream conterá o HTML final.
  * **opcional** `onError`: Um callback que é acionado sempre que há um erro no servidor, seja [recuperável](#recovering-from-errors-outside-the-shell) ou [não.](#recovering-from-errors-inside-the-shell) Por padrão, isso apenas chama `console.error`. Se você sobrescrever para [registrar relatórios de falhas,](#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`. Você também pode usá-lo para [ajustar o código de status](#setting-the-status-code) antes que o shell seja emitido.
  * **opcional** `onShellReady`: Um callback que é acionado logo após o [shell inicial](#specifying-what-goes-into-the-shell) ter sido renderizado. Você pode [definir o código de status](#setting-the-status-code) e chamar `pipe` aqui para começar a streaming. O React irá [stream o conteúdo adicional](#streaming-more-content-as-it-loads) após o shell juntamente com as tags `<script>` inline que substituem as alternativas de carregamento HTML pelo conteúdo.
  * **opcional** `onShellError`: Um callback que é acionado se houve um erro ao renderizar o shell inicial. Recebe o erro como um argumento. Nenhum byte foi emitido do stream ainda, e nem `onShellReady` nem `onAllReady` serão chamados, de modo que você pode [produzir um fallback HTML shell.](#recovering-from-errors-inside-the-shell)
  * **opcional** `progressiveChunkSize`: O número de bytes em um chunk. [Leia mais sobre a heurística padrão.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)

#### Returns {/*returns*/}

`renderToPipeableStream` retorna um objeto com dois métodos:

* `pipe` emite o HTML no [Writable Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams) Chame `pipe` em `onShellReady` se você quiser ativar o streaming, ou em `onAllReady` para crawlers e geração estática.
* `abort` permite que você [aborte a renderização no servidor](#aborting-server-rendering) e renderize o restante no cliente.

---

## Usage {/*usage*/}

### Rendering a React tree as HTML to a Node.js Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Chame `renderToPipeableStream` para renderizar sua árvore React como HTML em um [Node.js Stream:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// A sintaxe do manipulador de rota depende do seu framework backend
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Juntamente com o <CodeStep step={1}>componente raiz</CodeStep>, você precisa fornecer uma lista de <CodeStep step={2}>caminhos de bootstrap `<script>`</CodeStep>. Seu componente raiz deve retornar **o documento inteiro, incluindo a tag `<html>` raiz.**

Por exemplo, pode parecer assim:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Meu app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

O React irá injetar o [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) e suas <CodeStep step={2}>tags `<script>` de bootstrap</CodeStep> no stream HTML resultante:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML dos seus componentes ... -->
</html>
<script src="/main.js" async=""></script>
```

No cliente, seu script de bootstrap deve [hidratar todo o `document` com uma chamada para `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Isso irá anexar manipuladores de eventos ao HTML gerado pelo servidor e torná-lo interativo.

<DeepDive>

#### Reading CSS and JS asset paths from the build output {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Os URLs finais dos ativos (como arquivos JavaScript e CSS) geralmente são hashed após a construção. Por exemplo, em vez de `styles.css`, você pode acabar com `styles.123456.css`. Hashing nomes de arquivos de ativos estáticos garante que cada construção distinta do mesmo ativo terá um nome de arquivo diferente. Isso é útil porque permite que você habilite com segurança o caching de longo prazo para ativos estáticos: um arquivo com um certo nome nunca mudará de conteúdo.

No entanto, se você não souber os URLs dos ativos até depois da construção, não há como você colocá-los no código fonte. Por exemplo, codificar `"/styles.css"` em JSX como antes não funcionaria. Para mantê-los fora do seu código fonte, seu componente raiz pode ler os nomes reais dos arquivos de um mapa passado como uma prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

No servidor, renderize `<App assetMap={assetMap} />` e passe seu `assetMap` com os URLs dos ativos:

```js {1-5,8,9}
// Você precisaria obter este JSON das suas ferramentas de construção, por exemplo, ler do resultado da construção.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Como seu servidor agora está renderizando `<App assetMap={assetMap} />`, você precisa renderizá-lo com `assetMap` no cliente também para evitar erros de hidratação. Você pode serializar e passar `assetMap` para o cliente assim:

```js {9-10}
// Você precisaria obter este JSON das suas ferramentas de construção.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Cuidado: É seguro fazer stringify() disso porque esses dados não são gerados pelo usuário.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

No exemplo acima, a opção `bootstrapScriptContent` adiciona uma extra tag `<script>` inline que define a variável global `window.assetMap` no cliente. Isso permite que o código do cliente leia o mesmo `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Tanto o servidor quanto o cliente renderizam `App` com a mesma prop `assetMap`, então não há erros de hidratação.

</DeepDive>

---

### Streaming more content as it loads {/*streaming-more-content-as-it-loads*/}

Streaming permite que o usuário comece a ver o conteúdo mesmo antes que todos os dados tenham sido carregados no servidor. Por exemplo, considere uma página de perfil que mostra uma capa, uma barra lateral com amigos e fotos, e uma lista de postagens:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

Imagine que carregar dados para `<Posts />` leva algum tempo. Idealmente, você gostaria de mostrar o restante do conteúdo da página de perfil ao usuário sem esperar pelas postagens. Para fazer isso, [encapsule `Posts` em uma borda `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
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

Isso diz ao React para começar a stream o HTML antes que `Posts` carregue seus dados. O React enviará primeiro o HTML para o fallback de carregamento (`PostsGlimmer`), e então, quando `Posts` terminar de carregar seus dados, o React enviará o HTML restante juntamente com uma tag `<script>` inline que substitui o fallback de carregamento por aquele HTML. Da perspectiva do usuário, a página aparecerá primeiro com o `PostsGlimmer`, e depois será substituída pelo `Posts`.

Você pode ainda [anidar bordas `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) para criar uma sequência de carregamento mais granular:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Neste exemplo, o React pode começar a stream a página ainda mais cedo. Apenas `ProfileLayout` e `ProfileCover` devem terminar de renderizar primeiro, pois não estão encapsulados em nenhuma borda `<Suspense>`. No entanto, se `Sidebar`, `Friends` ou `Photos` precisarem carregar alguns dados, o React enviará o HTML para o fallback `BigSpinner`. Então, conforme mais dados se tornam disponíveis, mais conteúdo continuará a ser revelado até que tudo se torne visível.

Streaming não precisa esperar que o React em si carregue no navegador, ou que seu app se torne interativo. O conteúdo HTML do servidor será progressivamente revelado antes que qualquer uma das tags `<script>` carregue.

[Leia mais sobre como streaming HTML funciona.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Somente fontes de dados habilitadas para Suspense ativarão o componente Suspense.** Elas incluem:

- Busca de dados com frameworks habilitados para Suspense como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Carregamento preguiçoso de código de componentes com [`lazy`](/reference/react/lazy)
- Lendo o valor de uma Promise com [`use`](/reference/react/use)

Suspense **não detecta** quando os dados são buscados dentro de um Effect ou manipulador de eventos.

A maneira exata que você usaria para carregar dados no componente `Posts` acima depende do seu framework. Se você usar um framework habilitado para Suspense, encontrará os detalhes na documentação de busca de dados.

Busca de dados habilitada para Suspense sem o uso de um framework opinativo ainda não é suportada. Os requisitos para implementar uma fonte de dados habilitada para Suspense são instáveis e não documentados. Uma API oficial para integrar fontes de dados com Suspense será lançada em uma versão futura do React.

</Note>

---

### Specifying what goes into the shell {/*specifying-what-goes-into-the-shell*/}

A parte do seu app fora de qualquer borda `<Suspense>` é chamada *de shell:*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Isso determina o estado de carregamento mais cedo que o usuário pode ver:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Se você encapsular todo o app em uma borda `<Suspense>` na raiz, o shell conterá apenas aquele spinner. No entanto, isso não é uma experiência de usuário agradável, pois ver um grande spinner na tela pode parecer mais lento e mais irritante do que esperar um pouco mais e ver o layout real. É por isso que geralmente você vai querer colocar as bordas `<Suspense>` de forma que o shell pareça *mínimo, mas completo* — como um esqueleto do layout inteiro da página.

O callback `onShellReady` é acionado quando todo o shell foi renderizado. Normalmente, você começará a stream então:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

No momento em que `onShellReady` é acionado, os componentes nas bordas `<Suspense>` aninhadas ainda podem estar carregando dados.

---

### Logging crashes on the server {/*logging-crashes-on-the-server*/}

Por padrão, todos os erros no servidor são registrados no console. Você pode substituir esse comportamento para registrar relatórios de falhas:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se você fornecer uma implementação personalizada de `onError`, não se esqueça de também registrar erros no console como acima.

---

### Recovering from errors inside the shell {/*recovering-from-errors-inside-the-shell*/}

Neste exemplo, o shell contém `ProfileLayout`, `ProfileCover` e `PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Se um erro ocorrer durante a renderização desses componentes, o React não terá nenhum HTML significativo para enviar ao cliente. Substitua `onShellError` para enviar um fallback HTML que não dependa da renderização no servidor como última alternativa:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo deu errado</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se houver um erro ao gerar o shell, tanto `onError` quanto `onShellError` serão acionados. Use `onError` para relatórios de erro e use `onShellError` para enviar o documento HTML fallback. Seu HTML fallback não precisa ser uma página de erro. Em vez disso, você pode incluir um shell alternativo que renderize seu app apenas no cliente.

---

### Recovering from errors outside the shell {/*recovering-from-errors-outside-the-shell*/}

Neste exemplo, o componente `<Posts />` está encapsulado em `<Suspense>`, então não faz parte do shell:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Se um erro acontecer no componente `Posts` ou em algum lugar dentro dele, o React [tentará se recuperar dele:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Ele emitirá o fallback de carregamento para a borda `<Suspense>` mais próxima (`PostsGlimmer`) no HTML.
2. Ele "desistirá" de tentar renderizar o conteúdo de `Posts` no servidor.
3. Quando o código JavaScript carregar no cliente, o React tentará *novamente* renderizar `Posts` no cliente.

Se tentar renderizar `Posts` no cliente *também* falhar, o React lançará o erro no cliente. Como com todos os erros lançados durante a renderização, a [borda de erro pai mais próxima](/reference/react/Component#static-getderivedstatefromerror) determina como apresentar o erro ao usuário. Na prática, isso significa que o usuário verá um indicador de carregamento até ter certeza de que o erro não é recuperável.

Se tentar renderizar `Posts` no cliente for bem-sucedido, o fallback de carregamento do servidor será substituído pela saída de renderização do cliente. O usuário não saberá que houve um erro no servidor. No entanto, o callback `onError` do servidor e os callbacks [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) do cliente serão acionados para que você possa ser notificado sobre o erro.

---

### Setting the status code {/*setting-the-status-code*/}

Streaming introduz um compromisso. Você quer começar a stream a página o mais cedo possível para que o usuário possa ver o conteúdo mais rápido. No entanto, uma vez que você começa a stream, você não pode mais definir o código de status da resposta.

Ao [dividir seu app](#specifying-what-goes-into-the-shell) em shell (acima de todas as bordas `<Suspense>`) e o restante do conteúdo, você já resolveu uma parte desse problema. Se o shell tiver erros, você receberá o callback `onShellError` que permite que você defina o código de status de erro. Caso contrário, você sabe que o app pode se recuperar no cliente, então você pode enviar "OK".

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo deu errado</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se um componente *fora* do shell (ou seja, dentro de uma borda `<Suspense>`) lançar um erro, o React não interromperá a renderização. Isso significa que o callback `onError` será acionado, mas você ainda obterá `onShellReady` em vez de `onShellError`. Isso ocorre porque o React tentará se recuperar desse erro no cliente, [como descrito acima.](#recovering-from-errors-outside-the-shell)

No entanto, se você quiser, pode usar o fato de que algo falhou para definir o código de status:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo deu errado</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Isso só capturará erros fora do shell que ocorrerem ao gerar o conteúdo inicial do shell, então não é exaustivo. Se saber se ocorreu um erro em algum conteúdo for crítico, você pode movê-lo para cima no shell.

---

### Handling different errors in different ways {/*handling-different-errors-in-different-ways*/}

Você pode [criar suas próprias subclasses de `Error`](https://javascript.info/custom-errors) e usar o operador [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) para verificar qual erro foi lançado. Por exemplo, você pode definir um `NotFoundError` personalizado e lançá-lo do seu componente. Então seus callbacks `onError`, `onShellReady` e `onShellError` podem fazer algo diferente dependendo do tipo de erro:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Algo deu errado</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Tenha em mente que uma vez que você emite o shell e começa a streaming, não pode mais alterar o código de status.

---

### Waiting for all content to load for crawlers and static generation {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Streaming oferece uma melhor experiência ao usuário porque o usuário pode ver o conteúdo à medida que se torna disponível.

No entanto, quando um crawler visita sua página, ou se você está gerando as páginas durante o tempo de construção, pode querer permitir que todo o conteúdo carregue primeiro e então produzir a saída HTML final em vez de revelá-la progressivamente.

Você pode aguardar todo o conteúdo carregar usando o callback `onAllReady`:

```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depende da sua estratégia de detecção de bots ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Algo deu errado</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Um visitante regular receberá uma stream de conteúdo carregado progressivamente. Um crawler receberá a saída HTML final após todos os dados carregarem. No entanto, isso também significa que o crawler terá que esperar por *todos* os dados, alguns dos quais podem ser lentos para carregar ou apresentar erro. Dependendo do seu app, você pode optar por enviar o shell também para os crawlers.

---

### Aborting server rendering {/*aborting-server-rendering*/}

Você pode forçar a renderização no servidor a "desistir" após um tempo limite:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

O React irá descarregar os fallbacks de carregamento restantes como HTML e tentará renderizar o restante no cliente.