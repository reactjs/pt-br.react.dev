---
title: "Introduzindo Relay e GraphQL"
layout: post
author: [wincent]
---

## Data fetching para aplicações React {#data-fetching-for-react-applications}

Há mais conhecimento agregado para criar um aplicativo do para que criar uma interface de usuário. Data fetching ainda é um problema complicado, principalmente quando as aplicações se tornam mais complicadas. Na [React.js Conf](http://conf.reactjs.com/) nós anunciamos dois projetos que nós criamos no Facebook para tornar simples o data fetching para desenvolvedores, mesmo quando um produto cresce o bastante para incluir dezenas de contribuidores e a aplicação se torna tão complexa quanto o próprio Facebook.

<iframe width="650" height="315" src="https://www.youtube-nocookie.com/embed/9sc8Pyc51uU" frameborder="0" allowfullscreen></iframe>

Os dois projetos &mdash; Relay e GraphQL &mdash; têm sido utilizados em ambiente de produção no Facebook por algum tempo, e nós estávamos empolgados em trazê-los ao mundo open source no futuro. No meio tempo, nós queríamos compartilhar algumas informações adicionais sobre os projetos aqui.

<script async class="speakerdeck-embed" data-id="7af7c2f33bf9451a892dcd91de55b7c2" data-ratio="1.29456384323641" src="//speakerdeck.com/assets/embed.js"></script>

## O que é Relay? {#what-is-relay}

Relay é um novo framework do Facebook que provêm funcionalidades de data-fetching para aplicações React. Ele foi anunciado na React.js Conf (Janeiro 2015).

Cada componente especifica de forma declarativa suas dependências de dados usando uma linguagem de query chamada GraphQL. Os dados ficam disponíveis para o componente via propriedades em `this.props`.

Desenvolvedores compõem naturalmente esses componentes React, e o Relay toma conta de compor as queries em batches eficientes, provendo exatamente cada componente com os dados que ele precisa (e não mais), atualizando esses componentes quando os dados mudam e mantendo um store do lado do cliente (com cache) de todos os dados.  

## O que é GraphQL? {#what-is-graphql}

GraphQL é uma linguagem para fazer data querying desenvolvida para descrever as dependências complexas e aninhadas de uma aplicação moderna. Ela está em ambiente de produção nos aplicativos nativos do Facebook há muitos anos.

No servidor, nós configuramos o sistema do GraphQL para mapear as queries às camadas de código de data-fetching. Essa camada de configuração permite o uso do GraphQL com mecanismos de armazenamento arbitrários. Relay usa GraphQL como a sua linguagem de query, mas não está amarrado a uma implementação específica de GraphQL.

## A proposta de valor {#the-value-proposition}

Relay nasceu a partir da nossa experiência em construir grandes aplicações no Facebook. Nosso objetivo mais abrangente é possibilitar desenvolvedores criarem aplicações de alto desempenho da forma correta, direta e óbvia. O projeto possibilita até grandes times fazerem mudanças com um alto grau de isolamento e confiabilidade. Fazer fetch dos dados é difícil, lidar com dados que estão sempre mudando também é difícil e desempenho mais ainda. Relay visa reduzir o grau de complexidade desses problemas, movendo os pedaços complicados para o framework e possibilitando você concentrar em construir a sua aplicação.

Situando as queries com o código da view, o desenvolvedor pode verificar o que o componente está fazendo olhando ele isoladamente; não é necessário considerar o contexto onde o componente foi renderizado para entende-lo. Componentes podem ser movidos para qualquer lugar na hierarquia de renderização sem ter que aplicar modificações nos componentes pais em cascata ou ter que codar a preparação dos dados do servidor separadamente.

Essa colocação leva os desenvolvedores a cair no ["pit de sucesso"](https://english.stackexchange.com/a/77541), porque eles pegam exatamente os dados que eles pediram e os dados que eles pediram são definidos explicitamente, bem perto de onde foi usado. Isso significa que o desempenho vem por padrão (se torna muito difícil causar over-fetch acidentalmente), e os componentes são mais robustos (under-fetching também se torna menos provável pela mesma razão, então componentes não vão tentar renderizar dados que estão faltando e dar pau em tempo de execução).

Relay provê um ambiente previsível para desenvolvedores mantendo uma constante: um componente não será renderizado até que todos os dados requeridos estejam disponíveis. Adicionalmente, queries são definidas estaticamente (ou seja, nós podemos extrair as queries da árvore de um componente antes da renderização) e o schema do GraphQL provê uma descrição autoritária de quais queries são válidas, então nós podemos validar as queries logo cedo e falhar rapidamente quando o desenvolver cometer um erro.

Só os campos de um objeto que um componente explicitamente pede serão acessíveis àquele componente, mesmo que outros campos sejam conhecidos e cacheados no store (porque outro componente pediu por eles). Isso faz com que seja impossível ocorrer bugs por dependências de dados implícitos posteriormente no sistema. 

Com o manuseio de todo o data-fetching através de uma única abstração, nós somos capazes de lidar com um monte de coisas que de outra forma teriam que ser lidadas de forma repetitiva por toda aplicação:

- **Performance:** Todas as queries seguem pelo fluxo do framework, onde coisas que de outra forma seriam ineficientes, padrões repetidos de queries são automaticamente colapsadas em lotes eficientes, queries mínimas. Da mesma forma, o framework sabe quais dados foram previamente pedidos, ou quais requisições ainda estão acontecendo, assim, queries podem ser "desduplicadas" e queries mínimas podem ser produzidas.
- **Subscriptions:** Todos os dados fluem em um único store, e todas as leituras do store são feitas via framework. Isso significa que o framework sabe quais componentes precisam de quais dados e quais deles devem ser re-renderizados quando os dados mudarem; componentes nunca têm que setar subscriptions individuais.
- **Padrões comuns:** Nós podemos fazer com que padrões comuns se tornem fáceis. Paginação é o exemplo que o [Jing](https://twitter.com/jingc) deu na conferência: se você tem 10 registros inicialmente, ir para a próxima página só quer dizer que você precisa de 15 registros no total. O framework automaticamente constrói a query mínima para buscar a diferença entre o que você tem e o que você precisa, faz a requisição e re-renderiza o componente quando os dados se tornam disponíveis.
- **Implementação simplificada no servidor:** Ao invés de ter uma proliferação de end-points (por ação, por rota), um único end-point GraphQL pode servir como uma fachada para inúmeras camadas de recursos.
- **Mutations uniformes:** Existe um padrão consistente para realizar mutations (escritas). Ele é conceitualmente englobado no modelo de query de dados em si. Você pode pensar que uma mutation é uma query com efeitos colaterais: você provém alguns parâmetros que descrevem as mudanças a serem feitas (por exemplo, anexando um comentário a um registro) e uma query especificando os dados que você vai precisar pra atualizar a sua view depois que a mutation completa (por exemplo, a contagem de comentários no registro), e os dados seguem o fluxo através do sistema. Nós podemos atulizar o cliente de forma "otimista" (ou seja, atualizar a view assumindo que tudo dará certo), e finalmente fazer o commit, tentar novamente ou reverter com um evento de erro quando a payload do servidor retornar.

## Como ele se relaciona com o Flux? {#how-does-it-relate-to-flux}

Pode-se dizer que Relay é inspirado pelo Flux, mas o modelo mental é muito mais simples. Ao invés de múltiplos stores, só há um único store central que guarda todos os dados GraphQL. Ao invés de subscriptions explícitas, o framework por si só consegue rastrear quais dados que cada componente precisa e quais componentes devem ser atualizados quando os dados mudarem. Ao invés de ações, modificações tomam forma de mutations.

No Facebook nós temos apps construídos inteiramente com Flux, inteiramente com Relay ou com ambos. Um padrão que nós estamos vendo surgir é deixar o Relay gerenciar a massa de dados e o fluxo para uma aplicação, mas utilizando paralelamente os stores do Flux para lidar com subconjuntos do estado da aplicação.

## Planos open source {#open-source-plans}

Nós estamos trabalhando duro atualmente para disponibilizar o GraphQL (uma especificação e uma implementação como referência) e o Relay ao público (sem datas específicas ainda, mas nós estamos super empolgados para trazê-los pra cá).

No meio tempo, nós estaremos disponibilizando mais e mais informações na forma de artigos de blog (e em [outros canais](https://gist.github.com/wincent/598fa75e22bdfa44cf47)). À medida que chegamos perto do lançamento open source, vocês podem esperar por detalhes mais concretos, sintaxe, documentações de API e mais.

Fique de olho!
