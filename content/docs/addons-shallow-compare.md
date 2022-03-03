---
id: shallow-compare
title: Comparação superficial
permalink: docs/shallow-compare.html
layout: docs
category: Reference
---

> Nota:
>
> `shallowCompare` é um add-on legado. Em vez disso, use [`React.memo`](/docs/react-api.html#reactmemo) ou [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).

**Importando**

```javascript
import shallowCompare from 'react-addons-shallow-compare'; // ES6
var shallowCompare = require('react-addons-shallow-compare'); // ES5 com npm
```

## Visão geral {#overview}

Antes do [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) ser introduzido, o `shallowCompare` era comumente usado para obter a mesma funcionalidade do [`PureRenderMixin`](pure-render-mixin.html) ao usar classes ES6 com React.

Se a função de renderização do seu componente React for "pura" (em outras palavras, ela renderiza o mesmo resultado com as mesmas props e estado), você pode usar essa função auxiliar para aumentar o desempenho em alguns casos.

Exemplo:

```js
export class SampleComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return <div className={this.props.className}>foo</div>;
  }
}
```

`shallowCompare` executa uma verificação de igualdade superficial nos objetos `props` e `nextProps` atuais, bem como nos objetos `state` e `nextState` atuais.  
Ele faz isso iterando nas chaves dos objetos que estão sendo comparados e retornando true quando os valores de uma chave em cada objeto não são estritamente iguais.

`shallowCompare` retorna `true` se na comparação superficial para props ou state ambos falharem, portanto, o componente deve ser atualizado.
`shallowCompare` retorna `false` se na comparação superficial para props e state ambos passarem, portanto, o componente não precisar ser atualizado.
