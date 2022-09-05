---
title:Iniciar um novo projeto no React
---

<Intro>

<<<<<<< HEAD
Se você está aprendendo React ou pensando em adicioná-lo a um projeto existente, pode começar rapidamente  [adicionando React a qualquer página HTML com tags de script](/learn/add-react-to-a-website). Se o seu projeto precisar de muitos componentes e muitos arquivos, talvez seja hora de considerar as opções abaixo!

</Intro>

## Escolha sua própria aventura {/*choose-your-own-adventure*/}

React é uma biblioteca que permite organizar o código da interface do usuário dividindo-o em partes chamadas componentes. O React não cuida do roteamento ou gerenciamento de dados. Para esses recursos, convém usar bibliotecas de terceiros ou escrever suas próprias soluções. Isso significa que existem várias maneiras de iniciar um novo projeto React:

* Comece com uma **configuração mínima com apenas um conjunto de ferramentas,** adicionando recursos ao seu projeto conforme necessário.
* Comece com um **software opinativo** com funcionalidade comum já incorporada.

Se você está apenas começando, procurando construir algo grande ou deseja configurar seu próprio conjunto de ferramentas, este guia te colocará no caminho certo.

## Começando com um conjunto de ferramentas React {/*getting-started-with-a-react-toolchain*/}

Se você está apenas começando com o React, recomendamos [Ceate React App](https://create-react-app.dev/), a maneira mais popular de experimentar os recursos do React e uma ótima maneira de criar um novo aplicativo do lado do cliente de single-page. Create React App é um conjunto de ferramentas sem opinião configurada apenas para React.Os conjuntos de ferramentas ajudam com coisas como:

* Dimensionamento para muitos arquivos e componentes
* Usando bibliotecas de terceiros do npm
* Detectando erros comuns antecipadamente
* Edição ao vivo de CSS e JS em desenvolvimento
* Otimizando a saída para produção

Você pode começar a construir com o Create React App com uma linha de código em seu terminal! (**Certifique-se de ter o [Node.js](https://nodejs.org/) instalado!**)
=======
If you're starting a new project, we recommend to use a toolchain or a framework. These tools provide a comfortable development environment but require a local Node.js installation.

</Intro>

<YouWillLearn>

* How toolchains are different from frameworks
* How to start a project with a minimal toolchain
* How to start a project with a fully-featured framework
* What's inside popular toolchains and frameworks

</YouWillLearn>

## Choose your own adventure {/*choose-your-own-adventure*/}

React is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn't take care of routing or data management. This means there are several ways to start a new React project:

* [Start with an **HTML file and a script tag**.](/learn/add-react-to-a-website) This doesn't require Node.js setup but offers limited features.
* Start with a **minimal toolchain,** adding more features to your project as you go. (Great for learning!)
* Start with an **opinionated framework** that has common features like data fetching and routing built-in.

## Getting started with a minimal toolchain {/*getting-started-with-a-minimal-toolchain*/}

If you're **learning React,** we recommend [Create React App](https://create-react-app.dev/). It is the most popular way to try out React and build a new single-page, client-side application. It's made for React but isn't opinionated about routing or data fetching.

First, install [Node.js](https://nodejs.org/en/). Then open your terminal and run this line to create a project:
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Agora você pode executar seu aplicativo:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

Para mais informações [confira o guia oficial ](https://create-react-app.dev/docs/getting-started).

<<<<<<< HEAD
> Create React App não lida com lógica de back-end ou bancos de dados; ele apenas cria um pipeline de construção de front-end. Isso significa que você pode usá-lo com qualquer back-end que desejar. Mas se você estiver procurando por mais recursos, como roteamento e lógica do lado do servidor, continue lendo!

### Outras opções {/*other-options*/}

O Create React App é ótimo para começar a trabalhar com o React, mas se você quiser um conjunto de ferramentas ainda mais leve, tente um desses outros cconjuntos de ferramentas populares:
=======
> Create React App doesn't handle backend logic or databases. You can use it with any backend. When you build a project, you'll get a folder with static HTML, CSS and JS. Because Create React App can't take advantage of the server, it doesn't provide the best performance. If you're looking for faster loading times and built-in features like routing and server-side logic, we recommend using a framework instead.

### Popular alternatives {/*popular-alternatives*/}
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

<<<<<<< HEAD
## Programando com React e um framework {/*building-with-react-and-a-framework*/}

Se você deseja iniciar um projeto maior e pronto para produção, o [Next.js](https://nextjs.org/) é um ótimo lugar para começar. Next.js é uma estrutura popular e leve para aplicativos estáticos e renderizados por servidor criados com React. Ele vem em um pacote com recursos como roteamento, estilo e renderização do lado do servidor, colocando seu projeto em funcionamento rapidamente.

[Comece a criar com Next.js](https://nextjs.org/docs/getting-started) usando o guia oficial.

### Outras opções {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/) permite gerar sites estáticos com React com GraphQL.
* [Razzle](https://razzlejs.org/)  é uma estrutura de renderização de servidor que não requer nenhuma configuração, mas oferece mais flexibilidade do que o Next.js.
=======
## Building with a full-featured framework {/*building-with-a-full-featured-framework*/}

If you're looking to **start a production-ready project,** [Next.js](https://nextjs.org/) is a great place to start. Next.js is a popular, lightweight framework for static and server‑rendered applications built with React. It comes pre-packaged with features like routing, styling, and server-side rendering, getting your project up and running quickly. 

The [Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) tutorial is a great introduction to building with React and Next.js.

### Popular alternatives {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)
>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e

## Conjuntos de ferramentas personalizadas
s {/*custom-toolchains*/}

<<<<<<< HEAD
Você pode preferir criar e configurar sueu próprio conjunto de ferramentas. Um  conjunto de ferramentas de construção JavaScript normalmente consiste em:

* Um **gerenciador de pacotes**—permite instalar, atualizar e gerenciar pacotes de terceiros. [Yarn](https://yarnpkg.com/) e [npm](https://www.npmjs.com/) são dois gerenciadores de pacotes populares.
* Um **bundler**— permite escrever código modular e agrupá-lo em pequenos pacotes para otimizar o tempo de carregamento. [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/), [Parcel](https://parceljs.org/) são alguns bundlers populares.
* Um **compilador**— permite escrever código JavaScript moderno que ainda funciona em navegadores mais antigos. [Babel](https://babeljs.io/) é um desses exemplos.

Em um projeto maior, você também pode querer ter uma ferramenta para gerenciar vários pacotes em um único repositório.  [Nx](https://nx.dev/react) é um exemplo deesse tipo de ferramenta.

Se você preferir configurar seu própria conjunto de ferramentas JavaScript do zero, [confira este guia ](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recria algumas das funcionalidades Create React App.
=======
You may prefer to create and configure your own toolchain. A toolchain typically consists of:

* A **package manager** lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/).
* A **compiler** lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc](https://swc.rs/).
* A **bundler** lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/).
* A **minifier** makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc](https://swc.rs/).
* A **server** handles server requests so that you can render components to HTML. Popular servers: [Express](https://expressjs.com/).
* A **linter** checks your code for common mistakes. Popular linters: [ESLint](https://eslint.org/).
* A **test runner** lets you run tests against your code. Popular test runners: [Jest](https://jestjs.io/).

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/react) or [Turborepo](https://turborepo.org/).

>>>>>>> e9faee62db6981e26a1cdabad6ae39620a1d2e3e
