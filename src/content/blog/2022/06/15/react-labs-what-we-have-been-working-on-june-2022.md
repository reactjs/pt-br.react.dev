---
title: "React Labs: No que Estivemos Trabalhando – Junho de 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, e Xuan Huang
date: 2022/06/15
description: O React 18 foi anos em desenvolvimento, e com ele trouxe lições valiosas para a equipe do React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de muitos caminhos. Alguns desses caminhos foram bem-sucedidos; muitos outros foram becos sem saída que levaram a novas percepções. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter visão sobre esses caminhos que estamos explorando.
---

15 de Junho de 2022 por [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[O React 18](/blog/2022/03/29/react-v18) foi anos em desenvolvimento, e com ele trouxe lições valiosas para a equipe do React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de muitos caminhos. Alguns desses caminhos foram bem-sucedidos; muitos outros foram becos sem saída que levaram a novas percepções. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter visão sobre esses caminhos que estamos explorando.

</Intro>

---

Normalmente, temos uma série de projetos sendo trabalhados a qualquer momento, variando desde os mais experimentais até os claramente definidos. Olhando para o futuro, gostaríamos de começar a compartilhar regularmente mais sobre o que temos trabalhado com a comunidade em relação a esses projetos.

Para definir as expectativas, este não é um roteiro com prazos claros. Muitos desses projetos estão sob pesquisa ativa e são difíceis de colocar datas concretas de lançamento. Eles podem, possivelmente, nunca ser lançados em sua iteração atual, dependendo do que aprendermos. Em vez disso, queremos compartilhar com você os espaços de problema que estamos ativamente pensando e o que aprendemos até agora.

## Componentes do Servidor {/*server-components*/}

Anunciamos uma [demonstração experimental dos Componentes do Servidor do React](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC) em dezembro de 2020. Desde então, temos finalizado suas dependências no React 18 e trabalhando em mudanças inspiradas por feedbacks experimentais.

Em particular, estamos abandonando a ideia de ter bibliotecas de I/O bifurcadas (por exemplo, react-fetch) e, em vez disso, adotando um modelo async/await para melhor compatibilidade. Isso não bloqueia tecnicamente a liberação dos RSCs, porque você também pode usar roteadores para busca de dados. Outra mudança é que estamos nos afastando da abordagem de extensão de arquivo em favor de [anotação de limites](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

Estamos trabalhando juntos com a Vercel e Shopify para unificar o suporte ao bundler para semânticas compartilhadas tanto no Webpack quanto no Vite. Antes do lançamento, queremos garantir que as semânticas dos RSCs sejam as mesmas em todo o ecossistema do React. Este é o principal bloqueador para alcançar a estabilidade.

## Carregamento de Ativos {/*asset-loading*/}

Atualmente, ativos como scripts, estilos externos, fontes e imagens são tipicamente pré-carregados e carregados usando sistemas externos. Isso pode dificultar a coordenação entre novos ambientes, como streaming, Componentes do Servidor, e mais.

Estamos analisando a adição de APIs para pré-carregar e carregar ativos externos deduplicados através das APIs do React que funcionam em todos os ambientes do React.

Estamos também considerando a possibilidade de que esses suportem Suspense, para que você possa ter imagens, CSS e fontes que bloqueiam a exibição até serem carregados, mas não bloqueiam o streaming e a renderização concorrente. Isso pode ajudar a evitar [“popcorn”](https://twitter.com/sebmarkbage/status/1516852731251724293) enquanto os visuais aparecem e o layout muda.

## Otimizações de Renderização Estática no Servidor {/*static-server-rendering-optimizations*/}

A Geração de Sites Estáticos (SSG) e a Regeneração Estática Incremental (ISR) são ótimas maneiras de obter desempenho para páginas que podem ser armazenadas em cache, mas achamos que podemos adicionar recursos para melhorar o desempenho da Renderização do Lado do Servidor (SSR) – especialmente quando a maior parte, mas não todo o conteúdo é armazenável em cache. Estamos explorando maneiras de otimizar a renderização do servidor utilizando compilação e passes estáticos.

## Compilador de Otimização do React {/*react-compiler*/}

Demos uma [pré-visualização inicial](https://www.youtube.com/watch?v=lGEMwh32soc) do React Forget na React Conf 2021. É um compilador que gera automaticamente o equivalente a chamadas `useMemo` e `useCallback` para minimizar o custo de re-renderizações, mantendo o modelo de programação do React.

Recentemente, concluímos uma reescrita do compilador para torná-lo mais confiável e capaz. Esta nova arquitetura nos permite analisar e memorizar padrões mais complexos, como o uso de [mutations locais](/learn/keeping-components-pure#local-mutation-your-components-little-secret), e abre muitas novas oportunidades de otimização em tempo de compilação além de simplesmente ficar à par dos Hooks de memoização.

Estamos trabalhando também em um playground para explorar muitos aspectos do compilador. Enquanto o objetivo do playground é facilitar o desenvolvimento do compilador, acreditamos que tornará mais fácil experimentá-lo e construir uma intuição sobre o que o compilador faz. Ele revela várias percepções sobre como funciona por dentro, e renderiza ao vivo as saídas do compilador enquanto você digita. Isso será lançado juntamente com o compilador quando for liberado.

## Offscreen {/*offscreen*/}

Hoje, se você quiser ocultar e mostrar um componente, tem duas opções. Uma é adicionar ou remover completamente da árvore. O problema com essa abordagem é que o estado da sua UI é perdido cada vez que você desmonta, incluindo estados armazenados no DOM, como a posição de rolagem.

A outra opção é manter o componente montado e alternar a aparência visualmente usando CSS. Isso preserva o estado da sua UI, mas vem com um custo de desempenho, porque o React deve continuar renderizando o componente oculto e todos os seus filhos sempre que recebe novas atualizações.

Offscreen introduz uma terceira opção: ocultar a UI visualmente, mas despriorizar seu conteúdo. A ideia é semelhante em espírito à propriedade CSS `content-visibility`: quando o conteúdo está oculto, não precisa ficar em sincronia com o resto da UI. O React pode adiar o trabalho de renderização até que o resto do aplicativo esteja ocioso ou até que o conteúdo se torne visível novamente.

Offscreen é uma capacidade de baixo nível que desbloqueia recursos de alto nível. Semelhante a outros recursos concorrentes do React, como `startTransition`, na maioria dos casos você não interagirá diretamente com a API Offscreen, mas sim através de um framework opinativo para implementar padrões como:

* **Transições instantâneas.** Algumas bibliotecas de roteamento já buscam dados para acelerar navegações subsequentes, como ao passar o mouse sobre um link. Com Offscreen, elas também poderão pré-renderizar a próxima tela em segundo plano.
* **Estado reutilizável.** Da mesma forma, ao navegar entre rotas ou abas, você pode usar Offscreen para preservar o estado da tela anterior, permitindo que você volte e retome de onde parou.
* **Renderização de listas virtualizadas.** Ao exibir grandes listas de itens, frameworks de listas virtualizadas pré-renderizarão mais linhas do que estão atualmente visíveis. Você pode usar Offscreen para pré-renderizar as linhas ocultas com uma prioridade inferior em relação aos itens visíveis na lista.
* **Conteúdo em segundo plano.** Estamos também explorando um recurso relacionado para despriorizar o conteúdo em segundo plano sem ocultá-lo, como ao exibir uma sobreposição modal.

## Rastreamento de Transições {/*transition-tracing*/}

Atualmente, o React possui duas ferramentas de profilagem. O [Profiler original](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) mostra uma visão geral de todos os commits em uma sessão de profilagem. Para cada commit, ele também mostra todos os componentes que renderizaram e a quantidade de tempo que levou para eles renderizarem. Também temos uma versão beta de um [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) introduzida no React 18 que mostra quando os componentes agendam atualizações e quando o React trabalha nessas atualizações. Ambas essas ferramentas ajudam os desenvolvedores a identificar problemas de desempenho em seu código.

Percebemos que os desenvolvedores não acham útil saber sobre commits lentos ou componentes individuais fora de contexto. É mais útil saber o que realmente causa os commits lentos. E os desenvolvedores querem poder rastrear interações específicas (por exemplo, um clique de botão, um carregamento inicial ou uma navegação de página) para observar regressões de desempenho e entender por que uma interação foi lenta e como consertá-la.

Tentamos anteriormente resolver esse problema criando uma [API de Rastreamento de Interações](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), mas apresentava algumas falhas de design fundamentais que reduziam a precisão do rastreamento do porquê uma interação foi lenta e às vezes resultavam em interações que nunca terminavam. Acabamos [removendo essa API](https://github.com/facebook/react/pull/20037) por causa desses problemas.

Estamos trabalhando em uma nova versão da API de Rastreamento de Interações (provisoriamente chamada de Rastreamento de Transições, porque é iniciada via `startTransition`) que resolve esses problemas.

## Novos Documentos do React {/*new-react-docs*/}

No ano passado, anunciamos a versão beta do novo site de documentação do React ([posteriormente lançado como react.dev](/blog/2023/03/16/introducing-react-dev)). O novo material de aprendizagem ensina Hooks primeiro e tem novos diagramas, ilustrações, além de muitos exemplos interativos e desafios. Fizemos uma pausa nesse trabalho para focar no lançamento do React 18, mas agora que o React 18 foi lançado, estamos ativamente trabalhando para concluir e lançar a nova documentação.

Estamos atualmente escrevendo uma seção detalhada sobre efeitos, já que ouvimos que esse é um dos tópicos mais desafiadores tanto para novos usuários quanto para usuários experientes do React. [Sincronização com Efeitos](/learn/synchronizing-with-effects) é a primeira página publicada na série, e mais páginas estão por vir nas próximas semanas. Quando começamos a escrever uma seção detalhada sobre efeitos, percebemos que muitos padrões comuns de efeitos podem ser simplificados ao adicionar um novo primitivo ao React. Compartilhamos algumas ideias iniciais sobre isso no [RFC useEvent](https://github.com/reactjs/rfcs/pull/220). Ele está atualmente em pesquisa inicial, e ainda estamos iterando sobre a ideia. Agradecemos os comentários da comunidade sobre o RFC até agora, assim como o [feedback](https://github.com/reactjs/react.dev/issues/3308) e contribuições para a reescrita contínua da documentação. Gostaríamos de agradecer especialmente [Harish Kumar](https://github.com/harish-sethuraman) por submeter e revisar muitas melhorias na nova implementação do site.

*Agradecimentos a [Sophie Alpert](https://twitter.com/sophiebits) por revisar este post do blog!*