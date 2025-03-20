---
title: "React v18.0"
author: The React Team
date: 2022/03/08
description: React 18 is now available on npm! In our last post, we shared step-by-step instructions for upgrading your app to React 18. In this post, we'll give an overview of what's new in React 18, and what it means for the future.
---

March 29, 2022 por [The React Team](/community/team)

---

<Intro>

O React 18 já está disponível no npm! Em nosso último post, compartilhamos instruções passo a passo para [atualizar seu aplicativo para o React 18](/blog/2022/03/08/react-18-upgrade-guide). Neste post, daremos uma visão geral do que há de novo no React 18 e o que isso significa para o futuro.

</Intro>

---

Nossa versão principal mais recente inclui aprimoramentos imediatos como o *batching* automático, novas APIs como o `startTransition` e a renderização do lado do servidor com suporte para Suspense.

Muitos dos recursos do React 18 são construídos em cima de nosso novo *renderer* concorrente, uma mudança nos bastidores que desbloqueia novos recursos poderosos. O React Concorrente é opcional - ele só é ativado quando você usa um recurso concorrente - mas achamos que ele terá um grande impacto na maneira como as pessoas constroem aplicativos.

Passamos anos pesquisando e desenvolvendo suporte para simultaneidade no React e tomamos cuidado extra para fornecer um caminho de adoção gradual para os usuários existentes. No verão passado, [formamos o Grupo de Trabalho do React 18](/blog/2021/06/08/the-plan-for-react-18) para coletar feedback de especialistas da comunidade e garantir uma experiência de atualização tranquila para todo o ecossistema React.

Caso você tenha perdido, compartilhamos grande parte dessa visão no React Conf 2021:

