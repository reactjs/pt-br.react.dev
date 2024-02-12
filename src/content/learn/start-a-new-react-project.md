---
title: Inicie um Novo Projeto em React
---

<Intro>

<<<<<<< HEAD
Se você deseja construir uma nova aplicação ou um novo site totalmente em React, recomendamos escolher um dos *frameworks* baseados em React populares na comunidade. *Frameworks* fornecem recursos que a maioria das aplicações e sites eventualmente precisam, incluindo roteamento, busca de dados e geração de HTML.
=======
If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

</Intro>


<<<<<<< HEAD
**Você precisa instalar o [Node.js](https://nodejs.org/en/) para desenvolver localmente.** Você *também* pode escolher usar o Node.js em produção, mas não precisa. Vários *frameworks*  baseados em React permitem a exportação para uma pasta estática de HTML/CSS/JS.
=======
You can use React without a framework, however we’ve found that most apps and sites eventually build solutions to common problems such as code-splitting, routing, data fetching, and generating HTML. These problems are common to all UI libraries, not just React.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

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

<<<<<<< HEAD
**[Next.js](https://nextjs.org/) é um *framework* React *full-stack.*** É versátil e permite que você crie aplicações React de qualquer tamanho--desde um blog majoritariamente estático a uma aplicação dinâmica e complexa. Para criar um novo projeto com Next.js, execute no seu terminal:
=======
### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
Caso você seja novo ao Next.js, confira o [tutorial de Next.js](https://nextjs.org/learn/foundations/about-nextjs).

Next.js é mantido pela [Vercel](https://vercel.com/). Você pode [implantar uma aplicação Next.js](https://nextjs.org/docs/deployment) em qualquer hospedagem Node.js ou *serverless*, ou em seu próprio servidor. [Aplicações Next.js totalmente estáticas](https://nextjs.org/docs/advanced-features/static-html-export) podem ser implantadas em qualquer hospedagem de conteúdo estático.
=======
If you're new to Next.js, check out the [learn Next.js course.](https://nextjs.org/learn)

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports a [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

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

<<<<<<< HEAD
<DeepDive>

#### Posso usar React sem um *framework*? {/*can-i-use-react-without-a-framework*/}

Você definitivamente pode usar React sem um *framework*--é assim que você [usaria React para uma seção da sua página.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Contudo, se você está construindo uma nova aplicação ou um novo site totalmente em React, recomendamos usar um *framework*.**

E aqui está o porquê.

Mesmo que você não precise de roteamento ou busca de dados no início, você provavelmente vai querer adicionar algumas bibliotecas para eles. Conforme seu pacote JavaScript cresce com cada nova funcionalidade, você talvez tenha que descobrir como dividir o código para cada rota individualmente. Conforme suas necessidades de busca de dados ficam mais complexas, é provável que vá encontrar cascatas de comunicação servidor-cliente que fazem sua aplicação parecer muito lenta. Conforme seu público passe a incluir mais usuários com condições de rede ruins e dispositivos de baixo desempenho, você pode precisar gerar HTML a partir de seus componentes para exibir conteúdo cedo--seja no servidor, ou durante o tempo de construção (*build*). Mudar sua configuração para executar parte do seu código no servidor ou durante a construção pode ser bem complicado.

**Esses problemas não são específicos ao React. É por isso que Svelte tem SvelteKit, Vue tem Nuxt, e assim por diante.** Para resolver esses problemas por conta própria, você precisará integrar seu *bundler* com seu roteador e com sua biblioteca de busca de dados. Não é difícil fazer uma configuração inicial funcionar, mas há muitas sutilezas envolvidas em fazer uma aplicação que carrega rapidamente mesmo enquanto cresce ao longo do tempo. Você vai querer enviar a menor quantidade de código da aplicação, mas fazer isso em uma única ida e volta entre cliente-servidor, em paralelo com qualquer dado necessário para a página. Você provavelmente vai querer que a página seja interativa antes mesmo de seu código JavaScript ser executado, para suportar o aprimoramento progressivo. Você pode querer gerar uma pasta de arquivos HTML totalmente estáticos para suas páginas de marketing que podem ser hospedadas em qualquer lugar e ainda funcionar com JavaScript desabilitado. Construir essas capacidades por conta própria requer trabalho de verdade.

**Os *Frameworks* React nesta página resolvem problemas como esses por padrão, sem trabalho extra de sua parte.** Eles permitem que você comece bem enxuto e então escale sua aplicação a partir das suas necessidades. Cada *framework* React tem uma comunidade, então encontrar respostas para perguntas e atualizar ferramentas é mais fácil. *Frameworks* também dão estrutura para seu código, ajudando você e outros a reter contextos e habilidades entre diferentes projetos. Por outro lado, com uma configuração personalizada é mais fácil ficar preso em versões de dependências não suportadas, e você essencialmente acabará criando seu próprio *framework*--embora um sem comunidade ou trajetória de atualizações (e se for algo como os que fizemos no passado, projetado de forma descuidada). 

Caso você ainda não esteja convencido, ou sua aplicação tenha restrições incomuns que não são bem atendidas por esses *frameworks* e você gostaria de criar sua própria configuração personalizada, nós não podemos te impedir--vá em frente! Pegue `react` e `react-dom` do npm, configure seu processo de construção personalizado com um *bundler* como [Vite](https://vitejs.dev/) ou [Parcel](https://parceljs.org/), e adicione outras ferramentas conforme você precisar para roteamento, geração estática ou renderização no servidor, e etc.
</DeepDive>

## *Frameworks* React de ponta {/*bleeding-edge-react-frameworks*/}
=======
## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

Conforme exploramos como continuar melhorando o React, percebemos que integrar o React mais de perto com *frameworks* (especificamente com roteamento, *bundling* e tecnologias de servidor) é a nossa maior oportunidade de ajudar usuários do React a construir aplicações melhores. A equipe Next.js concordou em colaborar conosco em pesquisar, desenvolver, integrar e testar recursos de ponta do React que são agnósticos a *frameworks*, como [Componentes de Servidor do React.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Esses recursos estão mais próximos de estarem prontos para produção dia após dia, e nós temos conversado com outros desenvolvedores de *bundlers* e *frameworks* sobre integrá-los. Nossa esperança é que, em um ou dois anos, todos os *frameworks* listados nesta página terão suporte completo para esses recursos. (Se você é um autor de *framework* interessado em se juntar a nós para experimentar esses recursos, por favor nos comunique!)

### Next.js *(App Router)* {/*nextjs-app-router*/}

<<<<<<< HEAD
**[O *App Router* do Next.js](https://beta.nextjs.org/docs/getting-started) é uma reformulação das APIs do Next.js com o objetivo de cumprir com a visão de arquitetura *full-stack* da equipe React.** Ele permite que você busque dados em componentes assíncronos que rodam no servidor ou até mesmo durante a construção (*build*).

Next.js é mantido pela [Vercel](https://vercel.com/). Você pode [implantar uma aplicação Next.js](https://nextjs.org/docs/deployment) em qualquer hospedagem Node.js ou *serverless*, ou em seu próprio servidor. Next.js também possui suporte para [exportação estática](https://beta.nextjs.org/docs/configuring/static-export), que não requer um servidor.
<Pitfall>

O *App Router* do Next.js está **atualmente em beta e ainda não é recomendado para produção** (nesta data, Março 2023). Para experimentá-lo em um projeto Next.js existente, [siga este guia de migração progressiva](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).
</Pitfall>
=======
**[Next.js's App Router](https://nextjs.org/docs) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

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
