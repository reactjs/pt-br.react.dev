---
title: "React Labs: No que temos trabalhado – Março de 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, and Andrew Clark
date: 2023/03/22
description: Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativos. Fizemos um progresso significativo neles desde nossa última atualização e gostaríamos de compartilhar o que aprendemos.
---

22 de março de 2023 por [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativos. Fizemos um progresso significativo neles desde nossa [última atualização](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e gostaríamos de compartilhar o que aprendemos.

</Intro>

---

## React Server Components {/*react-server-components*/}

React Server Components (ou RSC) é uma nova arquitetura de aplicação projetada pela equipe do React.

Compartilhamos pela primeira vez nossa pesquisa sobre RSC em uma [apresentação introdutória](/blog/2020/12/21/data-fetching-with-react-server-components) e um [RFC](https://github.com/reactjs/rfcs/pull/188). Para recapitular, estamos introduzindo um novo tipo de componente – Server Components – que são executados antecipadamente e são excluídos do seu bundle JavaScript. Server Components podem ser executados durante o build, permitindo que você leia do sistema de arquivos ou busque conteúdo estático. Eles também podem ser executados no servidor, permitindo que você acesse sua camada de dados sem ter que construir uma API. Você pode passar dados por props de Server Components para os Client Components interativos no navegador.

RSC combina o simples modelo mental "request/response" de aplicativos de várias páginas (Multi-Page Apps) centrados no servidor com a interatividade perfeita de aplicativos de página única (Single-Page Apps) centrados no cliente, oferecendo o melhor dos dois mundos.

Desde nossa última atualização, fundimos o [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) para ratificar a proposta. Resolvemos problemas pendentes com a proposta [React Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) e chegamos a um consenso com nossos parceiros para utilizar a convenção `"use client"`. Esses documentos também atuam como especificação para o que uma implementação compatível com RSC deve suportar.

A maior mudança é que introduzimos [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) como a principal forma de buscar dados de Server Components. Também planejamos suportar o carregamento de dados do cliente, introduzindo um novo Hook chamado `use` que descompacta Promises. Embora não possamos suportar `async / await` em componentes arbitrários em aplicativos somente de cliente, planejamos adicionar suporte para isso quando você estruturar seu aplicativo somente de cliente de forma semelhante a como os aplicativos RSC são estruturados.

Agora que temos a busca de dados bem definida, estamos explorando a outra direção: enviar dados do cliente para o servidor, para que você possa executar mutações no banco de dados e implementar formulários. Estamos fazendo isso permitindo que você passe funções de Server Action através da fronteira servidor/cliente, que o cliente pode então chamar, fornecendo RPC contínuo. Server Actions também oferecem formulários aprimorados progressivamente antes do carregamento do JavaScript.

React Server Components foi lançado no [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router). Isso mostra uma profunda integração de um roteador que realmente leva em conta o RSC como um primitivo, mas não é a única maneira de construir um roteador e framework compatíveis com RSC. Há uma clara separação para os recursos fornecidos pela especificação RSC e implementação. React Server Components é destinado a ser uma especificação para componentes que funcionam em frameworks React compatíveis.

Geralmente, recomendamos o uso de um framework existente, mas se você precisar construir seu próprio framework personalizado, é possível. Construir seu próprio framework compatível com RSC não é tão fácil quanto gostaríamos, principalmente devido à profunda integração do bundler necessária. A geração atual de bundlers é ótima para uso no cliente, mas não foram projetados com suporte de primeira classe para dividir um único gráfico de módulos entre o servidor e o cliente. É por isso que agora estamos fazendo parceria direta com os desenvolvedores de bundler para integrar os primitivos para RSC.

## Carregamento de Assets {/*asset-loading*/}

[Suspense](/reference/react/Suspense) permite que você especifique o que exibir na tela enquanto os dados ou o código para seus componentes ainda estão sendo carregados. Isso permite que seus usuários vejam progressivamente mais conteúdo enquanto a página está carregando, bem como durante as navegações do roteador que carregam mais dados e código. No entanto, da perspectiva do usuário, o carregamento e a renderização de dados não contam toda a história ao considerar se o novo conteúdo está pronto. Por padrão, os navegadores carregam folhas de estilo, fontes e imagens de forma independente, o que pode levar a saltos na UI e mudanças consecutivas no layout.

Estamos trabalhando para integrar totalmente o Suspense com o ciclo de vida de carregamento de folhas de estilo, fontes e imagens, para que o React os leve em consideração para determinar se o conteúdo está pronto para ser exibido. Sem nenhuma alteração na forma como você cria seus componentes React, as atualizações se comportarão de maneira mais coerente e agradável. Como uma otimização, também forneceremos uma maneira manual de pré-carregar assets como fontes diretamente dos componentes.

Atualmente, estamos implementando esses recursos e teremos mais para compartilhar em breve.

## Document Metadata {/*document-metadata*/}

Diferentes páginas e telas em seu aplicativo podem ter metadados diferentes, como a tag `<title>`, descrição e outras tags `<meta>` específicas para esta tela. Da perspectiva da manutenção, é mais escalável manter essas informações próximas ao componente React para essa página ou tela. No entanto, as tags HTML para esses metadados precisam estar no `<head>` do documento, que normalmente é renderizado em um componente na raiz do seu aplicativo.

Hoje, as pessoas resolvem esse problema com uma das duas técnicas.

Uma técnica é renderizar um componente especial de terceiros que move `<title>`, `<meta>` e outras tags dentro dele para o `<head>` do documento. Isso funciona para os principais navegadores, mas existem muitos clientes que não executam JavaScript do lado do cliente, como analisadores do Open Graph, e, portanto, essa técnica não é universalmente adequada.

Outra técnica é renderizar a página no servidor em duas partes. Primeiro, o conteúdo principal é renderizado e todas essas tags são coletadas. Em seguida, o `<head>` é renderizado com essas tags. Finalmente, o `<head>` e o conteúdo principal são enviados para o navegador. Essa abordagem funciona, mas impede que você se beneficie do [Streaming Server Renderer do React 18](/reference/react-dom/server/renderToReadableStream) porque você teria que esperar que todo o conteúdo fosse renderizado antes de enviar o `<head>`.

É por isso que estamos adicionando suporte integrado para renderizar tags `<title>`, `<meta>` e metadata `<link>` em qualquer lugar na sua árvore de componentes, logo de cara. Funcionaria da mesma forma em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e, no futuro, RSC. Compartilharemos mais detalhes sobre isso em breve.

## React Optimizing Compiler {/*react-optimizing-compiler*/}

Desde nossa atualização anterior, temos iterado ativamente no design do [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), um compilador de otimização para React. Falamos anteriormente sobre ele como um "compilador de auto-memoização", e isso é verdade em certo sentido. Mas a construção do compilador nos ajudou a entender o modelo de programação do React ainda mais profundamente. Uma maneira melhor de entender o React Forget é como um compilador de *reatividade* automático.

A ideia central do React é que os desenvolvedores definam sua UI como uma função do estado atual. Você trabalha com valores JavaScript simples – números, strings, arrays, objetos – e usa os idiomas JavaScript padrão – if/else, for, etc – para descrever a lógica do seu componente. O modelo mental é que o React irá re-renderizar sempre que o estado da aplicação mudar. Acreditamos que esse modelo mental simples e a proximidade com a semântica JavaScript é um princípio importante no modelo de programação do React.

O problema é que o React pode às vezes ser *demasiado* reativo: ele pode re-renderizar demais. Por exemplo, em JavaScript, não temos maneiras baratas de comparar se dois objetos ou arrays são equivalentes (tendo as mesmas chaves e valores), portanto, criar um novo objeto ou array em cada renderização pode fazer com que o React faça mais trabalho do que o estritamente necessário. Isso significa que os desenvolvedores precisam memoizar explicitamente os componentes para não reagir exageradamente às mudanças.

Nosso objetivo com o React Forget é garantir que os aplicativos React tenham a quantidade certa de reatividade por padrão: que os aplicativos re-renderizem apenas quando os valores do estado mudam *significativamente*. De uma perspectiva de implementação, isso significa memoizar automaticamente, mas acreditamos que a estrutura de reatividade é uma maneira melhor de entender o React e o Forget. Uma maneira de pensar sobre isso é que o React atualmente re-renderiza quando a identidade do objeto muda. Com o Forget, o React re-renderiza quando o valor semântico muda – mas sem incorrer no custo de tempo de execução de comparações profundas.

Em termos de progresso concreto, desde nossa última atualização, iteramos substancialmente no design do compilador para nos alinharmos com essa abordagem de reatividade automática e para incorporar feedback do uso do compilador internamente. Após algumas refatorações significativas no compilador, começando no final do ano passado, agora começamos a usar o compilador em produção em áreas limitadas na Meta. Planejamos torná-lo de código aberto assim que o provarmos em produção.

Finalmente, muitas pessoas expressaram interesse em como o compilador funciona. Estamos ansiosos para compartilhar muitos mais detalhes quando provarmos o compilador e torná-lo de código aberto. Mas há algumas coisas que podemos compartilhar agora:

O núcleo do compilador é quase completamente desacoplado do Babel, e a API principal do compilador é (aproximadamente) AST antigo na entrada, AST novo na saída (mantendo os dados de localização da fonte). Nos bastidores, usamos uma representação de código personalizada e um pipeline de transformação para fazer análise semântica de baixo nível. No entanto, a principal interface pública do compilador será por meio de plugins do Babel e outros sistemas de build. Para facilitar os testes, atualmente temos um plugin do Babel que é um wrapper muito fino que chama o compilador para gerar uma nova versão de cada função e trocá-la.

À medida que refatoramos o compilador nos últimos meses, queríamos nos concentrar no refinamento do modelo de compilação principal para garantir que pudéssemos lidar com complexidades como condicionais, loops, reatribuição e mutação. No entanto, JavaScript tem muitas maneiras de expressar cada um desses recursos: if/else, ternários, for, for-in, for-of, etc. Tentar suportar a linguagem completa antecipadamente teria atrasado o ponto em que poderíamos validar o modelo principal. Em vez disso, começamos com um subconjunto pequeno, mas representativo da linguagem: let/const, if/else, loops for, objetos, arrays, primitivos, chamadas de função e alguns outros recursos. À medida que ganhamos confiança no modelo principal e refinamos nossas abstrações internas, expandimos o subconjunto da linguagem suportada. Também somos explícitos sobre a sintaxe que ainda não suportamos, registrando diagnósticos e ignorando a compilação para entrada não suportada. Temos utilitários para testar o compilador nas bases de código da Meta e ver quais recursos não suportados são mais comuns para que possamos priorizá-los em seguida. Continuaremos expandindo incrementalmente para dar suporte à linguagem inteira.

Tornar o JavaScript simples em componentes React reativo requer um compilador com um profundo entendimento da semântica para que ele possa entender exatamente o que o código está fazendo. Ao adotar essa abordagem, estamos criando um sistema para reatividade dentro do JavaScript que permite que você escreva código de produto de qualquer complexidade com a expressividade total da linguagem, em vez de ser limitado a uma linguagem específica do domínio.

## Offscreen Rendering {/*offscreen-rendering*/}

Offscreen rendering é um recurso futuro no React para renderizar telas em segundo plano sem sobrecarga de desempenho adicional. Você pode pensar nisso como uma versão da propriedade [`content-visibility` CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) que funciona não apenas para elementos DOM, mas também para componentes React. Durante nossa pesquisa, descobrimos uma variedade de casos de uso:

- Um roteador pode pré-renderizar telas em segundo plano para que, quando um usuário navegar até elas, elas estejam instantaneamente disponíveis.
- Um componente de mudança de guia pode preservar o estado das guias ocultas, para que o usuário possa alternar entre elas sem perder seu progresso.
- Um componente de lista virtualizada pode pré-renderizar linhas adicionais acima e abaixo da janela visível.
- Ao abrir um modal ou pop-up, o restante do aplicativo pode ser colocado no modo "fundo" para que eventos e atualizações sejam desabilitados para tudo, exceto o modal.

A maioria dos desenvolvedores React não interage com as APIs offscreen do React diretamente. Em vez disso, a renderização offscreen será integrada a coisas como roteadores e bibliotecas de UI, e então os desenvolvedores que usam essas bibliotecas se beneficiarão automaticamente sem trabalho adicional.

A ideia é que você deve ser capaz de renderizar qualquer árvore React fora da tela sem alterar a forma como você escreve seus componentes. Quando um componente é renderizado fora da tela, ele não é realmente *montado* até que o componente se torne visível – seus efeitos não são acionados. Por exemplo, se um componente usa `useEffect` para registrar análises quando ele aparece pela primeira vez, a pré-renderização não vai bagunçar a precisão dessas análises. Da mesma forma, quando um componente sai da tela, seus efeitos também são desmontados. Um recurso chave da renderização fora da tela é que você pode alternar a visibilidade de um componente sem perder seu estado.

Desde nossa última atualização, testamos uma versão experimental de pré-renderização internamente na Meta em nossos aplicativos React Native no Android e iOS, com resultados de desempenho positivos. Também melhoramos como a renderização offscreen funciona com Suspense – suspender dentro de uma árvore offscreen não acionará fallbacks do Suspense. Nosso trabalho restante envolve finalizar os primitivos que são expostos aos desenvolvedores de bibliotecas. Esperamos publicar um RFC ainda este ano, juntamente com uma API experimental para testes e feedback.

## Transition Tracing {/*transition-tracing*/}

A API Transition Tracing permite que você detecte quando [React Transitions](/reference/react/useTransition) ficam mais lentas e investigar o porquê de estarem lentas. Após nossa última atualização, concluímos o design inicial da API e publicamos um [RFC](https://github.com/reactjs/rfcs/pull/238). Os recursos básicos também foram implementados. O projeto está atualmente em espera. Agradecemos o feedback sobre o RFC e esperamos retomar seu desenvolvimento para fornecer uma melhor ferramenta de medição de desempenho para React. Isso será particularmente útil com roteadores construídos sobre React Transitions, como o [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router).

* * *
Além desta atualização, nossa equipe fez aparições recentes em podcasts e transmissões ao vivo da comunidade para falar mais sobre nosso trabalho e responder a perguntas.

* [Dan Abramov](https://bsky.app/profile/danabra.mov) e [Joe Savona](https://twitter.com/en_JS) foram entrevistados por [Kent C. Dodds em seu canal do YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), onde discutiram preocupações em relação ao React Server Components.
* [Dan Abramov](https://bsky.app/profile/danabra.mov) e [Joe Savona](https://twitter.com/en_JS) foram convidados no [podcast JSParty](https://jsparty.fm/267) e compartilharam suas ideias sobre o futuro do React.

Obrigado a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster) e [Sophie Alpert](https://twitter.com/sophiebits) por revisar esta postagem.

Obrigado por ler e nos vemos na próxima atualização!