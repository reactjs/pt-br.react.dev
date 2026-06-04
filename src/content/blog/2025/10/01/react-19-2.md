---
title: "React 19.2"
author: The React Team
date: 2025/10/01
description: O React 19.2 adiciona novos recursos como Activity, React Performance Tracks, useEffectEvent e muito mais.
---

1 de outubro de 2025 por [A Equipe do React](/community/team)

---

<Intro>

React 19.2 já está disponível no npm!

</Intro>

Esta é a nossa terceira versão no último ano, após o React 19 em dezembro e o React 19.1 em junho. Neste post, daremos uma visão geral dos novos recursos do React 19.2 e destacaremos algumas mudanças notáveis.

<InlineToc />

---

## Novos recursos do React {/*new-react-features*/}

### `<Activity />` {/*activity*/}

`<Activity>` permite que você divida seu aplicativo em "atividades" que podem ser controladas e priorizadas.

Você pode usar Activity como uma alternativa para renderizar condicionalmente partes do seu aplicativo:

```js
// Antes
{isVisible && <Page />}

// Depois
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

No React 19.2, Activity suporta dois modos: `visible` e `hidden`.

- `hidden`: oculta os filhos, desmonta efeitos e adia todas as atualizações até que o React não tenha mais nada para trabalhar.
- `visible`: mostra os filhos, monta efeitos e permite que as atualizações sejam processadas normalmente.

Isso significa que você pode pré-renderizar e continuar renderizando partes ocultas do aplicativo sem impactar o desempenho de qualquer coisa visível na tela.

Você pode usar Activity para renderizar partes ocultas do aplicativo para as quais um usuário provavelmente navegará em seguida, ou para salvar o estado de partes das quais o usuário se afastou. Isso ajuda a tornar as navegações mais rápidas carregando dados, CSS e imagens em segundo plano, e permite que as navegações de volta mantenham o estado, como campos de entrada.

No futuro, planejamos adicionar mais modos ao Activity para diferentes casos de uso.

Para exemplos de como usar Activity, confira a [documentação do Activity](/reference/react/Activity).

---

### `useEffectEvent` {/*use-effect-event*/}

Um padrão comum com `useEffect` é notificar o código do aplicativo sobre algum tipo de "eventos" de um sistema externo. Por exemplo, quando uma sala de chat é conectada, você pode querer exibir uma notificação:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]);
  // ...
```

O problema com o código acima é que uma mudança em quaisquer valores usados dentro de um "evento" como esse fará com que o Effect circundante seja reexecutado. Por exemplo, mudar o `theme` fará com que a sala de chat se reconecte. Isso faz sentido para valores relacionados à lógica do Effect em si, como `roomId`, mas não faz sentido para `theme`.

Para resolver isso, a maioria dos usuários simplesmente desabilita a regra do linter e exclui a dependência. Mas isso pode levar a erros, pois o linter não pode mais ajudá-lo a manter as dependências atualizadas se você precisar atualizar o Effect mais tarde.

Com `useEffectEvent`, você pode separar a parte do "evento" dessa lógica do Effect que a emite:

```js {2,3,4,9}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Todas as dependências declaradas (Eventos de Effect não são dependências)
  // ...
```

Semelhante aos eventos DOM, os Eventos de Effect sempre "enxergam" as últimas props e estado.

**Eventos de Effect não devem ser declarados no array de dependências**. Você precisará atualizar para `eslint-plugin-react-hooks@latest` para que o linter não tente inseri-los como dependências. Observe que Eventos de Effect só podem ser declarados no mesmo componente ou Hook que "seus" Effects. Essas restrições são verificadas pelo linter.

<Note>

#### Quando usar `useEffectEvent` {/*when-to-use-useeffectevent*/}

Você deve usar `useEffectEvent` para funções que são conceitualmente "eventos" que acontecem de serem disparados por um Effect em vez de um evento do usuário (é isso que o torna um "Evento de Effect"). Você não precisa envolver tudo em `useEffectEvent`, ou usá-lo apenas para silenciar o erro do linter, pois isso pode levar a erros.

Para um mergulho profundo sobre como pensar em Eventos de Effect, veja: [Separando Eventos de Effects](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects).

</Note>

---

### `cacheSignal` {/*cache-signal*/}

<RSC>

`cacheSignal` é apenas para uso com [React Server Components](/reference/rsc/server-components).

</RSC>

`cacheSignal` permite que você saiba quando o tempo de vida do [`cache()`](/reference/react/cache) acabou:

