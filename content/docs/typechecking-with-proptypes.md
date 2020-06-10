---
id: typechecking-with-proptypes
title: Checagem de tipos (Typechecking) com PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Note:
>
> `React.PropTypes` foi movido para um pacote diferente desde a versão 15.5 do React. Por favor, use [a biblioteca `prop-types`](https://www.npmjs.com/package/prop-types).
>
> Nós fornecemos [um script de codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) para automatizar a conversão.

Na medida em que sua aplicação cresce, você pode capturar muitos bugs com checagem de tipos. Em algumas aplicações, você pode usar extensões do JavaScript como [Flow](https://flowtype.org/) ou [TypeScript](https://www.typescriptlang.org/) para checar os tipos de toda a sua aplicação. Porém, mesmo se você não usá-las, React possui algumas habilidades de checagem de tipos nativas. Para executar a checagem de tipos nas props para um componente, você pode atribuir à propriedade em especial `propTypes`:

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

`PropTypes` exporta uma variedade de validadores que podem ser usados para certificar que os dados que você recebe são válidos. Neste exemplo, utilizamos `PropTypes.string`. Quando um valor inválido for fornecido a uma prop, um alerta será exibido no console JavaScript. Por motivos de performance, `propTypes` é checado apenas em modo de desenvolvimento.

### PropTypes {#proptypes}

Aqui está um exemplo documentando os diferentes tipos de validadores fornecidos:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS type. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // A React element type (ie. MyComponent).
  optionalElementType: PropTypes.elementType,
  
  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  
  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### Exigindo Filho Único (Single Child) {#requiring-single-child}

Com `PropTypes.element` você pode especificar que apenas um único filho pode ser passado para um componente como `children`.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Valores Padrão de Props (Default Prop Values) {#default-prop-values}

Você pode definir valores padrão (default) para suas `props` através da atribuição à propriedade especial `defaultProps`:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

Se você está usando um plugin Babel como [plugin-proposal-class-properties](https://babeljs.io/docs/plugins/transform-class-properties), você também poderá declarar `defaultProps` como propriedade estática dentro de uma classe de componente React. Essa sintaxe ainda não foi finalizada e irá exigir uma etapa de compilação para funcionar em um navegador. Para mais informações, veja [proposal-class-fields](https://github.com/tc39/proposal-class-fields).

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

A `defaultProps` será usada para garantir que `this.props.name` tenha um valor caso não tenha sido especificado pelo componente pai. A checagem de tipos de `propTypes` acontece após `defaultProps` ser resolvida, logo a checagem também será aplicada à `defaultProps`.
