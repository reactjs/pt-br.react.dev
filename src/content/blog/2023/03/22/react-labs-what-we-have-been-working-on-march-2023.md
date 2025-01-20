---
title: "React Labs: No que temos trabalhado – Março de 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage e Andrew Clark
date: 2023/03/22
description: Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar o que aprendemos.
---

22 de março de 2023 por [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage) e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa [última atualização](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e gostaríamos de compartilhar o que aprendemos.

</Intro>

---

## React Server Components {/*react-server-components*/}

Os React Server Components (ou RSC) são uma nova arquitetura de aplicativo projetada pela equipe do React.

Compartilhamos pela primeira vez nossa pesquisa sobre RSC em uma [palestra introdutória](/blog/2020/12/21/data-fetching-with-react-server-components) e em um [RFC](https://github.com/reactjs/rfcs/pull/188). Para recapitular, estamos introduzindo um novo tipo de componente — Server Components — que são executados antes do tempo e são excluídos do seu pacote JavaScript. Os Server Components podem ser executados durante a construção, permitindo que você leia do sistema de arquivos ou busque conteúdo estático. Eles também podem ser executados no servidor, permitindo que você acesse sua camada de dados sem precisar construir uma API. Você pode passar dados por meio de props dos Server Components para os Client Components interativos no navegador.

O RSC combina o simples modelo mental de "requisição/resposta" de aplicativos Multi-Page centrados no servidor com a interatividade contínua dos aplicativos Single-Page centrados no cliente, proporcionando o melhor dos dois mundos.

Desde nossa última atualização, mesclamos o [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) para ratificar a proposta. Resolvemos questões pendentes com a proposta de [Convencões de Módulo do Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) e chegamos a um consenso com nossos parceiros para adotar a convenção `"use client"`. Esses documentos também servem como especificação para o que uma implementação compatível com RSC deve suportar.

A maior mudança é que introduzimos [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) como a principal maneira de fazer o fetching de dados a partir dos Server Components. Também planejamos suportar o carregamento de dados a partir do cliente, introduzindo um novo Hook chamado `use`, que desembrulha Promises. Embora não possamos suportar `async / await` em componentes arbitrários em aplicativos apenas do cliente, planejamos adicionar suporte a isso quando você estruturar seu aplicativo apenas do cliente de maneira semelhante a como os aplicativos RSC estão estruturados.

Agora que resolvemos bastante bem o problema de fetching de dados, estamos explorando a outra direção: enviar dados do cliente para o servidor, para que você possa executar mutações de banco de dados e implementar formulários. Estamos fazendo isso permitindo que você passe funções de Server Action através da fronteira servidor/cliente, que o cliente pode então chamar, proporcionando RPC sem costura. As Server Actions também fornecem formulários progressivamente aprimorados antes que o JavaScript seja carregado.

Os React Server Components foram implementados no [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router). Isso demonstra uma integração profunda de um roteador que realmente se aprofunda no RSC como uma primitiva, mas não é a única maneira de construir um roteador e um framework compatíveis com RSC. Há uma separação clara para os recursos fornecidos pela especificação e implementação do RSC. Os React Server Components são destinados a ser uma especificação para componentes que funcionam em frameworks React compatíveis.

Recomendamos em geral o uso de um framework existente, mas se você precisar construir seu próprio framework personalizado, isso é possível. Construir seu próprio framework compatível com RSC não é tão fácil quanto gostaríamos, principalmente devido à profunda integração do bundler necessária. A geração atual de bundlers funciona bem no lado do cliente, mas não foi projetada com suporte de primeira classe para dividir um único gráfico de módulos entre o servidor e o cliente. Por isso, estamos agora fazendo parceria diretamente com desenvolvedores de bundler para obter as primitivas para RSC integradas.

## Carregamento de Ativos {/*asset-loading*/}

[A Suspense](/reference/react/Suspense) permite que você especifique o que exibir na tela enquanto os dados ou o código para seus componentes ainda estão sendo carregados. Isso permite que seus usuários vejam progressivamente mais conteúdo enquanto a página está carregando, bem como durante as navegações do roteador que carregam mais dados e código. No entanto, do ponto de vista do usuário, o carregamento de dados e a renderização não contam toda a história ao considerar se um novo conteúdo está pronto. Por padrão, os navegadores carregam folhas de estilo, fontes e imagens de forma independente, o que pode levar a saltos na IU e mudanças consecutivas de layout.

Estamos trabalhando para integrar completamente a Suspense com o ciclo de carregamento de folhas de estilo, fontes e imagens, para que o React os leve em consideração ao determinar se o conteúdo está pronto para ser exibido. Sem qualquer alteração na maneira como você autor seus componentes React, as atualizações se comportarão de maneira mais coerente e agradável. Como uma otimização, também forneceremos uma maneira manual de pré-carregar ativos como fontes diretamente dos componentes.

Atualmente, estamos implementando esses recursos e teremos mais novidades em breve.

## Metadados do Documento {/*document-metadata*/}

Diferentes páginas e telas em seu aplicativo podem ter metadados diferentes, como a tag `<title>`, descrição e outras tags `<meta>` específicas para esta tela. Do ponto de vista de manutenção, é mais escalável manter essas informações próximas do componente React para aquela página ou tela. No entanto, as tags HTML para esses metadados precisam estar no `<head>` do documento, que geralmente é renderizado em um componente na raiz do seu aplicativo.

Hoje, as pessoas resolvem esse problema com uma das duas técnicas.

Uma técnica é renderizar um componente de terceiros especial que move `<title>`, `<meta>` e outras tags dentro dele para o `<head>` do documento. Isso funciona para os principais navegadores, mas há muitos clientes que não executam JavaScript do lado do cliente, como os analisadores de Open Graph, portanto, essa técnica não é universalmente adequada.

Outra técnica é renderizar o servidor da página em duas partes. Primeiro, o conteúdo principal é renderizado e todas essas tags são coletadas. Em seguida, o `<head>` é renderizado com essas tags. Finalmente, o `<head>` e o conteúdo principal são enviados para o navegador. Essa abordagem funciona, mas impede que você aproveite o [Renderizador de Servidor de Streaming do React 18](/reference/react-dom/server/renderToReadableStream) porque você teria que esperar todos os conteúdos serem renderizados antes de enviar o `<head>`.

Por isso, estamos adicionando suporte integrado para renderizar tags `<title>`, `<meta>` e `<link>` de metadados em qualquer lugar na sua árvore de componentes diretamente. Isso funcionará da mesma maneira em todos os ambientes, incluindo código totalmente do lado do cliente, SSR e, no futuro, RSC. Compartilharemos mais detalhes sobre isso em breve.

## Compilador Otimizador do React {/*react-optimizing-compiler*/}

Desde nossa atualização anterior, temos iterado ativamente no design do [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), um compilador otimizador para o React. Já falamos sobre ele como um "compilador automático de memorização", e isso é verdade em certo sentido. Mas construir o compilador nos ajudou a compreender ainda mais profundamente o modelo de programação do React. Uma maneira melhor de entender o React Forget é como um compilador automático de *reatividade*.

A ideia central do React é que os desenvolvedores definem sua IU como uma função do estado atual. Você trabalha com valores JavaScript simples — números, strings, arrays, objetos — e usa idiomatismos padrão do JavaScript — if/else, for, etc. — para descrever a lógica do seu componente. O modelo mental é que o React re-renderiza sempre que o estado da aplicação muda. Acreditamos que esse modelo mental simples e a proximidade com a semântica do JavaScript é um princípio importante no modelo de programação do React.

A questão é que o React às vezes pode ser *demais* reativo: pode re-renderizar demais. Por exemplo, em JavaScript não temos maneiras baratas de comparar se dois objetos ou arrays são equivalentes (tendo as mesmas chaves e valores), então criar um novo objeto ou array a cada renderização pode fazer com que o React trabalhe mais do que realmente precisa. Isso significa que os desenvolvedores têm que memorizá-los explicitamente para não reagir em demasia às mudanças.

Nosso objetivo com o React Forget é garantir que os aplicativos React tenham a quantidade certa de reatividade por padrão: que os aplicativos re-renderizem apenas quando valores de estado mudam *significativamente*. Do ponto de vista de implementação, isso significa memorização automática, mas acreditamos que a formulação de reatividade é uma maneira melhor de entender o React e o Forget. Uma maneira de pensar sobre isso é que o React atualmente re-renderiza quando a identidade do objeto muda. Com o Forget, o React re-renderiza quando o valor semântico muda — mas sem incorrer no custo de tempo de execução de comparações profundas.

Em termos de progresso concreto, desde nossa última atualização, iteramos substancialmente sobre o design do compilador para alinhar com essa abordagem de reatividade automática e incorporar feedback do uso interno do compilador. Após algumas refatorações significativas no compilador no final do ano passado, agora começamos a usar o compilador em produção em áreas limitadas na Meta. Planejamos tornar isso open source assim que tivermos provado sua eficácia em produção.

Finalmente, muitas pessoas expressaram interesse em como o compilador funciona. Estamos ansiosos para compartilhar mais detalhes quando provarmos o compilador e o tornarmos open source. Mas há alguns pontos que podemos compartilhar agora:

O núcleo do compilador está quase completamente desacoplado do Babel, e a API do compilador é (aproximadamente) AST antigo como entrada, novo AST como saída (mantendo os dados de localização de origem). Nos bastidores, usamos uma representação de código personalizada e um pipeline de transformação para realizar uma análise semântica de baixo nível. No entanto, a interface pública principal do compilador será através do Babel e de outros plugins do sistema de compilação. Para facilitar os testes, atualmente temos um plugin do Babel que é uma camada muito fina que chama o compilador para gerar uma nova versão de cada função e trocá-la.

À medida que refatoramos o compilador nos últimos meses, queríamos focar em refinar o modelo de compilação central para garantir que pudéssemos lidar com complexidades, como condicionais, loops, reatribuição e mutação. No entanto, o JavaScript possui muitas maneiras de expressar cada uma dessas características: if/else, ternários, for, for-in, for-of, etc. Tentar suportar a linguagem completa desde o início teria atrasado o ponto em que poderíamos validar o modelo central. Em vez disso, começamos com um subconjunto pequeno, mas representativo da linguagem: let/const, if/else, loops for, objetos, arrays, primitivos, chamadas de função e algumas outras características. À medida que ganhamos confiança no modelo central e refinamos nossas abstrações internas, expandimos o subconjunto da linguagem suportada. Também somos explícitos sobre a sintaxe que ainda não suportamos, registrando diagnósticos e ignorando a compilação para entradas não suportadas. Temos utilitários para testar o compilador nos códigos da Meta e ver quais recursos não suportados são mais comuns, para que possamos priorizar esses recursos em seguida. Continuaremos expandindo gradualmente para suportar toda a linguagem.

Fazer JavaScript simples nos componentes React reativos exige um compilador com uma compreensão profunda das semânticas, para que ele possa entender exatamente o que o código está fazendo. Ao seguir essa abordagem, estamos criando um sistema de reatividade dentro do JavaScript que permite que você escreva código de produto de qualquer complexidade com a total expressividade da linguagem, em vez de ser limitado a uma linguagem específica do domínio.

## Renderização Offscreen {/*offscreen-rendering*/}

A renderização offscreen é uma capacidade futura no React para renderizar telas em segundo plano sem sobrecarga adicional de desempenho. Você pode pensá-la como uma versão da propriedade CSS [`content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) que funciona não apenas para elementos do DOM, mas também para componentes React. Durante nossa pesquisa, descobrimos uma variedade de casos de uso:

- Um roteador pode pré-renderizar telas em segundo plano para que, quando um usuário navegar para elas, elas estejam instantaneamente disponíveis.
- Um componente de mudança de aba pode preservar o estado das abas ocultas, permitindo que o usuário alterne entre elas sem perder seu progresso.
- Um componente de lista virtualizada pode pré-renderizar linhas adicionais acima e abaixo da janela visível.
- Ao abrir um modal ou popup, o restante do aplicativo pode ser colocado em modo "background", de modo que eventos e atualizações sejam desativados para tudo, exceto para o modal.

A maioria dos desenvolvedores React não interagirá diretamente com as APIs offscreen do React. Em vez disso, a renderização offscreen será integrada a coisas como roteadores e bibliotecas de IU, e, assim, os desenvolvedores que usam essas bibliotecas se beneficiarão automaticamente sem trabalho adicional.

A ideia é que você deve ser capaz de renderizar qualquer árvore React offscreen sem mudar a maneira como escreve seus componentes. Quando um componente é renderizado offscreen, ele não *monta* realmente até que o componente se torne visível — seus efeitos não são acionados. Por exemplo, se um componente usa `useEffect` para registrar análises quando aparece pela primeira vez, a pré-renderização não prejudicará a precisão dessas análises. Da mesma forma, quando um componente sai da tela, seus efeitos também são desmontados. Um recurso chave da renderização offscreen é que você pode alternar a visibilidade de um componente sem perder seu estado.

Desde nossa última atualização, testamos uma versão experimental de pré-renderização internamente na Meta em nossos aplicativos React Native no Android e iOS, com resultados de desempenho positivos. Também melhoramos como a renderização offscreen funciona com a Suspense — suspender dentro de uma árvore offscreen não acionará os fallback da Suspense. Nossa tarefa restante envolve a finalização das primitivas que serão expostas para desenvolvedores de bibliotecas. Esperamos publicar um RFC ainda este ano, juntamente com uma API experimental para testes e feedback.

## Rastreio de Transições {/*transition-tracing*/}

A API de Rastreio de Transições permite que você detecte quando [Transições do React](/reference/react/useTransition) se tornam mais lentas e investigue por que podem estar lentas. Após nossa última atualização, finalizamos o design inicial da API e publicamos um [RFC](https://github.com/reactjs/rfcs/pull/238). As capacidades básicas também foram implementadas. O projeto está atualmente suspenso. Agradecemos o feedback sobre o RFC e esperamos retomar seu desenvolvimento para fornecer uma ferramenta de medição de desempenho melhor para o React. Isso será particularmente útil com roteadores construídos sobre as Transições do React, como o [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router).

* * *
Além desta atualização, nossa equipe fez aparições recentes como convidados em podcasts da comunidade e transmissões ao vivo para falar mais sobre nosso trabalho e responder perguntas.

* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram entrevistados por [Kent C. Dodds em seu canal no YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), onde discutiram preocupações em torno dos React Server Components.
* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram convidados do [podcast JSParty](https://jsparty.fm/267) e compartilharam seus pensamentos sobre o futuro do React.

Agradecimentos a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster) e [Sophie Alpert](https://twitter.com/sophiebits) pela revisão deste post.

Obrigado por ler e até a próxima atualização!