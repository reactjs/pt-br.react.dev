---
id: shallow-renderer
title: Renderização superficial (Shallow Renderer)
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Importando**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 com npm
```

## Visão geral {#overview}

Ao escrever testes unitários para o React, a renderização superficial pode ser útil. A renderização superficial o deixa renderizar um componente a um "nível simples de profundidade" e afirmar fatos sobre o que este método retorna, sem se preocupar sobre o comportamento dos componentes filhos, os quais não são instanciados ou renderizados. Isto não requer o DOM.

Por exemplo, se você tem o seguinte componente:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Título</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Então pode afirmar:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// no seu teste:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Título</span>,
  <Subcomponent foo="bar" />
]);
```

O teste superficial atualmente tem algumas limitações, ou seja, não suporta refs.

> Nota:
>
> Nós também recomendamos verificar a [Shallow Rendering API](https://airbnb.io/enzyme/docs/api/shallow.html) da Enzyme. Ela fornece uma API de alto nível mais agradável sobre a mesma funcionalidade.

## Referência {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Você pode pensar no shallowRenderer como um "lugar" para renderizar o componente que você esta testando, e do qual irá extrair a saída do componente.

`shallowRenderer.render()` é similar ao [`ReactDOM.render()`](/docs/react-dom.html#render) mas ela não requer o DOM e somente renderiza um nível simples de profundidade. Isto significa que você pode testar componentes isolados de como seus filhos são implementados.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Depois do `shallowRenderer.render()` ter sido chamado, você pode usar `shallowRenderer.getRenderOutput()` para pegar a saída renderizada superficialmente.


Você pode então começar a afirmar fatos sobre a saída.
