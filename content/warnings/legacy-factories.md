---
title: React Element Factories e JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

Você provavelmente chegou até aqui porque seu código está chamando seu componente como uma chamada de função simples. Isso está obsoleto agora:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX {#jsx}

Componentes React não podem mais ser chamados diretamente dessa forma. Ao invés disso, [você pode usar JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Sem JSX {#whitout-jsx}

Se você não quiser, ou não puder usar JSX, terá que fazer um wrap do seu componente em uma factory antes de chamá-lo:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Essa é uma maneira fácil de atualização se você tiver muitas chamadas de função existentes.

## Componentes dinâmicos sem JSX {#dynamic-components-without-jsx}

Se você obtiver uma classe de componente de uma fonte dinâmica, talvez não seja necessário criar uma factory que você invoque imediatamente. Em vez disso, você pode simplesmente criar seu elemento inline:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## Mais a fundo {#in-depth}

[Leia mais sobre POR QUE estamos fazendo essa mudança.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
