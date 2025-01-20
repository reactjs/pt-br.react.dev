---
title: "React Labs: No que Estamos Trabalhando – Março de 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, e Andrew Clark
date: 2023/03/22
description: Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativos. Fizemos progressos significativos desde nossa última atualização e gostaríamos de compartilhar o que aprendemos.
---

22 de março de 2023 por [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), e [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Nos posts do React Labs, escrevemos sobre projetos em pesquisa e desenvolvimento ativos. Fizemos progressos significativos desde nossa [última atualização](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) e gostaríamos de compartilhar o que aprendemos.

</Intro>

---

## React Server Components {/*react-server-components*/}

React Server Components (ou RSC) é uma nova arquitetura de aplicativo projetada pela equipe do React.

Primeiramente, compartilhamos nossa pesquisa sobre RSC em uma [palestra introdutória](/blog/2020/12/21/data-fetching-with-react-server-components) e em uma [RFC](https://github.com/reactjs/rfcs/pull/188). Para recapitular, estamos introduzindo um novo tipo de componente—Componentes de Servidor—que são executados antecipadamente e são excluídos do seu pacote JavaScript. Componentes de Servidor podem ser executados durante a construção, permitindo que você leia do sistema de arquivos ou busque conteúdo estático. Eles também podem ser executados no servidor, permitindo que você acesse sua camada de dados sem precisar construir uma API. Você pode passar dados por meio de props de Componentes de Servidor para os Componentes Interativos do Cliente no navegador.

RSC combina o simples modelo mental de "requisição/resposta" de Aplicativos Multi-Página centrados no servidor com a interatividade fluida de Aplicativos de Página Única centrados no cliente, oferecendo o melhor dos dois mundos.

Desde nossa última atualização, nós mesclamos a [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) para ratificar a proposta. Resolvemos questões pendentes com a proposta das [Convensões de Módulo do Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) e chegamos a um consenso com nossos parceiros para adotar a convenção `"use client"`. Esses documentos também atuam como especificação para o que uma implementação compatível com RSC deve suportar.

A maior mudança é que introduzimos [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) como a principal maneira de fazer a busca de dados a partir de Componentes de Servidor. Também planejamos suportar o carregamento de dados do cliente introduzindo um novo Hook chamado `use` que desembrulha Promises. Embora não possamos suportar `async / await` em componentes arbitrários em aplicativos somente do cliente, planejamos adicionar suporte para isso quando você estruturar seu aplicativo somente do cliente de forma semelhante a como os aplicativos RSC são estruturados.

Agora que temos a busca de dados bem resolvida, estamos explorando a outra direção: enviar dados do cliente para o servidor, para que você possa executar mutações de banco de dados e implementar formulários. Estamos fazendo isso permitindo que você passe funções de Ação do Servidor por meio da fronteira servidor/cliente, que o cliente pode então chamar, proporcionando RPC contínuo. Ações do Servidor também oferecem formulários progressivamente aprimorados antes que o JavaScript carregue.

React Server Components foi lançado no [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router). Isso demonstra uma profunda integração de um roteador que realmente adota RSC como uma primitiva, mas não é a única maneira de construir um roteador e framework compatíveis com RSC. Há uma separação clara para os recursos fornecidos pela especificação RSC e a implementação. React Server Components é destinado como uma especificação para componentes que funcionam em frameworks React compatíveis.

Geralmente, recomendamos o uso de um framework existente, mas se você precisar construir seu próprio framework personalizado, isso é possível. Construir seu próprio framework compatível com RSC não é tão fácil quanto gostaríamos que fosse, principalmente devido à profunda integração do empacotador necessária. A geração atual de empacotadores é ótima para uso no cliente, mas não foi projetada com suporte de primeira classe para dividir um único gráfico de módulo entre o servidor e o cliente. É por isso que agora estamos nos associando diretamente com os desenvolvedores de empacotadores para obter as primitivas para RSC incorporadas.

## Carregamento de Ativos {/*asset-loading*/}

[Suspense](/reference/react/Suspense) permite que você especifique o que exibir na tela enquanto os dados ou o código para seus componentes ainda estão sendo carregados. Isso permite que seus usuários vejam progressivamente mais conteúdo enquanto a página está carregando, assim como durante as navegações do roteador que carregam mais dados e código. No entanto, da perspectiva do usuário, o carregamento de dados e a renderização não contam toda a história ao considerar se o novo conteúdo está pronto. Por padrão, os navegadores carregam folhas de estilo, fontes e imagens de forma independente, o que pode levar a saltos na UI e mudanças de layout consecutivas.

Estamos trabalhando para integrar completamente o Suspense com o ciclo de carregamento de folhas de estilo, fontes e imagens, para que o React os leve em consideração para determinar se o conteúdo está pronto para ser exibido. Sem qualquer alteração na maneira como você cria seus componentes React, as atualizações se comportarão de uma maneira mais coerente e agradável. Como uma otimização, também forneceremos uma maneira manual de pré-carregar ativos como fontes diretamente dos componentes.

Atualmente, estamos implementando esses recursos e teremos mais para compartilhar em breve.

## Metadados do Documento {/*document-metadata*/}

Diferentes páginas e telas em seu aplicativo podem ter metadados diferentes, como a tag `<title>`, descrição e outras tags `<meta>` específicas para essa tela. Do ponto de vista de manutenção, é mais escalável manter essa informação próxima ao componente React para essa página ou tela. No entanto, as tags HTML para esses metadados precisam estar no `<head>` do documento, que geralmente é renderizado em um componente na raiz de seu aplicativo.

Hoje em dia, as pessoas resolvem esse problema com uma das duas técnicas.

Uma técnica é renderizar um componente especial de terceiros que move `<title>`, `<meta>` e outras tags contidas dentro dele para o `<head>` do documento. Isso funciona para os principais navegadores, mas há muitos clientes que não executam JavaScript do lado do cliente, como analisadores Open Graph, e assim, essa técnica não é universalmente adequada.

A outra técnica é renderizar o servidor a página em duas partes. Primeiro, o conteúdo principal é renderizado e todas essas tags são coletadas. Então, o `<head>` é renderizado com essas tags. Finalmente, o `<head>` e o conteúdo principal são enviados ao navegador. Essa abordagem funciona, mas impede que você aproveite o [React 18's Streaming Server Renderer](/reference/react-dom/server/renderToReadableStream) porque você teria que esperar todo o conteúdo ser renderizado antes de enviar o `<head>`.

É por isso que estamos adicionando suporte embutido para renderizar tags `<title>`, `<meta>` e tags de metadados `<link>` em qualquer lugar da sua árvore de componentes de forma nativa. Isso funcionará da mesma forma em todos os ambientes, incluindo código totalmente do lado do cliente, SSR, e no futuro, RSC. Compartilharemos mais detalhes sobre isso em breve.

## Compilador Otimizador do React {/*react-optimizing-compiler*/}

Desde nossa atualização anterior, estivemos iterando ativamente no design do [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), um compilador otimizador para o React. Já falamos sobre isso como um "compilador auto-memoizável", e isso é verdadeiro em certo sentido. Mas construir o compilador nos ajudou a entender ainda mais profundamente o modelo de programação do React. Uma maneira melhor de entender o React Forget é como um compilador automático de *reatividade*.

A ideia central do React é que os desenvolvedores definem sua UI como uma função do estado atual. Você trabalha com valores JavaScript simples — números, strings, arrays, objetos — e usa idioms padrão de JavaScript — if/else, for, etc — para descrever sua lógica de componente. O modelo mental é que o React re-renderiza sempre que o estado da aplicação muda. Acreditamos que esse modelo mental simples e a proximidade com a semântica do JavaScript é um princípio importante no modelo de programação do React.

O problema é que o React pode ser *demais* reativo: pode re-renderizar demais. Por exemplo, em JavaScript não temos maneiras baratas de comparar se dois objetos ou arrays são equivalentes (tendo as mesmas chaves e valores), então criar um novo objeto ou array a cada renderização pode fazer com que o React faça mais trabalho do que realmente precisa. Isso significa que os desenvolvedores têm que memoizar explicitamente os componentes para não reagir demais às mudanças.

Nosso objetivo com o React Forget é garantir que os aplicativos React tenham a quantidade certa de reatividade por padrão: que os aplicativos re-renderizem apenas quando os valores de estado *mudarem significativamente*. De uma perspectiva de implementação, isso significa memoização automática, mas acreditamos que a abordagem de reatividade é uma maneira melhor de entender o React e o Forget. Uma maneira de pensar sobre isso é que o React atualmente re-renderiza quando a identidade do objeto muda. Com o Forget, o React re-renderiza quando o valor semântico muda — mas sem incorrer no custo de tempo de execução de comparações profundas.

Em termos de progresso concreto, desde nossa última atualização, iteramos substancialmente no design do compilador para alinhar com essa abordagem automática de reatividade e incorporar feedback do uso do compilador internamente. Após algumas refatorações significativas do compilador começando no final do ano passado, agora começamos a usar o compilador em produção em áreas limitadas na Meta. Planejamos open-source assim que tivermos provado em produção.

Finalmente, muitas pessoas expressaram interesse em como o compilador funciona. Estamos ansiosos para compartilhar muitos mais detalhes quando provarmos o compilador e o tornarmos open-source. Mas existem algumas informações que podemos compartilhar agora:

O núcleo do compilador está quase completamente desacoplado do Babel, e a API do compilador é (aproximadamente) AST antigo como entrada, novo AST como saída (mantendo os dados de localização de origem). Nos bastidores, usamos uma representação e pipeline de transformação de código personalizados para realizar uma análise semântica de baixo nível. No entanto, a interface pública primária para o compilador será por meio do Babel e outros plugins do sistema de build. Para facilitar os testes, atualmente temos um plugin Babel que é uma embalagem muito fina que chama o compilador para gerar uma nova versão de cada função e substituí-la.

À medida que refatoramos o compilador nos últimos meses, queríamos focar em refinar o modelo de compilação central para garantir que pudéssemos lidar com complexidades como condicionais, loops, reatribuição e mutação. No entanto, o JavaScript tem muitas maneiras de expressar cada um desses recursos: if/else, ternários, for, for-in, for-of, etc. Tentar suportar toda a linguagem de antemão teria atrasado o momento em que poderíamos validar o modelo central. Em vez disso, começamos com um subconjunto pequeno, mas representativo da linguagem: let/const, if/else, loops for, objetos, arrays, primitivos, chamadas de função, e alguns outros recursos. À medida que ganhamos confiança no modelo central e refinamos nossas abstrações internas, expandimos o subconjunto da linguagem suportada. Também somos explícitos sobre a sintaxe que ainda não suportamos, registrando diagnósticos e pulando a compilação para entradas não suportadas. Temos utilitários para experimentar o compilador nas bases de código da Meta e ver quais recursos não suportados são os mais comuns para que possamos priorizá-los a seguir. Continuaremos expandindo gradualmente em direção ao suporte de toda a linguagem.

Fazer JavaScript simples em componentes React reativo requer um compilador com uma compreensão profunda das semânticas para que possa entender exatamente o que o código está fazendo. Ao adotar essa abordagem, estamos criando um sistema para reatividade dentro do JavaScript que permite que você escreva código de produção de qualquer complexidade com toda a expressividade da linguagem, em vez de ser limitado a uma linguagem específica de domínio.

## Renderização Offscreen {/*offscreen-rendering*/}

A renderização offscreen é uma capacidade futura no React para renderizar telas em segundo plano sem sobrecarga de desempenho adicional. Você pode pensar nisso como uma versão da propriedade CSS [`content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) que funciona não apenas para elementos do DOM, mas também para componentes React. Durante nossa pesquisa, descobrimos uma variedade de casos de uso:

- Um roteador pode pré-renderizar telas em segundo plano para que, quando um usuário navega até elas, estejam instantaneamente disponíveis.
- Um componente de troca de abas pode preservar o estado das abas ocultas, permitindo que o usuário alterne entre elas sem perder seu progresso.
- Um componente de lista virtualizada pode pré-renderizar linhas adicionais acima e abaixo da janela visível.
- Ao abrir um modal ou pop-up, o restante do aplicativo pode ser colocado em modo "fundo", de modo que eventos e atualizações sejam desativados para tudo, exceto o modal.

A maioria dos desenvolvedores React não interagirá diretamente com as APIs offscreen do React. Em vez disso, a renderização offscreen será integrada a coisas como roteadores e bibliotecas de UI, e os desenvolvedores que usam essas bibliotecas se beneficiarão automaticamente sem trabalho adicional.

A ideia é que você deve ser capaz de renderizar qualquer árvore React offscreen sem mudar a forma como escreve seus componentes. Quando um componente é renderizado offscreen, ele na verdade não *monta* até que o componente se torne visível — seus efeitos não são disparados. Por exemplo, se um componente usa `useEffect` para registrar análises quando aparece pela primeira vez, a pré-renderização não afetará a precisão dessas análises. Da mesma forma, quando um componente vai para offscreen, seus efeitos são desmontados também. Um recurso chave da renderização offscreen é que você pode alternar a visibilidade de um componente sem perder seu estado.

Desde nossa última atualização, testamos uma versão experimental de pré-renderização internamente na Meta em nossos aplicativos React Native no Android e iOS, com resultados positivos de desempenho. Também melhoramos como a renderização offscreen funciona com Suspense — suspender dentro de uma árvore offscreen não acionará os fallback do Suspense. Nosso trabalho restante envolve a finalização das primitivas que serão expostas aos desenvolvedores de bibliotecas. Esperamos publicar uma RFC ainda este ano, juntamente com uma API experimental para testes e feedback.

## Rastreamento de Transições {/*transition-tracing*/}

A API de Rastreamento de Transições permite que você detecte quando [Transições do React](/reference/react/useTransition) se tornam mais lentas e investigue por que podem estar lentas. Após nossa última atualização, concluímos o design inicial da API e publicamos uma [RFC](https://github.com/reactjs/rfcs/pull/238). As capacidades básicas também foram implementadas. O projeto está atualmente em espera. Aceitamos feedback sobre a RFC e esperamos retomar seu desenvolvimento para fornecer uma ferramenta de medição de desempenho melhor para o React. Isso será particularmente útil com roteadores construídos sobre Transições do React, como o [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router).

* * *
Além desta atualização, nossa equipe fez recentes aparições em podcasts e transmissões ao vivo da comunidade para falar mais sobre nosso trabalho e responder a perguntas.

* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram entrevistados por [Kent C. Dodds em seu canal no YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), onde discutiram preocupações em torno dos Componentes de Servidor do React.
* [Dan Abramov](https://twitter.com/dan_abramov) e [Joe Savona](https://twitter.com/en_JS) foram convidados no [podcast JSParty](https://jsparty.fm/267) e compartilharam suas opiniões sobre o futuro do React.

Agradecimentos a [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster) e [Sophie Alpert](https://twitter.com/sophiebits) por revisar este post.

Obrigado por ler e até a próxima atualização!