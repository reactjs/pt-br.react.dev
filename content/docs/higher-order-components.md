<!---

NOTE: Remove this before opening the PR

- Should I translate Higher-Order Component?
- If yes, should I call its acronym HOC or COS?
- Should I translate "wrapped" to "envolvido"?
- Should I translate Side-effects?
- Should I translate "lifecycle" methods?

--->

---
id: higher-order-components
title: Componentes de Ordem Superior
permalink: docs/higher-order-components.html
---

Um componente de ordem superior (HOC, do inglês Higher-Order Component) é uma técnica avançada no React para reutilizar a lógica de um component. HOCs não são parte da API do React, por si. Eles são um padrão que surgiu da própria natureza de composição do React.

Concretamente, **um componente de ordem superior é uma função que recebe um componente e retorna um novo componente.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Enquanto um componente transforma props em UI, um componente de ordem superior transforma um componente em outro componente.

HOCs são comuns em bibliotecas terceiras para React, como o [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) do Redux e o [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) do Relay.

Neste documento, nós vamos discutir porque componentes de ordem superior são úteis, e como escrever o seu.

## Use HOCs para características transversais {#use-hocs-for-cross-cutting-concerns}
> **Nota**
>
> Anteriormente, nós recomendamos mixins como uma forma de lidar com características transversais. Desde então, percebemos que mixins criam mais problemas do que valem. [Leia mais](/blog/2016/07/13/mixins-considered-harmful.html) sobre o porque nós deixamos os mixins de lado e como você pode fazer a transição dos seus componentes existentes.

Componentes são uma unidade primária de reutilização de código no React. Contudo, você perceberá que alguns padrões não se encaixam tão facilmente em componentes tradicionais.

Por exemplo, digamos que você tem um componente `CommentList` que subscreve-se a uma fonte externa de dados para renderizar uma lista de comentários:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" é uma fonte de dados global
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Assina as mudanças
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Limpa o listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Atualiza o estado do componente sempre que a fonte de dados muda
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Depois, você escreve um componente que se subscreve a um blog post, o qual segue um padrão similar:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` e `BlogPost` não são identicos - eles chamam métodos diferentes de `DataSource`, e renderizam saídas diferentes. Mas muito de suas implementações é igual:

- Em mount, adicione um change listener para `DataSource`.
- Dentro do listener, chame `setState` sempre que a fonte de dados mude.
- Em unmount, remova o change listener.

Você pode imaginar que em uma applicação grande, esse mesmo padrão de assinar `DataSource` e chamar `setState` irá ocorrer várias vezes. Nós queremos uma abstração que permita-nos definir essa lógica em um único lugar e compartilhá-la com vários componentes. Isso é onde componentes de ordem superior se superam.

Nós podemos escrever uma função que cria componentes, como `CommentList` e `BlogPost`, que assina `DataSource`. A função irá aceitar como um dos seus argumentos um componente filho que recebe o dado assinado como uma prop. Vamos chamar a função de `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

O primeiro paramêtro é um componente envolvido. O segundo parâmetro acessa os dados que estamos interessados, dado um `DataSource` e as props atuais.

Quando `CommentListWithSubscription` e `BlogPostWithSubscription` são renderizados, `CommentList` e `BlogPost` passarão uma prop `data` com o dado mais recente retirado de `DataSource`:

```js
// A função recebe um componente...
function withSubscription(WrappedComponent, selectData) {
  // ...e retorna outro componente...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... o qual lida com a assinatura...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... e renderia o componente envolvido com os dados frescos!
      // Note que nós passamos diretamente qualquer prop adicional
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Note que um HOC não modifica o componente de entrada, nem utiliza herança para copiar seu comportamento. Ao invés disso, um HOC *compõe* o componente original ao *envolvê-lo* em um componente recipiente. Um HOC é uma função pura sem efeitos colaterais.

E é isso! O componente envolvido recebe todas as props do recipiente, junto de uma nova prop, `data`, o qual a utiliza para renderizar sua saída. O HOC não se preocupa com o como ou por que de seus dados serem usados, e o componente envolvido não se preocupa de onde os dados vieram.

Por `withSubscription` ser uma função normal, você pode adicionar quantos argumentos quiser. Por exemplo, você pode querer fazer o nome da prop `data` ser configurável, para continuar a isolar o HOC do componente envolvido. Ou podes aceitar um argumento que configura `shouldComponentUpdate`, ou um que configura a fonte de dados. Todos esses casos são possíveis porque o HOC tem controle total sobre como o componente é definido.

Como componentes, o contrato entre `withSubscription` e o componente envolvido é completamente baseado em props. Isso faz com que seja fácil trocar um HOC por outro, desde que eles providenciem as mesmas props para o componente envolvido. Isso pode ser útil se você mudar de bibliotecas para busca de dados, por exemplo.

# Não Altere o Componente Original. Use Composição. {#dont-mutate-the-original-component-use-composition}

Resista a tentação de modificar o prototype de um componente (ou alterá-lo de qualquer outra forma) dentro de um HOC.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // O fato de estarmos retornando a entrada original é uma dica de que ela sofreu mutação.
  return InputComponent;
}

// EnhancedComponent criará logs sempre que uma prop for recebida
const EnhancedComponent = logProps(InputComponent);
```

