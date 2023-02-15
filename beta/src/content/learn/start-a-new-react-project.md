---
title: Iniciar um Novo Projeto React
---

<Intro>

Se você está iniciando um novo projeto, recomendamos usar uma toolchain ou um framework. Essas ferramentas fornecem um ambiente de desenvolvimento confortável, mas exigem uma instalação local do Node.js.

</Intro>

<YouWillLearn>

* Como as toolchains são diferentes dos frameworks
* Como iniciar um projeto com uma toolchain mínima
* Como iniciar um projeto com um framework completo
* O que há dentro de toolchains e frameworks populares

</YouWillLearn>

## Escolha sua própria aventura {/*choose-your-own-adventure*/}

O React é uma biblioteca que permite que você organize o código da interface do usuário quebrando-o em peças chamadas componentes. O React não cuida da rotação ou gerenciamento de dados. Isso significa que há várias maneiras de iniciar um novo projeto React:

* [Comece com um **arquivo HTML e uma tag de script.**](/learn/add-react-to-a-website) Isso não exige configuração do Node.js, mas oferece recursos limitados.
* Comece com uma **toolchain mínima,** adicionando mais recursos ao seu projeto conforme avança. (Ótimo para aprender!)
* Comece com um **framework com opinião** que possua recursos comuns, como busca de dados e roteamento incorporado.

## Começando com uma toolchain mínima {/*getting-started-with-a-minimal-toolchain*/}

Se você está **aprendendo React,** recomendamos [Create React App.](https://create-react-app.dev/) É a maneira mais popular de experimentar o React e criar uma nova aplicação de lado do cliente de página única. Ele foi feito para o React, mas não tem opinião sobre roteamento ou busca de dados.

Primeiro, instale [Node.js.](https://nodejs.org/pt-br) Em seguida, abra o seu terminal e execute esta linha para criar um projeto:

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Agora você pode executar seu aplicativo com:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

Para obter mais informações, [consulte o guia oficial.](https://create-react-app.dev/docs/getting-started)

> O Create React App não gerencia a lógica do backend ou bancos de dados. Você pode usá-lo com qualquer backend. Quando você constrói um projeto, receberá uma pasta com HTML, CSS e JS estáticos. Como o Create React App não pode aproveitar o servidor, ele não fornece o melhor desempenho. Se você está procurando tempos de carregamento mais rápidos e recursos incorporados, como roteamento e lógica do lado do servidor, recomendamos usar um framework em vez disso.

### Alternativas populares {/*toolkit-popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## Construindo com um framework com todos os recursos {/*building-with-a-full-featured-framework*/}

Se você está procurando **iniciar um projeto pronto para produção,** [Next.js](https://nextjs.org/) é um ótimo lugar para começar. O Next.js é um framework popular e leve para aplicativos estáticos e renderizados no servidor construídos com React. Ele vem pré-embalado com recursos como roteamento, estilização e renderização no lado do servidor, possibilitando que seu projeto comece a funcionar rapidamente.

O tutorial de [Fundações Next.js](https://nextjs.org/learn/foundations/about-nextjs) é uma ótima introdução à construção com React e Next.js.

### Alternativas populares {/*framework-popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## Toolchains personalizadas {/*custom-toolchains*/}

Você pode preferir criar e configurar sua própria toolchain. Uma toolchain geralmente consiste em:

* Um **gerenciador de pacotes** permite que você instale, atualize e gerencie pacotes de terceiros. Gerenciadores de pacotes populares: [npm](https://www.npmjs.com/) (integrado ao Node.js), [Yarn](https://yarnpkg.com/) e [pnpm.](https://pnpm.io/)
* Um **compilador** permite que você compile recursos de linguagem modernos e sintaxe adicional, como JSX ou anotações de tipo para os navegadores. Compiladores populares: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/) e [swc.](https://swc.rs/)
* Um **bundler** permite que você escreva código modular e o agrupe em pequenos pacotes para otimizar o tempo de carregamento. Bundlers populares [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/) e [swc.](https://swc.rs/)
* Um **minifier** torna o seu código mais compacto para que ele carregue mais rapidamente. Minifiers populares: [Terser](https://terser.org/) e [swc.](https://swc.rs/)
* Um **servidor** gerencia requisições do servidor para que você possa renderizar componentes em HTML. Servidores populares: [Express.](https://expressjs.com/)
* Um **linter** verifica seu código em busca de erros comuns. Linters populares: [ESLint.](https://eslint.org/)
* Um **executor de testes** permite que você execute testes em seu código. Executor de teste popular: [Jest.](https://jestjs.io/)

Se você preferir configurar sua própria toolchain JavaScript do zero, [confira este guia](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recria algumas das funcionalidades do Create React App. Um framework também geralmente fornece uma solução de roteamento e busca de dados. Em um projeto maior, você também pode querer gerenciar múltiplos pacotes em um único repositório com uma ferramenta como [Nx](https://nx.dev/react) ou [Turborepo.](https://turborepo.org/)

