---
title: "React v18.0"
author: The React Team
date: 2022/03/08
description: O React 18 já está disponível no npm! Em nossa última postagem, compartilhamos instruções passo a passo para atualizar seu aplicativo para o React 18. Nesta postagem, daremos uma visão geral do que há de novo no React 18 e o que isso significa para o futuro.
---

29 de março de 2022 por [The React Team](/community/team)

---

<Intro>

O React 18 já está disponível no npm! Em nossa última postagem, compartilhamos instruções passo a passo para [atualizar seu aplicativo para o React 18](/blog/2022/03/08/react-18-upgrade-guide). Nesta postagem, daremos uma visão geral do que há de novo no React 18 e o que isso significa para o futuro.

</Intro>

---

Nossa última versão principal inclui melhorias prontas para uso, como agrupamento automático, novas APIs como startTransition e renderização em streaming do lado do servidor com suporte para Suspense.

Muitos dos recursos do React 18 são construídos sobre nosso novo renderizador concorrente, uma mudança nos bastidores que desbloqueia novas capacidades poderosas. O React concorrente é opcional — ele só é ativado quando você usa um recurso concorrente — mas acreditamos que terá um grande impacto na forma como as pessoas constroem aplicativos.

Passamos anos pesquisando e desenvolvendo suporte para concorrência no React, e tomamos cuidado extra para fornecer um caminho de adoção gradual para os usuários existentes. No verão passado, [formamos o Grupo de Trabalho do React 18](/blog/2021/06/08/the-plan-for-react-18) para reunir feedback de especialistas da comunidade e garantir uma experiência de atualização suave para todo o ecossistema do React.

Caso você tenha perdido, compartilhamos muito dessa visão na React Conf 2021:

