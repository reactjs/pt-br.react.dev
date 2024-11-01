---
title: Inicie um Novo Projeto em React
---

<Intro>

Se você deseja construir um novo aplicativo ou site totalmente com React, recomendamos escolher uma das estruturas populares na comunidade com tecnologia React.

</Intro>


Você pode usar o React sem uma estrutura, mas descobrimos que a maioria dos aplicativos e sites eventualmente criam soluções para problemas comuns, como divisão de código, roteamento, busca de dados e geração de HTML. Esses problemas são comuns a todas as bibliotecas de UI, não apenas ao React.

Utilizando uma estrutura, você pode começar a usar o React rapidamente, além de evitar criar sua própria estrutura mais tarde.

<DeepDive>

#### Posso usar o React sem uma estrutura? {/*can-i-use-react-without-a-framework*/}

Você definitivamente pode usar o React sem uma estrutura--é assim que você faria [se utilizasse o React para uma parte da sua página.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Entretanto, se você está criando uma nova aplicação ou site inteiramente com React, recomendamos a utilização de uma estrutura.**

Veja o porquê.

Mesmo que você não precise de roteamento ou busca de dados a princípio, você possivelmente desejará adicionar alguma biblioteca para isso futuramente. À medida que seu pacote JavaScript cresce com cada novo recurso, você pode ter que descobrir como dividir o código para cada rota individualmente. À medida que suas necessidades de busca de dados se tornam mais complexas, é provável que você se depare com uma enxurrada de requisições cliente-servidor que fazem seu aplicativo parecer muito lento. Conforme sua aplicação recebe mais usuários com más condições de rede e dispositivos de baixo custo, você pode precisar gerar HTML  a partir de seus componentes para exibir o conteúdo antecipadamente--seja no servidor, ou durante o tempo de compilação. Alterar alguma configuração para executar parte do seu código no servidor ou durante a compilação pode ser bem complicado.

**Esses problemas não são específicos do React. É por isso que o Svelte tem o SvelteKit, o Vue tem o Nuxt, e assim por diante.** Para solucionar esses problemas por conta própria, você precisará integrar seu *bundler* com sua biblioteca de roteamento e com sua biblioteca de busca de dados. Não é difícil fazer uma configuração inicial funcionar, mas há muitas sutilezas envolvidas na criação de uma aplicação que carrega rapidamente mesmo enquanto cresce ao longo do tempo. Você vai querer enviar a mínima quantidade de código da aplicação em uma única viagem cliente-servidor, ao mesmo tempo que todos os dados necessários para a página. Provavelmente, você desejará que a página seja interativa antes mesmo que seu código JavaScript ser executado, para ter um carregamento progressivo aprimorado. Você pode querer gerar uma pasta de arquivos HTML totalmente estáticos para suas páginas de marketing que podem ser hospedadas em qualquer lugar e ainda funcionar com JavaScript desabilitado. Desenvolver essas capacidades você mesmo dá muito trabalho.

**As estruturas React nesta página solucionam problemas como esses por padrão, sem nenhum trabalho extra da sua parte.** Elas permitem que você comece de forma bem enxuta e depois dimensione seu aplicativo conforme suas necessidades. Cada estrutura de React tem uma comunidade, então encontrar respostas e atualizar ferramentas é mais fácil. Estruturas fornecem suporte ao seu código, ajudando você e outros a reaproveitar contexto e habilidades entre diferentes projetos. Por outro lado, com uma configuração personalizada, é mais fácil ficar preso em versões de dependências sem suporte, e você acabará criando sua própria estrutura, porém sem uma comunidade ou meios de atualizar as dependências (e se for parecido com as que fizemos no passado, projetada mais aleatoriamente).

Se o seu aplicativo tiver restrições incomuns que não são bem atendidas por esses frameworks, ou você prefere resolver esses problemas sozinho, você pode criar sua própria configuração personalizada com React. Use `react` e `react-dom` a partir do npm, configure seu processo de construção personalizado com um *bundler* como [Vite](https://vitejs.dev/) ou [Parcel](https://parceljs.org/), e adicione outras ferramentas conforme necessário para roteamento, geração estática ou renderização do lado do servidor e muito mais.

</DeepDive>

## *Frameworks* baseados em React com qualidade de mercado {/*production-grade-react-frameworks*/}

Essas estruturas oferecem suporte a todos os recursos necessários para implantar e dimensionar seu aplicativo em produção e estão trabalhando para dar suporte à nossa [visão de arquitetura full-stack](#which-features-make-up-the-react-teams-full-stack-architecture-vision). Todas as estruturas que recomendamos são de código aberto com comunidades ativas para suporte, e podem ser implantadas em seu próprio servidor ou em um provedor de hospedagem. Se você é um autor de uma estrutura e está interessado em ser incluído nesta lista, [por favor nos avise](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

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
