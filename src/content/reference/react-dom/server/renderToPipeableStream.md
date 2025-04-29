---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` renderiza uma árvore React em um [Node.js Stream.](https://nodejs.org/api/stream.html) que pode ser canalizada.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Esta API é específica do Node.js. Ambientes com [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) como Deno e runtimes de borda modernos, devem usar [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) em vez disso.

</Note>

---

## Referência {/*reference*/}

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

No cliente, chame [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) para tornar o HTML gerado no servidor interativo.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `reactNode`: Um nó React que você deseja renderizar em HTML. Por exemplo, um elemento JSX como `<App />`. Espera-se que ele represente o documento inteiro, então o componente `App` deve renderizar a tag `<html>`.

* **opcional** `options`: Um objeto com opções de streaming.
  * **opcional** `bootstrapScriptContent`: Se especificado, esta string será colocada em uma tag `<script>` inline.
  * **opcional** `bootstrapScripts`: Uma matriz de URLs de string para as tags `<script>` a serem emitidas na página. Use isso para incluir o `<script>` que chama [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omita-o se você não quiser executar o React no cliente.
  * **opcional** `bootstrapModules`: Como `bootstrapScripts`, mas emite [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) em vez disso.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar vários roots na mesma página. Deve ser o mesmo prefixo passado para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **opcional** `namespaceURI`: Uma string com o [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) do root para o stream. O padrão é HTML comum. Passe `'http://www.w3.org/2000/svg'` para SVG ou `'http://www.w3.org/1998/Math/MathML'` para MathML.
  * **opcional** `nonce`: Uma string [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) para permitir scripts para [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **opcional** `onAllReady`: Um callback que é acionado quando toda a renderização estiver concluída, incluindo o [shell](#specifying-what-goes-into-the-shell) e todo o [conteúdo](#streaming-more-content-as-it-loads) adicional. Você pode usá-lo em vez de `onShellReady` [para crawlers e geração estática.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Se você iniciar o streaming aqui, não receberá nenhum carregamento progressivo. O stream conterá o HTML final.
  * **opcional** `onError`: Um callback que é acionado sempre que houver um erro do servidor, seja [recuperável](#recovering-from-errors-outside-the-shell) ou [não.](#recovering-from-errors-inside-the-shell) Por padrão, isso só chama `console.error`. Se você substituí-lo para [registrar relatórios de falha,](#logging-crashes-on-the-server) certifique-se de ainda chamar `console.error`. Você também pode usá-lo para [ajustar o código de status](#setting-the-status-code) antes que o shell seja emitido.
  * **opcional** `onShellReady`: Um callback que é acionado logo após o [shell inicial](#specifying-what-goes-into-the-shell) ser renderizado. Você pode [definir o código de status](#setting-the-status-code) e chamar `pipe` aqui para iniciar o streaming. O React [fará o streaming do conteúdo adicional](#streaming-more-content-as-it-loads) após o shell, juntamente com as tags `<script>` inline que substituem os fallbacks de carregamento HTML com o conteúdo.
  * **opcional** `onShellError`: Um callback que é acionado se houver um erro ao renderizar o shell inicial. Ele recebe o erro como um argumento. Nenhum byte foi emitido do stream ainda, e nem `onShellReady` nem `onAllReady` serão chamados, para que você possa [gerar um fallback shell HTML.](#recovering-from-errors-inside-the-shell)
  * **opcional** `progressiveChunkSize`: O número de bytes em um chunk. [Leia mais sobre a heurística padrão.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### Retorna {/*returns*/}

`renderToPipeableStream` retorna um objeto com dois métodos:

* `pipe` gera o HTML no [Node.js Stream gravável](https://nodejs.org/api/stream.html#writable-streams) fornecido. Chame `pipe` em `onShellReady` se você deseja ativar o streaming ou em `onAllReady` para crawlers e geração estática.
* `abort` permite que você [interrompa a renderização do servidor](#aborting-server-rendering) e renderize o restante no cliente.

---

## Uso {/*usage*/}

### Renderizando uma árvore React como HTML para um Node.js Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Chame `renderToPipeableStream` para renderizar sua árvore React como HTML em um [Node.js Stream:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// A sintaxe do manipulador de rota depende do seu framework de backend
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

Junto com o <CodeStep step={1}>componente root</CodeStep>, você precisa fornecer uma lista de <CodeStep step={2}>caminhos de `<script>` bootstrap</CodeStep>. Seu componente root deve retornar **o documento inteiro, incluindo a tag root `<html>`.**

Por exemplo, pode se parecer com isto:

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

O React irá injetar o [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) e suas <CodeStep step={2}>tags `<script>` de bootstrap</CodeStep> no stream HTML resultante:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

No cliente, seu script bootstrap deve [hidratar o `document` inteiro com uma chamada para `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Isso irá anexar event listeners ao HTML gerado pelo servidor e torná-lo interativo.

