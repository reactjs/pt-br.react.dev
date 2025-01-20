---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` renderiza uma árvore React em um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API depende de [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Para Node.js, use [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) em vez disso.

</Note>

---

## Reference {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

Chame `renderToReadableStream` para renderizar sua árvore React como HTML em um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

No cliente, chame [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para tornar o HTML gerado pelo servidor interativo.

[Veja mais exemplos abaixo.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: Um nó React que você quer renderizar como HTML. Por exemplo, um elemento JSX como `<App />`. Espera-se que represente o documento inteiro, portanto, o componente `App` deve renderizar a tag `<html>`.

* **opcional** `options`: Um objeto com opções de streaming.
  * **opcional** `bootstrapScriptContent`: Se especificado, esta string será colocada em uma tag `<script>` inline.
  * **opcional** `bootstrapScripts`: Um array de URLs em string para as tags `<script>` a serem emitidas na página. Use isso para incluir a `<script>` que chama [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omiti-lo se você não quiser executar o React no cliente.
  * **opcional** `bootstrapModules`: Semelhante a `bootstrapScripts`, mas emite [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) em vez disso.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar múltiplas raízes na mesma página. Deve ser o mesmo prefixo passado para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **opcional** `namespaceURI`: Uma string com o [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) raiz para o stream. Padrão para HTML comum. Passe `'http://www.w3.org/2000/svg'` para SVG ou `'http://www.w3.org/1998/Math/MathML'` para MathML.
  * **opcional** `nonce`: Uma string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) para permitir scripts para [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `onError`: Um callback que é chamado sempre que há um erro no servidor, seja [recuperável](#recovering-from-errors-outside-the-shell) ou [não.](#recovering-from-errors-inside-the-shell) Por padrão, isso apenas chama `console.error`. Se você substituir para [registrar relatórios de falhas,](#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`. Você também pode usá-lo para [ajustar o código de status](#setting-the-status-code) antes que o shell seja emitido.
  * **opcional** `progressiveChunkSize`: O número de bytes em um chunk. [Leia mais sobre a heurística padrão.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **opcional** `signal`: Um [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) que permite [abortar a renderização do servidor](#aborting-server-rendering) e renderizar o resto no cliente.


#### Returns {/*returns*/}

`renderToReadableStream` retorna uma Promise:

- Se a renderização do [shell](#specifying-what-goes-into-the-shell) for bem-sucedida, essa Promise será resolvida para um [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- Se a renderização do shell falhar, a Promise será rejeitada. [Use isso para gerar um shell de fallback.](#recovering-from-errors-inside-the-shell)

O stream retornado tem uma propriedade adicional:

* `allReady`: Uma Promise que é resolvida quando toda a renderização está completa, incluindo tanto o [shell](#specifying-what-goes-into-the-shell) quanto todos os [conteúdos adicionais.](#streaming-more-content-as-it-loads) Você pode `await stream.allReady` antes de retornar uma resposta [para crawlers e geração estática.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Se você fizer isso, não obterá nenhum carregamento progressivo. O stream conterá o HTML final.

---

## Usage {/*usage*/}

### Rendering a React tree as HTML to a Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

Chame `renderToReadableStream` para renderizar sua árvore React como HTML em um [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Juntamente com o <CodeStep step={1}>componente raiz</CodeStep>, você precisa fornecer uma lista de <CodeStep step={2}>caminhos `<script>` de bootstrap</CodeStep>. Seu componente raiz deve retornar **o documento inteiro, incluindo a tag raiz `<html>`.**

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

Isso anexará manipuladores de eventos ao HTML gerado pelo servidor e tornará interativo.

<DeepDive>

#### Reading CSS and JS asset paths from the build output {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Os URLs finais dos ativos (como arquivos JavaScript e CSS) geralmente são hashados após a construção. Por exemplo, em vez de `styles.css` você pode acabar com `styles.123456.css`. Hashing os nomes de arquivos de ativos estáticos garante que cada construção distinta do mesmo ativo terá um nome de arquivo diferente. Isso é útil porque permite ativar com segurança o cache de longo prazo para ativos estáticos: um arquivo com um certo nome nunca mudaria de conteúdo.

No entanto, se você não souber os URLs dos ativos até após a construção, não há como colocá-los no código-fonte. Por exemplo, codificar `"/styles.css"` em JSX como antes não funcionaria. Para mantê-los fora do seu código-fonte, seu componente raiz pode ler os nomes reais dos arquivos de um mapa passado como prop:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>Meu app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

No servidor, renderize `<App assetMap={assetMap} />` e passe seu `assetMap` com os URLs dos ativos:

```js {1-5,8,9}
// Você precisaria obter esse JSON da sua ferramenta de construção, por exemplo, ler do resultado da construção.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Como seu servidor agora está renderizando `<App assetMap={assetMap} />`, você precisa renderizá-lo com `assetMap` no cliente também para evitar erros de hidratação. Você pode serializar e passar `assetMap` para o cliente assim:

```js {9-10}
// Você precisaria obter esse JSON da sua ferramenta de construção.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Cuidado: É seguro usar stringify() porque esses dados não são gerados pelo usuário.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
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

Tanto o cliente quanto o servidor renderizam `App` com a mesma prop `assetMap`, de modo que não há erros de hidratação.

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

Imagine que carregar dados para `<Posts />` leva algum tempo. Idealmente, você gostaria de mostrar o restante do conteúdo da página de perfil ao usuário sem esperar pelas postagens. Para fazer isso, [envolva `Posts` em um limite `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Isso diz ao React para começar a transmitir o HTML antes que `Posts` carregue seus dados. O React enviará primeiro o HTML para o fallback de carregamento (`PostsGlimmer`), e então, quando `Posts` terminar de carregar seus dados, o React enviará o HTML restante junto com uma tag `<script>` inline que substitui o fallback de carregamento por esse HTML. Da perspectiva do usuário, a página aparecerá primeiro com o `PostsGlimmer`, depois sendo substituída pelo `Posts`.

Você pode ainda mais [anidar limites `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) para criar uma sequência de carregamento mais granular:

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

Neste exemplo, o React pode começar a transmitir a página mesmo mais cedo. Apenas `ProfileLayout` e `ProfileCover` devem terminar de ser renderizados primeiro porque não estão envolvidos em nenhum limite `<Suspense>`. No entanto, se `Sidebar`, `Friends` ou `Photos` precisarem carregar alguns dados, o React enviará o HTML para o fallback de `BigSpinner`. Então, à medida que mais dados se tornam disponíveis, mais conteúdo continuará sendo revelado até que tudo fique visível.

Streaming não precisa esperar que o React em si carregue no navegador, ou que seu app se torne interativo. O conteúdo HTML do servidor será progressivamente revelado antes que todas as `<script>` tags carreguem.

[Leia mais sobre como streaming HTML funciona.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Apenas fontes de dados habilitadas para Suspense ativarão o componente Suspense.** Elas incluem:

- Busca de dados com frameworks habilitados para Suspense como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Código de componente de carregamento preguiçoso com [`lazy`](/reference/react/lazy)
- Lendo o valor de uma Promise com [`use`](/reference/react/use)

Suspense **não** detecta quando os dados são buscados dentro de um Effect ou manipulador de eventos.

A maneira exata como você carregaria dados no componente `Posts` acima depende do seu framework. Se você estiver usando um framework habilitado para Suspense, encontrará os detalhes em sua documentação de busca de dados.

Buscar dados habilitados por Suspense sem o uso de um framework opinar ainda não é suportado. Os requisitos para implementar uma fonte de dados habilitada para Suspense são instáveis e não documentados. Uma API oficial para integrar fontes de dados com Suspense será lançada em uma versão futura do React. 

</Note>

---

### Specifying what goes into the shell {/*specifying-what-goes-into-the-shell*/}

A parte do seu app fora de quaisquer limites `<Suspense>` é chamada *o shell:*

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

Ele determina o estado de carregamento mais cedo que o usuário pode ver:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Se você envolver todo o app em um limite `<Suspense>` na raiz, o shell conterá apenas aquele spinner. No entanto, isso não é uma experiência de usuário agradável porque ver um grande spinner na tela pode parecer mais lento e mais irritante do que esperar um pouco mais e ver o layout real. É por isso que geralmente você vai querer colocar os limites `<Suspense>` de forma que o shell pareça *mínimo, mas completo*—como um esqueleto do layout da página inteira.

A chamada assíncrona a `renderToReadableStream` será resolvida para um `stream` assim que todo o shell tiver sido renderizado. Normalmente, você começará a transmitir então criando e retornando uma resposta com esse `stream`:

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Quando o `stream` é retornado, os componentes em limites `<Suspense>` aninhados podem ainda estar carregando dados.

---

### Logging crashes on the server {/*logging-crashes-on-the-server*/}

Por padrão, todos os erros no servidor são registrados no console. Você pode substituir esse comportamento para registrar relatórios de falhas:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Se você fornecer uma implementação `onError` personalizada, não se esqueça de também registrar os erros no console como acima.

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

Se um erro ocorrer enquanto renderiza esses componentes, o React não terá HTML significativo para enviar ao cliente. Envolva sua chamada `renderToReadableStream` em um `try...catch` para enviar um HTML de fallback que não depende da renderização do servidor como último recurso:

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Algo deu errado</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Se houver um erro ao gerar o shell, tanto `onError` quanto seu bloco `catch` serão acionados. Use `onError` para relatórios de erro e use o bloco `catch` para enviar o documento HTML de fallback. Seu fallback HTML não precisa ser uma página de erro. Em vez disso, você pode incluir um shell alternativo que renderiza seu app no cliente apenas.

---

### Recovering from errors outside the shell {/*recovering-from-errors-outside-the-shell*/}

Neste exemplo, o componente `<Posts />` está envolto em `<Suspense>` então ele não é uma parte do shell:

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

Se um erro ocorrer no componente `Posts` ou em algum lugar dentro dele, o React irá [tentar recuperar-se dele:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Ele emitirá o fallback de carregamento para o limite `<Suspense>` mais próximo (`PostsGlimmer`) no HTML.
2. Ele "desistirá" de tentar renderizar o conteúdo de `Posts` no servidor.
3. Quando o código JavaScript carregar no cliente, o React *tentar novamente* renderizar `Posts` no cliente.

Se a tentativa de renderizar `Posts` no cliente *também* falhar, o React lançará o erro no cliente. Como com todos os erros lançados durante a renderização, o [limite de erro pai mais próximo](/reference/react/Component#static-getderivedstatefromerror) determina como apresentar o erro ao usuário. Na prática, isso significa que o usuário verá um indicador de carregamento até que se tenha certeza de que o erro não é recuperável.

Se a tentativa de renderizar `Posts` no cliente for bem-sucedida, o fallback de carregamento do servidor será substituído pela saída de renderização do cliente. O usuário não saberá que houve um erro no servidor. No entanto, o callback `onError` do servidor e os callbacks [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) do cliente serão acionados para que você possa ser notificado sobre o erro.

---

### Setting the status code {/*setting-the-status-code*/}

Streaming introduz um compromisso. Você quer começar a transmitir a página o mais cedo possível para que o usuário possa ver o conteúdo mais cedo. No entanto, uma vez que você começa a transmitir, você não pode mais definir o código de status da resposta.

Ao [dividir seu app](#specifying-what-goes-into-the-shell) entre o shell (acima de todos os limites `<Suspense>`) e o restante do conteúdo, você já resolveu parte desse problema. Se o shell tiver erros, seu bloco `catch` será executado, o que permite que você defina o código de status do erro. Caso contrário, você sabe que o app pode recuperar no cliente, então você pode enviar "OK".

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Algo deu errado</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Se um componente *fora* do shell (ou seja, dentro de um limite `<Suspense>`) lançar um erro, o React não interromperá a renderização. Isso significa que o callback `onError` será acionado, mas seu código continuará executando sem entrar no bloco `catch`. Isso ocorre porque o React tentará recuperar desse erro no cliente, [como descrito acima.](#recovering-from-errors-outside-the-shell)

No entanto, se você quiser, pode usar o fato de que algo falhou para definir o código de status:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Algo deu errado</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Isso apenas capturará erros fora do shell que ocorreram enquanto geravam o conteúdo do shell inicial, então não é exaustivo. Se saber se um erro ocorreu para algum conteúdo é crítico, você pode movê-lo para dentro do shell.

---

### Handling different errors in different ways {/*handling-different-errors-in-different-ways*/}

Você pode [criar suas próprias subclasses de `Error`](https://javascript.info/custom-errors) e usar o operador [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) para verificar qual erro foi lançado. Por exemplo, você pode definir um `NotFoundError` personalizado e lançá-lo do seu componente. Então você pode salvar o erro em `onError` e fazer algo diferente antes de retornar a resposta dependendo do tipo de erro:

```js {2-3,5-15,22,28,33}
async function handler(request) {
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

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Algo deu errado</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Lembre-se de que uma vez que você emitir o shell e começar a transmitir, você não pode mudar o código de status.

---

### Waiting for all content to load for crawlers and static generation {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Streaming oferece uma melhor experiência ao usuário porque o usuário pode ver o conteúdo à medida que se torna disponível.

No entanto, quando um crawler visita sua página, ou se você está gerando as páginas no momento da construção, você pode querer esperar que todo o conteúdo carregue primeiro e então produzir a saída HTML final em vez de revelá-la progressivamente.

Você pode esperar que todo o conteúdo carregue aguardando a Promise `stream.allReady`:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... depende da sua estratégia de detecção de bots ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Algo deu errado</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Um visitante regular receberá um stream de conteúdo carregado progressivamente. Um crawler receberá a saída HTML final após todos os dados carregarem. No entanto, isso também significa que o crawler terá que esperar por *todos* os dados, alguns dos quais podem ser lentos para carregar ou gerar erro. Dependendo do seu app, você poderia escolher enviar o shell para os crawlers também.

---

### Aborting server rendering {/*aborting-server-rendering*/}

Você pode forçar a renderização do servidor a "desistir" após um tempo limite:

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```