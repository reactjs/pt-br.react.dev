---
title: "React Labs: No que temos trabalhado – Junho de 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, and Xuan Huang
date: 2022/06/15
description: React 18 levou anos para ser feito e, com ele, trouxe lições valiosas para a equipe React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de muitos caminhos. Alguns desses caminhos foram bem-sucedidos; muitos mais foram becos sem saída que levaram a novos insights. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter uma visão desses caminhos que estamos explorando.
---

15 de junho de 2022 por [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](/blog/2022/03/29/react-v18) levou anos para ser feito e, com ele, trouxe lições valiosas para a equipe React. Seu lançamento foi o resultado de muitos anos de pesquisa e exploração de muitos caminhos. Alguns desses caminhos foram bem-sucedidos; muitos mais foram becos sem saída que levaram a novos insights. Uma lição que aprendemos é que é frustrante para a comunidade esperar por novos recursos sem ter uma visão desses caminhos que estamos explorando.

</Intro>

---

Normalmente, temos vários projetos sendo trabalhados a qualquer momento, que variam do mais experimental ao claramente definido. Olhando para o futuro, gostaríamos de começar a compartilhar regularmente mais sobre o que temos trabalhado com a comunidade em todos esses projetos.

Para definir as expectativas, esta não é uma roadmap com cronogramas claros. Muitos desses projetos estão em pesquisa ativa e são difíceis de definir datas de lançamento concretas. Eles podem possivelmente nunca serem lançados em sua iteração atual, dependendo do que aprendemos. Em vez disso, queremos compartilhar com você os espaços de problemas em que estamos pensando ativamente e o que aprendemos até agora.

## Server Components {/*server-components*/}

Anunciamos uma [demonstração experimental dos React Server Components](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC) em dezembro de 2020. Desde então, temos finalizado suas dependências no React 18 e trabalhando em mudanças inspiradas pelo feedback experimental.

