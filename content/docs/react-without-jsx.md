---
id: react-without-jsx
title: React sem JSX
permalink: docs/react-without-jsx.html
---

JSX não é obrigatório para utilizar o React. Utilizar o React sem JSX é especialmente conveniente quando você não quer configurar compilação no seu ambiente de build.

Cada elemento JSX é apenas açúcar sintático (_syntactic sugar_) para a chamada da função `React.createElement(component, props, ...children)`. Assim, quaisquer coisas que você pode fazer com JSX também podem ser feitas simplesmente com JavaScript.

Por exemplo, esse código escrito com JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

pode ser compilado para esse código que não usa JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Se você estiver curioso para ver mais exemplos de como JSX é convertido para JavaScript, pode checar [o compilador online do Babel](babel://jsx-simple-example).

O componente pode ser fornecido como uma string, como uma subclasse de `React.Component` ou  como uma função simples.

Se você se cansar de ter que digitar sempre `React.createElement`, um padrão comum é atribuir a função à uma variável auxiliar:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

Se você utilizar essa forma resumida de `React.createElement`, pode ser quase tão conveniente de utilizar o React sem JSX.

Por outro lado, você pode buscar por projetos da comunidade como [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) e [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) que oferecem uma sintaxe mais amigável.
