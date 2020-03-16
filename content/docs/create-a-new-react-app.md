---
id: create-a-new-react-app
title: Crie um novo React App
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Use uma toolchain integrada para uma melhor experiência de usuário e desenvolvedor.

Esta página descreve algumas toolchains populares com React que ajudam em tarefas como:

* Escalar para muitos arquivos e componentes.
* Usar bibliotecas de terceiros através do npm.
* Detectar erros comuns cedo.
* Edição em tempo real de CSS e JS em desenvolvimento.
* Otimizar a saída para produção

As toolchains recomendadas nesta página **não requerem configuração para começar**.

## Você Pode Não Precisar de Uma Toolchain {#you-might-not-need-a-toolchain}

Se você não se depara com nenhum dos problemas descritos acima, ou se ainda não se sente confortável usando ferramentas JavaScript, considere [simplesmente adicionar uma tag `script` numa página HTML](/docs/add-react-to-a-website.html), opcionalmente [usando JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Esta é **a maneira mais fácil de integrar React a um site já existente.** Você pode a qualquer momento adicionar à toolchain conforme achar útil.

## Toolchains Recomendadas {#recommended-toolchains}

A equipe React recomenda principalmente as seguintes soluções:

- Se você está **aprendendo React** ou **criando um novo [single-page](/docs/glossary.html#single-page-application) app,** use [Create React App](#create-react-app). 
- Se você está fazendo um **site renderizado no servidor (SSR) com Node.js,** tente [Next.js](#nextjs).
- Se você está fazendo um **site estático orientado a conteúdo,** experimente [Gatsby](#gatsby).
- Se você está montando uma **biblioteca de componentes** ou **integrando com um código-base existente**, veja [Toolchains Mais Flexíveis](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) é um ambiente confortável para **aprender React**, e é a melhor maneira de começar um **[single-page](/docs/glossary.html#single-page-application) application** em React. 

Além de configurar seu ambiente de desenvolvimento para utilizar as funcionalidades mais recentes do JavaScript, ele fornece uma experiência de desenvolvimento agradável, e otimiza o seu app para produção. Será necessário ter [Node >= 8.10 e npm >= 5.6](https://nodejs.org/pt-br/) na sua máquina. Para criar um novo projeto, rode:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Nota
>
>`npx` na primeira linha não é erro de digitação -- é um [package runner que vem com npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App não lida com lógica de backend nem banco de dados. Ele apenas cria um build pipeline para o frontend, podendo portanto ser utilizado com qualquer backend de sua escolha. Por trás, [Babel](https://babeljs.io/) e [Webpack](https://webpack.js.org/) estão sendo utilizados, mas não é necessário saber nada sobre eles.

Quando estiver pronto pra mandar pra produção, rode `npm run build` para criar e mandar o build otimizado de seu app para a pasta `build`. Você pode saber mais sobre o Create React App [através de seu README](https://github.com/facebookincubator/create-react-app#create-react-app--) e o [Guia de Usuário](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) é um framework leve e popular para **aplicações estáticas e renderizadas no servidor** feito com React. Ele inclui **soluções para estilização e roteamento** prontas, e presume que esteja rodando [Node.js](https://nodejs.org/) como ambiente de servidor.

Aprenda Next.js através de [seu guia oficial](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) é a melhor forma de criar **sites estáticos** usando React. Ele permite usar componentes React, porém produzindo HTML e CSS pré-renderizado para garantir a velocidade mais rápida possível de carregamento.

Aprenda Gatsby através de [seu guia oficial](https://www.gatsbyjs.org/docs/) e a [galeria de starter kits](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Toolchains Mais Flexíveis {#more-flexible-toolchains} 

As seguintes toolchains oferecem mais flexibilidade e escolha. Nós as recomendamos para usuários mais experientes:

- **[Neutrino](https://neutrinojs.org/)** combina o poder do [webpack](https://webpack.js.org/) com a simplicidade de presets, e inclui um preset para [React apps](https://neutrinojs.org/packages/react/) e [React components](https://neutrinojs.org/packages/react-components/).

- **[Parcel](https://parceljs.org/)** é um bundler de aplicativos web rápido e sem configuração que [funciona com React](https://parceljs.org/recipes.html#react). 

- **[Razzle](https://github.com/jaredpalmer/razzle)** é um framework renderizado no servidor que não requer configuração, porém oferece mais flexibilidade que o Next.js.

## Criando uma Toolchain do Zero {#creating-a-toolchain-from-scratch} 

Uma build toolchain em JavaScript consiste tipicamente de:

* Um **gerenciador de pacotes**, como [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/). Ele permite aproveitar de um vasto ecosistema de pacotes de terceiros, e facilmente instalar e atualizá-los.

* Um **bundler**, como [webpack](https://webpack.js.org/) ou [Parcel](https://parceljs.org/). Ele permite escrever código modular e empacotá-lo em pequenos pedaços para otimizar o tempo de carregamento.

* Um **compilador** como [Babel](https://babeljs.io/). Ele nos permite escrever código JavaScript moderno que funcione até nos navegadores mais antigos.

Se você prefere criar a sua própria JavaScript toolchain do zero, [dê uma olhada neste guia](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recria algumas das funcionalidades do Create React App.

Não se esqueça de assegurar que sua toolchain customizada [esteja corretamente configurado para produção](/docs/optimizing-performance.html#use-the-production-build).
