---
id: addons
title: Add-Ons
#title: Complementos
permalink: docs/addons.html
---

<!-- > Notas:
>
> `React.addons` entry point is deprecated as of React v15.5. The add-ons have moved to separate modules, and some of them have been deprecated. -->

> Notas:
>
> O ponto de entrada `React.addons` é obsoleto a partir da versão v15.5 do React. Os add-ons foram movidos para módulos separados e alguns deles foram descontinuados.

<!-- The React add-ons are a collection of useful utility modules for building React apps. **These should be considered experimental** and tend to change more often than the core. -->

Os add-ons do React são uma coleção de módulos utilitários úteis para criar aplicativos React. **Estes devem ser considerados experimentais** e tendem a mudar com mais frequência do que a base.

<!-- - [`createFragment`](/docs/create-fragment.html), to create a set of externally-keyed children. -->
- [`createFragment`](/docs/create-fragment.html), para criar um conjunto filhos de chaves externas.

<!-- The add-ons below are in the development (unminified) version of React only: -->
Os add-ons abaixo estão apenas na versão de desenvolvimento(não minificados) do React:
<!-- - [`Perf`](/docs/perf.html), a performance profiling tool for finding optimization opportunities. -->
- [`Perf`](/docs/perf.html), uma ferramenta de perfil de desempenho para encontrar oportunidades de otimização.
<!-- - [`ReactTestUtils`](/docs/test-utils.html), simple helpers for writing test cases. -->
- [`ReactTestUtils`](/docs/test-utils.html), ajudantes simples para escrever casos de teste.

### Add-ons herdados {#legacy-add-ons}
<!-- The add-ons below are considered legacy and their use is discouraged. They will keep working in observable future, but there is no further development. -->
Os add-ons abaixo são considerados legados e seu uso é desencorajado. Eles continuarão trabalhando em um futuro observável, mas não há mais desenvolvimento.

<!-- - [`PureRenderMixin`](/docs/pure-render-mixin.html). Use [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) instead. -->
- [`PureRenderMixin`](/docs/pure-render-mixin.html). Use [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).
<!-- - [`shallowCompare`](/docs/shallow-compare.html), a helper function that performs a shallow comparison for props and state in a component to decide if a component should update. We recommend using [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) instead. -->
- [`shallowCompare`](/docs/shallow-compare.html), uma função auxiliar que executa uma comparação superficial para props e state em um componente para decidir se um componente deve atualizar. Nós recomendamos utilizar [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).
- [`update`](/docs/update.html). Use [`kolodny/immutability-helper`](https://github.com/kolodny/immutability-helper).
<!-- - [`ReactDOMFactories`](https://www.npmjs.com/package/react-dom-factories), pre-configured DOM factories to make React easier to use without JSX. -->
- [`ReactDOMFactories`](https://www.npmjs.com/package/react-dom-factories), fábricas DOM pré-configuradas para fazer o React ser mais fácil de utilizar sem JSX.

### Add-ons Descontinuados {#deprecated-add-ons}

- [`LinkedStateMixin`](/docs/two-way-binding-helpers.html) foi descontinuado.
<!-- - [`TransitionGroup` and `CSSTransitionGroup`](/docs/animation.html) have been deprecated in favor of [their drop-in replacements](https://github.com/reactjs/react-transition-group/tree/v1-stable). -->
- [`TransitionGroup` and `CSSTransitionGroup`](/docs/animation.html) foi descontinuado em favor de [suas substituições drop-in](https://github.com/reactjs/react-transition-group/tree/v1-stable).

## Utilizandos React com Add-ons {#using-react-with-add-ons}
<!-- You can install the add-ons individually from npm (e.g. `npm install react-addons-create-fragment`) and import them: -->
Você pode instalar os add-ons individualmente via npm (e.g. `npm install react-addons-create-fragment`) e importá-lo:

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 with npm
```
<!-- When using React 15 or earlier from a CDN, you can use `react-with-addons.js` instead of `react.js`: -->
Quando utilizar React 15 ou anterior via CDN, você pode usar `react-with-addons.js` ao invés de `react.js`:

```html
<script src="https://unpkg.com/react@15/dist/react-with-addons.js"></script>
```
<!-- Os add-ons will be available via the `React.addons` global (e.g. `React.addons.TestUtils`). -->
Os add-ons estarão disponíveis através do global `React.addons` (e.g. `React.addons.TestUtils`).
