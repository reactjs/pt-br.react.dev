---
id: test-renderer
title: Testando o Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Importando**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 com npm
```

## Visão Geral {#overview}

Este pacote fornece um renderizador React que pode ser usado para renderizar componentes React para objetos JavaScript puros, sem depender do DOM ou de um ambiente móvel nativo.

Essencialmente, esse pacote facilita a captura de um instantâneo da hierarquia de visualização da plataforma (semelhante a uma árvore DOM) processada por um componente React DOM ou React Native sem usar um navegador ou [jsdom](https://github.com/tmpvar/jsdom).

Exemplo:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Você pode usar o recurso de teste de instantâneo do Jest para salvar automaticamente uma cópia da árvore JSON em um arquivo e verificar em seus testes que ela não foi alterada: [Aprenda mais sobre isso](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

Você também pode percorrer o resultado para encontrar nós específicos e fazer verificações sobre eles.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)

### TestRenderer instance {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Referência {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Cria uma instância do `TestRenderer` com o elemento React fornecido. Este método não usa o DOM real, mas ainda renderiza completamente a árvore de componentes na memória para que você possa fazer verificações sobre ela. A instância retornada possui os seguintes métodos e propriedades.

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Return an object representing the rendered tree. This tree only contains the platform-specific nodes like `<div>` or `<View>` and their props, but doesn't contain any user-written components. This is handy for [snapshot testing](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Return an object representing the rendered tree. Unlike `toJSON()`, the representation is more detailed than the one provided by `toJSON()`, and includes the user-written components. You probably don't need this method unless you're writing your own assertion library on top of the test renderer.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Re-render the in-memory tree with a new root element. This simulates a React update at the root. If the new element has the same type and key as the previous element, the tree will be updated; otherwise, it will re-mount a new tree.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Unmount the in-memory tree, triggering the appropriate lifecycle events.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Return the instance corresponding to the root element, if available. This will not work if the root element is a function component because they don't have instances.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Returns the root "test instance" object that is useful for making assertions about specific nodes in the tree. You can use it to find other "test instances" deeper below.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Find a single descendant test instance for which `test(testInstance)` returns `true`. If `test(testInstance)` does not return `true` for exactly one test instance, it will throw an error.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Find a single descendant test instance with the provided `type`. If there is not exactly one test instance with the provided `type`, it will throw an error.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Find a single descendant test instance with the provided `props`. If there is not exactly one test instance with the provided `props`, it will throw an error.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Find all descendant test instances for which `test(testInstance)` returns `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Find all descendant test instances with the provided `type`.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Find all descendant test instances with the provided `props`.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

The component instance corresponding to this test instance. It is only available for class components, as function components don't have instances. It matches the `this` value inside the given component.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

The component type corresponding to this test instance. For example, a `<Button />` component has a type of `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

The props corresponding to this test instance. For example, a `<Button size="small" />` component has `{size: 'small'}` as props.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

A instância de teste pai desta instância de teste.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

As instâncias de testes filhas desta instância de teste.

## Ideias {#ideas}

Você pode passar a função `createNodeMock` para `TestRenderer.create` como opção, que permite mocks personalizados de refs.
`createNodeMock` aceita o elemento atual e deve retornar um objeto mock de ref.
Isso é útil quando você testa um componente que depende de refs.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock de uma função de focus
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
