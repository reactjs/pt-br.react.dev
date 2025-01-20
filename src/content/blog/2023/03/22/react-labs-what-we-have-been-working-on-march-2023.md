---
title: "React Labs: No que Estamos Trabalhando – Março de 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, e Andrew Clark
date: 2023/03/22
description: Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar o que aprendemos.
---

22 de março de 2023 por [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa [última atualização](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e gostaríamos de compartilhar o que aprendemos.

</Intro>

---

## React Server Components {/*react-server-components*/}

React Server Components (ou RSC) é uma nova arquitetura de aplicativo projetada pela equipe do React.

Compartilhamos inicialmente nossa pesquisa sobre RSC em uma [palestra introdutória](/blog/2020/12/21/data-fetching-with-react-server-components) e um [RFC](https://github.com/reactjs/rfcs/pull/188). Para recapitular, estamos introduzindo um novo tipo de componente—Componentes de Servidor—que são executados antecipadamente e são excluídos do seu pacote JavaScript. Os Componentes de Servidor podem ser executados durante a construção, permitindo que você leia do sistema de arquivos ou busque conteúdo estático. Eles também podem ser executados no servidor, permitindo que você acesse sua camada de dados sem precisar construir uma API. Você pode passar dados por meio de props dos Componentes de Servidor para os Componentes Interativos do Cliente no navegador.

RSC combina o simples modelo mental de "requisição/resposta" de Aplicativos Multi-Página centrados no servidor com a interatividade contínua de Aplicativos de Página Única centrados no cliente, oferecendo o melhor de ambos os mundos.

Desde nossa última atualização, fundimos o [RFC dos Componentes de Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) para ratificar a proposta. Resolvemos questões pendentes com a proposta das [Convenções de Módulo do Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) e chegamos a um consenso com nossos parceiros para adotar a convenção `"use client"`. Esses documentos também atuam como especificações sobre o que uma implementação compatível com RSC deve suportar.

A maior mudança é que introduzimos [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) como a principal maneira de fazer a busca de dados a partir dos Componentes de Servidor. Também planejamos suportar o carregamento de dados a partir do cliente introduzindo um novo Hook chamado `use` que desvenda Promises. Embora não possamos suportar `async / await` em componentes arbitrários em aplicativos apenas do cliente, planejamos adicionar suporte quando você estruturar seu aplicativo somente do cliente de forma semelhante à estrutura dos aplicativos RSC.

Agora que temos a busca de dados bem encaminhada, estamos explorando a outra direção: enviar dados do cliente para o servidor, para que você possa executar mutações de banco de dados e implementar formulários. Estamos fazendo isso ao permitir que você passe funções de Ação do Servidor através da fronteira servidor/cliente, que o cliente pode então chamar, fornecendo RPC contínuo. As Ações do Servidor também oferecem formulários progressivamente aprimorados antes que o JavaScript seja carregado.

Os Componentes de Servidor do React foram implementados no [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router). Isso demonstra uma integração profunda de um roteador que realmente adota RSC como um primitivo, mas não é a única maneira de construir um roteador e um framework compatível com RSC. Existe uma clara separação para os recursos fornecidos pela especificação RSC e pela implementação. Os Componentes de Servidor do React são destinados a ser uma especificação para componentes que funcionam entre frameworks compatíveis com o React.

Geralmente, recomendamos o uso de um framework existente, mas se você precisar construir seu próprio framework personalizado, isso é possível. Construir seu próprio framework compatível com RSC não é tão fácil quanto gostaríamos, principalmente devido à profunda integração necessária com os empacotadores. A geração atual de empacotadores é ótima para uso no cliente, mas não foi projetada com suporte de primeira classe para dividir um único gráfico de módulo entre o servidor e o cliente. É por isso que agora estamos fazendo parceria diretamente com desenvolvedores de empacotadores para que os primitivos para RSC sejam embutidos.

## Asset Loading {/*asset-loading*/}

[Suspense](/reference/react/Suspense) permite que você especifique o que exibir na tela enquanto os dados ou o código para seus componentes ainda estão sendo carregados. Isso permite que seus usuários vejam progressivamente mais conteúdo enquanto a página está sendo carregada, assim como durante as navegações do roteador que carregam mais dados e código. No entanto, da perspectiva do usuário, o carregamento de dados e a renderização não contam toda a história ao considerar se um novo conteúdo está pronto. Por padrão, os navegadores carregam folhas de estilo, fontes e imagens de forma independente, o que pode levar a saltos na UI e mudanças consecutivas de layout.

Estamos trabalhando para integrar completamente o Suspense com o ciclo de carregamento de folhas de estilo, fontes e imagens, para que o React leve isso em consideração ao determinar se o conteúdo está pronto para ser exibido. Sem qualquer alteração na forma como você cria seus componentes React, as atualizações se comportarão de maneira mais coerente e agradável. Como uma otimização, também forneceremos uma maneira manual de pré-carregar ativos, como fontes, diretamente de componentes.

Atualmente, estamos implementando esses recursos e teremos mais para compartilhar em breve.

## Document Metadata {/*document-metadata*/}

Diferentes páginas e telas em seu aplicativo podem ter metadados diferentes, como a tag `<title>`, descrição, e outras tags `<meta>` específicas para essa tela. Do ponto de vista da manutenção, é mais escalável manter essa informação próxima ao componente React daquela página ou tela. No entanto, as tags HTML para esse metadado precisam estar no `<head>` do documento, que normalmente é renderizado em um componente na raiz do seu aplicativo.

Hoje, as pessoas resolvem esse problema com uma das duas técnicas.

Uma técnica é renderizar um componente especial de terceiros que move `<title>`, `<meta>`, e outras tags dentro dele para o `<head>` do documento. Isso funciona para navegadores principais, mas há muitos clientes que não executam JavaScript no lado do cliente, como parsers Open Graph, e essa técnica não é universalmente adequada.

Outra técnica é renderizar o servidor a página em duas partes. Primeiro, o conteúdo principal é renderizado e todas essas tags são coletadas. Em seguida, o `<head>` é renderizado com essas tags. Finalmente, o `<head>` e o conteúdo principal são enviados para o navegador. Essa abordagem funciona, mas impede que você aproveite o [Renderizador de Streaming do React 18](/reference/react-dom/server/renderToReadableStream) porque você teria que esperar todo o conteúdo ser renderizado antes de enviar o `<head>`.

É por isso que estamos adicionando suporte embutido para renderizar tags `<title>`, `<meta>`, e `<link>` de metadados em qualquer lugar da sua árvore de componentes, de forma automática. Isso funcionará da mesma maneira em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e, no futuro, RSC. Compartilharemos mais detalhes sobre isso em breve.

## React Optimizing Compiler {/*react-optimizing-compiler*/}

Desde nossa última atualização, temos iterado ativamente sobre o design do [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), um compilador otimizado para o React. Falamos anteriormente sobre ele como um "compilador de auto-memorização", e isso é verdade em certo sentido. Mas construir o compilador nos ajudou a entender ainda mais o modelo de programação do React. Uma maneira melhor de entender o React Forget é como um compilador de *reatividade* automático.

A ideia central do React é que os desenvolvedores definem sua UI como uma função do estado atual. Você trabalha com valores JavaScript simples — números, strings, arrays, objetos — e usa o idioma JavaScript padrão — if/else, for, etc — para descrever a lógica do seu componente. O modelo mental é que o React fará uma nova renderização sempre que o estado da aplicação mudar. Acreditamos que esse simples modelo mental e a manutenção próxima das semânticas do JavaScript são um princípio importante no modelo de programação do React.

O problema é que o React pode, às vezes, ser *demais* reativo: pode renderizar novamente demais. Por exemplo, em JavaScript não temos maneiras baratas de comparar se dois objetos ou arrays são equivalentes (têm as mesmas chaves e valores), portanto, criar um novo objeto ou array em cada renderização pode fazer com que o React faça mais trabalho do que realmente precisa. Isso significa que os desenvolvedores têm que memoizar explicitamente os componentes para não reagir demais às mudanças.

Nosso objetivo com o React Forget é garantir que os aplicativos React tenham apenas a quantidade certa de reatividade por padrão: que os aplicativos sejam renderizados novamente apenas quando os valores de estado mudarem *significativamente*. De uma perspectiva de implementação, isso significa memoizar automaticamente, mas acreditamos que a estruturação da reatividade é uma maneira melhor de entender o React e o Forget. Uma maneira de pensar sobre isso é que o React atualmente renderiza novamente quando a identidade do objeto muda. Com o Forget, o React renderiza novamente quando o valor semântico muda — mas sem incorrer no custo de tempo de execução de comparações profundas.

Em termos de progresso concreto, desde nossa última atualização, iteramos substancialmente no design do compilador para alinhar com essa abordagem de reatividade automática e incorporar feedback do uso interno do compilador. Após algumas refatorações significativas no compilador a partir do final do ano passado, agora começamos a usar o compilador em produção em áreas limitadas na Meta. Planejamos disponibilizá-lo como código aberto uma vez que tivermos provado sua eficácia em produção.

Finalmente, muitas pessoas expressaram interesse em como o compilador funciona. Estamos ansiosos para compartilhar mais detalhes quando provarmos o compilador e o tornarmos de código aberto. Mas há algumas informações que podemos compartilhar agora:

O núcleo do compilador está quase completamente desacoplado do Babel, e a API principal do compilador é (aproximadamente) AST antigo de entrada, novo AST de saída (mantendo os dados de localização de origem). Por baixo dos panos, usamos uma representação personalizada de código e um pipeline de transformação para realizar uma análise semântica de baixo nível. No entanto, a interface pública principal do compilador será através do Babel e de outros plugins do sistema de construção. Para facilitar os testes, atualmente temos um plugin do Babel que é uma camada muito fina que chama o compilador para gerar uma nova versão de cada função e a troca.

À medida que refatoramos o compilador nos últimos meses, queríamos focar em refinar o modelo de compilação central para garantir que pudéssemos lidar com complexidades como condicionais, loops, reatribuição e mutação. No entanto, o JavaScript possui muitas maneiras de expressar cada um desses recursos: if/else, ternários, for, for-in, for-of, etc. Tentar suportar toda a linguagem desde o início teria atrasado o momento em que poderíamos validar o modelo central. Em vez disso, começamos com um subconjunto pequeno, mas representativo da linguagem: let/const, if/else, loops for, objetos, arrays, primitivos, chamadas de função e alguns outros recursos. À medida que ganhamos confiança no modelo central e refinamos nossas abstrações internas, expandimos o subconjunto de linguagem suportado. Também somos explícitos sobre a sintaxe que ainda não suportamos, registrando diagnósticos e pulando a compilação para entradas não suportadas. Temos utilitários para testar o compilador nos repositórios de código da Meta e ver quais recursos não suportados são mais comuns, para que possamos priorizar esses próximos. Continuaremos expandindo progressivamente para suportar toda a linguagem.

Tornar o JavaScript simples em componentes React reativo requer um compilador com uma compreensão profunda das semânticas para que ele possa entender exatamente o que o código está fazendo. Ao adotar essa abordagem, estamos criando um sistema de reatividade dentro do JavaScript que permite que você escreva código de produção de qualquer complexidade com toda a expressividade da linguagem, em vez de ficar limitado a uma linguagem específica de domínio.

## Offscreen Rendering {/*offscreen-rendering*/}

A renderização fora da tela é uma capacidade futura no React para renderizar telas em segundo plano sem sobrecarga adicional de desempenho. Você pode pensar nisso como uma versão da propriedade CSS [`content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) que funciona não apenas para elementos DOM, mas também para componentes React. Durante nossa pesquisa, descobrimos uma variedade de casos de uso:

- Um roteador pode pré-renderizar telas em segundo plano para que, quando um usuário navega até elas, elas estejam instantaneamente disponíveis.
- Um componente de troca de abas pode preservar o estado de abas ocultas, para que o usuário possa alternar entre elas sem perder seu progresso.
- Um componente de lista virtualizada pode pré-renderizar linhas adicionais acima e abaixo da janela visível.
- Ao abrir um modal ou popup, o restante do aplicativo pode ser colocado em modo "fundo" para que eventos e atualizações sejam desativados para tudo, exceto o modal.

A maioria dos desenvolvedores React não interagirá diretamente com as APIs offscreen do React. Em vez disso, a renderização offscreen será integrada a coisas como roteadores e bibliotecas de UI, e os desenvolvedores que usam essas bibliotecas se beneficiarão automaticamente sem trabalho adicional.

A ideia é que você deva ser capaz de renderizar qualquer árvore React fora da tela sem mudar a forma como escreve seus componentes. Quando um componente é renderizado fora da tela, ele não é realmente *montado* até que o componente se torne visível — seus efeitos não são disparados. Por exemplo, se um componente usa `useEffect` para registrar análises quando aparece pela primeira vez, a pré-renderização não afetará a precisão dessas análises. Da mesma forma, quando um componente sai da tela, seus efeitos também são desmontados. Um recurso chave da renderização fora da tela é que você pode alternar a visibilidade de um componente sem perder seu estado.

Desde nossa última atualização, testamos uma versão experimental da pré-renderização internamente na Meta em nossos aplicativos React Native em Android e iOS, com resultados de desempenho positivos. Também melhoramos como a renderização offscreen funciona com Suspense — suspender dentro de uma árvore offscreen não acionará os fallbacks do Suspense. Nosso trabalho restante envolve a finalização dos primitivos que são expostos aos desenvolvedores de bibliotecas. Esperamos publicar um RFC ainda este ano, juntamente com uma API experimental para testes e feedback.

## Transition Tracing {/*transition-tracing*/}

A API de Transition Tracing permite que você detecte quando [Transições do React](/reference/react/useTransition) se tornam mais lentas e investigue o porquê de poderem estar lentas. Após nossa última atualização, completamos o design inicial da API e publicamos um [RFC](https://github.com/reactjs/rfcs/pull/238). As capacidades básicas também foram implementadas. O projeto está atualmente em espera. Agradecemos o feedback sobre o RFC e esperamos retomar seu desenvolvimento para fornecer uma ferramenta de medição de desempenho melhor para o React. Isso será particularmente útil com roteadores construídos sobre as Transições do React, como o [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router).

* * *
Além desta atualização, nossa equipe fez recentes aparições como convidados em podcasts e transmissões ao vivo da comunidade para falar mais sobre nosso trabalho e responder a perguntas.

* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram entrevistados por [Kent C. Dodds em seu canal do YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), onde discutiram preocupações relacionadas aos Componentes de Servidor do React.
* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram convidados no [podcast JSParty](https://jsparty.fm/267) e compartilharam suas opiniões sobre o futuro do React.

Agradecemos a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), e [Sophie Alpert](https://twitter.com/sophiebits) pela revisão desta postagem.

Obrigado por ler e até a próxima atualização!