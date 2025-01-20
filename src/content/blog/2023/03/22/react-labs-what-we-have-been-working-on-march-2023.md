---
title: "React Labs: No que estamos trabalhando – Março de 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, e Andrew Clark
date: 2023/03/22
description: Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progresso significativo neles desde a nossa última atualização e gostaríamos de compartilhar o que aprendemos.
---

22 de março de 2023 por [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Nas postagens do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progresso significativo neles desde nossa [última atualização](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e gostaríamos de compartilhar o que aprendemos.

</Intro>

---

## React Server Components {/*react-server-components*/}

Os React Server Components (ou RSC) são uma nova arquitetura de aplicação projetada pela equipe do React.

Compartilhamos pela primeira vez nossa pesquisa sobre RSC em uma [palestra introdutória](/blog/2020/12/21/data-fetching-with-react-server-components) e um [RFC](https://github.com/reactjs/rfcs/pull/188). Para recapitular, estamos introduzindo um novo tipo de componente--Componentes do Servidor--que são executados antes do tempo e são excluídos do seu bundle JavaScript. Os Componentes do Servidor podem ser executados durante a construção, permitindo que você leia do sistema de arquivos ou busque conteúdo estático. Eles também podem ser executados no servidor, permitindo que você acesse sua camada de dados sem precisar construir uma API. Você pode passar dados por props dos Componentes do Servidor para os Componentes Interativos do Cliente no navegador.

O RSC combina o simples modelo mental "solicitação/resposta" de aplicativos Multi-Página centrados em servidor com a interatividade sem costura dos aplicativos de Página Única centrados em cliente, oferecendo o melhor dos dois mundos.

Desde nossa última atualização, unimos o [RFC dos React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) para ratificar a proposta. Resolvemos questões pendentes com a proposta das [Convenções do Módulo do Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) e chegamos a um consenso com nossos parceiros para seguir a convenção `"use client"`. Esses documentos também atuam como especificação para o que uma implementação compatível com RSC deve suportar.

A maior mudança é que introduzimos [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) como a principal maneira de fazer a busca de dados a partir dos Componentes do Servidor. Também planejamos suportar o carregamento de dados do cliente introduzindo um novo Hook chamado `use` que desembrulha Promessas. Embora não possamos suportar `async / await` em componentes arbitrários em aplicativos apenas do cliente, planejamos adicionar suporte a isso quando você estruturar seu aplicativo apenas do cliente de maneira semelhante a como os aplicativos RSC são estruturados.

Agora que temos a busca de dados bem consolidada, estamos explorando a outra direção: enviar dados do cliente para o servidor, para que você possa executar mutações de banco de dados e implementar formulários. Estamos fazendo isso permitindo que você passe funções de Ação do Servidor através da fronteira servidor/cliente, que o cliente pode então chamar, proporcionando RPC sem costura. As Ações do Servidor também dão a você formulários progressivamente aprimorados antes que o JavaScript seja carregado.

Os Componentes do Servidor do React foram lançados no [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router). Isso demonstra uma integração profunda de um roteador que realmente adota o RSC como um primitivo, mas não é a única maneira de construir um roteador e framework compatíveis com RSC. Existe uma separação clara para as funcionalidades fornecidas pela especificação RSC e pela implementação. Os Componentes do Servidor do React são destinados a atuar como uma especificação para componentes que funcionam em frameworks compatíveis com o React.

Recomendamos geralmente o uso de um framework existente, mas se você precisar construir seu próprio framework personalizado, isso é possível. Construir seu próprio framework compatível com RSC não é tão fácil quanto gostaríamos, principalmente devido à integração profunda do bundler necessária. A geração atual de bundlers é ótima para uso no cliente, mas não foi projetada com suporte de primeira classe para dividir um único gráfico de módulo entre o servidor e o cliente. É por isso que agora estamos fazendo parceria diretamente com desenvolvedores de bundlers para que os primitivos para RSC sejam incorporados.

## Asset Loading {/*asset-loading*/}

[Suspense](/reference/react/Suspense) permite que você especifique o que exibir na tela enquanto os dados ou o código para seus componentes ainda estão sendo carregados. Isso permite que seus usuários vejam progressivamente mais conteúdo enquanto a página está sendo carregada, bem como durante as navegações do roteador que carregam mais dados e código. No entanto, da perspectiva do usuário, o carregamento de dados e a renderização não contam a história completa ao considerar se novo conteúdo está pronto. Por padrão, os navegadores carregam estilos, fontes e imagens de forma independente, o que pode levar a saltos na interface e mudanças consecutivas de layout.

Estamos trabalhando para integrar completamente o Suspense com o ciclo de vida de carregamento de estilos, fontes e imagens, de modo que o React os considere para determinar se o conteúdo está pronto para ser exibido. Sem qualquer mudança na maneira como você escreve seus componentes React, as atualizações se comportarão de forma mais coerente e satisfatória. Como uma otimização, também forneceremos uma maneira manual de pré-carregar ativos como fontes diretamente dos componentes.

Atualmente, estamos implementando esses recursos e teremos mais para compartilhar em breve.

## Document Metadata {/*document-metadata*/}

Diferentes páginas e telas em seu aplicativo podem ter metadados diferentes, como a tag `<title>`, descrição e outras tags `<meta>` específicas para esta tela. Do ponto de vista de manutenção, é mais escalável manter essas informações próximas ao componente React daquela página ou tela. No entanto, as tags HTML para esses metadados precisam estar no `<head>` do documento, que é normalmente renderizado em um componente na raiz do seu aplicativo.

Hoje, as pessoas resolvem esse problema com uma das duas técnicas.

Uma técnica é renderizar um componente especial de terceiros que move `<title>`, `<meta>` e outras tags dentro dele para o `<head>` do documento. Isso funciona para os principais navegadores, mas existem muitos clientes que não executam JavaScript do lado do cliente, como parsers do Open Graph, e assim, essa técnica não é universalmente adequada.

Outra técnica é renderizar o servidor a página em duas partes. Primeiro, o conteúdo principal é renderizado e todas essas tags são coletadas. Em seguida, o `<head>` é renderizado com essas tags. Finalmente, o `<head>` e o conteúdo principal são enviados para o navegador. Essa abordagem funciona, mas impede que você aproveite o [Renderizador de Streaming do React 18](/reference/react-dom/server/renderToReadableStream) porque você teria que esperar todo o conteúdo ser renderizado antes de enviar o `<head>`.

É por isso que estamos adicionando suporte embutido para renderizar as tags `<title>`, `<meta>` e as tags de metadados `<link>` em qualquer lugar na árvore de componentes de forma nativa. Funcionaria da mesma maneira em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e, no futuro, RSC. Compartilharemos mais detalhes sobre isso em breve.

## React Optimizing Compiler {/*react-optimizing-compiler*/}

Desde a nossa atualização anterior, temos iterado ativamente no design do [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), um compilador otimizado para React. Já falamos sobre isso como um "compilador de auto-memorização", e isso é verdade em certo sentido. Mas construir o compilador nos ajudou a entender ainda mais profundamente o modelo de programação do React. Uma maneira melhor de entender o React Forget é como um compilador automático de *reatividade*.

A ideia central do React é que os desenvolvedores definem sua interface do usuário como uma função do estado atual. Você trabalha com valores de JavaScript simples — números, strings, arrays, objetos — e usa idiomatismos padrão de JavaScript — if/else, for, etc — para descrever a lógica de seu componente. O modelo mental é que o React re-renderizará sempre que o estado da aplicação mudar. Acreditamos que esse modelo mental simples e a proximidade com a semântica do JavaScript são um princípio importante no modelo de programação do React.

O problema é que o React pode às vezes ser *demais* reativo: pode re-renderizar demais. Por exemplo, em JavaScript não temos maneiras baratas de comparar se dois objetos ou arrays são equivalentes (tendo as mesmas chaves e valores), então criar um novo objeto ou array em cada renderização pode fazer com que o React faça mais trabalho do que realmente precisa. Isso significa que os desenvolvedores têm que memorizar explicitamente componentes para não reagir excessivamente a mudanças.

Nosso objetivo com o React Forget é garantir que os aplicativos React tenham a quantidade certa de reatividade por padrão: que os aplicativos re-renderizem somente quando os valores de estado *mudam de forma significativa*. Do ponto de vista de implementação, isso significa memorização automática, mas acreditamos que a estrutura de reatividade é uma melhor forma de entender o React e o Forget. Uma maneira de pensar sobre isso é que o React atualmente re-renderiza quando a identidade do objeto muda. Com o Forget, o React re-renderiza quando o valor semântico muda — mas sem incorrer no custo de tempo de execução de comparações profundas.

Em termos de progresso concreto, desde nossa última atualização, iteramos substancialmente sobre o design do compilador para alinhar com essa abordagem de reatividade automática e incorporar feedback do uso do compilador internamente. Após algumas refatorações significativas do compilador começando no final do ano passado, agora começamos a usar o compilador em produção em áreas limitadas na Meta. Planejamos torná-lo de código aberto assim que o provamos em produção.

Finalmente, muitas pessoas expressaram interesse em como o compilador funciona. Estamos ansiosos para compartilhar muitos mais detalhes quando comprovamos o compilador e o tornamos de código aberto. Mas há algumas informações que podemos compartilhar agora:

O núcleo do compilador está quase completamente desacoplado do Babel, e a API central do compilador é (aproximadamente) antigo AST entra, novo AST sai (enquanto mantém os dados de localização do código). Por trás das cenas, usamos uma representação e um pipeline de transformação de código personalizados para realizar análise semântica de baixo nível. No entanto, a interface pública principal para o compilador será através do Babel e de outros plugins do sistema de construção. Para facilidade de teste, atualmente temos um plugin Babel que é um envoltório muito fino que chama o compilador para gerar uma nova versão de cada função e substituí-la.

À medida que refatoramos o compilador nos últimos meses, queríamos nos concentrar em refinar o modelo de compilação central para garantir que conseguimos lidar com complexidades como condicionais, loops, reatribuição e mutação. No entanto, o JavaScript tem muitas maneiras de expressar cada um desses recursos: if/else, ternários, for, for-in, for-of, etc. Tentar dar suporte ao conjunto completo da linguagem desde o início teria atrasado o ponto em que poderíamos validar o modelo central. Em vez disso, começamos com um subconjunto pequeno, mas representativo da linguagem: let/const, if/else, loops for, objetos, arrays, primitivos, chamadas de função e alguns outros recursos. À medida que ganhamos confiança no modelo central e refinamos nossas abstrações internas, ampliamos o subconjunto da linguagem suportada. Também somos explícitos sobre a sintaxe que ainda não suportamos, registrando diagnósticos e pulando a compilação para entradas não suportadas. Temos utilitários para testar o compilador nos códigos da Meta e ver quais recursos não suportados são os mais comuns, para que possamos priorizá-los a seguir. Continuaremos expandindo gradualmente para suportar toda a linguagem.

Tornar o JavaScript simples nos componentes do React reativo exige um compilador com uma profunda compreensão da semântica para que ele possa entender exatamente o que o código está fazendo. Ao adotar essa abordagem, estamos criando um sistema de reatividade dentro do JavaScript que permite que você escreva código de produto de qualquer complexidade com toda a expressividade da linguagem, em vez de ser limitado a uma linguagem específica de domínio.

## Offscreen Rendering {/*offscreen-rendering*/}

A renderização offscreen é uma capacidade futura no React para renderizar telas em segundo plano sem sobrecarga de desempenho adicional. Você pode pensar nisso como uma versão da propriedade CSS [`content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) que funciona não apenas para elementos DOM, mas também para componentes React. Durante nossa pesquisa, descobrimos uma variedade de casos de uso:

- Um roteador pode pré-renderizar telas em segundo plano para que, quando um usuário navega até elas, estejam instantaneamente disponíveis.
- Um componente de troca de abas pode preservar o estado das abas ocultas, para que o usuário possa alternar entre elas sem perder seu progresso.
- Um componente de lista virtualizada pode pré-renderizar linhas adicionais acima e abaixo da janela visível.
- Ao abrir um modal ou popup, o restante do aplicativo pode ser colocado em modo "fundo", de modo que eventos e atualizações sejam desativados para tudo, exceto o modal.

A maioria dos desenvolvedores React não interagirá diretamente com as APIs offscreen do React. Em vez disso, a renderização offscreen será integrada a coisas como roteadores e bibliotecas de UI, e então os desenvolvedores que usam essas bibliotecas se beneficiarão automaticamente sem trabalho adicional.

A ideia é que você deve ser capaz de renderizar qualquer árvore React offscreen sem mudar a maneira como você escreve seus componentes. Quando um componente é renderizado offscreen, ele não *monta* até que o componente se torne visível — seus efeitos não são disparados. Por exemplo, se um componente usa `useEffect` para registrar análises quando ele aparece pela primeira vez, a pré-renderização não bagunçará a precisão dessas análises. Da mesma forma, quando um componente vai para offscreen, seus efeitos também são desmontados. Uma característica chave da renderização offscreen é que você pode alternar a visibilidade de um componente sem perder seu estado.

Desde nossa última atualização, testamos uma versão experimental de pré-renderização internamente na Meta em nossos aplicativos React Native no Android e iOS, com resultados de desempenho positivos. Também melhoramos como a renderização offscreen funciona com o Suspense — suspender dentro de uma árvore offscreen não acionará as opções de fallback do Suspense. Nosso trabalho restante envolve finalizar os primitivos que são expostos aos desenvolvedores de bibliotecas. Esperamos publicar um RFC mais tarde este ano, juntamente com uma API experimental para testes e feedback.

## Transition Tracing {/*transition-tracing*/}

A API de Rastreio de Transições permite que você detecte quando as [Transições do React](/reference/react/useTransition) se tornam mais lentas e investigue por que podem estar lentas. Após nossa última atualização, concluímos o design inicial da API e publicamos um [RFC](https://github.com/reactjs/rfcs/pull/238). As capacidades básicas também foram implementadas. O projeto está atualmente pausado. Agradecemos o feedback sobre o RFC e esperamos retomar seu desenvolvimento para fornecer uma melhor ferramenta de medição de desempenho para o React. Isso será particularmente útil com roteadores construídos sobre as Transições do React, como o [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router).

* * *
Além dessa atualização, nossa equipe tem feito aparições recentes em podcasts e transmissões ao vivo da comunidade para falar mais sobre nosso trabalho e responder perguntas.

* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram entrevistados por [Kent C. Dodds em seu canal no YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), onde discutiram preocupações em torno dos Componentes do Servidor do React.
* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram convidados no [podcast JSParty](https://jsparty.fm/267) e compartilharam seus pensamentos sobre o futuro do React.

Agradecemos a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster) e [Sophie Alpert](https://twitter.com/sophiebits) pela revisão desta postagem.

Obrigado por ler e até a próxima atualização!