```
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);

async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

Isso permite que você limpe ou aborte o trabalho quando o resultado não for mais usado no cache, como:

- O React completou a renderização com sucesso
- A renderização foi abortada
- A renderização falhou

Para mais informações, veja a [documentação do `cacheSignal`](/reference/react/cacheSignal).

---

### Performance Tracks {/*performance-tracks*/}

O React 19.2 adiciona um novo conjunto de [trilhas personalizadas](https://developer.chrome.com/docs/devtools/performance/extension) aos perfis de desempenho do Chrome DevTools para fornecer mais informações sobre o desempenho do seu aplicativo React:

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

A [documentação do React Performance Tracks](/reference/dev-tools/react-performance-tracks) explica tudo o que está incluído nas trilhas, mas aqui está uma visão geral.

#### Scheduler ⚛ {/*scheduler-*/}

A trilha do Scheduler mostra o que o React está trabalhando para diferentes prioridades, como "blocking" para interações do usuário, ou "transition" para atualizações dentro de `startTransition`. Dentro de cada trilha, você verá o tipo de trabalho sendo realizado, como o evento que agendou uma atualização e quando a renderização dessa atualização ocorreu.

Também mostramos informações como quando uma atualização está bloqueada esperando por uma prioridade diferente, ou quando o React está esperando pela pintura antes de continuar. A trilha do Scheduler ajuda você a entender como o React divide seu código em diferentes prioridades e a ordem em que concluiu o trabalho.

Veja a documentação da [trilha do Scheduler](/reference/dev-tools/react-performance-tracks#scheduler) para ver tudo o que está incluído.

#### Components ⚛ {/*components-*/}

A trilha de Componentes mostra a árvore de componentes em que o React está trabalhando para renderizar ou executar efeitos. Dentro dela, você verá rótulos como "Mount" para quando os filhos são montados ou efeitos são montados, ou "Blocked" para quando a renderização é bloqueada devido à cedência de trabalho fora do React.

A trilha de Componentes ajuda você a entender quando os componentes são renderizados ou executam efeitos, e o tempo que leva para concluir esse trabalho para ajudar a identificar problemas de desempenho.

Veja a documentação da [trilha de Componentes](/reference/dev-tools/react-performance-tracks#components) para ver tudo o que está incluído.

---

## Novos recursos do React DOM {/*new-react-dom-features*/}

### Partial Pre-rendering {/*partial-pre-rendering*/}

No 19.2, estamos adicionando uma nova capacidade para pré-renderizar parte do aplicativo com antecedência e retomar a renderização mais tarde.

Este recurso é chamado "Partial Pre-rendering" e permite pré-renderizar as partes estáticas do seu aplicativo e servi-las de uma CDN, e depois retomar a renderização do shell para preenchê-lo com conteúdo dinâmico mais tarde.

Para pré-renderizar um aplicativo para retomar mais tarde, primeiro chame `prerender` com um `AbortController`:

```
const {prelude, postponed} = await prerender(<App />, {
  signal: controller.signal,
});

// Salve o estado postponed para mais tarde
await savePostponedState(postponed);

// Envie o prelude para o cliente ou CDN.
```

Em seguida, você pode retornar o shell `prelude` para o cliente e, mais tarde, chamar `resume` para "retomar" um stream SSR:

```
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);

// Envie o stream para o cliente.
```

Ou você pode chamar `resumeAndPrerender` para retomar e obter HTML estático para SSG:

```
const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);

