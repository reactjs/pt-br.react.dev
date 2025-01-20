---
title: "React Labs: No que temos trabalhado – Março de 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, e Andrew Clark
date: 2023/03/22
description: Em posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar o que aprendemos.
---

22 de março de 2023 por [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Em posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativo. Fizemos progressos significativos desde nossa [última atualização](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e gostaríamos de compartilhar o que aprendemos.

</Intro>

---

## React Server Components {/*react-server-components*/}

React Server Components (ou RSC) é uma nova arquitetura de aplicação projetada pela equipe do React.

Compartilhamos nossa pesquisa sobre RSC pela primeira vez em uma [palestra introdutória](/blog/2020/12/21/data-fetching-with-react-server-components) e um [RFC](https://github.com/reactjs/rfcs/pull/188). Para recapitular, estamos introduzindo um novo tipo de componente — Componentes de Servidor — que são executados antecipadamente e estão excluídos do seu pacote JavaScript. Componentes de Servidor podem ser executados durante a construção, permitindo que você leia do sistema de arquivos ou busque conteúdo estático. Eles também podem ser executados no servidor, permitindo que você acesse sua camada de dados sem a necessidade de construir uma API. Você pode passar dados por props de Componentes de Servidor para os Componentes de Cliente interativos no navegador.

RSC combina o simples modelo mental de "request/response" de Aplicações Multi-Páginas centradas no servidor com a interatividade contínua de Aplicações de Página Única centradas no cliente, oferecendo o melhor dos dois mundos.

Desde nossa última atualização, mesclamos o [RFC de Componentes de Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) para ratificar a proposta. Resolvemos questões pendentes com a proposta de [Convenções de Módulos de Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) e alcançamos um consenso com nossos parceiros para adotar a convenção `"use client"`. Esses documentos também atuam como especificação do que uma implementação compatível com RSC deve suportar.

A maior mudança é que introduzimos [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) como a principal forma de fazer a busca de dados a partir de Componentes de Servidor. Também planejamos suportar o carregamento de dados a partir do cliente ao introduzir um novo Hook chamado `use`, que desvencilha Promises. Embora não possamos suportar `async / await` em componentes arbitrários em aplicativos apenas de cliente, planejamos adicionar suporte a isso ao estruturar seu aplicativo apenas de cliente de forma semelhante à como os aplicativos RSC são estruturados.

Agora que temos a busca de dados bem resolvida, estamos explorando a outra direção: enviar dados do cliente para o servidor, de forma que você possa executar mutações em bancos de dados e implementar formulários. Estamos fazendo isso permitindo que você passe funções de Ações de Servidor através da fronteira servidor/cliente, que o cliente pode então chamar, fornecendo RPC contínuo. Ações de Servidor também oferecem formulários progressivamente aprimorados antes que o JavaScript carregue.

Os Componentes de Servidor do React foram lançados no [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router). Isso demonstra uma integração profunda de um roteador que realmente adota RSC como um primitivo, mas não é a única maneira de construir um roteador e framework compatível com RSC. Há uma separação clara para os recursos fornecidos pela especificação RSC e a implementação. Componentes de Servidor do React destinam-se a ser uma especificação para componentes que funcionam em frameworks React compatíveis.

Recomendamos geralmente o uso de um framework existente, mas se você precisar construir seu próprio framework personalizado, é possível. Construir seu próprio framework compatível com RSC não é tão fácil quanto gostaríamos que fosse, principalmente devido à profunda integração necessária com o bundler. A geração atual de bundlers é ótima para uso no cliente, mas não foi projetada com suporte de primeira classe para dividir um único gráfico de módulo entre o servidor e o cliente. É por isso que agora estamos colaborando diretamente com desenvolvedores de bundler para obter os primitivos para RSC incorporados.

## Carregamento de Ativos {/*asset-loading*/}

[Suspense](/reference/react/Suspense) permite que você especifique o que exibir na tela enquanto os dados ou o código para seus componentes ainda estão sendo carregados. Isso permite que seus usuários vejam progressivamente mais conteúdo enquanto a página está carregando, assim como durante as navegações do roteador que carregam mais dados e código. No entanto, sob a perspectiva do usuário, o carregamento de dados e a renderização não contam toda a história ao considerar se novo conteúdo está pronto. Por padrão, os navegadores carregam folhas de estilo, fontes e imagens de forma independente, o que pode levar a saltos na UI e sucessivas mudanças de layout.

Estamos trabalhando para integrar totalmente o Suspense com o ciclo de carregamento de folhas de estilo, fontes e imagens, para que o React os considere para determinar se o conteúdo está pronto para ser exibido. Sem qualquer alteração na forma como você escreve seus componentes React, as atualizações se comportarão de uma maneira mais coerente e agradável. Como uma otimização, também forneceremos uma maneira manual de pré-carregar ativos como fontes diretamente dos componentes.

Atualmente estamos implementando esses recursos e teremos mais a compartilhar em breve.

## Metadados do Documento {/*document-metadata*/}

Diferentes páginas e telas em seu aplicativo podem ter metadados diferentes, como a tag `<title>`, descrição e outras tags `<meta>` específicas para esta tela. Do ponto de vista da manutenção, é mais escalável manter essa informação próxima ao componente React para aquela página ou tela. No entanto, as tags HTML para esses metadados precisam estar no `<head>` do documento, que é tipicamente renderizado em um componente na raiz do seu aplicativo.

Hoje, as pessoas resolvem esse problema com uma das duas técnicas.

Uma técnica é renderizar um componente de terceiros especial que move `<title>`, `<meta>`, e outras tags dentro dele para o `<head>` do documento. Isso funciona para os principais navegadores, mas existem muitos clientes que não executam JavaScript no lado do cliente, como parseadores Open Graph, e portanto essa técnica não é universalmente adequada.

Outra técnica é renderizar a página no servidor em duas partes. Primeiro, o conteúdo principal é renderizado e todas essas tags são coletadas. Em seguida, o `<head>` é renderizado com essas tags. Por fim, o `<head>` e o conteúdo principal são enviados para o navegador. Essa abordagem funciona, mas impede que você tire proveito do [Renderizador de Streaming do React 18](/reference/react-dom/server/renderToReadableStream) porque você teria que esperar todo o conteúdo ser renderizado antes de enviar o `<head>`.

É por isso que estamos adicionando suporte interno para renderizar `<title>`, `<meta>`, e tags de metadados `<link>` em qualquer lugar na sua árvore de componentes por padrão. Funcionará da mesma forma em todos os ambientes, incluindo código totalmente no lado do cliente, SSR e, no futuro, RSC. Compartilharemos mais detalhes sobre isso em breve.

## Compilador de Otimização do React {/*react-optimizing-compiler*/}

Desde nossa atualização anterior, temos iterado ativamente no design do [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), um compilador de otimização para o React. Já falamos sobre isso como um "compilador de auto-memoização", e isso é verdade em certo sentido. Mas construir o compilador nos ajudou a entender ainda mais profundamente o modelo de programação do React. Uma maneira melhor de entender o React Forget é como um compilador automático de *reatividade*.

A ideia central do React é que os desenvolvedores definem sua UI como uma função do estado atual. Você trabalha com valores JavaScript comuns — números, strings, arrays, objetos — e usa idiomas padrão do JavaScript — if/else, for, etc — para descrever a lógica do seu componente. O modelo mental é que o React re-renderiza sempre que o estado da aplicação muda. Acreditamos que esse modelo mental simples e a proximidade com as semânticas do JavaScript é um princípio importante no modelo de programação do React.

O problema é que o React pode às vezes ser *demais* reativo: ele pode re-renderizar em excesso. Por exemplo, no JavaScript não temos maneiras baratas de comparar se dois objetos ou arrays são equivalentes (tendo as mesmas chaves e valores), portanto, criar um novo objeto ou array a cada renderização pode fazer com que o React faça mais trabalho do que realmente precisa. Isso significa que os desenvolvedores têm que memoizar componentes explicitamente para não reagir em excesso às mudanças.

Nosso objetivo com o React Forget é garantir que os aplicativos React tenham a quantidade certa de reatividade por padrão: que os aplicativos re-renderizem apenas quando os valores do estado *mudarem de forma significativa*. Do ponto de vista da implementação, isso significa memoizar automaticamente, mas acreditamos que o enquadramento da reatividade é uma maneira melhor de entender o React e o Forget. Uma maneira de pensar sobre isso é que o React atualmente re-renderiza quando a identidade do objeto muda. Com o Forget, o React re-renderiza quando o valor semântico muda — mas sem incorrer no custo em tempo de execução de comparações profundas.

Em termos de progresso concreto, desde nossa última atualização, iteramos substancialmente no design do compilador para alinhar com essa abordagem de reatividade automática e incorporar feedback do uso do compilador internamente. Após algumas refatorações significativas no compilador a partir do final do ano passado, agora começamos a usar o compilador em produção em áreas limitadas na Meta. Planejamos torná-lo de código aberto assim que tivermos comprovado sua eficácia em produção.

Por fim, muitas pessoas expressaram interesse em como o compilador funciona. Estamos ansiosos para compartilhar muito mais detalhes quando comprovarmos o compilador e o tornarmos de código aberto. Mas há algumas informações que podemos compartilhar agora:

O núcleo do compilador está quase completamente desacoplado do Babel, e a API central do compilador é (aproximadamente) antigo AST entrando, novo AST saindo (mantendo os dados de localização da fonte). Por trás das câmeras, usamos uma representação de código e um pipeline de transformação personalizados para realizar uma análise semântica de baixo nível. No entanto, a principal interface pública para o compilador será através do Babel e outros plugins do sistema de construção. Para facilitar os testes, atualmente temos um plugin do Babel que é um wrapper muito fino que chama o compilador para gerar uma nova versão de cada função e trocá-la.

À medida que refatoramos o compilador nos últimos meses, queríamos nos concentrar em refinar o modelo de compilação central para garantir que pudéssemos lidar com complexidades, como condicionais, loops, reatribuição e mutação. No entanto, o JavaScript tem muitas maneiras de expressar cada uma dessas características: if/else, ternários, for, for-in, for-of, etc. Tentar suportar toda a linguagem desde o início teria atrasado o momento em que poderíamos validar o modelo central. Em vez disso, começamos com um subconjunto pequeno, mas representativo da linguagem: let/const, if/else, loops for, objetos, arrays, primitivos, chamadas de função e algumas outras características. À medida que ganhamos confiança no modelo central e refinamos nossas abstrações internas, expandimos o subconjunto de linguagem suportado. Também somos explícitos sobre a sintaxe que ainda não suportamos, registrando diagnósticos e pulando a compilação para entradas não suportadas. Temos utilitários para experimentar o compilador nas bases de código da Meta e ver quais recursos não suportados são mais comuns para que possamos priorizá-los a seguir. Continuaremos expandindo incrementalmente para suportar toda a linguagem.

Tornar o JavaScript comum em componentes React reativo requer um compilador com uma compreensão profunda das semânticas para que ele possa entender exatamente o que o código está fazendo. Ao adotar essa abordagem, estamos criando um sistema para reatividade dentro do JavaScript que permite que você escreva código de produto de qualquer complexidade com toda a expressividade da linguagem, em vez de ser limitado a uma linguagem específica de domínio.

## Renderização Offscreen {/*offscreen-rendering*/}

A renderização offscreen é uma capacidade futura no React para renderizar telas em segundo plano sem carga adicional de desempenho. Você pode pensar nisso como uma versão da propriedade CSS [`content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) que funciona não apenas para elementos do DOM, mas também para componentes React. Durante nossa pesquisa, descobrimos uma variedade de casos de uso:

- Um roteador pode pré-renderizar telas em segundo plano para que, quando um usuário navega até elas, estejam instantaneamente disponíveis.
- Um componente de troca de aba pode preservar o estado de abas ocultas, permitindo que o usuário troque entre elas sem perder seu progresso.
- Um componente de lista virtualizada pode pré-renderizar linhas adicionais acima e abaixo da janela visível.
- Ao abrir um modal ou popup, o restante do aplicativo pode ser colocado em modo "background", de forma que eventos e atualizações sejam desativados para tudo, exceto para o modal.

A maioria dos desenvolvedores React não interagirá com as APIs offscreen do React diretamente. Em vez disso, a renderização offscreen será integrada em coisas como roteadores e bibliotecas de UI, e, em seguida, os desenvolvedores que usam essas bibliotecas se beneficiarão automaticamente sem trabalho adicional.

A ideia é que você deve ser capaz de renderizar qualquer árvore React offscreen sem mudar a forma como você escreve seus componentes. Quando um componente é renderizado offscreen, ele não *monta* até que o componente se torne visível — seus efeitos não são acionados. Por exemplo, se um componente usa `useEffect` para registrar análises quando aparece pela primeira vez, a pré-renderização não comprometerá a precisão dessas análises. Da mesma forma, quando um componente vai para offscreen, seus efeitos também são desmontados. Um recurso chave da renderização offscreen é que você pode alternar a visibilidade de um componente sem perder seu estado.

Desde nossa última atualização, testamos uma versão experimental de pré-renderização internamente na Meta em nossos aplicativos React Native para Android e iOS, com resultados de desempenho positivos. Também melhoramos como a renderização offscreen funciona com o Suspense — suspender dentro de uma árvore offscreen não acionará os fallbacks do Suspense. Nosso trabalho restante envolve finalizar os primitivos que são expostos para os desenvolvedores de bibliotecas. Esperamos publicar um RFC ainda este ano, juntamente com uma API experimental para testes e feedback.

## Rastreio de Transição {/*transition-tracing*/}

A API de Rastreio de Transição permite que você detecte quando as [Transições React](/reference/react/useTransition) ficam mais lentas e investigue por que elas podem estar lentas. Após nossa última atualização, completamos o design inicial da API e publicamos um [RFC](https://github.com/reactjs/rfcs/pull/238). As capacidades básicas também foram implementadas. O projeto está atualmente em pausa. Agradecemos o feedback sobre o RFC e esperamos retomar seu desenvolvimento para fornecer uma ferramenta melhor de medição de desempenho para React. Isso será particularmente útil com roteadores construídos sobre Transições React, como o [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router).

* * *
Além dessa atualização, nossa equipe fez recentes aparições em podcasts e transmissões ao vivo da comunidade para falar mais sobre nosso trabalho e responder perguntas.

* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram entrevistados por [Kent C. Dodds em seu canal no YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), onde discutiram preocupações em torno dos Componentes de Servidor do React.
* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram convidados no [podcast JSParty](https://jsparty.fm/267) e compartilharam seus pensamentos sobre o futuro do React.

Agradecimentos a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), e [Sophie Alpert](https://twitter.com/sophiebits) por revisar este post.

Obrigado por ler e até a próxima atualização!