Existem alguns problemas nisso. Primeiro, o componente de entrada não pode ser reutilizado separadamente do componente melhorado. Mais crucialmente, se você aplicar outro HOC para `EnchancedComponent` que *também* altera `componentWillReceiveProps`, a funcionalidade do primeiro HOC será sobrescrita! Esse HOC também não funcionará com componentes funcionais, os quais não possuem métodos de ciclo de vida.

Realizar mutações em HOCs é uma abstração mal vedada - o consumer deve saber como eles são implementados para que se possa evitar conflitos com outros HOCs.

Ao invés de mutações, HOCs devem utilizar composição, envolvendo o componente de entrada em um componente recipiente:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Envolve o componente de entrada em um recipiente, sem alterá-lo. Bom!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

Este HOC possui a mesma funcionalidade que a sua versão com mutação e evita o potencial de ocorrer choques. Ele funciona igualmente bem com componentes funcionais e controlados. E por ser uma função pura, ele pode ser combinado com outros HOCs, ou até com si mesmo.

You may have noticed similarities between HOCs and a pattern called **container components**. Container components are part of a strategy of separating responsibility between high-level and low-level concerns. Containers manage things like subscriptions and state, and pass props to components that handle things like rendering UI. HOCs use containers as part of their implementation. You can think of HOCs as parameterized container component definitions.

## Convention: Pass Unrelated Props Through to the Wrapped Component {#convention-pass-unrelated-props-through-to-the-wrapped-component}

HOCs add features to a component. They shouldn't drastically alter its contract. It's expected that the component returned from a HOC has a similar interface to the wrapped component.

HOCs should pass through props that are unrelated to its specific concern. Most HOCs contain a render method that looks something like this:

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

This convention helps ensure that HOCs are as flexible and reusable as possible.

## Convention: Maximizing Composability {#convention-maximizing-composability}

Not all HOCs look the same. Sometimes they accept only a single argument, the wrapped component:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Usually, HOCs accept additional arguments. In this example from Relay, a config object is used to specify a component's data dependencies:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

The most common signature for HOCs looks like this:

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*What?!* If you break it apart, it's easier to see what's going on.

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```
In other words, `connect` is a higher-order function that returns a higher-order component!

This form may seem confusing or unnecessary, but it has a useful property. Single-argument HOCs like the one returned by the `connect` function have the signature `Component => Component`. Functions whose output type is the same as its input type are really easy to compose together.

```js
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(This same property also allows `connect` and other enhancer-style HOCs to be used as decorators, an experimental JavaScript proposal.)

The `compose` utility function is provided by many third-party libraries including lodash (as [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](http://redux.js.org/docs/api/compose.html), and [Ramda](http://ramdajs.com/docs/#compose).

## Convention: Wrap the Display Name for Easy Debugging {#convention-wrap-the-display-name-for-easy-debugging}

The container components created by HOCs show up in the [React Developer Tools](https://github.com/facebook/react-devtools) like any other component. To ease debugging, choose a display name that communicates that it's the result of a HOC.

The most common technique is to wrap the display name of the wrapped component. So if your higher-order component is named `withSubscription`, and the wrapped component's display name is `CommentList`, use the display name `WithSubscription(CommentList)`:

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## Caveats {#caveats}

Higher-order components come with a few caveats that aren't immediately obvious if you're new to React.

### Don't Use HOCs Inside the render Method {#dont-use-hocs-inside-the-render-method}

React's diffing algorithm (called reconciliation) uses component identity to determine whether it should update the existing subtree or throw it away and mount a new one. If the component returned from `render` is identical (`===`) to the component from the previous render, React recursively updates the subtree by diffing it with the new one. If they're not equal, the previous subtree is unmounted completely.

Normally, you shouldn't need to think about this. But it matters for HOCs because it means you can't apply a HOC to a component within the render method of a component:

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

The problem here isn't just about performance — remounting a component causes the state of that component and all of its children to be lost.

Instead, apply HOCs outside the component definition so that the resulting component is created only once. Then, its identity will be consistent across renders. This is usually what you want, anyway.

In those rare cases where you need to apply a HOC dynamically, you can also do it inside a component's lifecycle methods or its constructor.

### Static Methods Must Be Copied Over {#static-methods-must-be-copied-over}

Sometimes it's useful to define a static method on a React component. For example, Relay containers expose a static method `getFragment` to facilitate the composition of GraphQL fragments.

When you apply a HOC to a component, though, the original component is wrapped with a container component. That means the new component does not have any of the static methods of the original component.

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

To solve this, you could copy the methods onto the container before returning it:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

However, this requires you to know exactly which methods need to be copied. You can use [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) to automatically copy all non-React static methods:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Another possible solution is to export the static method separately from the component itself.

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs Aren't Passed Through {#refs-arent-passed-through}

While the convention for higher-order components is to pass through all props to the wrapped component, this does not work for refs. That's because `ref` is not really a prop — like `key`, it's handled specially by React. If you add a ref to an element whose component is the result of a HOC, the ref refers to an instance of the outermost container component, not the wrapped component.

The solution for this problem is to use the `React.forwardRef` API (introduced with React 16.3). [Learn more about it in the forwarding refs section](/docs/forwarding-refs.html).
