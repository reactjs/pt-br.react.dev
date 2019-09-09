---
id: addons
title: Add-Ons
permalink: docs/addons.html
---

> Notas:
>
> O ponto de entrada `React.addons` é obsoleto a partir da versão v15.5 do React. Os add-ons foram movidos para módulos separados e alguns deles foram descontinuados.

Os add-ons do React são uma coleção de módulos utilitários úteis para criar aplicativos React. **Estes devem ser considerados experimentais** e tendem a mudar com mais frequência do que a base.

- [`createFragment`](/docs/create-fragment.html), para criar um conjunto filhos de chaves externas.

Os add-ons abaixo estão apenas na versão de desenvolvimento(não minificados) do React:

- [`Perf`](/docs/perf.html), uma ferramenta de perfil de desempenho para encontrar oportunidades de otimização.
- [`ReactTestUtils`](/docs/test-utils.html), ajudantes simples para escrever casos de teste.

### Add-ons Legados {#legacy-add-ons}

Os add-ons abaixo são considerados legados e seu uso é desencorajado. Eles continuarão trabalhando em um futuro observável, mas não há mais desenvolvimento.

- [`PureRenderMixin`](/docs/pure-render-mixin.html). Utilize [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).
- [`shallowCompare`](/docs/shallow-compare.html), uma função auxiliar que executa uma comparação superficial para props e state em um componente para decidir se um componente deve atualizar. Nós recomendamos utilizar [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).
- [`update`](/docs/update.html). Utilize [`kolodny/immutability-helper`](https://github.com/kolodny/immutability-helper).
- [`ReactDOMFactories`](https://www.npmjs.com/package/react-dom-factories), fábricas DOM pré-configuradas para fazer o React ser mais fácil de utilizar sem JSX.

### Add-ons Descontinuados {#deprecated-add-ons}

- [`LinkedStateMixin`](/docs/two-way-binding-helpers.html) foi descontinuado.
- [`TransitionGroup` and `CSSTransitionGroup`](/docs/animation.html) foi descontinuado em favor de [suas substituições drop-in](https://github.com/reactjs/react-transition-group/tree/v1-stable).

## Usando React com Add-ons {#using-react-with-add-ons}

Você pode instalar os add-ons individualmente via npm (e.g. `npm install react-addons-create-fragment`) e importá-lo:

```javascript
import createFragment from 'react-addons-create-fragment'; // ES6
var createFragment = require('react-addons-create-fragment'); // ES5 with npm
```

Quando utilizar React 15 ou anterior via CDN, você pode usar `react-with-addons.js` ao invés de `react.js`:

```html
<script src="https://unpkg.com/react@15/dist/react-with-addons.js"></script>
```

Os add-ons estarão disponíveis através do global `React.addons` (e.g. `React.addons.TestUtils`).
