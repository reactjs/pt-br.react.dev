---
id: codebase-overview
title: Codebase Overview
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---
<!-- OBS: Perguntei na issue do "glossário" como codebase ficaria em ptbr e disseram código-base ao invés de base de código, se ficar muito estranho por favor avisem :like: -->
Esta seção fornecerá uma visão geral da organização da código-base React, suas convenções e implementação.

Se você quer [contribuir para o React](/docs/how-to-contribute.html), esperamos que este guia ajude você a se sentir mais à vontade para fazer mudanças.

Não recomendamos necessariamente nenhuma dessas convenções nos aplicativos React. Muitas delas existem por razões históricas e podem mudar com o tempo.

### Dependências Externas {#external-dependencies}

O React quase não tem dependências externas. Geralmente, um `require ()` aponta para um arquivo na própria código-base do React. No entanto, existem algumas exceções relativamente raras.

O repositório [fbjs](https://github.com/facebook/fbjs) existe porque o React compartilha alguns pequenos utilitários com bibliotecas como [Relay](https://github.com/facebook/relay), e nós os mantemos em sincronia.Não dependemos de módulos pequenos equivalentes no ecossistema do Node porque queremos que os engenheiros do Facebook possam fazer alterações neles sempre que necessário.  Nenhum dos utilitários dentro dos fbjs são considerados APIs públicas, e são destinados apenas para uso por projetos do Facebook, como o React.

### Pastas de nível superior {#top-level-folders}

Depois de clonar o [repositório do React](https://github.com/facebook/react), você verá algumas pastas de nível superior:

* [`packages`](https://github.com/facebook/react/tree/master/packages) contém metadados (como `package.json`) e o código fonte (subdiretório `src`) para todos os pacotes no repositório React. **Se a sua alteração está relacionada ao código, o subdiretório `src` de cada pacote é onde você passará a maior parte do seu tempo.**

* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) contém alguns pequenos aplicativos de teste React para os contribuidores.
* `build` é a saída de compilação do React. Não está no repositório, mas aparecerá no seu clone React depois de você [construí-lo](/docs/how-to-contribute.html#development-workflow) pela primeira vez.

A documentação está hospedada [em um repositório separado do React](https://github.com/reactjs/reactjs.org).

Existem algumas outras pastas de nível superior, mas elas são usadas principalmente para as ferramentas e você provavelmente nunca as encontrará ao contribuir.

### Testes Colocados {#colocated-tests}

Nós não temos um diretório de nível superior para testes unitários. Em vez disso, nós os colocamos em um diretório chamado `__tests__` relativo aos arquivos que eles testam.

Por exemplo, um teste para [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) está localizado em [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) ao lado dele.

### Avisos e Invariantes {#warnings-and-invariants}

A código-base React usa o módulo `warning` para exibir avisos:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'A matemática não está funcionando hoje.'
);
```

**O aviso é mostrado quando a condição `warning` é `false`.**

Uma maneira de pensar sobre isso é que a condição deve refletir a situação normal e não a excepcional.

É uma boa ideia evitar spam no console com avisos duplicados:

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
  'A matemática não está funcionando hoje.'
  );
  didWarnAboutMath = true;
}
```

Os avisos só são ativados no desenvolvimento. Na produção, eles são  retirados. Se você precisar proibir algum caminho de código de executar, use o módulo `invariant` em vez disso:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'Você não passará!'
);
```

**O invariant é lançado quando a condição `invariant` é `false`.**

"Invariant" é apenas uma maneira de dizer "essa condição sempre é verdadeira". Você pode pensar nisso como fazer uma afirmação.

É importante manter o comportamento de desenvolvimento e produção similares, então o `invariant` é lançado tanto no desenvolvimento quanto na produção. As mensagens de erro são substituídas automaticamente por códigos de erro em produção para evitar afetar negativamente o tamanho do byte.

### Desenvolvimento e produção {#development-and-production}

Você pode usar a variável pseudo-global ` __DEV__` na código-base para proteger blocos de código apenas de desenvolvimento.

Ele é embutido durante a etapa de compilação e se transforma em verificações `process.env.NODE_ENV! == 'production'` nos builds do CommonJS.

Para builds autônomas, ele se torna `true` na build não-minificada e é completamente eliminado com os blocos `if` que ele guarda na construção minificada.

```js
if (__DEV__) {
  // Esse código vai executar apenas no desenvolvimento.
}
```

### Flow {#flow}

Recentemente, começamos a introduzir verificações [Flow](https://flow.org/) na código-base. Os arquivos marcados com a anotação `@ flow` no comentário do cabeçalho da licença estão sendo verificados com typecheck.

Aceitamos pull requests [adicionando anotações do Flow ao código existente](https://github.com/facebook/react/pull/7600/files). Anotações de fluxo são assim:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Quando possível, o novo código deve usar anotações do Flow.
Você pode executar o `yarn flow` localmente para verificar seu código com o Flow.

### Injeção Dinâmica {#dynamic-injection}

React usa injeção dinâmica em alguns módulos. Embora seja sempre explícito, ainda é lamentável porque dificulta a compreensão do código. A principal razão pela qual existe é porque o React originalmente só suportava DOM como um destino. React Native começou como um fork do React. Nós tivemos que adicionar injeção dinâmica para deixar o React Native anular alguns comportamentos.

Você pode ver módulos declarando suas dependências dinâmicas como este:

```js
// Injetado dinamicamente
var textComponentClass = null;

// Depende do valor injetado dinamicamente
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Fornece uma oportunidade para injeção dinâmica
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

O campo `injection` não é tratado de maneira especial. Mas por convenção, isso significa que este módulo quer ter algumas dependências (presumivelmente específicas da plataforma) injetadas em tempo de execução.

There are multiple injection points in the codebase. In the future, we intend to get rid of the dynamic injection mechanism and wire up all the pieces statically during the build.

### Multiple Packages {#multiple-packages}

React is a [monorepo](http://danluu.com/monorepo/). Its repository contains multiple separate packages so that their changes can be coordinated together, and issues live in one place.

### React Core {#react-core}

The "core" of React includes all the [top-level `React` APIs](/docs/top-level-api.html#react), for example:

* `React.createElement()`
* `React.Component`
* `React.Children`

**React core only includes the APIs necessary to define components.** It does not include the [reconciliation](/docs/reconciliation.html) algorithm or any platform-specific code. It is used both by React DOM and React Native components.

The code for React core is located in [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) in the source tree. It is available on npm as the [`react`](https://www.npmjs.com/package/react) package. The corresponding standalone browser build is called `react.js`, and it exports a global called `React`.

### Renderers {#renderers}

React was originally created for the DOM but it was later adapted to also support native platforms with [React Native](http://facebook.github.io/react-native/). This introduced the concept of "renderers" to React internals.

**Renderers manage how a React tree turns into the underlying platform calls.**

Renderers are also located in [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

The only other officially supported renderer is [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). It used to be in a separate [GitHub repository](https://github.com/reactjs/react-art) but we moved it into the main source tree for now.

>**Note:**
>
>Technically the [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) is a very thin layer that teaches React to interact with React Native implementation. The real platform-specific code managing the native views lives in the [React Native repository](https://github.com/facebook/react-native) together with its components.

### Reconcilers {#reconcilers}

Even vastly different renderers like React DOM and React Native need to share a lot of logic. In particular, the [reconciliation](/docs/reconciliation.html) algorithm should be as similar as possible so that declarative rendering, custom components, state, lifecycle methods, and refs work consistently across platforms.

To solve this, different renderers share some code between them. We call this part of React a "reconciler". When an update such as `setState()` is scheduled, the reconciler calls `render()` on components in the tree and mounts, updates, or unmounts them.

Reconcilers are not packaged separately because they currently have no public API. Instead, they are exclusively used by renderers such as React DOM and React Native.

### Stack Reconciler {#stack-reconciler}

The "stack" reconciler is the implementation powering React 15 and earlier. We have since stopped using it, but it is documented in detail in the [next section](/docs/implementation-notes.html).

### Fiber Reconciler {#fiber-reconciler}

The "fiber" reconciler is a new effort aiming to resolve the problems inherent in the stack reconciler and fix a few long-standing issues. It has been the default reconciler since React 16.

Its main goals are:

* Ability to split interruptible work in chunks.
* Ability to prioritize, rebase and reuse work in progress.
* Ability to yield back and forth between parents and children to support layout in React.
* Ability to return multiple elements from `render()`.
* Better support for error boundaries.

You can read more about React Fiber Architecture [here](https://github.com/acdlite/react-fiber-architecture) and [here](https://blog.ag-grid.com/index.php/2018/11/29/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). While it has shipped with React 16, the async features are not enabled by default yet.

Its source code is located in [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Event System {#event-system}

React implements a synthetic event system which is agnostic of the renderers and works both with React DOM and React Native. Its source code is located in [`packages/events`](https://github.com/facebook/react/tree/master/packages/events).

There is a [video with a deep code dive into it](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 mins).

### What Next? {#what-next}

Read the [next section](/docs/implementation-notes.html) to learn about the pre-React 16 implementation of reconciler in more detail. We haven't documented the internals of the new reconciler yet.
