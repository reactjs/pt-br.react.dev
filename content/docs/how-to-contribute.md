---
id: how-to-contribute
title: Como Contribuir
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React é um dos primeiros projetos de código aberto do Facebook que está sendo desenvolvido muito ativamente, além de ser usado para entregar código para todos em [facebook.com](https://www.facebook.com). Nós ainda estamos trabalhando para tornar esse projeto mais transparente e fácil possível, mas ainda não estamos lá. Esperamos que essa documentação torne esse processo de contribuição mais clara e responda algumas perguntas que você possa ter.

### [Código de Conduta](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) {#code-of-conduct}

O Facebook adotou o [Convênio do Contribuinte](https://www.contributor-covenant.org/) como seu Código de Conduta, e esperamos que os participantes do projeto o adotem. Por favor, [leia o texto completo](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) para que você possa entender quais ações serão ou não toleradas.

### Desenvolvimento Aberto {#open-development}

Todo trabalho no React acontece diretamente no [GitHub](https://github.com/facebook/react). Tanto membros do ***Core Team*** quanto contribuidores externos devem enviar ***pull requests*** que vão passar pelo mesmo processo de revisão.

### Versionamento Semântico {#semantic-versioning}

O React segue o [versionamento semântico](http://semver.org/). Lançamos versões de ***patch*** para correções críticas, versões secundárias (minor version) para novos recursos e versões principais (major version) para qualquer alteração de quebra. Quando fazemos alterações significativas, também introduzimos alguns avisos de descontinuidade em uma versão secundária para que nossos usuários tenham conhecimento sobre as próximas alterações e migrem seu código com antecedência. Saiba mais sobre nosso compromisso com a estabilidade e a migração incremental em [nossa política de versão](/docs/faq-versioning.html).

Toda mudança significativa é documentada na [***changelog***](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### Organização de Branches {#branch-organization}

Envie todas as alterações para a [`branch master`](https://github.com/facebook/react/tree/master). Não usamos ramificações separadas para desenvolvimento ou para os próximos lançamentos. Fazemos o possível para manter a `master` em boas condições, com testes passando todas as vezes.

O código que chega na `master` deve ser compatível com a versão estável mais recente. Pode conter recursos adicionais, mas nenhuma alteração de última hora. Deveríamos ser capazes de lançar uma nova versão secundária apartir da `master` a qualquer momento.

### Feature Flags {#feature-flags}

Para manter o ramo da `master` em um estado liberável, as alterações de interrupção e os recursos experimentais devem ser colocados atrás de uma feature flag.

Feature flags são definidas em [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/master/packages/shared/ReactFeatureFlags.js). Algums builds do React podem ativar conjuntos diferentes de features flags; por exemplo, o React Native build pode ser configurado de maneira diferente que o React DOM. Essas flags são encontradas em [`packages/shared/forks`](https://github.com/facebook/react/tree/master/packages/shared/forks). Feature flags são digitados estaticamente pelo Flow, para que você possa executar o `yarn flow` para confirmar que atualizou todos os arquivos necessários.

O sistema de build do React removerá as branches de recursos desativados antes da publicação. Um trabalho de integração contínua é executado em todas as confirmações para verificar alterações no tamanho do pacote. Você pode usar a alteração de tamanho como um sinal de que o recurso foi bloqueado corretamente.

### Bugs {#bugs}

#### Onde Encontrar Problemas Conhecidos {#where-to-find-known-issues}

Nós estamos utilizando as [GitHub Issues](https://github.com/facebook/react/issues) para nossas páginas públicas. Nós vamos ficar de olho e tentar manter claro quando estamos trabalhando internamente na correção de algum bug. Antes de preencher uma nova tarefa, verifique se o problema já existe.

#### Relatando novos problemas {#reporting-new-issues}

A melhor maneira de corrigir o problema é fornecer um caso de teste reduzido. Este [template no JSFiddle](https://jsfiddle.net/Luktwrdm/) é um excelente ponto de partida.

#### Bugs de Segurança {#security-bugs}

O Facebook tem um [programa de recompensas](https://www.facebook.com/whitehat/) para a divulgação segura de bugs de segurança. Com isso em mente, não reporte esses problemas de forma pública. Percorra o processo descrito nessa página.

### Como entrar em contato {#how-to-get-in-touch}

* IRC: [#reactjs on freenode](https://webchat.freenode.net/?channels=reactjs)
* [Fóruns de discussão](/community/support.html#popular-discussion-forums)

Há também uma comunidade ativa de usuários do React na plataforma no [Discord](http://www.reactiflux.com/) caso você precise de ajuda.

### Propondo uma alteração {#proposing-a-change}

Se você pretende alterar a API pública ou fazer alterações não triviais na implementação, recomendamos [abrir uma ***issue***](https://github.com/facebook/react/issues/new). Isso nos permite chegar a um acordo sobre sua proposta antes de colocar um esforço significativo nela.

Se você está apenas corrigindo um bug, não tem problema em enviar uma ***pull request*** diretamente, mas ainda sim recomendamos abrir uma ***issue*** com detalhes sobre o que você está corrigindo. Isso é útil caso não aceitemos essa correção específica, mas queremos acompanhar o problema.

### Seu primeiro ***Pull Request*** {#your-first-pull-request}

Trabalhando em seu primeiro ***Pull Request***. Você pode aprender como desta série de vídeos gratuitos:

**[Como contribuir para um projeto de código aberto no GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

Para ajudar você a se familiarizar com o nosso processo de contribuição, temos uma lista de [boas primeiras ***issues***](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue") que contém erros que têm um escopo relativamente limitado. Este é um ótimo lugar para começar.

Se você decidir corrigir um bug, por favor, verifique o tópico do comentário caso alguém já esteja trabalhando em uma correção. Se ninguém estiver trabalhando no momento, por favor deixe um comentário dizendo que você pretende trabalhar nele para que outras pessoas não dupliquem sem querer seu esforço.

Se alguém assumir uma ***issue***, mas não fizer o acompanhamento por mais de duas semanas, não há problema em você assumir, mas mesmo assim você ainda deve deixar um comentário.

### Enviando um ***Pull Request*** {#sending-a-pull-request}

O Core Team está monitorando os ***pull requests***. Analisaremos seu envio e fazermos o ***merge***, solicitaremos alterações ou podemos fechá-la com uma explicação plausível. Para alterações de API, podemos precisar corrigir nossos usos internos no Facebook.com, o que pode causar algum atraso. Faremos o nosso melhor para fornecer atualizações e feedback durante todo o processo.

**Antes de enviar o seu pull request,** certifique-se de ter feito os seguintes passos:

1. Faça fork do [repositório oficial](https://github.com/facebook/react) and criou sua branch da `master`.
2. Execute `yarn` no repositório raíz.
3. Se você corrigiu um bug ou um código adicionado que deve ser testado, adicione testes!
4. Certifique-se de que a suíte de teste passe (`yarn test`). Dica: `yarn test --watch TestName` é útil no desenvolvimento.
5. Execute `yarn test-prod` para testar no ambiente de produção. Suporta as mesmas opções que `yarn test`.
6. Se você precisar de um depurador, execute `yarn debug-test --watch TestName`, abra `chrome://inspect`e aperte em "Inspecionar".
7. Formate seu código com [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Certifique-se de que seus códigos foram verificados com linters (`yarn lint`). Dica: `yarn linc` verifica somente os arquivos alterados.
9. Rode o [Flow](https://flowtype.org/) para typechecks (`yarn flow`).
10. Se ainda não fez, preencha o CLA.

### Licença de Acordo de Contribuidor (***Contributor License Agreement*** - CLA) {#contributor-license-agreement-cla}

Para aceitar seu ***pull request***, precisamos que você envie um CLA. Você só precisa fazer isso uma vez, então se você fez isso para outro projeto de código aberto do Facebook, você está pronto para continuar. Se você estiver enviando um ***pull request*** pela primeira vez, nos informe que você concluiu o CLA e então podemos fazer uma verificação cruzada com seu GitHub

**[Preencha sua CLA aqui.](https://code.facebook.com/cla)**

### Pré-requisitos de Contribuição {#contribution-prerequisites}

* Possuir o [Node](https://nodejs.org) instalado na versão v8.0.0+ e [Yarn](https://yarnpkg.com/en/) na versão v1.2.0+.
* Possuir o [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) instalado.
* Você deve ter o `gcc` instalado ou está confortável em instalar um compilador, se necessário. Algumas de nossas dependências podem exigir uma etapa de compilação. No OS X, as Ferramentas de Linha de Comando do Xcode cobrirão isso. No Ubuntu, `apt-get install build-essential` instalará os pacotes requeridos. Comandos semelhantes devem funcionar em outras distribuições Linux. O Windows irá requerer alguns passos adicionais, veja as instruções de instalação do [node-gyp](https://github.com/nodejs/node-gyp#installation) para detalhes.
* Você deve ser familiarizado com o Git.

### Fluxo de Trabalho de Desenvolvimento {#development-workflow}

Depois de clonar o React, execute `yarn` para buscar suas dependências. Então, você pode executar vários comandos:

* `yarn lint` verifica o estilo de código.
* `yarn linc` funciona como o `yarn lint`, mas é mais rápido porque verifica apenas os arquivos que diferem na sua ***branch***.
* `yarn test` executa o conjunto de testes completo.
* `yarn test --watch` executa um observador de testes interativo.
* `yarn test <pattern>` executa testes com nomes de arquivos correspondentes.
* `yarn test-prod` executa testes no ambiente de produção. Suporta todas as mesmas opções que o `yarn test`.
* `yarn debug-test` é como `yarn test` mas com um depurador. Abra `chrome://inspect` e clique em "Inspecionar".
* `yarn flow` executa o typecheck do [Flow](https://flowtype.org/) .
* `yarn build` cria uma pasta `build` com todos os pacotes.
* `yarn build react/index,react-dom/index --type=UMD` cria compilações UMD somente com o React e ReactDOM.

Recomendamos executar o `yarn test` (ou suas variações acima) para garantir que você não introduza nenhuma regressão enquanto trabalha na sua mudança. No entanto, pode ser útil testar sua versão do React em um projeto real.

Primeiro, execute `yarn build`. Isto irá produzir pacotes pré-construídos na pasta `build`, bem como irá preparar pacotes npm dentro da pasta `build/packages`.

A maneira mais fácil de testar suas alterações é rodar `yarn build react/index,react-dom/index --type=UMD` e depois abrir `fixtures/packaging/babel-standalone/dev.html`. Este arquivo já usa o `react.development.js` a partir da pasta `build` para que ele possa pegar suas alterações.

Se você quiser experimentar as alterações no seu projeto React existente, poderá copiar `build/dist/react.development.js`,`build/dist/react-dom.development.js` ou qualquer outro build em seu aplicativo e usá-los em vez da versão estável.

Se o seu projeto usa React from npm, você pode excluir `react` e `react-dom` em suas dependências e usar o `yarn link` para apontá-los para a pasta local `build`. Note que **em vez de `--type = UMD`, você desejará passar `--type = NODE` ao criar**. Você também precisará criar o pacote `scheduler`:

```sh
cd ~/path_to_your_react_clone/
yarn build react/index,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```

Toda vez que você executar `yarn build` na pasta React, as versões atualizadas aparecerão no `node_modules` do seu projeto. Você pode então reconstruir seu projeto para testar suas alterações.

Se algum pacote ainda estiver faltando (por exemplo, talvez você use `react-dom/server` em seu projeto), você sempre poderá fazer uma compilação completa com `yarn build`. Observe que executar o `yarn build` sem opções leva muito tempo.

Ainda exigimos que seu ***pull request*** contenha testes de unidade para qualquer nova funcionalidade. Dessa forma, podemos garantir que não quebremos seu código no futuro.

### Guia de Estilo {#style-guide}

Usamos um formatador de código automático chamado [Prettier](https://prettier.io/). Execute o `yarn prettier` depois de fazer qualquer alteração no seu código.

Então, nosso linter irá capturar a maioria dos problemas que possam existir em seu código. Você pode verificar o status do seu estilo de código simplesmente executando `yarn linc`.

No entanto, ainda existem alguns estilos que o linter não consegue captar. Se você não tem certeza sobre alguma coisa, veja o [Guia de Estilos do Airbnb](https://github.com/airbnb/javascript) para te direcionar no caminho certo.

### Pedido de Comentários (Request for Comments - RFC) {#request-for-comments-rfc}

Muitas alterações, incluindo correções de bugs e melhorias na documentação, podem ser implementadas e revisadas por meio do fluxo de trabalho normal de ***pull requests*** do GitHub.

Algumas mudanças, entretanto, são "substanciais" e pedimos que estas sejam submetidas a um pequeno processo de design e produzam um consenso entre o Core Team do React.

O processo "RFC" (pedido de comentários) destina-se a fornecer um caminho consistente e controlado para que novos recursos entrem no projeto. Você pode contribuir visitando o repositório [rfcs](https://github.com/reactjs/rfcs).

### Licença {#license}

Ao contribuir com o React, você concorda que suas contribuições serão licenciadas sob sua licença do MIT.

### O que vem a seguir? {#what-next}

Leia a [próxima seção](/docs/codebase-overview.html) para saber como a base de código é organizada.