<DeepDive>

#### Lendo caminhos de assets CSS e JS da saída da build {/*reading-css-and-js-asset-paths-from-the-build-output*/}

As URLs dos assets finais (como arquivos JavaScript e CSS) são frequentemente hasheadas após a build. Por exemplo, em vez de `styles.css`, você pode acabar com `styles.123456.css`. Hashear os nomes de arquivos de assets estáticos garante que cada build distinto do mesmo asset terá um nome de arquivo diferente. Isso é útil porque permite que você habilite o cache de longo prazo com segurança para assets estáticos: um arquivo com um determinado nome nunca alteraria o conteúdo.

No entanto, se você não souber as URLs dos assets até depois da build, não há como colocá-las no código-fonte. Por exemplo, codificar `"/styles.css"` no JSX, como antes, não funcionaria. Para mantê-los fora do seu código-fonte, seu componente root pode ler os nomes de arquivos reais de um mapa passado como prop:

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

No servidor, renderize `<App assetMap={assetMap} />` e passe seu `assetMap` com as URLs dos assets:

```js {1-5,8,9}
// Você precisaria obter este JSON de suas ferramentas de build, por ex. lê-lo da saída da build.
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
// Você precisaria obter este JSON de suas ferramentas de build.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Cuidado: É seguro stringificar() isto porque estes dados não são gerados pelo usuário.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
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

### Streaming mais conteúdo à medida que ele carrega {/*streaming-more-content-as-it-loads*/}

O streaming permite que o usuário comece a ver o conteúdo mesmo antes que todos os dados tenham sido carregados no servidor. Por exemplo, considere uma página de perfil que mostra uma capa, uma barra lateral com amigos e fotos e uma lista de posts:

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

Imagine que carregar dados para `<Posts />` leva algum tempo. Idealmente, você gostaria de mostrar o restante do conteúdo da página de perfil para o usuário sem esperar pelos posts. Para fazer isso, [encapsule `Posts` em uma boundary `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Isso informa ao React para começar a transmitir o HTML antes que `Posts` carregue seus dados. O React enviará primeiro o HTML para o fallback de carregamento (`PostsGlimmer`) e, em seguida, quando `Posts` terminar de carregar seus dados, o React enviará o HTML restante junto com uma tag `<script>` inline que substitui o fallback de carregamento por esse HTML. Da perspectiva do usuário, a página aparecerá primeiro com o `PostsGlimmer`, posteriormente substituído pelos `Posts`.

