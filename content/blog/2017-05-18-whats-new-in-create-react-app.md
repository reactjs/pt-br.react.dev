---
title: "O que há de novo no Create React App"
author: [gaearon]
---

A menos de um ano atrás, nós introduzimos [Create React App](/blog/2016/07/22/create-apps-with-no-configuration.html) como uma forma oficialmente apoiada de criar aplicações com zero configuração. Desde então, o projeto teve um enorme crescimento, com mais de 950 commits de mais de 250 contribuidores.

Hoje, estamos entusiasmados em anunciar que muitos recursos que estiveram na pipeline dos últimos meses foram finalmente lançados.

Como de costume com o Create React App, **você pode aproveitar essas melhorias em suas aplicações não ejetadas existentes atualizando uma única dependência** e seguindo nossas [instruções de migração](https://github.com/facebookincubator/create-react-app/releases/tag/v1.0.0).

Aplicações recém-criadas obterão essas melhorias automaticamente.

### webpack 2 {#webpack-2}

>*Esta mudança foi uma contribuição de [@Timer](https://github.com/Timer) em [#1291](https://github.com/facebookincubator/create-react-app/pull/1291).*

Atualizamos para o webpack 2, que foi [oficialmente lançado](https://medium.com/webpack/webpack-2-and-beyond-40520af9067f) há alguns meses. É uma grande atualização com muitas correções de bugs e melhorias gerais. Temos testado por um tempo, e agora consideramos estável o suficiente para recomendar a todos.

Embora o formato de configuração do webpack tenha mudado, os usuários do Create React App que não ejetaram não precisam se peocupar com isso, pois atualizamos a configuração do nosso lado.

Se você ejetou sua aplicção por algum motivo, Webpack provê um [guia de migração de configuração](https://webpack.js.org/guides/migrating/) que você pode seguir para atualizar suas aplicações. Note que com cada release do Create React App, nós estamos trabalhando para suportar mais casos de uso fora da caixa para que você não tenha que ejetar no futuro.

A funcionalidade mais notável do webpack 2 é a habilidade de escrever e importar [módulos ES6](http://2ality.com/2014/09/es6-modules-final.html) diretamente sem compilar eles para CommonJS. Isso não deve afetar como você escreve código desde que você já use instruções `import` e `export`, mas ajudará a detectar mais erros, como a falta de exportações nomeadas em tempo de compilação:

![Validação de export](../images/blog/cra-update-exports.gif) 

No futuro, à medida que o ecossistema em torno dos módulos ES6 amadurecer, você poderá esperar mais melhorias no tamanho do bundle da sua aplicação, graças a [tree shaking](https://webpack.js.org/guides/tree-shaking/).

### Sobreposição de erro em tempo de execução {#error-overlay}

>*Esta mudança foi uma contribuição de [@Timer](https://github.com/Timer) e [@nicinabox](https://github.com/nicinabox) em [#1101](https://github.com/facebookincubator/create-react-app/pull/1101), [@bvaughn](https://github.com/bvaughn) em [#2201](https://github.com/facebookincubator/create-react-app/pull/2201).*

Você já cometeu algum erro no código e só percebeu isso depois que o console foi inundado por erros enigmáticos? Ou pior, você já enviou uma aplicação com falhas para produção porque acidentalmente perdeu um erro no desenvolvimento?

Para resolver esses problemas, estamos introduzindo uma sobreposição sempre que houver um erro não detectado na sua aplicação. Ele só aparece no desenvolvimento e você pode descartá-lo pressionando Escape. 

Um GIF vale mais que mil palavras:
    
![Sobreposição de erro em tempo de execução](../images/blog/cra-runtime-error.gif) 

(Sim, ele se integra ao seu editor!)

No futuro, planejamos ensinar a sobreposição de erros de tempo de execução para entender mais sobre sua aplicação React. Por exemplo, após o React 16, planejamos mostrar pilhas de componentes React além das pilhas JavaScript quando um erro é gerado.

### Aplicações Web Progressivas por Padrão {#progressive-web-apps-by-default}

>*Esta mudança foi uma contribuição de [@jeffposnick](https://github.com/jeffposnick) em [#1728](https://github.com/facebookincubator/create-react-app/pull/1728).*

Projetos criados recentemente são construídos como [Aplicações Web Progressivas](https://developers.google.com/web/progressive-web-apps/) por padrão. Isso significa que eles empregam [trabalhadores de serviço](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) com uma [estratégia de cache offline-first](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network) para minimizar o tempo necessário para veicular a aplicação aos usuários que o visitam novamente. Você pode desativar esse comportamento, mas recomendamos para aplicações novas e existentes, especialmente se você tem como alvo dispositivos móveis.

![Carregando ativos do trabalhador de serviço](../images/blog/cra-pwa.png) 

As novas aplicações têm esses recursos automaticamente, mas você pode converter facilmente um projeto existente em uma Aplicações Web Progressiva seguindo [nosso guia de migração](https://github.com/facebookincubator/create-react-app/releases/tag/v1.0.0).

Adicionaremos [mais documentação](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app ) sobre esse tópico nas próximas semanas. Por favor, fique à vontade para [fazer qualquer pergunta](https://github.com/facebookincubator/create-react-app/issues/new) no rastreador de problemas!

### Jest 20 {#jest-20}

>*Esta mudança foi uma contribuição de [@rogeliog](https://github.com/rogeliog) em [#1614](https://github.com/facebookincubator/create-react-app/pull/1614) e [@gaearon](https://github.com/gaearon) in [#2171](https://github.com/facebookincubator/create-react-app/pull/2171).*
   
Agora estamos usando a versão mais recente do Jest, que inclui inúmeras correções e melhorias. Você pode ler mais sobre as mudanças nas postagens [Jest 19](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html) e [Jest 20](http://facebook.github.io/jest/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html).

Os destaques incluem um novo [modo de onservação imersivo](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html#immersive-watch-mode), [um melhor formato de snapshot](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html#snapshot-updates), [melhorias na impressão de testes ignorados](https://facebook.github.io/jest/blog/2017/02/21/jest-19-immersive-watch-mode-test-platform-improvements.html#improved-printing-of-skipped-tests), e [novas APIs de teste](https://facebook.github.io/jest/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html#new-improved-testing-apis).

![Observador de teste imersivo](../images/blog/cra-jest-search.gif) 

Além disso, o Create React App agora suporta a configuração de algumas opções do Jest relacionadas aos relatórios de cobertura.

### Code Splitting with Dynamic import() {#code-splitting-with-dynamic-import}

>*This change was contributed by [@Timer](https://github.com/Timer) in [#1538](https://github.com/facebookincubator/create-react-app/pull/1538) and [@tharakawj](https://github.com/tharakawj) in [#1801](https://github.com/facebookincubator/create-react-app/pull/1801).*
   
It is important to keep the initial JavaScript payload of web apps down to the minimum, and [load the rest of the code on demand](https://medium.com/@addyosmani/progressive-web-apps-with-react-js-part-2-page-load-performance-33b932d97cf2). Although Create React App supported [code splitting](https://webpack.js.org/guides/code-splitting-async/) using `require.ensure()` since the first release, it used a webpack-specific syntax that did not work in Jest or other environments.
   
In this release, we are adding support for the [dynamic `import()` proposal](http://2ality.com/2017/01/import-operator.html#loading-code-on-demand) which aligns with the future web standards. Unlike `require.ensure()`, it doesn't break Jest tests, and should eventually become a part of JavaScript. We encourage you to use `import()` to delay loading the code for non-critical component subtrees until you need to render them.

![Creating chunks with dynamic import](../images/blog/cra-dynamic-import.gif)

### Better Console Output {#better-console-output}

>*This change was contributed by [@gaearon](https://github.com/gaearon) in [#2120](https://github.com/facebookincubator/create-react-app/pull/2120), [#2125](https://github.com/facebookincubator/create-react-app/pull/2125), and [#2161](https://github.com/facebookincubator/create-react-app/pull/2161).*

We have improved the console output across the board.

For example, when you start the development server, we now display the LAN address in additional to the localhost address so that you can quickly access the app from a mobile device on the same network:

![Better console output](../images/blog/cra-better-output.png) 

When lint errors are reported, we no longer show the warnings so that you can concentrate on more critical issues. Errors and warnings in the production build output are better formatted, and the build error overlay font size now matches the browser font size more closely.

### Mas espere... Há Mais! {#but-wait-theres-more}

Você não pode encaixar tudo em uma postagem de blog, mas há outros recursos solicitados há muito tempo nesta versão, como [arquivos `.env` específicos de ambiente e locais](https://github.com/facebookincubator/create-react-app/pull/1344), [uma regra de lint contra globais com nomes confusos](https://github.com/facebookincubator/create-react-app/pull/2130), [suporte para vários proxies em desenvolvimento](https://github.com/facebookincubator/create-react-app/pull/1790), [um script de inicialização do navegador personalizável](https://github.com/facebookincubator/create-react-app/pull/1590) e muitas correções de bugs.

Você pode ler o registro de alterações completo e o guia de migração nas [notas da versão v1.0.0](https://github.com/facebookincubator/create-react-app/releases/tag/v1.0.0).

### Agradecimentos {#acknowledgements}

Está versão é o resultado de meses de trabalho de muitas pessoas na comunidade React. Ela tem como objetivo melhorar a experiência do desenvolvedor e do usuário, pois acreditamos que elas são coplementares e amdam de mãos dadas.

Somos gratos a [todos que contribuiram](https://github.com/facebookincubator/create-react-app/graphs/contributors), seja com código, documentação, ou ajudando outras pessoas. Gostaríamos de agradecer especialmente [Joe Haddad](https://github.com/timer) pela sua ajuda inestimável na menutenção do projeto. 

Estamos empolgados em trazer essas melhorias para todos que usam o Create React App, e estamos ansiosos por mais dos seus comentários e contribuições.