// Envie o prelude HTML completo para a CDN.
```

Para mais informações, veja a documentação das novas APIs:
- `react-dom/server`
  - [`resume`](/reference/react-dom/server/resume): para Web Streams.
  - [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) para Node Streams.
- `react-dom/static`
  - [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) para Web Streams.
  - [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) para Node Streams.

Além disso, as APIs de prerender agora retornam um estado `postpone` para passar para as APIs de `resume`.

---

## Mudanças notáveis {/*notable-changes*/}

### Agrupamento de Limites Suspense para SSR {/*batching-suspense-boundaries-for-ssr*/}

Corrigimos um bug comportamental onde os limites Suspense se revelariam de forma diferente dependendo se foram renderizados no cliente ou ao fazer streaming da renderização do lado do servidor.

A partir do 19.2, o React agrupará as revelações de limites Suspense renderizados pelo servidor por um curto período, para permitir que mais conteúdo seja revelado em conjunto e se alinhe com o comportamento renderizado pelo cliente.

<Diagram name="19_2_batching_before" height={162} width={1270} alt="Diagrama com três seções, com uma seta transicionando cada seção entre elas. A primeira seção contém um retângulo de página mostrando um estado de carregamento cintilante com barras desbotadas. O segundo painel mostra a metade superior da página revelada e destacada em azul. O terceiro painel mostra a página inteira revelada e destacada em azul.">

Anteriormente, durante o streaming da renderização do lado do servidor, o conteúdo suspense substituía imediatamente os fallbacks.

</Diagram>

<Diagram name="19_2_batching_after" height={162} width={1270} alt="Diagrama com três seções, com uma seta transicionando cada seção entre elas. A primeira seção contém um retângulo de página mostrando um estado de carregamento cintilante com barras desbotadas. O segundo painel mostra a mesma página. O terceiro painel mostra a página inteira revelada e destacada em azul.">

No React 19.2, os limites suspense são agrupados por um pequeno período de tempo, para permitir a revelação de mais conteúdo em conjunto.

</Diagram>

Esta correção também prepara os aplicativos para suportar `<ViewTransition>` para Suspense durante o SSR. Ao revelar mais conteúdo em conjunto, as animações podem ser executadas em lotes maiores de conteúdo e evitar o encadeamento de animações de conteúdo que chegam em fluxo próximo.

<Note>

O React usa heurísticas para garantir que o throttling não afete os Core Web Vitals e o ranking de busca.

Por exemplo, se o tempo total de carregamento da página estiver se aproximando de 2,5s (que é o tempo considerado "bom" para [LCP](https://web.dev/articles/lcp)), o React parará de agrupar e revelará o conteúdo imediatamente para que o throttling não seja o motivo para perder a métrica.

</Note>

---

### SSR: Suporte a Web Streams para Node {/*ssr-web-streams-support-for-node*/}

O React 19.2 adiciona suporte a Web Streams para streaming de SSR no Node.js:
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) agora está disponível para Node.js
- [`prerender`](/reference/react-dom/static/prerender) agora está disponível para Node.js

Assim como as novas APIs `resume`:
- [`resume`](/reference/react-dom/server/resume) está disponível para Node.js.
- [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) está disponível para Node.js.


<Pitfall>

#### Prefira Node Streams para renderização do lado do servidor no Node.js {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

Em ambientes Node.js, ainda recomendamos fortemente o uso das APIs de Node Streams:

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)

Isso ocorre porque os Node Streams são muito mais rápidos que os Web Streams no Node, e os Web Streams não suportam compressão por padrão, levando os usuários a perderem acidentalmente os benefícios do streaming.

</Pitfall>

---

### `eslint-plugin-react-hooks` v6 {/*eslint-plugin-react-hooks*/}

Também publicamos `eslint-plugin-react-hooks@latest` com flat config por padrão no preset `recommended`, e opção de inclusão para novas regras com suporte do React Compiler.

Para continuar usando a configuração legada, você pode mudar para `recommended-legacy`:

```diff
- extends: ['plugin:react-hooks/recommended']
+ extends: ['plugin:react-hooks/recommended-legacy']
```

Para uma lista completa de regras habilitadas pelo compilador, [verifique a documentação do linter](/reference/eslint-plugin-react-hooks#recommended).

Confira o [changelog do `eslint-plugin-react-hooks` para uma lista completa de mudanças](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md#610).

---

### Atualizar o prefixo padrão de `useId` {/*update-the-default-useid-prefix*/}

No 19.2, estamos atualizando o prefixo padrão de `useId` de `:r:` (19.0.0) ou `«r»` (19.1.0) para `_r_`.

A intenção original de usar um caractere especial que não era válido para seletores CSS era que ele teria pouca probabilidade de colidir com IDs escritos pelos usuários. No entanto, para suportar View Transitions, precisamos garantir que os IDs gerados por `useId` sejam válidos para `view-transition-name` e nomes XML 1.0.

---

## Changelog {/*changelog*/}

Outras mudanças notáveis
- `react-dom`: Permite que nonce seja usado em estilos que podem ser içados [#32461](https://github.com/facebook/react/pull/32461)
- `react-dom`: Avisa ao usar um nó de propriedade do React como Container se ele também tiver conteúdo de texto [#32774](https://github.com/facebook/react/pull/32774)

Correções de bugs notáveis
- `react`: Stringifica o contexto como "SomeContext" em vez de "SomeContext.Provider" [#33507](https://github.com/facebook/react/pull/33507)
- `react`: Corrige loop infinito de `useDeferredValue` no evento popstate [#32821](https://github.com/facebook/react/pull/32821)
- `react`: Corrige um bug quando um valor inicial era passado para `useDeferredValue` [#34376](https://github.com/facebook/react/pull/34376)
- `react`: Corrige um crash ao enviar formulários com Client Actions [#33055](https://github.com/facebook/react/pull/33055)
- `react`: Oculta/reexibe o conteúdo de limites suspense desidratados se eles resuspendem [#32900](https://github.com/facebook/react/pull/32900)
- `react`: Evita estouro de pilha em árvores largas durante Hot Reload [#34145](https://github.com/facebook/react/pull/34145)
- `react`: Melhora as pilhas de componentes em vários locais [#33629](https://github.com/facebook/react/pull/33629), [#33724](https://github.com/facebook/react/pull/33724), [#32735](https://github.com/facebook/react/pull/32735), [#33723](https://github.com/facebook/react/pull/33723)
- `react`: Corrige um bug com `React.use` dentro de `Component` com `React.lazy` [#33941](https://github.com/facebook/react/pull/33941)
- `react-dom`: Para de avisar ao usar atributos ARIA 1.3 [#34264](https://github.com/facebook/react/pull/34264)
- `react-dom`: Corrige um bug com Suspense profundamente aninhado dentro de fallbacks de Suspense [#33467](https://github.com/facebook/react/pull/33467)
- `react-dom`: Evita travamento ao suspender após abortar durante a renderização [#34192](https://github.com/facebook/react/pull/34192)

Para uma lista completa de mudanças, por favor, veja o [Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md).


---

_Agradecimentos a [Ricky Hanlon](https://bsky.app/profile/ricky.fm) por [escrever este post](https://www.youtube.com/shorts/T9X3YkgZRG0), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me) e [Joe Savona](https://x.com/en_JS) por revisar este post._