Você pode ainda [anexar boundaries `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) para criar uma sequência de carregamento mais granular:

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

Neste exemplo, o React pode começar a transmitir a página ainda mais cedo. Apenas `ProfileLayout` e `ProfileCover` devem terminar a renderização primeiro porque não estão envolvidos em nenhuma boundary `<Suspense>`. No entanto, se `Sidebar`, `Friends` ou `Photos` precisarem carregar alguns dados, o React enviará o HTML para o fallback `BigSpinner` em vez disso. Em seguida, à medida que mais dados se tornam disponíveis, mais conteúdo continuará a ser revelado até que tudo se torne visível.

O streaming não precisa esperar que o próprio React carregue no navegador ou que seu aplicativo se torne interativo. O conteúdo HTML do servidor será revelado progressivamente antes que qualquer uma das tags `<script>` carregue.

[Leia mais sobre como o streaming HTML funciona.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Apenas fontes de dados ativadas pelo Suspense ativarão o componente Suspense.** Eles incluem:

- Busca de dados com frameworks com suporte ao Suspense como [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) e [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Código de componente de carregamento lento com [`lazy`](/reference/react/lazy)
- Lendo o valor de uma Promise com [`use`](/reference/react/use)

Suspense **não** detecta quando os dados são buscados dentro de um Effect ou manipulador de eventos.

A maneira exata como você carregaria dados no componente `Posts` acima depende do seu framework. Se você usar um framework com suporte ao Suspense, encontrará os detalhes em sua documentação de busca de dados.

A busca de dados habilitada para Suspense sem o uso de um framework opinativo ainda não é compatível. Os requisitos para implementar uma fonte de dados habilitada para Suspense são instáveis e não estão documentados. Uma API oficial para integrar fontes de dados ao Suspense será lançada em uma versão futura do React.

</Note>

---

### Especificando o que entra no shell {/*specifying-what-goes-into-the-shell*/}

A parte do seu aplicativo fora de qualquer boundary `<Suspense>` é chamada de *shell:*

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

Ele determina o estado de carregamento mais antigo que o usuário pode ver:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Se você envolver todo o aplicativo em uma boundary `<Suspense>` na raiz, o shell conterá apenas esse spinner. No entanto, essa não é uma boa experiência do usuário, porque ver um spinner grande na tela pode parecer mais lento e mais irritante do que esperar um pouco mais e ver o layout real. É por isso que, geralmente, você vai querer colocar as boundaries `<Suspense>` para que o shell pareça *mínimo, mas completo* - como um esqueleto de todo o layout da página.

O callback `onShellReady` é acionado quando todo o shell foi renderizado. Normalmente, você iniciará o streaming então:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

No momento em que `onShellReady` é ativado, os componentes nas boundaries `<Suspense>` aninhadas ainda podem estar carregando dados.

---

### Registrando falhas no servidor {/*logging-crashes-on-the-server*/}

Por padrão, todos os erros no servidor são registrados no console. Você pode substituir esse comportamento para registrar relatórios de falha:

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

Se você fornecer uma implementação `onError` personalizada, não se esqueça de também registrar erros no console como acima.

---

### Recuperando de erros dentro do shell {/*recovering-from-errors-inside-the-shell*/}

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

Se ocorrer um erro ao renderizar esses componentes, o React não terá nenhum HTML significativo para enviar ao cliente. Substitua `onShellError` para enviar um HTML de fallback que não dependa da renderização do servidor como último recurso:

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
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se houver um erro ao gerar o shell, `onError` e `onShellError` serão disparados. Use `onError` para relatórios de erros e use `onShellError` para enviar o documento HTML de fallback. Seu HTML de fallback não precisa ser uma página de erro. Em vez disso, você pode incluir um shell alternativo que renderize seu aplicativo apenas no cliente.

---

### Recuperando de erros fora do shell {/*recovering-from-errors-outside-the-shell*/}

Neste exemplo, o componente `<Posts />` está envolvido em `<Suspense>` para que *não* faça parte do shell:

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

Se ocorrer um erro no componente `Posts` ou em algum lugar dentro dele, o React [tentará se recuperar dele:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Ele emitirá o fallback de carregamento para o `<Suspense>` mais próximo (`PostsGlimmer`) no HTML.
2. Ele "desistirá" de tentar renderizar o conteúdo `Posts` no servidor.
3. Quando o código JavaScript carrega no cliente, o React *tentará* renderizar `Posts` no cliente.

Se tentar renderizar `Posts` no cliente *também* falhar, o React lançará o erro no cliente. Como acontece com todos os erros lançados durante a renderização, a [error boundary pai mais próxima](/reference/react/Component#static-getderivedstatefromerror) determina como apresentar o erro ao usuário. Na prática, isso significa que o usuário verá um indicador de carregamento até que seja certo que o erro não é recuperável.

Se tentar renderizar `Posts` no cliente for bem-sucedido, o fallback de carregamento do servidor será substituído pela saída de renderização do cliente. O usuário não saberá que houve um erro do servidor. No entanto, o callback `onError` do servidor e os callbacks [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) do cliente serão disparados para que você possa ser notificado sobre o erro.

---

### Definindo o código de status {/*setting-the-status-code*/}

O streaming introduz uma troca. Você deseja começar a transmitir a página o mais cedo possível para que o usuário possa ver o conteúdo mais cedo. No entanto, assim que você começar a transmitir, você não poderá mais definir o código de status da resposta.

Ao [dividir seu aplicativo](#specifying-what-goes-into-the-shell) no shell (acima de todas as boundaries `<Suspense>`) e o restante do conteúdo, você já resolveu parte desse problema. Se o shell emitir um erro, você receberá o callback `onShellError` que permite definir o código de status do erro. Caso contrário, você sabe que o aplicativo pode se recuperar no cliente, então você pode enviar "OK".

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
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Se um componente *fora* do shell (ou seja, dentro de uma boundary `<Suspense>`) lançar um erro, o React não parará de renderizar. Isso significa que o callback `onError` será acionado, mas você ainda receberá `onShellReady` em vez de `onShellError`. Isso ocorre porque o React tentará se recuperar desse erro no cliente, [como descrito acima.](#recovering-from-errors-outside-the-shell)

No entanto, se você quiser, pode usar o fato de algo ter dado errado para definir o código de status:

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
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Isso só detectará erros fora do shell que ocorreram ao gerar o conteúdo inicial do shell, portanto, não é exaustivo. Se saber se um erro ocorreu para algum conteúdo for fundamental, você poderá movê-lo para o shell.

---

### Lidando com diferentes erros de maneiras diferentes {/*handling-different-errors-in-different-ways*/}

Você pode [criar suas próprias subclasses `Error`](https://javascript.info/custom-errors) e usar o operador [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) para verificar qual erro é lançado. Por exemplo, você pode definir um `NotFoundError` personalizado e lançá-lo do seu componente. Em seguida, seus callbacks `onError`, `onShellReady` e `onShellError` podem fazer algo diferente dependendo do tipo de erro:

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
   response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Lembre-se que, uma vez que você emite o shell e inicia o streaming, você não pode alterar o código de status.

---

### Esperando o carregamento de todo o conteúdo para crawlers e geração estática {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

O streaming oferece uma melhor experiência do usuário porque o usuário pode ver o conteúdo à medida que ele fica disponível.

No entanto, quando um crawler visita sua página ou se você estiver gerando as páginas no tempo de build, talvez você queira que todo o conteúdo seja carregado primeiro e, em seguida, produza a saída HTML final em vez de revelá-lo progressivamente.

Você pode aguardar o carregamento de todo o conteúdo usando o callback `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depende da sua estratégia de detecção de bot ...

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
    response.send('<h1>Something went wrong</h1>'); 
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

Um visitante normal receberá um fluxo de conteúdo carregado progressivamente. Um crawler receberá a saída HTML final após o carregamento de todos os dados. No entanto, isso também significa que o crawler terá que esperar por *todos* os dados, alguns dos quais podem ser lentos para carregar ou dar erro. Dependendo do seu app, você pode optar por enviar o shell para os crawlers também.

---

### Interrompendo a renderização do servidor {/*aborting-server-rendering*/}

Você pode forçar a "desistência" da renderização do servidor após um tempo limite:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

O React irá descarregar os fallbacks de carregamento restantes como HTML e tentará renderizar o restante no cliente.