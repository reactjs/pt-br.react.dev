---
title: Iniciar um novo projeto no React
---

<Intro>

Se você está aprendendo React ou pensando em adicioná-lo a um projeto existente, pode começar rapidamente  [adicionando React a qualquer página HTML com tags de script](/learn/add-react-to-a-website). Se o seu projeto precisar de muitos componentes e muitos arquivos, talvez seja hora de considerar as opções abaixo!

</Intro>

## Escolha sua própria aventura {/*choose-your-own-adventure*/}

React é uma biblioteca que permite organizar o código da interface do usuário dividindo-o em partes chamadas componentes. O React não cuida do roteamento ou gerenciamento de dados. Para esses recursos, convém usar bibliotecas de terceiros ou escrever suas próprias soluções. Isso significa que existem várias maneiras de iniciar um novo projeto React:

* Comece com uma **configuração mínima com apenas uma cadeia de ferramentas,** adicionando recursos ao seu projeto conforme necessário.
* Comece com um **software opinativo** com funcionalidade comum já incorporada.

Se você está apenas começando, procurando construir algo grande ou deseja configurar sua própria cadeia de ferramentas, este guia te colocará no caminho certo.

## Começando com uma cadeia de ferramentas React {/*getting-started-with-a-react-toolchain*/}

Se você está apenas começando com o React, recomendamos [Ceate React App](https://create-react-app.dev/),  maneira mais popular de experimentar os recursos do React e uma ótima maneira de criar um novo aplicativo do lado do cliente de single-page. Create React App é uma cadeia de ferramentas sem opinião configurada apenas para React. As cadeias de ferramentas ajudam com coisas como:

* Dimensionamento para muitos arquivos e componentes
* Usando bibliotecas de terceiros do npm
* Detectando erros comuns antecipadamente
* Edição ao vivo de CSS e JS em desenvolvimento
* Otimizando a saída para produção

Você pode começar a construir com o Create React App com uma linha de código em seu terminal! (**Certifique-se de ter o [Node.js](https://nodejs.org/) instalado!**)

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

Agora você pode executar seu aplicativo:

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

Para mais informações [confira o guia oficial ](https://create-react-app.dev/docs/getting-started).

> Create React App não lida com lógica de back-end ou bancos de dados; ele apenas cria um pipeline de construção de front-end. Isso significa que você pode usá-lo com qualquer back-end que desejar. Mas se você estiver procurando por mais recursos, como roteamento e lógica do lado do servidor, continue lendo!

### Outras opções {/*other-options*/}

O Create React App é ótimo para começar a trabalhar com o React, mas se você quiser uma cadeia de ferramentas ainda mais leve, tente uma dessas outras cadeias de ferramentas populares:

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)
* [Snowpack](https://www.snowpack.dev/tutorials/react)

## Programando com com React e um framework
 {/*building-with-react-and-a-framework*/}

Se você deseja iniciar um projeto maior e pronto para produção, o [Next.js](https://nextjs.org/) é um ótimo lugar para começar. Next.js é uma estrutura popular e leve para aplicativos estáticos e renderizados por servidor criados com React. Ele vem em um pacote com recursos como roteamento, estilo e renderização do lado do servidor, colocando seu projeto em funcionamento rapidamente.

[Comece a criar com Next.js](https://nextjs.org/docs/getting-started) usando o guia oficial.

### Outras opções {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/) permite gerar sites estáticos com React com GraphQL.
* [Razzle](https://razzlejs.org/)  é uma estrutura de renderização de servidor que não requer nenhuma configuração, mas oferece mais flexibilidade do que o Next.js.

## Cadeias de ferramentas personalizadas
s {/*custom-toolchains*/}

Você pode preferir criar e configurar sua própria cadeia de ferramentas. Uma cadeia de ferramentas de construção JavaScript normalmente consiste em:

* Um **gerenciador de pacotes**—permite instalar, atualizar e gerenciar pacotes de terceiros. [Yarn](https://yarnpkg.com/) e [npm](https://www.npmjs.com/) são dois gerenciadores de pacotes populares.
* Um **bundler**— permite escrever código modular e agrupá-lo em pequenos pacotes para otimizar o tempo de carregamento. [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/), [Parcel](https://parceljs.org/) são alguns bundlers populares.
* Um **compilador**— permite escrever código JavaScript moderno que ainda funciona em navegadores mais antigos. [Babel](https://babeljs.io/) é um desses exemplos.

Em um projeto maior, você também pode querer ter uma ferramenta para gerenciar vários pacotes em um único repositório.  [Nx](https://nx.dev/react) é um exemplo deesse tipo de ferramenta.

Se você preferir configurar sua própria cadeia de ferramentas JavaScript do zero, [confira este guia ](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) que recria algumas das funcionalidades Create React App.
