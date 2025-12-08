---
title: Criando uma Aplicação React
---

<Intro>

Se você quer construir uma nova aplicação ou website com React, recomendamos começar com um framework.

</Intro>

Se sua aplicação tem restrições que não são bem atendidas pelos frameworks existentes, você prefere construir seu próprio framework, ou apenas quer aprender o básico de uma aplicação React, você pode [construir uma aplicação React do zero](/learn/build-a-react-app-from-scratch).

## Frameworks full-stack {/*full-stack-frameworks*/}

Estes frameworks recomendados suportam todas as funcionalidades que você precisa para fazer deploy e escalar sua aplicação em produção. Eles integraram as funcionalidades mais recentes do React e aproveitam a arquitetura do React.

<Note>

#### Frameworks full-stack não requerem um servidor. {/*react-frameworks-do-not-require-a-server*/}

Todos os frameworks nesta página suportam renderização do lado do cliente ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), aplicações de página única ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)), e geração de site estático ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). Essas aplicações podem ser deployadas em uma [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) ou serviço de hospedagem estática sem um servidor. Além disso, esses frameworks permitem que você adicione renderização do lado do servidor rota por rota, quando faz sentido para seu caso de uso.

Isso permite que você comece com uma aplicação apenas do lado do cliente, e se suas necessidades mudarem depois, você pode optar por usar funcionalidades de servidor em rotas individuais sem reescrever sua aplicação. Veja a documentação do seu framework para configurar a estratégia de renderização.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[O App Router do Next.js](https://nextjs.org/docs) é um framework React que aproveita completamente a arquitetura do React para permitir aplicações React full-stack.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js é mantido pela [Vercel](https://vercel.com/). Você pode [fazer deploy de uma aplicação Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para qualquer hospedagem Node.js ou serverless, ou para seu próprio servidor. Next.js também suporta [exportação estática](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) que não requer um servidor. A Vercel também fornece serviços em nuvem pagos opcionais.



### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) é a biblioteca de roteamento mais popular para React e pode ser pareada com Vite para criar um framework React full-stack**. Ele enfatiza APIs Web padrão e tem vários [templates prontos para deploy](https://github.com/remix-run/react-router-templates) para vários runtimes JavaScript e plataformas.

Para criar um novo projeto de framework React Router, execute:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router é mantido pela [Shopify](https://www.shopify.com).

### Expo (para aplicações nativas) {/*expo*/}

**[Expo](https://expo.dev/) é um framework React que permite criar aplicações universais para Android, iOS, e web com interfaces verdadeiramente nativas.** Ele fornece um SDK para [React Native](https://reactnative.dev/) que torna as partes nativas mais fáceis de usar. Para criar um novo projeto Expo, execute:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Se você é novo no Expo, confira o [tutorial do Expo](https://docs.expo.dev/tutorial/introduction/).

Expo é mantido pela [Expo (a empresa)](https://expo.dev/about). Construir aplicações com Expo é gratuito, e você pode enviá-las para as app stores do Google e Apple sem restrições. Expo também fornece serviços em nuvem pagos opcionais.

## Outros frameworks {/*other-frameworks*/}

Existem outros frameworks emergentes que estão trabalhando em direção à nossa visão de React full-stack:

<<<<<<< HEAD
- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start é um framework React full-stack alimentado pelo TanStack Router. Ele fornece SSR de documento completo, streaming, funções de servidor, bundling, e mais usando ferramentas como Nitro e Vite.
- [RedwoodJS](https://redwoodjs.com/): Redwood é um framework React full-stack com muitos pacotes pré-instalados e configuração que torna fácil construir aplicações web full-stack.
=======
There are other up-and-coming frameworks that are working towards our full stack React vision:

- [TanStack Start (Beta)](https://tanstack.com/start/): TanStack Start is a full-stack React framework powered by TanStack Router. It provides a full-document SSR, streaming, server functions, bundling, and more using tools like Nitro and Vite.
- [RedwoodSDK](https://rwsdk.com/): Redwood is a full stack React framework with lots of pre-installed packages and configuration that makes it easy to build full-stack web applications.
>>>>>>> e22544e68d6fffda33332771efe27034739f35a4

<DeepDive>

#### Quais funcionalidades compõem a visão de arquitetura full-stack da equipe React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

O bundler App Router do Next.js implementa completamente a [especificação oficial dos React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Isso permite misturar componentes de build-time, apenas do servidor, e interativos em uma única árvore React.

Por exemplo, você pode escrever um componente React apenas do servidor como uma função `async` que lê de um banco de dados ou de um arquivo. Então você pode passar dados para baixo para seus componentes interativos:

```js
// Este componente executa *apenas* no servidor (ou durante o build).
async function Talks({ confId }) {
  // 1. Você está no servidor, então pode conversar com sua camada de dados. Endpoint de API não é necessário.
  const talks = await db.Talks.findAll({ confId });

  // 2. Adicione qualquer quantidade de lógica de renderização. Isso não tornará seu bundle JavaScript maior.
  const videos = talks.map(talk => talk.video);

  // 3. Passe os dados para baixo para os componentes que executarão no navegador.
  return <SearchableVideoList videos={videos} />;
}
```

O App Router do Next.js também integra [busca de dados com Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Isso permite especificar um estado de carregamento (como um placeholder skeleton) para diferentes partes da sua interface de usuário diretamente na sua árvore React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components e Suspense são funcionalidades do React ao invés de funcionalidades do Next.js. No entanto, adotá-las no nível do framework requer buy-in e trabalho de implementação não trivial. No momento, o App Router do Next.js é a implementação mais completa. A equipe React está trabalhando com desenvolvedores de bundlers para tornar essas funcionalidades mais fáceis de implementar na próxima geração de frameworks.

</DeepDive>

## Começar do Zero {/*start-from-scratch*/}

Se sua aplicação tem restrições que não são bem atendidas pelos frameworks existentes, você prefere construir seu próprio framework, ou apenas quer aprender o básico de uma aplicação React, existem outras opções disponíveis para começar um projeto React do zero.

Começar do zero te dá mais flexibilidade, mas requer que você faça escolhas sobre quais ferramentas usar para roteamento, busca de dados, e outros padrões de uso comuns. É muito parecido com construir seu próprio framework, ao invés de usar um framework que já existe. Os [frameworks que recomendamos](#full-stack-frameworks) têm soluções integradas para esses problemas.

Se você quer construir suas próprias soluções, veja nosso guia para [construir uma aplicação React do Zero](/learn/build-a-react-app-from-scratch) para instruções sobre como configurar um novo projeto React começando com uma ferramenta de build como [Vite](https://vite.dev/), [Parcel](https://parceljs.org/), ou [RSbuild](https://rsbuild.dev/).

-----

_Se você é um autor de framework interessado em ser incluído nesta página, [por favor nos informe](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._