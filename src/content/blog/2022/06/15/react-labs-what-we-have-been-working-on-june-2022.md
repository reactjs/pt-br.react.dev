---
title: "React Labs: No que temos trabalhado – Junho de 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, e Xuan Huang
date: 2022/06/15
description: O React 18 levou anos para ser desenvolvido e trouxe lições valiosas para a equipe do React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de vários caminhos. Alguns desses caminhos foram bem-sucedidos; muitos outros foram becos sem saída que levaram a novos insights. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter uma visão sobre esses caminhos que estamos explorando.
---

15 de junho de 2022 por [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[O React 18](/blog/2022/03/29/react-v18) levou anos para ser desenvolvido e trouxe lições valiosas para a equipe do React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de vários caminhos. Alguns desses caminhos foram bem-sucedidos; muitos outros foram becos sem saída que levaram a novos insights. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter uma visão sobre esses caminhos que estamos explorando.

</Intro>

---

Geralmente temos vários projetos em andamento a qualquer momento, variando de experimentais a claramente definidos. Olhando para o futuro, gostaríamos de começar a compartilhar regularmente mais sobre o que temos trabalhado com a comunidade em relação a esses projetos.

Para definir expectativas, isso não é um roteiro com prazos claros. Muitos desses projetos estão sob pesquisa ativa e é difícil estabelecer datas de lançamento concretas. Eles podem nunca ser lançados em sua iteração atual, dependendo do que aprendemos. Em vez disso, queremos compartilhar com vocês os espaços de problemas que estamos pensando ativamente e o que aprendemos até agora.

## Componentes do Servidor {/*server-components*/}

Anunciamos uma [demonstração experimental dos Componentes do Servidor do React](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC) em dezembro de 2020. Desde então, temos finalizado suas dependências no React 18 e trabalhado em mudanças inspiradas pelo feedback experimental.

Em particular, estamos abandonando a ideia de ter bibliotecas de I/O separadas (por exemplo, react-fetch) e, em vez disso, adotando um modelo async/await para melhor compatibilidade. Isso não bloqueia tecnicamente o lançamento de RSC porque você também pode usar roteadores para busca de dados. Outra mudança é que também estamos nos afastando da abordagem de extensão de arquivo em favor de [anotar limites](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

Estamos trabalhando juntos com a Vercel e a Shopify para unificar o suporte a empacotadores para semânticas compartilhadas tanto no Webpack quanto no Vite. Antes do lançamento, queremos garantir que as semânticas de RSCs sejam as mesmas em todo o ecossistema React. Este é o principal bloqueador para alcançar a estabilidade.

## Carregamento de Recursos {/*asset-loading*/}

Atualmente, recursos como scripts, estilos externos, fontes e imagens são tipicamente pré-carregados e carregados usando sistemas externos. Isso pode dificultar a coordenação entre novos ambientes como streaming, Componentes do Servidor e mais.
Estamos analisando a adição de APIs para pré-carregar e carregar recursos externos deduplicados através das APIs do React que funcionem em todos os ambientes do React.

Estamos também considerando que esses recursos suportem Suspense para que você possa ter imagens, CSS e fontes que bloqueiem a exibição até serem carregados, mas que não bloqueiem o streaming e a renderização concorrente. Isso pode ajudar a evitar [“popcorning“](https://twitter.com/sebmarkbage/status/1516852731251724293) à medida que os visuais aparecem e o layout muda.

## Otimizações de Renderização de Servidor Estático {/*static-server-rendering-optimizations*/}

A Geração de Sites Estáticos (SSG) e a Regeneração Estática Incremental (ISR) são ótimas maneiras de obter desempenho para páginas em cache, mas achamos que podemos adicionar recursos para melhorar o desempenho da Renderização do Lado do Servidor (SSR) – especialmente quando a maior parte, mas não todo o conteúdo é cacheável. Estamos explorando maneiras de otimizar a renderização do servidor utilizando compilação e passes estáticos.

## Compilador Otimizador do React {/*react-compiler*/}

Nós demos uma [prévia inicial](https://www.youtube.com/watch?v=lGEMwh32soc) do React Forget na React Conf 2021. É um compilador que gera automaticamente o equivalente a chamadas `useMemo` e `useCallback` para minimizar o custo de re-renderização, enquanto retém o modelo de programação do React.

Recentemente, finalizamos uma reescrita do compilador para torná-lo mais confiável e capaz. Esta nova arquitetura nos permite analisar e memoizar padrões mais complexos, como o uso de [mutações locais](/learn/keeping-components-pure#local-mutation-your-components-little-secret), e abre muitas novas oportunidades de otimização em tempo de compilação além de estar apenas no mesmo nível que Hooks de memoização.

Também estamos trabalhando em um playground para explorar muitos aspectos do compilador. Embora o objetivo do playground seja facilitar o desenvolvimento do compilador, achamos que tornará mais fácil experimentá-lo e desenvolver intuições sobre o que o compilador faz. Ele revela vários insights sobre como funciona internamente e renderiza ao vivo as saídas do compilador à medida que você digita. Isso será lançado junto com o compilador quando for disponibilizado.

## Offscreen {/*offscreen*/}

Hoje, se você quiser esconder e mostrar um componente, tem duas opções. Uma é adicioná-lo ou removê-lo da árvore completamente. O problema com essa abordagem é que o estado da sua interface de usuário é perdido sempre que você desmonta, incluindo o estado armazenado no DOM, como a posição de rolagem.

A outra opção é manter o componente montado e alternar a aparência visualmente usando CSS. Isso preserva o estado da sua interface de usuário, mas tem um custo de desempenho, porque o React deve continuar renderizando o componente oculto e todos os seus filhos sempre que recebe novas atualizações.

Offscreen introduz uma terceira opção: esconder a interface visualmente, mas depriorizar seu conteúdo. A ideia é similar ao espírito da propriedade CSS `content-visibility`: quando o conteúdo está oculto, ele não precisa ficar em sincronia com o resto da interface. O React pode adiar o trabalho de renderização até que o restante do aplicativo esteja ocioso ou até que o conteúdo se torne visível novamente.

Offscreen é uma capacidade de baixo nível que desbloqueia recursos de alto nível. Semelhante a outras funcionalidades concorrentes do React, como `startTransition`, na maioria dos casos você não interagirá diretamente com a API Offscreen, mas sim por meio de uma estrutura opinativa para implementar padrões como:

* **Transições instantâneas.** Algumas estruturas de roteamento já pré-buscam dados para acelerar navegações subsequentes, como quando você passa o mouse sobre um link. Com Offscreen, elas também poderão pré-renderizar a próxima tela em segundo plano.
* **Estado reutilizável.** Da mesma forma, ao navegar entre rotas ou abas, você pode usar Offscreen para preservar o estado da tela anterior, assim você pode voltar e retomar de onde parou.
* **Renderização de listas virtualizadas.** Ao exibir grandes listas de itens, frameworks de listas virtualizadas pré-renderizarão mais linhas do que estão atualmente visíveis. Você pode usar Offscreen para pré-renderizar as linhas ocultas com uma prioridade menor do que os itens visíveis na lista.
* **Conteúdo em segundo plano.** Também estamos explorando um recurso relacionado para depriorizar conteúdo em segundo plano sem escondê-lo, como ao exibir uma sobreposição modal.

## Rastreio de Transições {/*transition-tracing*/}

Atualmente, o React possui duas ferramentas de perfilamento. O [Profiler original](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) mostra uma visão geral de todos os commits em uma sessão de perfilamento. Para cada commit, ele também mostra todos os componentes que renderizaram e o tempo que levou para renderizá-los. Também temos uma versão beta de um [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) introduzido no React 18 que mostra quando os componentes programam atualizações e quando o React trabalha nessas atualizações. Ambas as ferramentas de perfilamento ajudam os desenvolvedores a identificar problemas de desempenho em seu código.

Percebemos que os desenvolvedores não acham útil saber sobre commits lentos ou componentes individuais fora de contexto. É mais útil saber sobre o que realmente causa os commits lentos. E que os desenvolvedores querem ser capazes de rastrear interações específicas (por exemplo, um clique de botão, um carregamento inicial ou uma navegação de página) para observar regressões de desempenho e entender por que uma interação foi lenta e como corrigir isso.

Anteriormente, tentamos resolver esse problema criando uma [API de Rastreio de Interações](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), mas ela tinha alguns defeitos de design fundamentais que reduziram a precisão do rastreamento sobre por que uma interação foi lenta e às vezes resultaram em interações que nunca terminavam. Acabamos [removendo essa API](https://github.com/facebook/react/pull/20037) devido a esses problemas.

Estamos trabalhando em uma nova versão para a API de Rastreio de Interações (provisoriamente chamada de Rastreio de Transições porque é iniciada via `startTransition`) que resolve esses problemas.

## Novos Docs do React {/*new-react-docs*/}

No ano passado, anunciamos a versão beta do novo site de documentação do React ([mais tarde lançado como react.dev](/blog/2023/03/16/introducing-react-dev)). O novo material de aprendizagem ensina Hooks primeiro e possui novos diagramas, ilustrações, além de muitos exemplos interativos e desafios. Fizemos uma pausa nesse trabalho para nos concentrar no lançamento do React 18, mas agora que o React 18 foi lançado, estamos trabalhando ativamente para finalizar e lançar a nova documentação.

Atualmente, estamos escrevendo uma seção detalhada sobre efeitos, pois ouvimos que esse é um dos tópicos mais desafiadores tanto para novos usuários quanto para usuários experientes do React. [Sincronizando com Efeitos](/learn/synchronizing-with-effects) é a primeira página publicada na série, e haverá mais nas próximas semanas. Quando começamos a escrever uma seção detalhada sobre efeitos, percebemos que muitos padrões comuns de efeitos podem ser simplificados adicionando um novo primitivo ao React. Compartilhamos algumas ideias iniciais sobre isso na [RFC useEvent](https://github.com/reactjs/rfcs/pull/220). Está atualmente em pesquisa inicial e ainda estamos iterando sobre a ideia. Agradecemos os comentários da comunidade sobre a RFC até agora, assim como o [feedback](https://github.com/reactjs/react.dev/issues/3308) e as contribuições para a reescrita contínua da documentação. Gostaríamos de agradecer especialmente a [Harish Kumar](https://github.com/harish-sethuraman) por submeter e revisar muitas melhorias na nova implementação do site.

*Agradecimentos a [Sophie Alpert](https://twitter.com/sophiebits) por revisar este post no blog!*