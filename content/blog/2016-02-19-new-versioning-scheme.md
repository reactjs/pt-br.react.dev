---
title: "Novo Esquema de Versão"
author: [sebmarkbage]
---

Hoje anunciamos que estamos mudando para as principais revisões do React. A versão atual é 0.14.7. A próxima release será: **15.0.0**

Esta mudança não deve afetar materialmente a maioria de vocês. A mudança para as principais versões semver simplesmente ajuda a indicar o nosso compromisso para com a estabilidade e nos dá a flexibilidade para adicionar novos recursos em releases menores que sejam compatíveis com as versões anteriores. Isso significa que nós podemos ter menos releases principais e você não precisará esperar tanto tempo para desfrutar das melhorias do React. Além disso, se você é um autor de componente, este esquema de versão te dá a flexibilidade para suportar duas versões principais do React ao mesmo tempo, para que você não precise deixar nada para trás.

O core da API do React se mantém estável há anos. Nossos negócios, assim como muitos de vocês, dependem fortemente do uso do React como parte essencial da nossa infraestrutura. Também estamos comprometidos com a estabilidade e o progresso do React daqui em diante.

## Juntar Todo Mundo {#bring-everyone-along}

React não é apenas uma biblioteca mas um ecossistema. Sabemos que os seus e os nossos aplicativos não são apenas ilhas isoladas de código. É uma rede com seu próprio códido de aplicativo, seus próprios componentes de código aberto e bibliotecas de terceiros que dependem do React.

<img src="../images/blog/versioning-1.png" width="403">

Portanto, é importante que não só atualizemos nossos próprios códigos de base como também tragamos toda nossa comunidade conosco. Nós levamos o caminho da atualização muito a sério - para todos.

<img src="../images/blog/versioning-poll.png" width="596">

## Introducing Minor Releases {#introducing-minor-releases}

Ideally everyone could just depend on the latest version of React all the time.

<img src="../images/blog/versioning-2.png" width="463">

We know that in practice that is not possible. In the future, we expect more new additive APIs rather than breakage of existing ones. By moving to major revisions in the semver scheme, we can release new versions without breaking existing ones.

<img src="../images/blog/versioning-3.png" width="503">

That means that if one component needs a new API, there is no need for any of the other components to do any further work. They remain compatible.

## What Happened to 1.0.0? {#what-happened-to-100}

Part of React's growth and popularity is that it is stable and performant in production. People have long asked what React v1.0 will look. Technically some breaking changes are important to avoid stagnating, but we still achieve stability by making it easy to upgrade. If major version numbers indicate API stability and engender trust that it can be used in production, then we got there a long time ago. There are too many preconceived notions of what v1.0 is. We're still following semver. We're just communicating stability by moving the 0 from the beginning to the end.

## Breaking Changes {#breaking-changes}

Minor revision releases will include deprecation warnings and tips for how to upgrade an API or pattern that will be removed or changed in the future.

We will continue to release [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) for common patterns to make automatic upgrades of your codebase easier.

Once we've reached the end of life for a particular major version, we'll release a new major version where all deprecated APIs have been removed.

## Avoiding The Major Cliff {#avoiding-the-major-cliff}

If you try to upgrade your component to 16.0.0 you might find that your application no longer works if you still have other dependencies. E.g. if Ryan's and Jed's components are only compatible with 15.x.x.

<img src="../images/blog/versioning-4.png" width="498">

Worst case, you revert back to 15.1.0 for your application. Since you'll want to use your component, you might also revert that one.

<img src="../images/blog/versioning-5.png" width="493">

Of course, Ryan and Jed think the same way. If we're not careful, we can hit a cliff where nobody upgrades. This has happened to many software project ecosystems in the past.

Therefore, we're committed to making it easy for most components and libraries built on top of React to be compatible with two major versions at the same time. We will do this by introducing new APIs before completely removing the old ones, thereby avoiding those cliffs.

<img src="../images/blog/versioning-6.png" width="493">