* Na [palestra](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa), explicamos como o React 18 se encaixa em nossa missão de facilitar aos desenvolvedores a criação de ótimas experiências do usuário
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [demonstrou como usar os novos recursos no React 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai) nos deu uma visão geral da [renderização do servidor com streaming com Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

Abaixo está uma visão geral completa do que esperar nesta versão, começando com a Renderização Concorrente.

<Note>

Para usuários do React Native, o React 18 será lançado no React Native com a Nova Arquitetura React Native. Para mais informações, consulte a [palestra do React Conf aqui](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## O que é React Concorrente? {/*what-is-concurrent-react*/}

A adição mais importante no React 18 é algo em que esperamos que você nunca precise pensar: a simultaneidade. Achamos que isso é amplamente verdadeiro para desenvolvedores de aplicativos, embora a história possa ser um pouco mais complicada para os mantenedores de bibliotecas.

A simultaneidade não é um recurso, por si só. É um novo mecanismo nos bastidores que permite ao React preparar várias versões de sua UI ao mesmo tempo. Você pode pensar na simultaneidade como um detalhe de implementação — é valioso por causa dos recursos que ele desbloqueia. O React usa técnicas sofisticadas em sua implementação interna, como filas de prioridade e vários *buffering*. Mas você não verá esses conceitos em nenhum de nossos APIs públicas.

Quando projetamos APIs, tentamos esconder os detalhes de implementação dos desenvolvedores. Como desenvolvedor React, você se concentra no *que* deseja que a experiência do usuário se pareça, e o React lida com *como* entregar essa experiência. Portanto, não esperamos que os desenvolvedores do React saibam como a simultaneidade funciona por dentro.

No entanto, o React Concorrente é mais importante do que um detalhe de implementação típico — é uma atualização fundamental para o modelo de renderização central do React. Portanto, embora não seja muito importante saber como a simultaneidade funciona, pode valer a pena saber o que é em um nível alto.

Uma propriedade chave do React Concorrente é que a renderização é *interruptível*. Quando você atualiza pela primeira vez para o React 18, antes de adicionar quaisquer recursos concorrentes, as atualizações são renderizadas da mesma forma que nas versões anteriores do React — em uma única transação síncrona e ininterrupta. Com a renderização síncrona, uma vez que uma atualização começa a renderizar, nada pode interrompê-la até que o usuário possa ver o resultado na tela.

Em uma renderização concorrente, este nem sempre é o caso. O React pode começar a renderizar uma atualização, pausar no meio e, em seguida, continuar mais tarde. Ele pode até mesmo abandonar uma renderização em andamento completamente. O React garante que a UI aparecerá consistente mesmo que uma renderização seja interrompida. Para fazer isso, ele espera para executar as mutações do DOM até o final, uma vez que toda a árvore foi avaliada. Com essa capacidade, o React pode preparar novas telas em segundo plano sem bloquear a *thread* principal. Isso significa que a UI pode responder imediatamente à entrada do usuário, mesmo que esteja no meio de uma grande tarefa de renderização, criando uma experiência de usuário fluida.

Outro exemplo é o estado reutilizável. O React Concorrente pode remover seções da UI da tela e, em seguida, adicioná-las de volta mais tarde, reutilizando o estado anterior. Por exemplo, quando um usuário sai de uma tela e volta, o React deve ser capaz de restaurar a tela anterior no mesmo estado em que estava antes. Em uma próxima versão secundária, estamos planejando adicionar um novo componente chamado `<Offscreen>` que implementa esse padrão. Da mesma forma, você poderá usar Offscreen para preparar novas UIs em segundo plano para que ela esteja pronta antes que o usuário a revele.

A renderização concorrente é uma nova ferramenta poderosa no React e a maioria de nossos novos recursos são construídos para tirar proveito dela, incluindo Suspense, transições e renderização do servidor com *streaming*. Mas o React 18 é apenas o começo do que pretendemos construir sobre essa nova base.

## Adotando gradualmente recursos concorrentes {/*gradually-adopting-concurrent-features*/}

Tecnicamente, a renderização concorrente é uma mudança *breaking*. Como a renderização concorrente é *interruptível*, os componentes se comportam de maneira ligeiramente diferente quando ela é ativada.

Em nossos testes, atualizamos milhares de componentes para o React 18. O que descobrimos é que quase todos os componentes existentes "simplesmente funcionam" com renderização concorrente, sem nenhuma alteração. No entanto, alguns deles podem exigir algum esforço de migração adicional. Embora as alterações geralmente sejam pequenas, você ainda terá a capacidade de fazê-las em seu próprio ritmo. O novo comportamento de renderização no React 18 **só é ativado nas partes do seu aplicativo que usam novos recursos.**

A estratégia geral de atualização é colocar seu aplicativo em execução no React 18 sem quebrar o código existente. Então você pode gradualmente começar a adicionar recursos concorrentes em seu próprio ritmo. Você pode usar [`<StrictMode>`](/reference/react/StrictMode) para ajudar a expor erros relacionados à simultaneidade durante o desenvolvimento. O Strict Mode não afeta o comportamento de produção, mas durante o desenvolvimento ele registrará avisos extras e invocará funções em dobro que devem ser idempotentes. Ele não detectará tudo, mas é eficaz para evitar os tipos mais comuns de erros.

Depois de atualizar para o React 18, você poderá começar a usar os recursos concorrentes imediatamente. Por exemplo, você pode usar `startTransition` para navegar entre as telas sem bloquear a entrada do usuário. Ou use `useDeferredValue` para limitar as re-renderizações caras.

No entanto, a longo prazo, esperamos que a principal maneira de adicionar simultaneidade ao seu aplicativo seja usando uma biblioteca ou *framework* habilitado para simultaneidade. Na maioria dos casos, você não interagirá com as APIs concorrentes diretamente. Por exemplo, em vez de os desenvolvedores chamarem `startTransition` sempre que navegam para uma nova tela, as bibliotecas de roteamento automaticamente encapsularão as navegações em `startTransition`.

Pode levar algum tempo para as bibliotecas serem atualizadas para serem compatíveis com a simultaneidade. Fornecemos novas APIs para facilitar que as bibliotecas aproveitem os recursos concorrentes. Nesse ínterim, seja paciente com os mantenedores enquanto trabalhamos para migrar gradualmente o ecossistema React.

Para mais informações, consulte nosso post anterior: [Como atualizar para o React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense em *Frameworks* de Dados {/*suspense-in-data-frameworks*/}

No React 18, você pode começar a usar [Suspense](/reference/react/Suspense) para buscar dados em *frameworks* opinativos como Relay, Next.js, Hydrogen ou Remix. A busca de dados *ad hoc* com Suspense é tecnicamente possível, mas ainda não é recomendada como uma estratégia geral.

No futuro, podemos expor primitivos adicionais que podem facilitar o acesso aos seus dados com Suspense, talvez sem o uso de um *framework* opinativo. No entanto, o Suspense funciona melhor quando está profundamente integrado à arquitetura de seu aplicativo: seu *router*, sua camada de dados e seu ambiente de renderização do servidor. Portanto, mesmo a longo prazo, esperamos que as bibliotecas e *frameworks* desempenhem um papel crucial no ecossistema React.

Assim como nas versões anteriores do React, você também pode usar Suspense para divisão de código (code splitting) no cliente com React.lazy. Mas nossa visão para o Suspense sempre foi sobre muito mais do que carregar código — o objetivo é estender o suporte para Suspense para que, eventualmente, o mesmo *fallback* declarativo do Suspense possa lidar com qualquer operação assíncrona (carregando código, dados, imagens, etc.).

## Server Components ainda está em desenvolvimento  {/*server-components-is-still-in-development*/}

Os [**Server Components**](/blog/2020/12/21/data-fetching-with-react-server-components) é um recurso futuro que permite aos desenvolvedores construir aplicativos que abrangem o servidor e o cliente, combinando a rica interatividade de aplicativos do lado do cliente com o desempenho aprimorado da renderização tradicional do servidor. Server Components não é inerentemente acoplado ao React Concorrente, mas é projetado para funcionar melhor com recursos concorrentes como Suspense e renderização de servidor com *streaming*.

Server Components ainda é experimental, mas esperamos lançar uma versão inicial em uma versão secundária 18.x. Enquanto isso, estamos trabalhando com *frameworks* como Next.js, Hydrogen e Remix para avançar na proposta e prepará-la para ampla adoção.

## O que há de novo no React 18 {/*whats-new-in-react-18*/}

### Novo Recurso: *Batching* Automático {/*new-feature-automatic-batching*/}

*Batching* é quando o React agrupa várias atualizações de estado em uma única re-renderização para melhor desempenho. Sem o *batching* automático, nós só agrupamos atualizações dentro dos *event handlers* do React. As atualizações dentro de *promises*, `setTimeout`, *event handlers* nativos ou qualquer outro evento não foram agrupadas no React por padrão. Com o *batching* automático, essas atualizações serão agrupadas automaticamente:

```js
// Antes: apenas eventos React foram agrupados.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React vai renderizar duas vezes, uma para cada atualização de estado (sem batching)
}, 1000);

// Depois: as atualizações dentro de timeouts, promises,
// event handlers nativos ou qualquer outro evento são agrupadas.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React só vai re-renderizar uma vez no final (isso é batching!)
}, 1000);
```

Para mais informações, veja este post para [Batching automático para menos renderizações no React 18](https://github.com/reactwg/react-18/discussions/21).

### Novo Recurso: Transições {/*new-feature-transitions*/}

Uma transição é um novo conceito no React para distinguir entre atualizações urgentes e não urgentes.

*   **Atualizações urgentes** refletem interação direta, como digitar, clicar, pressionar e assim por diante.
*   **Atualizações de transição** fazem a transição da UI de uma visualização para outra.

Atualizações urgentes como digitar, clicar ou pressionar, precisam de resposta imediata para corresponder às nossas intuições sobre como os objetos físicos se comportam. Caso contrário, parecem "erradas". No entanto, as transições são diferentes porque o usuário não espera ver cada valor intermediário na tela.

Por exemplo, quando você seleciona um filtro em um *dropdown*, você espera que o botão de filtro responda imediatamente quando você clica. No entanto, os resultados reais podem fazer a transição separadamente. Um pequeno atraso seria imperceptível e frequentemente esperado. E se você alterar o filtro novamente antes que os resultados terminem de renderizar, você só se importa em ver os últimos resultados.

Normalmente, para a melhor experiência do usuário, uma única entrada do usuário deve resultar em uma atualização urgente e uma não urgente. Você pode usar a API `startTransition` dentro de um evento de entrada para informar ao React quais atualizações são urgentes e quais são "transições":

```js
import { startTransition } from 'react';

// Urgente: Mostre o que foi digitado
setInputValue(input);

// Marque quaisquer atualizações de estado dentro como transições
startTransition(() => {
  // Transição: Mostre os resultados
  setSearchQuery(input);
});
```

As atualizações encapsuladas em `startTransition` são tratadas como não urgentes e serão interrompidas se entrarem atualizações mais urgentes, como cliques ou pressionamentos de teclas. Se uma transição for interrompida pelo usuário (por exemplo, digitando vários caracteres em sequência), o React descartará o trabalho de renderização desatualizado que não foi finalizado e renderizará apenas a última atualização.

*   `useTransition`: um *Hook* para iniciar transições, incluindo um valor para rastrear o estado pendente.
*   `startTransition`: um método para iniciar transições quando o *Hook* não pode ser usado.

As transições serão optadas para a renderização concorrente, o que permite que a atualização seja interrompida. Se o conteúdo re-suspender, as transições também dizem ao React para continuar mostrando o conteúdo atual enquanto renderiza o conteúdo da transição em segundo plano (veja o [RFC Suspense](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) para mais informações).

[Veja a documentação para transições aqui](/reference/react/useTransition).

### Novos Recursos Suspense {/*new-suspense-features*/}

Suspense permite que você especifique declarativamente o estado de carregamento para uma parte da árvore de componentes se ainda não estiver pronta para ser exibida:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense torna o "estado de carregamento da UI" um conceito declarativo de primeira classe no modelo de programação do React. Isso nos permite construir recursos de nível superior em cima dele.

Apresentamos uma versão limitada do Suspense há vários anos. No entanto, o único caso de uso suportado era a divisão de código com React.lazy, e não era suportado ao renderizar no servidor.

No React 18, adicionamos suporte para Suspense no servidor e expandimos seus recursos usando recursos de renderização concorrente.

Suspense no React 18 funciona melhor quando combinado com a API de transição. Se você suspender durante uma transição, o React impedirá que o conteúdo já visível seja substituído por um *fallback*. Em vez disso, o React atrasará a renderização até que dados suficientes tenham sido carregados para evitar um mau estado de carregamento.

Para mais informações, consulte o RFC para [Suspense no React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### Novas APIs de renderização de cliente e servidor  {/*new-client-and-server-rendering-apis*/}

Nesta versão, aproveitamos a oportunidade para redesenhar as APIs que expomos para renderização no cliente e no servidor. Essas alterações permitem que os usuários continuem usando as APIs antigas no modo React 17 enquanto atualizam para as novas APIs no React 18.

#### React DOM Client {/*react-dom-client*/}

Essas novas APIs agora são exportadas de `react-dom/client`:

*   `createRoot`: Novo método para criar uma raiz para `renderizar` ou `desmontar`. Use-o em vez de `ReactDOM.render`. Novos recursos no React 18 não funcionam sem ele.
*   `hydrateRoot`: Novo método para hidratar um aplicativo renderizado no servidor. Use-o em vez de `ReactDOM.hydrate` em conjunto com as novas APIs React DOM Server. Novos recursos no React 18 não funcionam sem ele.

Tanto `createRoot` quanto `hydrateRoot` aceitam uma nova opção chamada `onRecoverableError` caso você queira ser notificado quando o React se recuperar de erros durante a renderização ou hidratação para registro em log. Por padrão, o React usará [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError), ou `console.error` em navegadores mais antigos.

[Veja a documentação para React DOM Client aqui](/reference/react-dom/client).

#### React DOM Server {/*react-dom-server*/}

Essas novas APIs agora são exportadas de `react-dom/server` e têm suporte total para Suspense com *streaming* no servidor:

*   `renderToPipeableStream`: para *streaming* em ambientes Node.
*   `renderToReadableStream`: para ambientes de tempo de execução de ponta modernos, como Deno e Cloudflare workers.

O método `renderToString` existente continua funcionando, mas é desencorajado.

[Veja a documentação para React DOM Server aqui](/reference/react-dom/server).

### Novos Comportamentos do Strict Mode {/*new-strict-mode-behaviors*/}

No futuro, gostaríamos de adicionar um recurso que permita ao React adicionar e remover seções da UI, preservando o estado. Por exemplo, quando um usuário sai de uma tela e volta, o React deve ser capaz de mostrar imediatamente a tela anterior. Para fazer isso, o React desmontaria e remontaria árvores usando o mesmo estado do componente de antes.

Este recurso dará aos aplicativos React melhor desempenho imediato, mas exige que os componentes sejam resistentes aos efeitos que estão sendo montados e destruídos várias vezes. A maioria dos efeitos funcionará sem nenhuma alteração, mas alguns efeitos presumem que eles são montados ou destruídos apenas uma vez.

Para ajudar a expor esses problemas, o React 18 apresenta uma nova verificação somente para desenvolvimento no Strict Mode. Essa nova verificação desmontará e remontará automaticamente todos os componentes, sempre que um componente for montado pela primeira vez, restaurando o estado anterior na segunda montagem.

Antes desta alteração, o React montaria o componente e criaria os efeitos:
````
* React monta o componente.
  * Layout effects são criados.
  * Effects são criados.
```

Com o Strict Mode no React 18, o React simulará a desmontagem e remontagem do componente no modo de desenvolvimento:

```
* React monta o componente.
  * Layout effects são criados.
  * Effects são criados.
* React simula a desmontagem do componente.
  * Layout effects são destruídos.
  * Effects são destruídos.
* React simula a montagem do componente com o estado anterior.
  * Layout effects são criados.
  * Effects são criados.
```

[Veja a documentação para garantir o estado reutilizável aqui](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### Novos Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` é um novo Hook para gerar IDs únicos no cliente e no servidor, evitando incompatibilidades de hidratação. É útil principalmente para bibliotecas de componentes que se integram com APIs de acessibilidade que exigem IDs únicos. Isso resolve um problema que já existe no React 17 e abaixo, mas é ainda mais importante no React 18 por causa de como o novo renderizador de servidor de streaming entrega o HTML fora de ordem. [Veja a documentação aqui](/reference/react/useId).

> Observação
>
> `useId` **não** serve para gerar [chaves em uma lista](/learn/rendering-lists#where-to-get-your-key). As chaves devem ser geradas a partir de seus dados.

#### useTransition {/*usetransition*/}

`useTransition` e `startTransition` permitem que você marque algumas atualizações de estado como não urgentes. Outras atualizações de estado são consideradas urgentes por padrão. O React permitirá que as atualizações de estado urgentes (por exemplo, atualizar uma entrada de texto) interrompam as atualizações de estado não urgentes (por exemplo, renderizar uma lista de resultados de pesquisa). [Veja a documentação aqui](/reference/react/useTransition).

#### useDeferredValue {/*usedeferredvalue*/}

O `useDeferredValue` permite que você adie a rerenderização de uma parte não urgente da árvore. É semelhante ao debouncing, mas tem algumas vantagens em comparação com ele. Não há atraso de tempo fixo, então o React tentará a renderização adiada logo após a primeira renderização ser refletida na tela. A renderização adiada é interrompível e não bloqueia a entrada do usuário. [Veja a documentação aqui](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` é um novo Hook que permite que lojas externas suportem leituras concorrentes, forçando as atualizações para a loja a serem síncronas. Ele remove a necessidade de useEffect ao implementar assinaturas em fontes de dados externas e é recomendado para qualquer biblioteca que se integra com o estado externo ao React. [Veja a documentação aqui](/reference/react/useSyncExternalStore).

> Observação
>
> `useSyncExternalStore` destina-se a ser usado por bibliotecas, não pelo código do aplicativo.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` é um novo Hook que permite que bibliotecas CSS-in-JS abordem problemas de desempenho de injeção de estilos na renderização. A menos que você já tenha construído uma biblioteca CSS-in-JS, não esperamos que você use isso. Este Hook será executado após o DOM ser mutado, mas antes que os layout effects leiam o novo layout. Isso resolve um problema que já existe no React 17 e inferior, mas é ainda mais importante no React 18, pois o React cede ao navegador durante a renderização concorrente, dando a ele a chance de recalcular o layout. [Veja a documentação aqui](/reference/react/useInsertionEffect).

> Observação
>
> `useInsertionEffect` destina-se a ser usado por bibliotecas, não pelo código do aplicativo.

## Como Fazer o Upgrade {/*how-to-upgrade*/}

Veja [Como Fazer o Upgrade para o React 18](/blog/2022/03/08/react-18-upgrade-guide) para obter instruções passo a passo e uma lista completa de mudanças importantes e notáveis.

## Changelog {/*changelog*/}

### React {/*react*/}

* Adiciona `useTransition` e `useDeferredValue` para separar atualizações urgentes de transições. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) por  [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adiciona `useId` para gerar IDs únicos. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) por  [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adiciona `useSyncExternalStore` para ajudar bibliotecas de lojas externas a se integrarem com o React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) por  [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), e [@drarmstr](https://github.com/drarmstr))
* Adiciona `startTransition` como uma versão de `useTransition` sem feedback pendente. ([#19696](https://github.com/facebook/react/pull/19696)  por [@rickhanlonii](https://github.com/rickhanlonii))
* Adiciona `useInsertionEffect` para bibliotecas CSS-in-JS. ([#21913](https://github.com/facebook/react/pull/21913)  por [@rickhanlonii](https://github.com/rickhanlonii))
* Faz Suspense remontar os layout effects quando o conteúdo reaparece.  ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) por  [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), e [@lunaruan](https://github.com/lunaruan))
* Faz o `<StrictMode>` reexecutar os effects para verificar o estado restaurável. ([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418)  por [@bvaughn](https://github.com/bvaughn) e [@lunaruan](https://github.com/lunaruan))
* Assume que os Símbolos estão sempre disponíveis. ([#23348](https://github.com/facebook/react/pull/23348)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Remove o polyfill `object-assign`. ([#23351](https://github.com/facebook/react/pull/23351)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Remove a API `unstable_changedBits` sem suporte.  ([#20953](https://github.com/facebook/react/pull/20953)  por [@acdlite](https://github.com/acdlite))
* Permite que os componentes renderizem indefinidos. ([#21869](https://github.com/facebook/react/pull/21869)  por [@rickhanlonii](https://github.com/rickhanlonii))
* Descarrega `useEffect` resultante de eventos discretos como cliques de forma síncrona. ([#21150](https://github.com/facebook/react/pull/21150)  por [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` agora se comporta da mesma forma que `null` e não é ignorado. ([#21854](https://github.com/facebook/react/pull/21854)  por [@rickhanlonii](https://github.com/rickhanlonii))
* Considera que todos os `lazy()` que resolvem para o mesmo componente são equivalentes. ([#20357](https://github.com/facebook/react/pull/20357)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Não corrige o console durante a primeira renderização. ([#22308](https://github.com/facebook/react/pull/22308)  por [@lunaruan](https://github.com/lunaruan))
* Melhora o uso da memória. ([#21039](https://github.com/facebook/react/pull/21039)  por [@bgirard](https://github.com/bgirard))
* Melhora as mensagens se a coerção de string lançar (Temporal.*, Symbol, etc.) ([#22064](https://github.com/facebook/react/pull/22064)  por [@justingrant](https://github.com/justingrant))
* Usa `setImmediate` quando disponível em vez de `MessageChannel`. ([#20834](https://github.com/facebook/react/pull/20834)  por [@gaearon](https://github.com/gaearon))
* Corrige a falha de contexto na propagação dentro de árvores suspensas. ([#23095](https://github.com/facebook/react/pull/23095)  por [@gaearon](https://github.com/gaearon))
* Corrige `useReducer` observando props incorretas, removendo o mecanismo de bailout ansioso. ([#22445](https://github.com/facebook/react/pull/22445)  por [@josephsavona](https://github.com/josephsavona))
* Corrige `setState` sendo ignorado no Safari ao anexar iframes. ([#23111](https://github.com/facebook/react/pull/23111)  por [@gaearon](https://github.com/gaearon))
* Corrige uma falha ao renderizar `ZonedDateTime` na árvore. ([#20617](https://github.com/facebook/react/pull/20617)  por [@dimaqq](https://github.com/dimaqq))
* Corrige uma falha quando o documento é definido como `null` nos testes. ([#22695](https://github.com/facebook/react/pull/22695)  por [@SimenB](https://github.com/SimenB))
* Corrige `onLoad` não disparando quando os recursos concorrentes estão ativados. ([#23316](https://github.com/facebook/react/pull/23316)  por [@gnoff](https://github.com/gnoff))
* Corrige um aviso quando um seletor retorna `NaN`.  ([#23333](https://github.com/facebook/react/pull/23333)  por [@hachibeeDI](https://github.com/hachibeeDI))
* Corrige uma falha quando o documento é definido como `null` nos testes. ([#22695](https://github.com/facebook/react/pull/22695) por [@SimenB](https://github.com/SimenB))
* Corrige o cabeçalho da licença gerado. ([#23004](https://github.com/facebook/react/pull/23004)  por [@vitaliemiron](https://github.com/vitaliemiron))
* Adiciona `package.json` como um dos pontos de entrada. ([#22954](https://github.com/facebook/react/pull/22954)  por [@Jack](https://github.com/Jack-Works))
* Permite suspender fora de uma limite de Suspense. ([#23267](https://github.com/facebook/react/pull/23267)  por [@acdlite](https://github.com/acdlite))
* Registra um erro recuperável sempre que a hidratação falha. ([#23319](https://github.com/facebook/react/pull/23319)  por [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Adiciona `createRoot` e `hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) por  [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adiciona hidratação seletiva. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) por  [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adiciona `aria-description` à lista de atributos ARIA conhecidos. ([#22142](https://github.com/facebook/react/pull/22142)  por [@mahyareb](https://github.com/mahyareb))
* Adiciona o evento `onResize` aos elementos de vídeo. ([#21973](https://github.com/facebook/react/pull/21973)  por [@rileyjshaw](https://github.com/rileyjshaw))
* Adiciona `imageSizes` e `imageSrcSet` às props conhecidas. ([#22550](https://github.com/facebook/react/pull/22550)  por [@eps1lon](https://github.com/eps1lon))
* Permite filhos `<option>` não string se `value` for fornecido.  ([#21431](https://github.com/facebook/react/pull/21431)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Corrige o estilo `aspectRatio` não sendo aplicado. ([#21100](https://github.com/facebook/react/pull/21100)  por [@gaearon](https://github.com/gaearon))
* Avisa se `renderSubtreeIntoContainer` for chamado. ([#23355](https://github.com/facebook/react/pull/23355)  por [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* Adiciona o novo renderizador de streaming. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) por  [@sebmarkbage](https://github.com/sebmarkbage))
* Corrige provedores de contexto em SSR ao lidar com várias solicitações. ([#23171](https://github.com/facebook/react/pull/23171)  por [@frandiox](https://github.com/frandiox))
* Reverte a renderização do cliente em incompatibilidade de texto. ([#23354](https://github.com/facebook/react/pull/23354)  por [@acdlite](https://github.com/acdlite))
* Descontinua `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359)  por [@sebmarkbage](https://github.com/sebmarkbage))
* Corrige um log de erro falso no novo renderizador de servidor. ([#24043](https://github.com/facebook/react/pull/24043)  por [@eps1lon](https://github.com/eps1lon))
* Corrige um erro no novo renderizador de servidor. ([#22617](https://github.com/facebook/react/pull/22617)  por [@shuding](https://github.com/shuding))
* Ignora os valores de função e símbolo dentro de elementos personalizados no servidor. ([#21157](https://github.com/facebook/react/pull/21157)  por [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* Lança quando `act` é usado em produção. ([#21686](https://github.com/facebook/react/pull/21686)  por [@acdlite](https://github.com/acdlite))
* Suporta a desativação de avisos de `act` falsos com `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561)  por [@acdlite](https://github.com/acdlite))
* Expande o aviso de act para cobrir todas as APIs que podem agendar o trabalho do React. ([#22607](https://github.com/facebook/react/pull/22607)  por [@acdlite](https://github.com/acdlite))
* Faz atualizações de lote `act`. ([#21797](https://github.com/facebook/react/pull/21797)  por [@acdlite](https://github.com/acdlite))
* Remove o aviso para efeitos passivos pendentes. ([#22609](https://github.com/facebook/react/pull/22609)  por [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Rastreia as raízes montadas tardiamente no Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740)  por [@anc95](https://github.com/anc95))
* Adiciona campo `exports` ao `package.json`. ([#23087](https://github.com/facebook/react/pull/23087)  por [@otakustay](https://github.com/otakustay))

### Componentes de Servidor (Experimental) {/*server-components-experimental*/}

* Adiciona suporte ao Contexto do Servidor. ([#23244](https://github.com/facebook/react/pull/23244)  por [@salazarm](https://github.com/salazarm))
* Adiciona suporte `lazy`. ([#24068](https://github.com/facebook/react/pull/24068)  por [@gnoff](https://github.com/gnoff))
* Atualiza o plugin webpack para webpack 5 ([#22739](https://github.com/facebook/react/pull/22739)  por [@michenly](https://github.com/michenly))
* Corrige um erro no carregador do Node. ([#22537](https://github.com/facebook/react/pull/22537)  por [@btea](https://github.com/btea))
* Usa `globalThis` em vez de `window` para ambientes de borda. ([#22777](https://github.com/facebook/react/pull/22777)  por [@huozhi](https://github.com/huozhi))
``