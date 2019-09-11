---
id: test-utils
title: Utilitários de Teste
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importando**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 com npm
```

## Visão Geral {#overview}

`ReactTestUtils` torna fácil para testar componentes em React utilizando framework de teste à sua escolha. No Facebook, nós utilizamos [Jest](https://facebook.github.io/jest/) para testar JavaScript sem dores. Aprenda como utilizar o Jest através do website do Jest [Tutorial para React](https://facebook.github.io/jest/docs/en/tutorial-react.html#content).

> Nota:
>
> Nós recomendamos usar o [`react-testing-library`](https://testing-library.com/react) que é projetado para permitir e encorajar escrita de testes que utilizam seus componentes como os usuários finais utilizarão.
> Alternativamente, Airbnb lançou um utilitário de teste chamado [Enzyme](https://airbnb.io/enzyme/), que torna fácil para afirmar, manipular e cruzar a saída dos seus componentes React.

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Referência {#reference}

### `act()` {#act}

Para preparar um componente para determinações, coloque o código de renderização e de atualizações dentro de uma chamada `act()`. Isso faz com que o teste rode mais próximo de como React funciona no browser.

>Nota:
>
>Se você usa `react-test-renderer`, ele provê um exportador de `act` que se comporta da mesma maneira.

Por exemplo, vamos dizer que nós temos esse componente `Counter`:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Você clicou ${this.state.count} vezes`;
  }
  componentDidUpdate() {
    document.title = `Você clicou ${this.state.count} vezes`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Você clicou {this.state.count} vezes</p>
        <button onClick={this.handleClick}>
          Clique aqui
        </button>
      </div>
    );
  }
}
```

Aqui está como nós podemos testar:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Teste da primeira renderização e componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Você clicou 0 vezes');
  expect(document.title).toBe('Você clicou 0 vezes');

  // Teste do segundo render e componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Você clicou 1 vezes');
  expect(document.title).toBe('Você clicou 1 vezes');
});
```

- Não esqueça que disparando eventos DOM apenas funciona quando o conteúdo do DOM  é adicionado no `document`. Você pode usar um auxiliador como  [`react-testing-library`](https://testing-library.com/react) para reduzir o código de boilerplate.

- O documento [`recipes`](/docs/testing-recipes.html) contém mais detalhes sobre como `act()` se comporta, como exemplos e uso.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Passe um módulo de componente mockado para este método para melhorá-lo com métodos que permitem a utilização como um dummy componente React. Ao invés de renderizar como de costume, o componente vai se tornar um simples `<div>` (ou outra tag se `mockTagName` for fornecido) contendo qualquer filho fornecido.

> Nota:
>
> `mockComponent()` é uma API legada. Nós recomendamos utilizar [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Retorna `true` se `element` é algum elemento React.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Retorna `true` se `element` é um elemento React cujo tipo é de um React `componentClass`.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Retorna `true` se `instance` é um componente DOM (como `<div>` ou `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Retorna `true` se `instance` é um componente definido pelo usuário, como uma classe ou função.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Retorna `true` se `instance` é um componente cujo tipo é de um React `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Cruza todos componentes em `tree` e acumula todos componentes em que `test(component)` seja `true`. Não é tão útil sozinho, mas é utilizado como primitivo para outros utilitários de teste.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Encontra todos elementos DOM dos componentes na árvore de renderização que possuam o nome de classe igual a `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Similar a [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) mas espera apenas um resultado, e retorna esse resultado, ou lança uma exceção se existir mais de um equivalente.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Encontra todos elementos DOM do componente na árvore de renderização que possua a tag com o nome igual a `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Similar a [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) mas espera apenas um resultado, e retorna esse resultado, ou lança uma exceção se existir mais de um equivalente.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Encontra todas as instâncias do componente com tipo igual a `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Similar a [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) mas espera apenas um resultado, e retorna esse resultado, ou lança uma exceção se existir mais de um equivalente.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Renderiza um elemento React em um nó DOM desaclopado no documento. **Esta função precisa de um DOM.** É efetivamente equivalente à:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Nota:
>
> Você precisa ter `window`, `window.document` e `window.document.createElement` disponíveis globalmente **antes** de importar `React`. Caso contrário o React vai pensar que não pode acessa o DOM e os métodos como `setState` não funcionarão.

* * *

## Outros Utilitários {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simule um dispacho de evento para um nó do DOM com dados opcionais do evento `eventData`.

`Simulate` tem um método para [cada evento que React entende](/docs/events.html#supported-events)

**Clicando em um elemento**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Alterando o valor de um campo de input e depois pressionando ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'girafa';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Nota:
>
> Você precisa fornecer alguma propriedade de evento que está sendo usado em seu componente (e.g. keyCode, which, etc...) já que o React não está criando nenhum desses para você.

* * *