* Na [palestra principal](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa), explicamos como o React 18 se encaixa em nossa missão de facilitar para os desenvolvedores a construção de grandes experiências do usuário
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [demonstrou como usar os novos recursos do React 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai) nos deu uma visão geral da [renderização de servidor em streaming com Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

Abaixo está uma visão geral completa do que esperar nesta versão, começando com a Renderização Concorrente.

<Note>

Para usuários do React Native, o React 18 será enviado no React Native com a Nova Arquitetura do React Native. Para mais informações, veja a [palestra principal da React Conf aqui](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## O que é o React Concorrente? {/*what-is-concurrent-react*/}

A adição mais importante no React 18 é algo que esperamos que você nunca tenha que pensar: concorrência. Acreditamos que isso é em grande parte verdade para desenvolvedores de aplicativos, embora a história possa ser um pouco mais complicada para os mantenedores de bibliotecas.

A concorrência não é uma funcionalidade, por si só. É um novo mecanismo nos bastidores que permite que o React prepare várias versões de sua interface do usuário ao mesmo tempo. Você pode pensar na concorrência como um detalhe de implementação — é valioso por causa dos recursos que desbloqueia. O React usa técnicas sofisticadas em sua implementação interna, como filas de prioridade e múltiplos buffers. Mas você não verá esses conceitos em nenhum de nossos APIs públicas.

Quando projetamos APIs, tentamos esconder detalhes de implementação dos desenvolvedores. Como um desenvolvedor do React, você se concentra em *o que* você deseja que a experiência do usuário pareça, e o React lida com *como* fornecer essa experiência. Portanto, não esperamos que os desenvolvedores do React saibam como a concorrência funciona nos bastidores.

No entanto, o React Concorrente é mais importante do que um detalhe típico de implementação — é uma atualização fundamental ao modelo de renderização central do React. Então, embora não seja super importante saber como a concorrência funciona, pode valer a pena saber o que é em um nível alto.

Uma propriedade-chave do React Concorrente é que a renderização é interrompível. Quando você primeiro atualizar para o React 18, antes de adicionar quaisquer recursos concorrentes, as atualizações são renderizadas da mesma forma que nas versões anteriores do React — em uma única transação síncrona, ininterrupta. Com a renderização síncrona, uma vez que uma atualização começa a renderizar, nada pode interrompê-la até que o usuário possa ver o resultado na tela.

Em uma renderização concorrente, isso nem sempre é o caso. O React pode começar a renderizar uma atualização, pausar no meio e, em seguida, continuar mais tarde. Pode até abandonar uma renderização em andamento completamente. O React garante que a interface do usuário pareça consistente mesmo que uma renderização seja interrompida. Para fazer isso, ele espera para realizar mutações no DOM até o final, uma vez que toda a árvore tenha sido avaliada. Com essa capacidade, o React pode preparar novas telas em segundo plano sem bloquear a thread principal. Isso significa que a interface do usuário pode responder imediatamente à entrada do usuário, mesmo que esteja no meio de uma grande tarefa de renderização, criando uma experiência de usuário fluida.

Outro exemplo é o estado reutilizável. O React Concorrente pode remover seções da interface do usuário da tela e, em seguida, adicioná-las de volta mais tarde, reutilizando o estado anterior. Por exemplo, quando um usuário muda de tela e volta, o React deve ser capaz de restaurar a tela anterior no mesmo estado em que estava antes. Em uma próxima versão menor, estamos planejando adicionar um novo componente chamado `<Offscreen>` que implementa esse padrão. Da mesma forma, você poderá usar Offscreen para preparar uma nova interface do usuário em segundo plano para que esteja pronta antes que o usuário a revele.

A renderização concorrente é uma nova ferramenta poderosa no React e a maioria de nossos novos recursos foi construída para aproveitar isso, incluindo Suspense, transições e renderização de servidor em streaming. Mas o React 18 é apenas o começo do que pretendemos construir sobre essa nova base.

## Adoção Gradual de Recursos Concorrentes {/*gradually-adopting-concurrent-features*/}

Tecnicamente, a renderização concorrente é uma mudança que quebra. Como a renderização concorrente é interrompível, os componentes se comportam de forma ligeiramente diferente quando estão habilitados.

Em nossos testes, atualizamos milhares de componentes para o React 18. O que descobrimos é que quase todos os componentes existentes "funcionam" com a renderização concorrente, sem quaisquer alterações. No entanto, alguns deles podem exigir algum esforço adicional de migração. Embora as mudanças geralmente sejam pequenas, você ainda terá a capacidade de fazê-las no seu próprio ritmo. O novo comportamento de renderização no React 18 é **habilitado apenas nas partes do seu aplicativo que usam novos recursos**.

A estratégia geral de atualização é ter seu aplicativo rodando no React 18 sem quebrar o código existente. Então você pode começar a adicionar recursos concorrentes gradualmente no seu próprio ritmo. Você pode usar [`<StrictMode>`](/reference/react/StrictMode) para ajudar a expor bugs relacionados à concorrência durante o desenvolvimento. O Strict Mode não afeta o comportamento em produção, mas durante o desenvolvimento, ele registrará avisos extras e invocará funções duas vezes que se espera que sejam idempotentes. Ele não capturará tudo, mas é eficaz em prevenir os tipos de erros mais comuns.

Após você atualizar para o React 18, você poderá começar a usar recursos concorrentes imediatamente. Por exemplo, você pode usar startTransition para navegar entre telas sem bloquear a entrada do usuário. Ou useDeferredValue para limitar re-renderizações caras.

No entanto, a longo prazo, esperamos que a principal forma de adicionar concorrência ao seu aplicativo seja usando uma biblioteca ou framework habilitado para concorrência. Na maioria dos casos, você não interagirá com APIs concorrentes diretamente. Por exemplo, em vez de os desenvolvedores chamarem startTransition sempre que navegam para uma nova tela, bibliotecas de roteadores envolverão automaticamente as navegações em startTransition.

Pode levar algum tempo para que as bibliotecas sejam atualizadas para serem compatíveis com concorrência. Fornecemos novas APIs para facilitar para as bibliotecas aproveitar os recursos concorrentes. Enquanto isso, por favor, seja paciente com os mantenedores enquanto trabalhamos para migrar gradualmente o ecossistema do React.

Para mais informações, veja nossa postagem anterior: [Como atualizar para o React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense em Frameworks de Dados {/*suspense-in-data-frameworks*/}

No React 18, você pode começar a usar [Suspense](/reference/react/Suspense) para buscar dados em frameworks opnativos como Relay, Next.js, Hydrogen ou Remix. A busca ad hoc de dados com Suspense é tecnicamente possível, mas ainda não é recomendada como uma estratégia geral.

No futuro, podemos expor primitivos adicionais que poderiam facilitar o acesso aos seus dados com Suspense, talvez sem o uso de um framework opnativo. No entanto, o Suspense funciona melhor quando está profundamente integrado à arquitetura de sua aplicação: seu roteador, sua camada de dados e seu ambiente de renderização do servidor. Assim, mesmo a longo prazo, esperamos que bibliotecas e frameworks desempenhem um papel crucial no ecossistema do React.

Como nas versões anteriores do React, você também pode usar o Suspense para divisão de código no cliente com React.lazy. Mas nossa visão para o Suspense sempre foi sobre muito mais do que carregar código — o objetivo é estender o suporte ao Suspense para que, eventualmente, a mesma fallback declarativa do Suspense possa lidar com qualquer operação assíncrona (carregar código, dados, imagens, etc).

## Componentes do Servidor Ainda Estão em Desenvolvimento {/*server-components-is-still-in-development*/}

[**Componentes do Servidor**](/blog/2020/12/21/data-fetching-with-react-server-components) é um recurso que está por vir e que permite que os desenvolvedores construam aplicativos que abrangem o servidor e o cliente, combinando a rica interatividade de aplicativos do lado do cliente com o desempenho aprimorado da renderização tradicional do servidor. Componentes do Servidor não estão intrinsecamente acoplados ao React Concorrente, mas foram projetados para funcionar melhor com recursos concorrentes como Suspense e renderização em streaming do servidor.

Componentes do Servidor ainda estão experimentais, mas esperamos lançar uma versão inicial em uma versão menor do 18.x. Enquanto isso, estamos trabalhando com frameworks como Next.js, Hydrogen e Remix para avançar a proposta e prepará-la para ampla adoção.

## O que há de novo no React 18 {/*whats-new-in-react-18*/}

### Novo Recurso: Agrupamento Automático {/*new-feature-automatic-batching*/}

Agrupamento é quando o React agrupa várias atualizações de estado em uma única re-renderização para melhor desempenho. Sem agrupamento automático, nós apenas agrupávamos atualizações dentro dos manipuladores de eventos do React. Atualizações dentro de promessas, setTimeout, manipuladores de eventos nativos, ou qualquer outro evento não eram agrupadas no React por padrão. Com o agrupamento automático, essas atualizações serão agrupadas automaticamente:

```js
// Antes: apenas eventos do React eram agrupados.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React renderizará duas vezes, uma vez para cada atualização de estado (sem agrupamento)
}, 1000);

// Depois: atualizações dentro de timeouts, promessas,
// manipuladores de eventos nativos ou qualquer outro evento são agrupadas.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // O React re-renderizará apenas uma vez no final (isso é agrupamento!)
}, 1000);
```

Para mais informações, veja esta postagem sobre [Agrupamento automático para menos renders no React 18](https://github.com/reactwg/react-18/discussions/21).

### Novo Recurso: Transições {/*new-feature-transitions*/}

Uma transição é um novo conceito no React para distinguir entre atualizações urgentes e não-urgentes.

* **Atualizações urgentes** refletem interações diretas, como digitar, clicar, pressionar, e assim por diante.
* **Atualizações de transição** mudam a interface do usuário de uma visualização para outra.

Atualizações urgentes, como digitar, clicar ou pressionar, precisam de uma resposta imediata para corresponder às nossas intuições sobre como objetos físicos se comportam. Caso contrário, elas parecem "erradas". No entanto, as transições são diferentes porque o usuário não espera ver todos os valores intermediários na tela.

Por exemplo, quando você seleciona um filtro em um dropdown, espera que o botão do filtro responda imediatamente quando você clicar. No entanto, os resultados reais podem transitar separadamente. Um pequeno atraso seria imperceptível e muitas vezes esperado. E se você mudar o filtro novamente antes que os resultados estejam prontos, você só se importa em ver os últimos resultados.

Normalmente, para a melhor experiência do usuário, uma única entrada do usuário deve resultar em uma atualização urgente e uma não-urgente. Você pode usar a API startTransition dentro de um evento de entrada para informar ao React quais atualizações são urgentes e quais são "transições":

```js
import { startTransition } from 'react';

// Urgente: Mostrar o que foi digitado
setInputValue(input);

// Marque qualquer atualização de estado dentro como transições
startTransition(() => {
  // Transição: Mostrar os resultados
  setSearchQuery(input);
});
```

Atualizações envolvidas em startTransition são tratadas como não-urgentes e serão interrompidas se atualizações mais urgentes, como cliques ou pressões de teclas, chegarem. Se uma transição for interrompida pelo usuário (por exemplo, digitando múltiplos caracteres em sequência), o React descartará o trabalho de renderização já concluído que não foi finalizado e renderizará apenas a última atualização.

* `useTransition`: um Hook para iniciar transições, incluindo um valor para rastrear o estado pendente.
* `startTransition`: um método para iniciar transições quando o Hook não pode ser usado.

As transições se optarão por renderização concorrente, o que permite que a atualização seja interrompida. Se o conteúdo suspender novamente, as transições também dizem ao React para continuar mostrando o conteúdo atual enquanto renderiza o conteúdo da transição em segundo plano (veja o [Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) para mais informações).

[Veja a documentação para transições aqui](/reference/react/useTransition).

### Novos Recursos do Suspense {/*new-suspense-features*/}

Suspense permite que você especifique de forma declarativa o estado de carregamento para uma parte da árvore de componentes se ainda não estiver pronta para ser exibida:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense torna o "estado de carregamento da interface do usuário" um conceito declarativo de primeira classe no modelo de programação do React. Isso nos permite construir recursos de nível superior sobre isso.

Introduzimos uma versão limitada do Suspense há vários anos. No entanto, o único caso de uso suportado era a divisão de código com React.lazy, e não era suportado de forma alguma ao renderizar no servidor.

No React 18, adicionamos suporte para o Suspense no servidor e expandimos suas capacidades usando recursos de renderização concorrente.

O Suspense no React 18 funciona melhor quando combinado com a API de transição. Se você suspender durante uma transição, o React evitará que o conteúdo já visível seja substituído por um fallback. Em vez disso, o React atrasará a renderização até que dados suficientes sejam carregados para evitar um estado de carregamento ruim.

Para mais, veja o RFC para [Suspense no React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### Novas APIs de Renderização no Cliente e no Servidor {/*new-client-and-server-rendering-apis*/}

Nesta versão, aproveitamos a oportunidade para redesenhar as APIs que expomos para renderização no cliente e no servidor. Essas mudanças permitem que os usuários continuem usando as APIs antigas no modo React 17 enquanto atualizam para as novas APIs no React 18.

#### React DOM Cliente {/*react-dom-client*/}

Essas novas APIs agora são exportadas de `react-dom/client`:

* `createRoot`: Novo método para criar uma raiz para `render` ou `unmount`. Use-o em vez de `ReactDOM.render`. Novos recursos no React 18 não funcionam sem isso.
* `hydrateRoot`: Novo método para hidratar um aplicativo renderizado no servidor. Use-o em vez de `ReactDOM.hydrate` em conjunto com as novas APIs do React DOM Server. Novos recursos no React 18 não funcionam sem isso.

Tanto `createRoot` quanto `hydrateRoot` aceitam uma nova opção chamada `onRecoverableError`, caso você queira ser notificado quando o React se recupera de erros durante a renderização ou hidratação para registro. Por padrão, o React usará [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError), ou `console.error` nos navegadores mais antigos.

[Veja a documentação para o React DOM Cliente aqui](/reference/react-dom/client).

#### React DOM Servidor {/*react-dom-server*/}

Essas novas APIs agora são exportadas de `react-dom/server` e têm suporte completo para streaming de Suspense no servidor:

* `renderToPipeableStream`: para streaming em ambientes Node.
* `renderToReadableStream`: para modernos ambientes de runtime, como Deno e Cloudflare workers.

O método existente `renderToString` continua funcionando, mas é desaconselhado.

[Veja a documentação para o React DOM Servidor aqui](/reference/react-dom/server).

### Novos Comportamentos no Strict Mode {/*new-strict-mode-behaviors*/}

No futuro, gostaríamos de adicionar um recurso que permita ao React adicionar e remover seções da interface do usuário enquanto preserva o estado. Por exemplo, quando um usuário muda de tela e volta, o React deve ser capaz de mostrar imediatamente a tela anterior. Para fazer isso, o React desmonte e remonte árvores usando o mesmo estado do componente anterior.

Esse recurso dará aos aplicativos do React melhor desempenho direto, mas requer que os componentes sejam resilientes a efeitos sendo montados e destruídos várias vezes. A maioria dos efeitos funcionará sem nenhuma alteração, mas alguns efeitos assumem que eles são montados ou destruídos apenas uma vez.

Para ajudar a expor esses problemas, o React 18 introduz uma nova verificação somente para desenvolvimento no Strict Mode. Essa nova verificação desmontará e remontará automaticamente cada componente sempre que um componente for montado pela primeira vez, restaurando o estado anterior na segunda montagem.

Antes dessa mudança, o React montaria o componente e criaria os efeitos:

```
* O React monta o componente.
  * Efeitos de layout são criados.
  * Efeitos são criados.
```

Com o Strict Mode no React 18, o React simulará o desmonte e remonte do componente em modo de desenvolvimento:

```
* O React monta o componente.
  * Efeitos de layout são criados.
  * Efeitos são criados.
* O React simula o desmonte do componente.
  * Efeitos de layout são destruídos.
  * Efeitos são destruídos.
* O React simula a montagem do componente com o estado anterior.
  * Efeitos de layout são criados.
  * Efeitos são criados.
```

[Veja a documentação para garantir estado reutilizável aqui](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### Novos Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` é um novo Hook para gerar IDs únicos tanto no cliente quanto no servidor, evitando incompatibilidades durante a hidratação. É especialmente útil para bibliotecas de componentes que se integram com APIs de acessibilidade que requerem IDs únicos. Isso resolve um problema que já existe no React 17 e anteriores, mas é ainda mais importante no React 18 por causa de como o novo renderizador de servidor em streaming entrega HTML fora de ordem. [Veja a documentação aqui](/reference/react/useId).

> Nota
>
> `useId` **não** é para gerar [chaves em uma lista](/learn/rendering-lists#where-to-get-your-key). Chaves devem ser geradas a partir dos seus dados.

#### useTransition {/*usetransition*/}

`useTransition` e `startTransition` permitem que você marque algumas atualizações de estado como não urgentes. Outras atualizações de estado são consideradas urgentes por padrão. O React permitirá atualizações de estado urgentes (por exemplo, atualizar um campo de texto) para interromper atualizações de estado não urgentes (por exemplo, renderizar uma lista de resultados de busca). [Veja a documentação aqui](/reference/react/useTransition).

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` permite que você adie a re-renderização de uma parte não urgente da árvore. É semelhante ao debouncing, mas tem algumas vantagens em comparação. Não há um atraso de tempo fixo, então o React tentará a renderização adiada logo após a primeira renderização ser refletida na tela. A renderização adiada é interrompível e não bloqueia a entrada do usuário. [Veja a documentação aqui](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` é um novo Hook que permite que lojas externas suportem leituras concorrentes forçando as atualizações da loja a serem síncronas. Ele remove a necessidade de useEffect ao implementar assinaturas de fontes de dados externas e é recomendado para qualquer biblioteca que se integre ao estado externo ao React. [Veja a documentação aqui](/reference/react/useSyncExternalStore).

> Nota
>
> `useSyncExternalStore` é destinado a ser usado por bibliotecas, não por código de aplicativo.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` é um novo Hook que permite que bibliotecas CSS-in-JS abordem problemas de desempenho de injeção de estilos na renderização. A menos que você já tenha construído uma biblioteca CSS-in-JS, não esperamos que você use isso. Este Hook será executado após o DOM ser mutado, mas antes dos efeitos de layout lerem o novo layout. Isso resolve um problema que já existe no React 17 e anteriores, mas é ainda mais importante no React 18 porque o React cede à necessidade do navegador durante a renderização concorrente, dando-lhe uma chance de recalcular o layout. [Veja a documentação aqui](/reference/react/useInsertionEffect).

> Nota
>
> `useInsertionEffect` é destinado a ser usado por bibliotecas, não por código de aplicativo.

## Como Atualizar {/*how-to-upgrade*/}

Veja [Como atualizar para o React 18](/blog/2022/03/08/react-18-upgrade-guide) para instruções passo a passo e uma lista completa de mudanças notáveis e que quebram.

## Changelog {/*changelog*/}

### React {/*react*/}

* Adicione `useTransition` e `useDeferredValue` para separar atualizações urgentes de transições. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) por [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adicione `useId` para gerar IDs únicos. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) por [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adicione `useSyncExternalStore` para ajudar bibliotecas de lojas externas a se integrarem com o React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) por [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), e [@drarmstr](https://github.com/drarmstr))
* Adicione `startTransition` como uma versão de `useTransition` sem feedback pendente. ([#19696](https://github.com/facebook/react/pull/19696) por [@rickhanlonii](https://github.com/rickhanlonii))
* Adicione `useInsertionEffect` para bibliotecas CSS-in-JS. ([#21913](https://github.com/facebook/react/pull/21913) por [@rickhanlonii](https://github.com/rickhanlonii))
* Faça o Suspense remontar efeitos de layout quando o conteúdo reaparecer. ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) por [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), e [@lunaruan](https://github.com/lunaruan))
* Faça `<StrictMode>` re-executar efeitos para verificar estado restaurável. ([#19523](https://github.com/facebook/react/pull/19523), [#21418](https://github.com/facebook/react/pull/21418) por [@bvaughn](https://github.com/bvaughn) e [@lunaruan](https://github.com/lunaruan))
* Assuma que os Símbolos estão sempre disponíveis. ([#23348](https://github.com/facebook/react/pull/23348) por [@sebmarkbage](https://github.com/sebmarkbage))
* Remova o polyfill de `object-assign`. ([#23351](https://github.com/facebook/react/pull/23351) por [@sebmarkbage](https://github.com/sebmarkbage))
* Remova a API não suportada `unstable_changedBits`. ([#20953](https://github.com/facebook/react/pull/20953) por [@acdlite](https://github.com/acdlite))
* Permita que componentes renderizem indefinidos. ([#21869](https://github.com/facebook/react/pull/21869) por [@rickhanlonii](https://github.com/rickhanlonii))
* Execute `useEffect` resultantes de eventos discretos como cliques de forma síncrona. ([#21150](https://github.com/facebook/react/pull/21150) por [@acdlite](https://github.com/acdlite))
* `Suspense fallback={undefined}` agora se comporta da mesma forma que `null` e não é ignorado. ([#21854](https://github.com/facebook/react/pull/21854) por [@rickhanlonii](https://github.com/rickhanlonii))
* Considere todos os `lazy()` resolvendo para o mesmo componente equivalente. ([#20357](https://github.com/facebook/react/pull/20357) por [@sebmarkbage](https://github.com/sebmarkbage))
* Não altere o console durante a primeira renderização. ([#22308](https://github.com/facebook/react/pull/22308) por [@lunaruan](https://github.com/lunaruan))
* Melhore o uso de memória. ([#21039](https://github.com/facebook/react/pull/21039) por [@bgirard](https://github.com/bgirard))
* Melhore as mensagens se a coerção de string lançar (Temporal.*, Símbolo, etc.) ([#22064](https://github.com/facebook/react/pull/22064) por [@justingrant](https://github.com/justingrant))
* Use `setImmediate` quando disponível em vez de `MessageChannel`. ([#20834](https://github.com/facebook/react/pull/20834) por [@gaearon](https://github.com/gaearon))
* Corrija a falha de propagação do contexto dentro de árvores suspensas. ([#23095](https://github.com/facebook/react/pull/23095) por [@gaearon](https://github.com/gaearon))
* Corrija o `useReducer` observando props incorretas ao remover o mecanismo de interrupção ansioso. ([#22445](https://github.com/facebook/react/pull/22445) por [@josephsavona](https://github.com/josephsavona))
* Corrija o `setState` sendo ignorado no Safari ao anexar iframes. ([#23111](https://github.com/facebook/react/pull/23111) por [@gaearon](https://github.com/gaearon))
* Corrija uma falha ao renderizar `ZonedDateTime` na árvore. ([#20617](https://github.com/facebook/react/pull/20617) por [@dimaqq](https://github.com/dimaqq))
* Corrija uma falha ao definir document como `null` em testes. ([#22695](https://github.com/facebook/react/pull/22695) por [@SimenB](https://github.com/SimenB))
* Corrija o `onLoad` não sendo acionado quando os recursos concorrentes estão ativados. ([#23316](https://github.com/facebook/react/pull/23316) por [@gnoff](https://github.com/gnoff))
* Corrija um aviso quando um seletor retorna `NaN`. ([#23333](https://github.com/facebook/react/pull/23333) por [@hachibeeDI](https://github.com/hachibeeDI))
* Corrija uma falha ao definir document como `null` em testes. ([#22695](https://github.com/facebook/react/pull/22695) por [@SimenB](https://github.com/SimenB))
* Corrija o cabeçalho da licença gerada. ([#23004](https://github.com/facebook/react/pull/23004) por [@vitaliemiron](https://github.com/vitaliemiron))
* Adicione `package.json` como um dos pontos de entrada. ([#22954](https://github.com/facebook/react/pull/22954) por [@Jack](https://github.com/Jack-Works))
* Permita suspender fora de um limite de Suspense. ([#23267](https://github.com/facebook/react/pull/23267) por [@acdlite](https://github.com/acdlite))
* Registre um erro recuperável sempre que a hidratação falhar. ([#23319](https://github.com/facebook/react/pull/23319) por [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Adicione `createRoot` e `hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) por [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adicione hidratação seletiva. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) por [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), e [@sebmarkbage](https://github.com/sebmarkbage))
* Adicione `aria-description` à lista de atributos ARIA conhecidos. ([#22142](https://github.com/facebook/react/pull/22142) por [@mahyareb](https://github.com/mahyareb))
* Adicione o evento `onResize` aos elementos de vídeo. ([#21973](https://github.com/facebook/react/pull/21973) por [@rileyjshaw](https://github.com/rileyjshaw))
* Adicione `imageSizes` e `imageSrcSet` às props conhecidas. ([#22550](https://github.com/facebook/react/pull/22550) por [@eps1lon](https://github.com/eps1lon))
* Permita filhos `<option>` que não são strings se `value` estiver fornecido. ([#21431](https://github.com/facebook/react/pull/21431) por [@sebmarkbage](https://github.com/sebmarkbage))
* Corrija o estilo `aspectRatio` não sendo aplicado. ([#21100](https://github.com/facebook/react/pull/21100) por [@gaearon](https://github.com/gaearon))
* Alerta se `renderSubtreeIntoContainer` for chamado. ([#23355](https://github.com/facebook/react/pull/23355) por [@acdlite](https://github.com/acdlite))

### React DOM Servidor {/*react-dom-server-1*/}

* Adicione o novo renderizador em streaming. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) por [@sebmarkbage](https://github.com/sebmarkbage))
* Corrija provedores de contexto no SSR ao lidar com múltiplas solicitações. ([#23171](https://github.com/facebook/react/pull/23171) por [@frandiox](https://github.com/frandiox))
* Reverta para renderização do cliente em caso de incompatibilidade de texto. ([#23354](https://github.com/facebook/react/pull/23354) por [@acdlite](https://github.com/acdlite))
* Descontinue `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359) por [@sebmarkbage](https://github.com/sebmarkbage))
* Corrija um log de erro espúrio no novo renderizador do servidor. ([#24043](https://github.com/facebook/react/pull/24043) por [@eps1lon](https://github.com/eps1lon))
* Corrija um bug no novo renderizador do servidor. ([#22617](https://github.com/facebook/react/pull/22617) por [@shuding](https://github.com/shuding))
* Ignore valores de função e símbolo dentro de elementos personalizados no servidor. ([#21157](https://github.com/facebook/react/pull/21157) por [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* Lance um erro quando `act` é usado em produção. ([#21686](https://github.com/facebook/react/pull/21686) por [@acdlite](https://github.com/acdlite))
* Suporte para desativar avisos espúrios do act com `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561) por [@acdlite](https://github.com/acdlite))
* Expanda o aviso do act para cobrir todas as APIs que possam agendar trabalho do React. ([#22607](https://github.com/facebook/react/pull/22607) por [@acdlite](https://github.com/acdlite))
* Faça com que o `act` agrupe atualizações. ([#21797](https://github.com/facebook/react/pull/21797) por [@acdlite](https://github.com/acdlite))
* Remova o aviso para efeitos passivos pendentes. ([#22609](https://github.com/facebook/react/pull/22609) por [@acdlite])

### React Refresh {/*react-refresh*/}

* Rastreie raízes montadas tarde no Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740) por [@anc95](https://github.com/anc95))
* Adicione o campo `exports` ao `package.json`. ([#23087](https://github.com/facebook/react/pull/23087) por [@otakustay](https://github.com/otakustay))

### Componentes do Servidor (Experimental) {/*server-components-experimental*/}

* Adicione suporte ao Server Context. ([#23244](https://github.com/facebook/react/pull/23244) por [@salazarm](https://github.com/salazarm))
* Adicione suporte a `lazy`. ([#24068](https://github.com/facebook/react/pull/24068) por [@gnoff](https://github.com/gnoff))
* Atualize o plugin webpack para webpack 5 ([#22739](https://github.com/facebook/react/pull/22739) por [@michenly](https://github.com/michenly))
* Corrija um erro no carregador do Node. ([#22537](https://github.com/facebook/react/pull/22537) por [@btea](https://github.com/btea))
* Use `globalThis` em vez de `window` para ambientes de borda. ([#22777](https://github.com/facebook/react/pull/22777) por [@huozhi](https://github.com/huozhi))