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
Esta seção fornecerá uma visão geral da organização do código-base React, suas convenções e implementação.

Se você quer [contribuir para o React](/docs/how-to-contribute.html), esperamos que este guia ajude você a se sentir mais à vontade para fazer mudanças.

Não recomendamos necessariamente nenhuma dessas convenções nos aplicativos React. Muitas delas existem por razões históricas e podem mudar com o tempo.

### Pastas de nível superior {#top-level-folders}

Depois de clonar o [repositório do React](https://github.com/facebook/react), você verá algumas pastas no nível superior:

* [`packages`](https://github.com/facebook/react/tree/master/packages) contém metadados (como `package.json`) e o código fonte (subdiretório `src`) para todos os pacotes no repositório React. **Se a sua alteração está relacionada ao código, o subdiretório `src` de cada pacote é onde você passará a maior parte do seu tempo.**

* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) contém alguns pequenos aplicativos de teste do React para os contribuidores.
* `build` é a saída de compilação do React. Não está no repositório, mas aparecerá no seu clone do React depois de você [fizer o _build_](/docs/how-to-contribute.html#development-workflow) pela primeira vez.

A documentação está hospedada [em um repositório separado do React](https://github.com/reactjs/reactjs.org).

Existem algumas outras pastas no nível superior, mas elas são usadas principalmente para as ferramentas e você provavelmente nunca as encontrará ao contribuir.

### Testes Colocados {#colocated-tests}

Nós não temos um diretório no nível superior para testes unitários. Em vez disso, nós os colocamos em um diretório chamado `__tests__` relativo aos arquivos que eles testam.

Por exemplo, um teste para [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) está localizado em [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) ao lado dele.

### Avisos e Invariantes {#warnings-and-invariants}

O código-base do React usa o módulo `warning` para exibir avisos:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'O Math não está funcionando hoje.'
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
  'O Math não está funcionando hoje.'
  );
  didWarnAboutMath = true;
}
```

Os alertas só são ativados no desenvolvimento. Na produção, eles são  retirados. Se você precisar impedir a execuçāo de algum caminho do código, use o módulo `invariant` em vez disso:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'Você não vai passar!'
);
```

**O invariant é lançado quando a condição `invariant` é `false`.**

"Invariant" é apenas uma maneira de dizer "essa condição sempre é verdadeira". Você pode pensar nisso como fazer uma afirmação.

É importante manter o comportamento de desenvolvimento e produção similares. Então o `invariant` é lançado tanto no desenvolvimento quanto na produção. As mensagens de erro são substituídas automaticamente por códigos de erro em produção para evitar afetar negativamente o tamanho do byte.

### Desenvolvimento e produção {#development-and-production}

Você pode usar a variável pseudo-global ` __DEV__` no código-base para proteger blocos de código usados apenas no desenvolvimento.

Ele é embutido durante a etapa de compilação e se transforma em verificações `process.env.NODE_ENV! == 'production'` nos builds do CommonJS.

Para builds autônomas, ele se torna `true` na build não-minificada e é completamente eliminado com os blocos `if` que ele guarda na construção minificada.

```js
if (__DEV__) {
  // Esse código vai executar apenas no desenvolvimento.
}
```

### Flow {#flow}

Recentemente, começamos a introduzir verificações do [Flow](https://flow.org/) no código-base. Os arquivos marcados com a anotação `@ flow` no comentário do cabeçalho da licença estão sendo verificados com typecheck.

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

React usa injeção dinâmica em alguns módulos. Embora seja sempre explícito, ainda é lamentável porque dificulta a compreensão do código. A principal razão pela qual existe é porque o React originalmente só suportava o DOM como um destino. O React Native começou como um fork do React. Nós tivemos que adicionar a injeção dinâmica para deixar o React Native anular alguns comportamentos.

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

Existem vários pontos de injeção no código-base. No futuro, pretendemos nos livrar do mecanismo de injeção dinâmica e conectar todas as peças estaticamente durante a construção.

### Pacotes Múltiplos {#multiple-packages}

React é um [monorepo](https://danluu.com/monorepo/). Seu repositório contém vários pacotes separados para que suas alterações possam ser coordenadas em conjunto e os problemas residam em um só lugar.

### React Core {#react-core}

O "core" do React inclui todas as [`React` APIs de nível superior](/docs/top-level-api.html#react), por exemplo:

* `React.createElement()`
* `React.Component`
* `React.Children`

**O core React inclui apenas as APIs necessárias para definir os componentes.** Não inclui o algoritmo de [reconciliação](/docs/reconciliation.html) ou qualquer código específico da plataforma. Ele é usado pelos componentes React DOM e React Native.

O código do React core está localizado em [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) na árvore de origem. Está disponível no npm como o pacote [`react`](https://www.npmjs.com/package/react). A construção do navegador independente correspondente é chamada `react.js`,e exporta um global chamado `React`.

### Renderizadores {#renderers}

O React foi originalmente criado para o DOM, mas depois foi adaptado para também suportar plataformas nativas com o [React Native](https://reactnative.dev/). Isso introduziu o conceito de "renderizadores" para as partes internas do React.

**Os renderizadores gerenciam como uma árvore no React se transforma nas chamadas de subjacentes da plataforma.**

Renderizadores tambéms são encontrados em [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [Renderizador de React DOM](https://github.com/facebook/react/tree/master/packages/react-dom) renderiza componentes React para o DOM. Implementa [APIs do `React` de nível superior](/docs/react-dom.html) e está disponível como pacote npm [`react-dom`](https://www.npmjs.com/package/react-dom). Ele também pode ser usado como um pacote de navegador autônomo chamado `react-dom.js` que exporta um global do `ReactDOM`.
* [Renderizador do React Native](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renderiza componentes React para views nativas. É usado internamente pelo React Native.
* [Renderizador de testes do React](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renderiza componentes React para árvores JSON. É usado pela funcionalidade de [teste de Snapshot](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) atributo do [Jest](https://facebook.github.io/jest) e está disponível como pacote npm [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) .

O único outro renderizador oficialmente suportado é o [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). Costumava estar em um [repositorio GitHub](https://github.com/reactjs/react-art) separado mas nós os movemos para a árvore de código principal.

>**Nota:**
>
>Tecnicamente o [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) é uma camada muito fina que ensina o React a interagir com a implementação do React Native. O código específico da plataforma real que gerencia as views nativas reside no [repositório do React Native](https://github.com/facebook/react-native) junto com seus componentes.

### Reconciliadores {#reconcilers}

Até mesmo renderizadores muito diferentes, como o React DOM e o React Native, precisam compartilhar muita lógica. Em particular, o algoritmo de  [reconciliação](/docs/reconciliation.html) deve ser o mais semelhante possível para que a renderização declarativa, os componentes personalizados, o state, os lifecycle méthods e os refs funcionem de maneira consistente em todas as plataformas.

Para resolver isso, diferentes renderizadores compartilham algum código entre eles. Nós chamamos essa parte do React de "reconciliador". Quando uma atualização como `setState()` está agendado, o reconciliador chama o método `render()` em componentes na árvore e monta, atualiza ou desmonta.

Os reconciliadores não são empacotados separadamente porque atualmente não possuem uma API pública. Em vez disso, eles são usados exclusivamente por renderizadores como React DOM e React Native.

### Reconciliador Stack {#stack-reconciler}

O reconciliador "stack" é a implementação que energiza o React 15 e o anterior. Desde então, paramos de usá-lo, mas está documentado em detalhes na [próxima seção](/docs/implementation-notes.html).

### Reconciliador Fiber {#fiber-reconciler}

O reconciliador de "fiber" é um novo esforço com o objetivo de resolver os problemas inerentes ao reconciliador de pilha e corrigir alguns problemas de longa data. Foi o reconciliador padrão desde o React 16.

Seus principais objetivos são:

* Capacidade de dividir o trabalho ininterrupto em blocos.
* Capacidade de priorizar, rebaixar e reutilizar o trabalho em andamento.
* Capacidade de retroceder entre pais e filhos para dar suporte ao layout no React.
* Capacidade de retornar vários elementos do método `render()`.
* Melhor suporte para limites de erro.

Você pode ler mais sobre a arquitetura do React Fiber [aqui](https://github.com/acdlite/react-fiber-architecture) e [aqui](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). Embora tenha sido fornecido com o React 16, os recursos assíncronos ainda não estão habilitados por padrão.

Seu código-fonte está localizado em [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Sistema de Eventos  {#event-system}

O React implementa um sistema de eventos sintéticos que é agnóstico dos renderizadores e funciona com React DOM e React Native. Seu código-fonte está localizado em [`packages/legacy-events`](https://github.com/facebook/react/tree/master/packages/legacy-events).

Esse é um [vídeo com mais profundidade no código](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 minutos).

### Qual o proximo passo? {#what-next}

Leia a [próxima seção](/docs/implementation-notes.html)para aprender sobre a implementação do reconciliador antes do React 16 em mais detalhes. Ainda não documentamos os componentes internos do novo reconciliador.