Em particular, estamos abandonando a ideia de ter bibliotecas de E/S bifurcadas (por exemplo, react-fetch) e, em vez disso, adotando um modelo async/await para melhor compatibilidade. Isso tecnicamente não bloqueia o lançamento do RSC porque você também pode usar routers para buscar dados. Outra mudança é que também estamos nos afastando da abordagem de extensão de arquivo em favor da [anotation de boundaries](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

Estamos trabalhando com Vercel e Shopify para unificar o suporte de bundler para semântica compartilhada no Webpack e no Vite. Antes do lançamento, queremos ter certeza de que a semântica dos RSCs seja a mesma em todo o ecossistema React. Este é o principal bloqueador para alcançar a estabilidade.

## Asset Loading {/*asset-loading*/}

Atualmente, assets como scripts, estilos externos, fontes e imagens são normalmente pré-carregados e carregados usando sistemas externos. Isso pode tornar complicado coordenar em novos ambientes como streaming, Server Components e muito mais.
Estamos analisando como adicionar APIs para pré-carregar e carregar assets externos desduplicados por meio de APIs React que funcionam em todos os ambientes React.

Também estamos analisando como esses suportam Suspense para que você possa ter imagens, CSS e fontes que bloqueiam a exibição até que sejam carregadas, mas não bloqueiam o streaming e a renderização concorrente. Isso pode ajudar a evitar o [“popcorning“](https://twitter.com/sebmarkbage/status/1516852731251724293) conforme as imagens aparecem e a mudança de layout.

## Static Server Rendering Optimizations {/*static-server-rendering-optimizations*/}

Static Site Generation (SSG) e Incremental Static Regeneration (ISR) são ótimas maneiras de obter performance para páginas que podem ser armazenadas em cache, mas achamos que podemos adicionar recursos para melhorar o desempenho da Server Side Rendering (SSR) dinâmica – especialmente quando a maioria, mas nem todo o conteúdo, pode ser armazenado em cache. Estamos explorando maneiras de otimizar a renderização do servidor utilizando compilação e passes estáticos.

## React Optimizing Compiler {/*react-compiler*/}

Apresentamos uma [visualização inicial](https://www.youtube.com/watch?v=lGEMwh32soc) do React Forget no React Conf 2021. É um compilador que gera automaticamente o equivalente às chamadas `useMemo` e `useCallback` para minimizar o custo de re-renderização, mantendo o modelo de programação do React.

Recentemente, terminamos uma reescrita do compilador para torná-lo mais confiável e capaz. Essa nova arquitetura nos permite analisar e memoizar padrões mais complexos, como o uso de [local mutations](/learn/keeping-components-pure#local-mutation-your-components-little-secret), e abre muitas novas oportunidades de otimização em tempo de compilação, além de apenas estar no mesmo nível dos Hooks de memoização.

Também estamos trabalhando em um playground para explorar muitos aspectos do compilador. Embora o objetivo do playground seja facilitar o desenvolvimento do compilador, achamos que isso tornará mais fácil experimentá-lo e construir uma intuição para o que o compilador faz. Ele revela vários insights sobre como ele funciona por dentro e renderiza ao vivo as saídas do compilador à medida que você digita. Isso será enviado junto com o compilador quando for lançado.

## Offscreen {/*offscreen*/}

Hoje, se você deseja ocultar e mostrar um componente, você tem duas opções. Uma delas é adicionar ou remover o componente da árvore completamente. O problema com essa abordagem é que o estado da sua UI é perdido toda vez que você desmonta, incluindo o estado armazenado no DOM, como a posição da rolagem.

A outra opção é manter o componente montado e alternar a aparência visualmente usando CSS. Isso preserva o estado da sua UI, mas tem um custo de performance, porque o React deve continuar renderizando o um componente oculto e todos os seus filhos sempre que recebe novas atualizações.

Offscreen introduz uma terceira opção: oculta a UI visualmente, mas desprioriza seu conteúdo. A ideia é semelhante em espírito à propriedade CSS `content-visibility`: quando o conteúdo é oculto, ele não precisa permanecer em sincronia com o restante da UI. O React pode adiar o trabalho de renderização até que o restante do app esteja ocioso ou até que o conteúdo se torne visível novamente.

Offscreen é um recurso de baixo nível que desbloqueia recursos de alto nível. Semelhante a outros recursos concorrentes do React, como `startTransition`, na maioria dos casos você não vai interagir com a API Offscreen diretamente, mas sim por meio de um framework com opinião para implementar padrões como:

*   **Transições instantâneas.** Alguns frameworks de roteamento já pré-carregam dados para acelerar as navegações subsequentes, como ao passar o mouse sobre um link. Com Offscreen, eles também poderão pré-renderizar a próxima tela em segundo plano.
*   **Estado reutilizável.** Da mesma forma, ao navegar entre rotas ou abas, você pode usar Offscreen para preservar o estado da tela anterior para que possa voltar e continuar de onde parou.
*   **Renderização de lista virtualizada.** Ao exibir grandes listas de itens, frameworks de lista virtualizada pré-renderizarão mais linhas do que estão visíveis no momento. Você pode usar Offscreen para pré-renderizar as linhas ocultas com prioridade mais baixa do que os itens visíveis na lista.
*   **Conteúdo em segundo plano.** Também estamos explorando um recurso relacionado para despriorizar o conteúdo em segundo plano sem ocultá-lo, como ao exibir uma sobreposição modal.

## Transition Tracing {/*transition-tracing*/}

Atualmente, o React possui duas ferramentas de profiling. O [Profiler original](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) mostra uma visão geral de todos os commits em uma sessão de profiling. Para cada commit, ele também mostra todos os componentes que renderizaram e a quantidade de tempo que levou para renderizá-los. Também temos uma versão beta de um [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) introduzido no React 18 que mostra quando os componentes agendam atualizações e quando o React trabalha nessas atualizações. Ambos esses profilers ajudam os desenvolvedores a identificar problemas de performance em seu código.

Percebemos que os desenvolvedores não acham útil saber sobre commits ou componentes individuais lentos fora de contexto. É mais útil saber sobre o que realmente causa os commits lentos. E que os desenvolvedores querem ser capazes de rastrear interações específicas (por exemplo, um clique de botão, um carregamento inicial ou uma navegação de página) para observar as regressões de performance e entender por que uma interação foi lenta e como corrigi-la.

Anteriormente, tentamos resolver esse problema criando uma [Interaction Tracing API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), mas ela apresentava algumas falhas fundamentais de design que reduziam a precisão do rastreamento do motivo pelo qual uma interação era lenta e, às vezes, resultava em interações que nunca terminavam. Acabamos [removendo esta API](https://github.com/facebook/react/pull/20037) por causa desses problemas.

Estamos trabalhando em uma nova versão para a Interaction Tracing API (chamada provisoriamente de Transition Tracing porque é iniciada via `startTransition`) que resolve esses problemas.

## New React Docs {/*new-react-docs*/}

No ano passado, anunciamos a versão beta do novo site de documentação do React ([posteriormente lançado como react.dev](/blog/2023/03/16/introducing-react-dev)) do novo site de documentação do React. Os novos materiais de aprendizado ensinam Hooks em primeiro lugar e têm novos diagramas, ilustrações, bem como muitos exemplos e desafios interativos. Fizemos uma pausa nesse trabalho para nos concentrarmos no lançamento do React 18, mas agora que o React 18 foi lançado, estamos trabalhando ativamente para finalizar e lançar a nova documentação.

Atualmente, estamos escrevendo uma seção detalhada sobre efeitos, pois ouvimos que esse é um dos tópicos mais desafiadores para usuários novos e experientes do React. [Synchronizing with Effects](/learn/synchronizing-with-effects) é a primeira página publicada na série, e haverá mais nas próximas semanas. Quando começamos a escrever uma seção detalhada sobre efeitos, percebemos que muitos padrões de efeito comuns podem ser simplificados adicionando uma nova primitiva ao React. Compartilhamos alguns pensamentos iniciais sobre isso no [useEvent RFC](https://github.com/reactjs/rfcs/pull/220). Ele está atualmente em pesquisa inicial e ainda estamos iterando sobre a ideia. Agradecemos os comentários da comunidade sobre o RFC até agora, bem como o [feedback](https://github.com/reactjs/react.dev/issues/3308) e as contribuições para a reescrita da documentação em andamento. Gostaríamos de agradecer especificamente a [Harish Kumar](https://github.com/harish-sethuraman) por enviar e revisar muitas melhorias na nova implementação do site.

*Obrigado a [Sophie Alpert](https://twitter.com/sophiebits) por revisar este post do blog!*
``