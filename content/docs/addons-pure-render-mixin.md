---
id: pure-render-mixin
title: PureRenderMixin
permalink: docs/pure-render-mixin.html
layout: docs
category: Add-Ons
---

> Nota:
>
> `PureRenderMixin` é um add-on legado. Use [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) em vez disso.

**Importando**

```javascript
import PureRenderMixin from 'react-addons-pure-render-mixin'; // ES6
var PureRenderMixin = require('react-addons-pure-render-mixin'); // ES5 com npm
```

## Visão geral {#overview}

Se a função de renderização do seu componente React renderizar o mesmo resultado com as mesmas props e state, você pode usar este mixin para aumentar o desempenho em alguns casos.

Exemplo:

```js
const createReactClass = require('create-react-class');

createReactClass({
  mixins: [PureRenderMixin],

  render: function() {
    return <div className={this.props.className}>foo</div>;
  }
});
```

Sob o capô, o mixin implementa o [shouldComponentUpdate](/docs/component-specs.html#updating-shouldcomponentupdate), no qual compara as props e o estado atuais com os próximos e retorna `false` se as igualdades forem aprovadas.

> Nota:
>
> Isso apenas compara superficialmente os objetos. Se estes contiverem estruturas de dados complexas, podem produzir falsos negativos para diferenças mais profundas. Apenas misture em componentes que tenham props e estado simples, ou use `forceUpdate()` quando você souber que estruturas de dados profundas foram alteradas. Ou considere usar [objetos imutáveis](https://immutable-js.com/) para facilitar comparações rápidas de dados aninhados.
>
> Além disso, `shouldComponentUpdate` ignora atualizações para toda a subárvore do componente. Certifique-se de que todos os componentes childrens também sejam "puros".
