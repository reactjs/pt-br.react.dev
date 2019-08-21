---
title: "Introduzindo Relay e GraphQL"
layout: post
author: [wincent]
---

## Data fetching para aplicações React {#data-fetching-for-react-applications}

É mais complicado construir uma aplicação do que criar uma interface para o usuário. Data fetching ainda é um problema complicado, principalmente quando as aplicações se tornam mais complicadas. Na [React.js Conf](http://conf.reactjs.com/) nós anunciamos dois projetos que nós criamos no Facebook para tornar simples o data fetching para desenvolvedores, mesmo quando um produto cresce o bastante para incluir dezenas de contribuidores e a aplicação se torna tão complexa quanto o próprio Facebook.

<iframe width="650" height="315" src="https://www.youtube-nocookie.com/embed/9sc8Pyc51uU" frameborder="0" allowfullscreen></iframe>

Os dois projetos &mdash; Relay e GraphQL &mdash; têm sido utilizados em ambiente de produção no Facebook por algum tempo, e nós estávamos empolgados em trazê-los ao mundo open source no futuro. No meio tempo, nós queríamos compartilhar algumas informações adicionais sobre os projetos aqui.

<script async class="speakerdeck-embed" data-id="7af7c2f33bf9451a892dcd91de55b7c2" data-ratio="1.29456384323641" src="//speakerdeck.com/assets/embed.js"></script>

## O que é Relay? {#what-is-relay}

Relay é um novo framework do Facebook que provêm funcionalidades de data-fetching para aplicações React. Ele foi anunciado na React.js Conf (Janeiro 2015).

Cada componente especifica de forma declarativa suas dependências de dados using uma linguagem de query chamada GraphQL. Os dados ficam disponíveis para o componente via propriedades em `this.props`.

Desenvolvedores compõem naturalmente esses componentes React, e o Relay toma conta de compor as queries em batches eficientes, provendo exatamente cada componente com os dados que ele precisa (e não mais), atualizando esses componentes quando os dados mudam e mantendo um store do lado do cliente (com cache) de todos os dados.  

## O que é GraphQL? {#what-is-graphql}

GraphQL é uma linguagem para fazer data querying desenvolvida para descrever as dependências complexas e aninhadas de uma aplicação moderna. Ela está em ambiente de produção nos aplicativos nativos do Facebook há muitos anos.

No servidor, nós configuramos o sistema do GraphQL para mapear as queries às camadas de código de data-fetching. Essa camada de configuração permite o uso do GraphQL com mecanismos de armazenamento arbitrários. Relay use GraphQL como a sua linguagem de query, mas não está amarrado a uma implementação específica de GraphQL.

## The value proposition {#the-value-proposition}

Relay was born out of our experiences building large applications at Facebook. Our overarching goal is to enable developers to create correct, high-performance applications in a straightforward and obvious way. The design enables even large teams to make changes with a high degree of isolation and confidence. Fetching data is hard, dealing with ever-changing data is hard, and performance is hard. Relay aims to reduce these problems to simple ones, moving the tricky bits into the framework and freeing you to concentrate on building your application.

By co-locating the queries with the view code, the developer can reason about what a component is doing by looking at it in isolation; it's not necessary to consider the context where the component was rendered in order to understand it. Components can be moved anywhere in a render hierarchy without having to apply a cascade of modifications to parent components or to the server code which prepares the data payload.

Co-location leads developers to fall into the "pit of success", because they get exactly the data they asked for and the data they asked for is explicitly defined right next to where it is used. This means that performance becomes the default (it becomes much harder to accidentally over-fetch), and components are more robust (under-fetching is also less likely for the same reason, so components won't try to render missing data and blow up at runtime).

Relay provides a predictable environment for developers by maintaining an invariant: a component won't be rendered until all the data it requested is available. Additionally, queries are defined statically (ie. we can extract queries from a component tree before rendering) and the GraphQL schema provides an authoritative description of what queries are valid, so we can validate queries early and fail fast when the developer makes a mistake.

Only the fields of an object that a component explicitly asks for will be accessible to that component, even if other fields are known and cached in the store (because another component requested them). This makes it impossible for implicit data dependency bugs to exist latently in the system.

By handling all data-fetching via a single abstraction, we're able to handle a bunch of things that would otherwise have to be dealt with repeatedly and pervasively across the application:

- **Performance:** All queries flow through the framework code, where things that would otherwise be inefficient, repeated query patterns get automatically collapsed and batched into efficient, minimal queries. Likewise, the framework knows which data have been previously requested, or for which requests are currently "in flight", so queries can be automatically de-duplicated and the minimal queries can be produced.
- **Subscriptions:** All data flows into a single store, and all reads from the store are via the framework. This means the framework knows which components care about which data and which should be re-rendered when data changes; components never have to set up individual subscriptions.
- **Common patterns:** We can make common patterns easy. Pagination is the example that [Jing](https://twitter.com/jingc) gave at the conference: if you have 10 records initially, getting the next page just means declaring you want 15 records in total, and the framework automatically constructs the minimal query to grab the delta between what you have and what you need, requests it, and re-renders your view when the data become available.
- **Simplified server implementation:** Rather than having a proliferation of end-points (per action, per route), a single GraphQL endpoint can serve as a facade for any number of underlying resources.
- **Uniform mutations:** There is one consistent pattern for performing mutations (writes), and it is conceptually baked into the data querying model itself. You can think of a mutation as a query with side-effects: you provide some parameters that describe the change to be made (eg. attaching a comment to a record) and a query that specifies the data you'll need to update your view of the world after the mutation completes (eg. the comment count on the record), and the data flows through the system using the normal flow. We can do an immediate "optimistic" update on the client (ie. update the view under the assumption that the write will succeed), and finally commit it, retry it or roll it back in the event of an error when the server payload comes back.

## How does it relate to Flux? {#how-does-it-relate-to-flux}

In some ways Relay is inspired by Flux, but the mental model is much simpler. Instead of multiple stores, there is one central store that caches all GraphQL data. Instead of explicit subscriptions, the framework itself can track which data each component requests, and which components should be updated whenever the data change. Instead of actions, modifications take the form of mutations.

At Facebook, we have apps built entirely using Flux, entirely using Relay, or with both. One pattern we see emerging is letting Relay manage the bulk of the data flow for an application, but using Flux stores on the side to handle a subset of application state.

## Open source plans {#open-source-plans}

We're working very hard right now on getting both GraphQL (a spec, and a reference implementation) and Relay ready for public release (no specific dates yet, but we are super excited about getting these out there).

In the meantime, we'll be providing more and more information in the form of blog posts (and in [other channels](https://gist.github.com/wincent/598fa75e22bdfa44cf47)). As we get closer to the open source release, you can expect more concrete details, syntax and API descriptions and more.

Watch this space!
