---
title: "Create React App 2.0: Babel 7, Sass, e Mais"
author: [timer, gaearon]
---

Create React App 2.0 foi lançado hoje e traz o equivalente a um ano de melhoria numa única atualização de dependência.

Apesar do React por si só [não precisar de nenhuma dependência de compilação](/docs/create-a-new-react-app.html), pode ser desafiador escrever um aplicativo complexo sem um _test runner_ rápido, um minificador para produção e um código fonte modular. Desde do primeiro lançamento, o objetivo do [Create React App](https://github.com/facebook/create-react-app) tem sido ajudar você a focar no que é mais importante -- o código da sua aplicação -- e cuidar da configuração de compilação e testes para você.

Várias ferramentas nas quais ele depende já lançaram novas versões contendo novos recursos e melhorias de desempenho: [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0), [webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4) e [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html). Entretanto, atualizá-las manualmente e fazer com que elas trabalhem bem juntas requer muitos esforços. E é justamente nisso que os [contribuidores do Create React App](https://github.com/facebook/create-react-app/graphs/contributors) tem se mantido ocupados nos últimos meses: **migrando a configuração e dependências para que você não precise fazer sozinho**.

Agora que Create React App 2.0 está fora do período _beta_, vamos ver o que é novo e como podemos testá-lo!

>Nota
>
>Não se sinta pressionado a atualizar nada. Se você está satisfeito com as funcionalidades atuais, o desempenho e a confiabilidade, você pode continuar usando a versão em que você está atualmente! Pode ser uma boa ideia deixar o lançamento 2.0 se estabilizar um pouco antes de alterá-lo em produção.

## Novidades {#whats-new}

Aqui está um pequeno resumo das novidades nesse lançamento:

* 🎉 Mais opções de estilização: você pode usar [Sass](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-sass-stylesheet) e [CSS Modules](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-modules-stylesheet) por padrão.
* 🐠 Atualizamos para [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0), incluindo suporte para [a sintaxe de Fragmento React](/docs/fragments.html#short-syntax) e várias correções de erros.
* 📦 Atualizamos para [webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4), que automaticamente divide seus bundles de JS mais inteligentemente.
* 🃏 Atualizamos para [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html), que inclui um [mode interativo](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#interactive-snapshot-mode) para revisar _snapshots_.
* 💄 Adicionamos [PostCSS](https://preset-env.cssdb.org/features#stage-3) para você utilizar novas funcionalidades do CSS em navegadores antigos.
* 💎 Você usar [Apollo](https://github.com/leoasis/graphql-tag.macro#usage), [Relay Modern](https://github.com/facebook/relay/pull/2171#issuecomment-411459604), [MDX](https://github.com/facebook/create-react-app/issues/5149#issuecomment-425396995) e outros transformadores [Babel Macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) de terceiros.
* 🌠 Agora você pode [import um SVG como componente React](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-svgs) e utilizá-lo no JSX.
* 🐈 Você pode testar o novo modo experimental [Yarn Plug'n'Play](https://github.com/yarnpkg/rfcs/pull/101) que remove a necessidade de `node_modules`.
* 🕸 Agora você pode [usar sua própria implementação de proxy](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#configuring-the-proxy-manually) em desenvolvimento para coincidir com a API do seu servidor.
* 🚀 Agora você pode usar [pacotes escritos para as mais novas versões de Node](https://github.com/sindresorhus/ama/issues/446#issuecomment-281014491)  sem quebrar a compilação.
* ✂️ Agora você pode opcionalmente conseguir um CSS bundle menor se você apenas planeja suportar apenas navegadores modernos.
* 👷‍♀️ Service workers agora são opcionais e implementados utilizando o [Workbox](https://developers.google.com/web/tools/workbox/) do Google.

**Todas essas funcionalidades estão disponíveis por padrão** -- para ativá-las, siga as instruções acima.

## Começando um Projeto com Create React App 2.0 {#starting-a-project-with-create-react-app-20}

Você não precisar atualizar nada. A partir de hoje, quando você executar `create-react-app`, ele usará a versão 2.0 do modelo por padrão. Divirta-se!

Se você quer **usar o modelo antigo 1.x** por alguma razão, você pode fazer isso adicionando o argumento `--scripts-version=react-scripts@1.x` ao comando `create-react-app`.

## Updating a Project to Create React App 2.0 {#updating-a-project-to-create-react-app-20}

Upgrading a non-ejected project to Create React App 2.0 should usually be straightforward. Open `package.json` in the root of your project and find `react-scripts` there.

Then change its version to `2.0.3`:

```js{2}
  // ... other dependencies ...
  "react-scripts": "2.0.3"
```

Run `npm install` (or `yarn`, if you use it). **For many projects, this one-line change is sufficient to upgrade!**

<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><p lang="en" dir="ltr">working here... thanks for all the new functionality 👍</p>&mdash; Stephen Haney (@sdothaney) <a href="https://twitter.com/sdothaney/status/1046822703116607490?ref_src=twsrc%5Etfw">October 1, 2018</a></blockquote>

Here are a few more tips to get you started.

**When you run `npm start` for the first time after the upgrade,** you'll get a prompt asking about which browsers you'd like to support. Press `y` to accept the default ones. They'll be written to your `package.json` and you can edit them any time. Create React App will use this information to produce smaller or polyfilled CSS bundles depending on whether you target modern browsers or older browsers.

**If `npm start` still doesn't quite work for you after the upgrade,** [check out the more detailed migration instructions in the release notes](https://github.com/facebook/create-react-app/releases/tag/v2.0.3). There *are* a few breaking changes in this release but the scope of them is limited, so they shouldn't take more than a few hours to sort out. Note that **[support for older browsers](https://github.com/facebook/create-react-app/blob/master/packages/react-app-polyfill/README.md) is now opt-in** to reduce the polyfill size.

**If you previously ejected but now want to upgrade,** one common solution is to find the commits where you ejected (and any subsequent commits changing the configuration), revert them, upgrade, and later optionally eject again. It's also possible that the feature you ejected for (maybe Sass or CSS Modules?) is now supported out of the box.

>Note
>
>Due to a possible bug in npm, you might see warnings about unsatisfied peer dependencies. You should be able to ignore them. As far as we're aware, this issue isn't present with Yarn.

## Mudanças Radicais {#breaking-changes}

Aqui está uma lista de mudanças neste lançamento que podem quebrar suas aplicações.

* Node 6 não é mais suportado.
* Suporte para navegadores antigos (como do IE 9 até IE 11) agora é opcional em um [pacote separado](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill).
* Agora a divisão de código (code-splitting) utilizando `import()` se comporta mais semelhante à especificação, enquanto que `require.ensure()` foi desativado.
* O ambiente padrão do Jest agora inclui jsdom.
* Suporte para especificar um objeto como configuração de `proxy` foi substituído pelo suporte para módulo proxy customizado.
* Suporte para extensão `.mjs` foi removido até que seu ecossistema se estabilize.
* Definições de PropTypes são automaticamente removidas na compilação em ambiente de produção.

Se algum desses pontos afeta você, as [notas de lançamento 2.0.3](https://github.com/facebook/create-react-app/releases/tag/v2.0.3) tem mais instruções detalhadas.

## Saiba Mais {#learn-more}

Você pode encontrar todo histórico de mudanças nas [notas de lançamento](https://github.com/facebook/create-react-app/releases/tag/v2.0.3). Esse foi um lançamento grande e podemos ter esquecido de algo. Por favor, reporte qualquer problema para nosso [rastreador de issues](https://github.com/facebook/create-react-app/issues/new) e vamos tentar ajudar.

>Nota
>
>Se você está usando versões _alpha_ 2.x, temos [instruções de migração diferentes](https://gist.github.com/gaearon/8650d1c70e436e5eff01f396dffc4114) para elas.

## Agradecimento {#thanks}

Esse lançamento não seria possível sem a maravilhosa comunidade de contribuidores. Gostaríamos de agradecer a [Andreas Cederström](https://github.com/andriijas), [Clement Hoang](https://github.com/clemmy), [Brian Ng](https://github.com/existentialism), [Kent C. Dodds](https://github.com/kentcdodds), [Ade Viankakrisna Fadlil](https://github.com/viankakrisna), [Andrey Sitnik](https://github.com/ai), [Ro Savage](https://github.com/ro-savage), [Fabiano Brito](https://github.com/Fabianopb), [Ian Sutherland](https://github.com/iansu), [Pete Nykänen](https://github.com/petetnt), [Jeffrey Posnick](https://github.com/jeffposnick), [Jack Zhao](https://github.com/bugzpodder), [Tobias Koppers](https://github.com/sokra), [Henry Zhu](https://github.com/hzoo), [Maël Nison](https://github.com/arcanis), [XiaoYan Li](https://github.com/lixiaoyan), [Marko Trebizan](https://github.com/themre), [Marek Suscak](https://github.com/mareksuscak), [Mikhail Osher](https://github.com/miraage) e vários outros que testaram e ofereceram _feedback_ para esse lançamento.
