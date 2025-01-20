---
title: "React Labs: No Que Estamos Trabalhando – Junho de 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, e Xuan Huang
date: 2022/06/15
description: O React 18 levou anos para ser desenvolvido, e com isso trouxe lições valiosas para a equipe do React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de muitos caminhos. Alguns desses caminhos foram bem-sucedidos; muitos outros foram becos sem saída que levaram a novos insights. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter visibilidade sobre esses caminhos que estamos explorando.
---

15 de junho de 2022 por [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[O React 18](/blog/2022/03/29/react-v18) levou anos para ser desenvolvido, e com isso trouxe lições valiosas para a equipe do React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de muitos caminhos. Alguns desses caminhos foram bem-sucedidos; muitos outros foram becos sem saída que levaram a novos insights. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter visibilidade sobre esses caminhos que estamos explorando.

</Intro>

---

Normalmente, temos vários projetos em andamento a qualquer momento, variando de mais experimentais a claramente definidos. Olhando para o futuro, gostaríamos de começar a compartilhar regularmente mais sobre no que estamos trabalhando com a comunidade em relação a esses projetos.

Para estabelecer expectativas, este não é um roadmap com cronogramas claros. Muitos desses projetos estão sob pesquisa ativa e é difícil definir datas concretas de lançamento. Eles podem, possivelmente, nunca serem lançados em sua iteração atual, dependendo do que aprendermos. Em vez disso, queremos compartilhar com você os espaços de problemas que estamos pensando ativamente e o que aprendemos até agora.

## Componentes do Servidor {/*server-components*/}

Anunciamos uma [demonstração experimental de Componentes do Servidor do React](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC) em dezembro de 2020. Desde então, temos finalizado suas dependências no React 18 e trabalhando em mudanças inspiradas pelo feedback experimental.

Em particular, estamos abandonando a ideia de ter bibliotecas I/O bifurcadas (ex. react-fetch) e, em vez disso, adotando um modelo async/await para melhor compatibilidade. Isso não bloqueia tecnicamente o lançamento do RSC porque você também pode usar roteadores para busca de dados. Outra mudança é que também estamos nos afastando da abordagem de extensão de arquivo em favor de [anotar limites](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

Estamos trabalhando juntos com a Vercel e a Shopify para unificar o suporte a bundlers para semânticas compartilhadas em Webpack e Vite. Antes do lançamento, queremos ter certeza de que as semânticas dos RSCs sejam as mesmas em todo o ecossistema do React. Este é o principal bloqueio para alcançar a estabilidade.

## Carregamento de Ativos {/*asset-loading*/}

Atualmente, ativos como scripts, estilos externos, fontes e imagens são tipicamente pré-carregados e carregados usando sistemas externos. Isso pode dificultar a coordenação entre novos ambientes como streaming, Componentes do Servidor e mais. 
Estamos analisando a adição de APIs para pré-carregar e carregar ativos externos deduplicados por meio de APIs do React que funcionam em todos os ambientes do React.

Estamos também analisando a possibilidade de ter suporte a Suspense para que você possa ter imagens, CSS e fontes que bloqueiam a exibição até serem carregadas, mas não bloqueiam a renderização em streaming e concorrente. Isso pode ajudar a evitar [“popcorning“](https://twitter.com/sebmarkbage/status/1516852731251724293) quando os visuais aparecem e o layout se desloca.

## Otimizações de Renderização Estática no Servidor {/*static-server-rendering-optimizations*/}

A Geração de Sites Estáticos (SSG) e a Regeneração Estática Incremental (ISR) são ótimas maneiras de obter desempenho para páginas que podem ser armazenadas em cache, mas acreditamos que podemos adicionar recursos para melhorar o desempenho da Renderização no Lado do Servidor (SSR) – especialmente quando a maior parte, mas não todo o conteúdo é armazenável em cache. Estamos explorando maneiras de otimizar a renderização no servidor utilizando compilação e passes estáticos.

## Compilador de Otimização do React {/*react-compiler*/}

Demos uma [prévia antecipada](https://www.youtube.com/watch?v=lGEMwh32soc) do React Forget na React Conf 2021. É um compilador que gera automaticamente o equivalente a chamadas `useMemo` e `useCallback` para minimizar o custo de re-renderizações, enquanto mantém o modelo de programação do React.

Recentemente, finalizamos uma reescrita do compilador para torná-lo mais confiável e capaz. Esta nova arquitetura nos permite analisar e memorizar padrões mais complexos, como o uso de [mutações locais](/learn/keeping-components-pure#local-mutation-your-components-little-secret), e abre muitas novas oportunidades de otimização em tempo de compilação além de simplesmente estar à altura dos Hooks de memorização.

Estamos também trabalhando em um playground para explorar muitos aspectos do compilador. Embora o objetivo do playground seja facilitar o desenvolvimento do compilador, acreditamos que ele tornará mais fácil experimentá-lo e construir uma intuição sobre o que o compilador faz. Ele revela vários insights sobre como funciona nos bastidores e renderiza ao vivo as saídas do compilador enquanto você digita. Isso será lançado junto com o compilador quando for liberado.

## Offscreen {/*offscreen*/}

Hoje, se você quiser ocultar e mostrar um componente, tem duas opções. Uma é adicioná-lo ou removê-lo completamente da árvore. O problema com essa abordagem é que o estado da sua UI é perdido toda vez que você desmonta, incluindo o estado armazenado no DOM, como a posição de rolagem.

A outra opção é manter o componente montado e alternar a aparência visualmente usando CSS. Isso preserva o estado da sua UI, mas tem um custo de desempenho, pois o React deve continuar renderizando o componente oculto e todos os seus filhos sempre que recebe novas atualizações.

Offscreen introduz uma terceira opção: ocultar a UI visualmente, mas despriorizar seu conteúdo. A ideia é semelhante em espírito à propriedade CSS `content-visibility`: quando o conteúdo está oculto, não precisa se manter em sincronia com o restante da UI. O React pode adiar o trabalho de renderização até que o restante do aplicativo esteja ocioso ou até que o conteúdo se torne visível novamente.

Offscreen é uma capacidade de baixo nível que desbloqueia recursos de alto nível. Similar a outros recursos concorrentes do React, como `startTransition`, na maioria dos casos você não interagirá com a API Offscreen diretamente, mas sim através de um framework opinativo para implementar padrões como:

* **Transições instantâneas.** Alguns frameworks de roteamento já pré-buscam dados para acelerar navegações subsequentes, como ao passar o mouse sobre um link. Com Offscreen, eles também poderão pré-renderizar a próxima tela em segundo plano.
* **Estado reutilizável.** Similarmente, ao navegar entre rotas ou abas, você pode usar Offscreen para preservar o estado da tela anterior para que você possa voltar e retomar de onde parou.
* **Renderização de listas virtualizadas.** Ao exibir grandes listas de itens, frameworks de listas virtualizadas pré-renderizarão mais linhas do que estão visíveis atualmente. Você pode usar Offscreen para pré-renderizar as linhas ocultas com uma prioridade menor do que os itens visíveis na lista.
* **Conteúdo em segundo plano.** Estamos também explorando um recurso relacionado para despriorizar conteúdo em segundo plano sem ocultá-lo, como ao exibir uma sobreposição modal.

## Rastreio de Transições {/*transition-tracing*/}

Atualmente, o React possui duas ferramentas de perfilagem. O [Profiler original](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) mostra uma visão geral de todos os commits em uma sessão de perfilagem. Para cada commit, ele também mostra todos os componentes que renderizaram e o tempo que levou para eles renderizarem. Também temos uma versão beta de um [Profiler de Linha do Tempo](https://github.com/reactwg/react-18/discussions/76) introduzida no React 18 que mostra quando os componentes agendam atualizações e quando o React trabalha nessas atualizações. Ambos os profilers ajudam os desenvolvedores a identificar problemas de desempenho em seu código.

Percebemos que os desenvolvedores não acham útil saber sobre commits lentos ou componentes individuais fora de contexto. É mais útil saber sobre o que realmente causa os commits lentos. E que os desenvolvedores querem poder rastrear interações específicas (ex. um clique de botão, um carregamento inicial ou uma navegação de página) para observar regressões de desempenho e entender por que uma interação foi lenta e como corrigir isso.

Anteriormente, tentamos resolver esse problema criando uma [API de Rastreio de Interações](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), mas ela tinha alguns defeitos de design fundamentais que reduziam a precisão do rastreio de por que uma interação era lenta e às vezes resultavam em interações que nunca terminavam. Acabamos [removendo essa API](https://github.com/facebook/react/pull/20037) por causa desses problemas.

Estamos trabalhando em uma nova versão da API de Rastreio de Interações (provisoriamente chamada de Rastreio de Transições porque é iniciada via `startTransition`) que resolve esses problemas.

## Novos Documentos do React {/*new-react-docs*/}

No ano passado, anunciamos a versão beta do novo site de documentação do React ([posteriormente lançado como react.dev](/blog/2023/03/16/introducing-react-dev)). Os novos materiais de aprendizado ensinam Hooks primeiro e têm novos diagramas, ilustrações, além de muitos exemplos interativos e desafios. Pausamos esse trabalho para nos concentrar no lançamento do React 18, mas agora que o React 18 foi lançado, estamos trabalhando ativamente para finalizar e lançar a nova documentação.

Atualmente, estamos escrevendo uma seção detalhada sobre efeitos, pois ouvimos que esse é um dos tópicos mais desafiadores tanto para novos quanto para experientes usuários do React. [Sincronizando com Efeitos](/learn/synchronizing-with-effects) é a primeira página publicada na série, e mais virão nas próximas semanas. Quando começamos a escrever uma seção detalhada sobre efeitos, percebemos que muitos padrões de efeito comuns podem ser simplificados adicionando um novo primitivo ao React. Compartilhamos alguns pensamentos iniciais sobre isso no [useEvent RFC](https://github.com/reactjs/rfcs/pull/220). Ele está atualmente em pesquisa inicial e ainda estamos iterando sobre a ideia. Agradecemos os comentários da comunidade sobre o RFC até agora, bem como o [feedback](https://github.com/reactjs/react.dev/issues/3308) e as contribuições para a reescrita contínua da documentação. Gostaríamos de agradecer especificamente a [Harish Kumar](https://github.com/harish-sethuraman) por submeter e revisar muitas melhorias na nova implementação do site.

*Obrigado a [Sophie Alpert](https://twitter.com/sophiebits) por revisar este post do blog!*