---
title: Inicie um Novo Projeto em React
---

<Intro>

Se você deseja construir um novo aplicativo ou site totalmente com React, recomendamos escolher uma das estruturas populares na comunidade com tecnologia React.

</Intro>


Você pode usar o React sem uma estrutura, mas descobrimos que a maioria dos aplicativos e sites eventualmente criam soluções para problemas comuns, como divisão de código, roteamento, busca de dados e geração de HTML. Esses problemas são comuns a todas as bibliotecas de UI, não apenas ao React.

By starting with a framework, you can get started with React quickly, and avoid essentially building your own framework later.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.

</DeepDive>

## *Frameworks* baseados em React com qualidade de mercado {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) é um *framework* React *full-stack.*** É versátil e permite criar aplicativos React de qualquer tamanho – desde um blog quase todo estático até um aplicativo dinâmico complexo. Para criar um novo projeto Next.js, execute em seu terminal:

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Se você é novo no Next.js, confira o [aprender curso Next.js.](https://nextjs.org/learn)

Next.js é mantido por [Vercel](https://vercel.com/). Você pode [implantar um aplicativo Next.js](https://nextjs.org/docs/app/building-your-application/deploying) em qualquer Node.js ou hospedagem sem servidor, ou em seu próprio servidor. Next.js também suporta uma [exportação estática](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) que não requer um servidor.

### Remix {/*remix*/}

**[Remix](https://remix.run/) é um *framework* React *full-stack* com roteamento aninhado.** Ele permite que você divida sua aplicação em partes aninhadas que podem carregar dados em paralelo e atualizar em resposta às ações do usuário. Para criar um novo projeto com Remix, execute no seu terminal:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Caso você seja novo ao Remix, confira o [tutorial de blog do Remix](https://remix.run/docs/en/main/tutorials/blog) (curto) e o [tutorial de aplicações Remix](https://remix.run/docs/en/main/tutorials/jokes) (longo).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) é um *framework* React para sites rápidos baseados em CMS (*Content Management Systems*).** Seu rico ecossistema de *plugins* e sua camada de dados GraphQL simplificam a integração de conteúdo, APIs e serviços em um único site. Para criar um novo projeto com Gatsby, execute no seu terminal:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Caso você seja novo ao Gatsby, confira o [tutorial de Gatsby](https://www.gatsbyjs.com/docs/tutorial/).

Gatsby é mantido pela [Netlify](https://www.netlify.com/). Você pode [implantar um site Gatsby totalmente estático](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) em qualquer hospedagem estática. Caso você opte por usar apenas recursos de servidor, certifique-se que seu provedor de hospedagem possui suporte para Gatsby.

### Expo (para aplicações mobile) {/*expo*/}

**[Expo](https://expo.dev/) é um *framework* React que permite que você crie aplicações universais para Android, iOS e web com UIs genuinamente nativas.** Ele fornece um SDK para [React Native](https://reactnative.dev/) que torna as partes nativas mais fáceis de usar. Para criar um novo projeto Expo, execute no seu terminal:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Caso você seja novo ao Expo, confira o [tutorial de Expo](https://docs.expo.dev/tutorial/introduction/).

Expo é mantido pela [Expo (a empresa)](https://expo.dev/about). Construir aplicações com Expo é gratuito, e você pode submetê-las para as lojas de aplicativos do Google e da Apple sem restrições. Adicionalmente, Expo fornece serviços em nuvem pagos opcionais.

## *Frameworks* React de ponta {/*bleeding-edge-react-frameworks*/}

Conforme exploramos como continuar melhorando o React, percebemos que integrar o React mais de perto com *frameworks* (especificamente com roteamento, *bundling* e tecnologias de servidor) é a nossa maior oportunidade de ajudar usuários do React a construir aplicações melhores. A equipe Next.js concordou em colaborar conosco em pesquisar, desenvolver, integrar e testar recursos de ponta do React que são agnósticos a *frameworks*, como [Componentes de Servidor do React.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Esses recursos estão mais próximos de estarem prontos para produção dia após dia, e nós temos conversado com outros desenvolvedores de *bundlers* e *frameworks* sobre integrá-los. Nossa esperança é que, em um ou dois anos, todos os *frameworks* listados nesta página terão suporte completo para esses recursos. (Se você é um autor de *framework* interessado em se juntar a nós para experimentar esses recursos, por favor nos comunique!)

### Next.js *(App Router)* {/*nextjs-app-router*/}

**[O *App Router* do Next.js](https://nextjs.org/docs) é uma reformulação das APIs Next.js com o objetivo de cumprir a visão de arquitetura full-stack da equipe React.** Ele permite buscar dados em componentes assíncronos que são executados no servidor ou mesmo durante a construção.

Next.js é mantido pela [Vercel](https://vercel.com/). Você pode [implantar uma aplicação Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para qualquer Node.js ou hospedagem sem servidor, ou para seu próprio servidor. Next.js também suporta [exportação estática](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) que não requer um servidor.

<DeepDive>

#### Quais recursos compõem a visão de arquitetura *full-stack* da equipe React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

O *App Router* do Next.js implementa na íntegra a [especificação oficial dos Componentes de Servidor do React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Isso permite que você misture componentes apenas de servidor, componentes interativos e componentes gerados durante a construção (*build*) em uma única árvore React.

Por exemplo, você pode escrever um componente React apenas de servidor como uma função `async` que lê de um banco de dados ou de um arquivo. Então você pode passar dados deste componente para baixo, para seus componentes interativos:

```js
// Este componente roda *apenas* no servidor (ou durante a construção).
async function Talks({ confId }) {
  // 1. Você está no servidor, então você pode se comunicar com sua camada de dados. Rotas de APIs não são necessárias.
  const talks = await db.Talks.findAll({ confId });

  // 2. Adicione qualquer quantidade de lógica de renderização. Isso não aumentará o tamanho do seu pacote JavaScript.
  const videos = talks.map(talk => talk.video);

  // 3. Passe os dados para baixo para os componentes que rodarão no navegador.
  return <SearchableVideoList videos={videos} />;
}
```

O *App Router* do Next.js também integra [busca de dados com Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Isso permite que você especifique um estado de carregamento (como um esqueleto) para diferentes partes da sua interface de usuário diretamente na sua árvore React:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Componentes de Servidor e Suspense são recursos do React ao invés de recursos do Next.js. Entretanto, adotá-los no nível do *framework* requer comprometimento e um esforço de implementação que não é trivial. No momento, o *App Router* do Next.js é a implementação mais completa. A equipe React está trabalhando com desenvolvedores de *bundlers* para tornar esses recursos mais fáceis de implementar na próxima geração de *frameworks*.

</DeepDive>
