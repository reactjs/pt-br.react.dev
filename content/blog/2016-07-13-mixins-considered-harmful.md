---
titulo: "Considerando Mixins Nocivos"
autor: [gaearon]
---

“Como eu compartilho o código entre diversos componentes?" é uma das primeiras perguntas que as pessoas fazem quando aprendem React. Nossa resposta sempre foi, usar composição de componentes para reutilizaçaão do código. Você pode definir um componente e usá-lo em diversos outros componentes.

Nem sempre é óbvio como um determinado padrão pode ser resolvido com a componetização. O React é influenciado pela programacão funcional, mas entrou em um campo que é dominado por bibliotecas orientadas à objetos. Foi difícil para os engenheiros, dentro e fora do Facebook, de abrir mão dos padrões que estavam acostumados.

Para facilitar a adocão inicial e o aprendizado, incluímos algumas válvulas de escape no React. O sistema <em>mixin</em> era uma dessas válvulas de escape, e seu objetivo era dar a você uma maneira de reutilizar o código entre os componentes, quando você não tem certeza de como resolver o mesmo problema com a composição.

Três anos se passaram desde que o React foi lancado. O cenário mudou. Agora, várias bibliotecas de visualizões adotam um modelo de componente semelhante ao React. Usar composição sobre a herança para criar interfaces de usuário declarativas não é mais uma novidade. Também estamos mais confiantes no modelo do componente React, e vimos muitos usos criativos dele tanto internamente quanto na comunidade.

Neste post, vamos considerar os problemas comumentes causados por <em>mixins</em>. Em seguida, sugeriremos vários padrões alternativos para os mesmos casos de uso. Descobrimos que esses padrões escalam melhor com a complexidade da base de código do que os <em>mixins</em>.

## Porque Mixins Estão Quebrados  {#porque-mixins-estao-quebrados}

No Facebook, o uso do React cresceu de alguns componentes para milhares deles. Isso nos dá uma janela sobre como as pessoas usam o React. Graças à renderização declarativa e ao fluxo de dados de cima para baixo, muitas equipes conseguiram corrigir vários bugs ao enviar novos recursos à medida que o React era adotado.

No entando, é inevitável que parte do nosso código usando React se torne gradualmente incompreensível. Ocasionalmente, a equipe do React veria grupos de componentes em diferentes projetos que as pessoas tinham medo de tocar. Esses componentes eram muito fáceis de serem quebrados acidentalmente, eram confusos para novos desenvolvedores e acabaram se tornando tão confusos para as pessoas que os escreveram em primeiro lugar. Muito dessa confusão ocorreu por causa dos <em>mixins</em>. Na época, eu não estava trabalhando no Facebook, mas cheguei [as mesmas conclusões]((https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)) depois de escrever vários de terríveis <em>mixins</em>.

Isso não significa que os próprios <em>mixins</em> são ruins. As pessoas empregam com sucesso em diferentes linguagens e paradigmas, incluindo algumas linguagens funcionais. No Facebook, usamos extensivamente traços no Hack que são bastante semelhantes aos <em>mixins</em>. No entanto, pensamos que os <em>mixins</em> são desnecessários e problemáticos nas bases de código do React. E aqui está o porquê.

### Mixins introduzem dependências implícitas {#mixins-introduzem-dependencias-implicitas}

Às vezes, um componente depende de um determinado método definido no <em>mixin</em>, como `getClassName()`. Às vezes é o contrário, e <em>mixins</em> chama um método como `renderHeader()` no componente. JavaScript é uma linguagem dinâmica, por isso é difícil impor ou documentar tais dependências.

Os <em>mixins</em> quebram a suposição comum e geralmente segura de que você pode renomear uma chave de estado ou um método pesquisando suas ocorrências no arquivo do componente. Você pode escrever um componente com estado e, em seguida, seu colega de trabalho pode adicionar um <em>mixin</em> que leia esse estado. Em alguns meses, você pode querer mover esse estado para o componente pai para que ele possa ser compartilhado com um irmão. Você vai se lembrar de atualizar o <em>mixin</em> para ler a <em>prop</em> em vez disso? E se, até agora, outros componentes também usarem este <em>mixin</em>?

Essas dependências implícitas dificultam que novos membros da equipe contribuam para uma base de código. O método `render()` de um componente pode fazer referência a algum método que não está definido na classe. É seguro remover? Talvez esteja definido em um dos <em>mixins</em>. Mas qual deles? Você precisa rolar até a lista de <em>mixins</em>, abrir cada um desses arquivos e procurar por este método. Pior ainda, <em>mixins</em> podem especificar seus próprios <em>mixins</em>, então a pesquisa por se aprofundar.

Muitas vezes, os <em>mixins</em> passam a depender de outros <em>mixins</em>, e a remoção de um deles quebra o outro. Nessas situações, é muito complicado dizer como os dados entram e saem dos <em>mixins</em> e como é o seu gráfico de dependências. Ao contrário dos componentes, os <em>mixins</em> não formam uma hierarquia: eles são achatados e operam no mesmo <em>namespace</em>.

### Mixins causam confronto de nomes {#mixins-causam-confronto-de-nomes}

Não há garantia de que duas misturas específicas possam ser usadas juntas. Por exemplo, se `FluxListenerMixin` define `handleChange()` e `WindowSizeMixin` define `handleChange()`, voceê não pode usá-los juntos. Você também não pode definir um método com esse nome em seu próprio componente.

Não é um grande problema se você controlar o código do <em>mixin</em>. Quando você tem um conflito, você pode renomear esse método em um dos <em>mixins</em>. No entanto, é complicado porque alguns componentes ou outros <em>mixins</em> já podem estar chamando esse métodos diretamente, e você precisa encontrar e corrigir essas chamadas também.

Se você tiver um conflito de nome com um <em>mixin</em> de um pacote de terceiros, não será possível renomear um método dele. Em vez disso, você precisa usar nomes estanhos de métodos em seu componente para evitar conflitos.

A situação não é melhor para os autores dos <em>mixins</em>. Até mesmo a adição de um novo método a um <em>mixin</em> é sempre uma alteração potencial, pois um método com o memso nome já pode existir em alguns dos componentes que o usam, diretamente ou por meio de outro <em>mixin</em>. Uma vez escritos, os <em>mixins</em> são difíceis de remover ou mudar. Idéias ruins não são refatoradas porque a refatoração é muito arriscada.

### Mixins desencadeiam complexidade de bola de neve {#mixins-desencadeiam-complexidade-de-bola-de-neve}

Mesmo quando os <em>mixins</em> começam de forma simples, eles tendem a se tornar complexos ao longo do tempo. O exemplo abaixo é baseado em um cenário real que vi em um repositório.

Um componente precisa de algum estado para rastrear o foco do mouse. Para manter essa lógica reutilizável, você pode extrair `handleMouserEnter()`, `handleMouseLeave()` e `isHovering()` em um `HoverMixin`. Em seguida, alguém precisa implementar uma dica de ferramenta. Eles não querem duplicar a lógica em `HoverMixin`, de modo que criam um `TooltipMixin` que usa o `HoverMixin`. `TooltipMix` lê `isHovering()` fornecido pelo `HoverMixin` no seu `componentDidUpdate()` e mostra ou oculta a dica da ferramenta.

A few months later, somebody wants to make the tooltip direction configurable. In an effort to avoid code duplication, they add support for a new optional method called `getTooltipOptions()` to `TooltipMixin`. By this time, components that show popovers also use `HoverMixin`. However popovers need a different hover delay. To solve this, somebody adds support for an optional `getHoverOptions()` method and implements it in `TooltipMixin`. Those mixins are now tightly coupled.

This is fine while there are no new requirements. However this solution doesn’t scale well. What if you want to support displaying multiple tooltips in a single component? You can’t define the same mixin twice in a component. What if the tooltips need to be displayed automatically in a guided tour instead of on hover? Good luck decoupling `TooltipMixin` from `HoverMixin`. What if you need to support the case where the hover area and the tooltip anchor are located in different components? You can’t easily hoist the state used by mixin up into the parent component. Unlike components, mixins don’t lend themselves naturally to such changes.

Every new requirement makes the mixins harder to understand. Components using the same mixin become increasingly coupled with time. Any new capability gets added to all of the components using that mixin. There is no way to split a “simpler” part of the mixin without either duplicating the code or introducing more dependencies and indirection between mixins. Gradually, the encapsulation boundaries erode, and since it’s hard to change or remove the existing mixins, they keep getting more abstract until nobody understands how they work.

These are the same problems we faced building apps before React. We found that they are solved by declarative rendering, top-down data flow, and encapsulated components. At Facebook, we have been migrating our code to use alternative patterns to mixins, and we are generally happy with the results. You can read about those patterns below.

## Migrating from Mixins {#migrating-from-mixins}

Let’s make it clear that mixins are not technically deprecated. If you use `React.createClass()`, you may keep using them. We only say that they didn’t work well for us, and so we won’t recommend using them in the future.

Every section below corresponds to a mixin usage pattern that we found in the Facebook codebase. For each of them, we describe the problem and a solution that we think works better than mixins. The examples are written in ES5 but once you don’t need mixins, you can switch to ES6 classes if you’d like.

We hope that you find this list helpful. Please let us know if we missed important use cases so we can either amend the list or be proven wrong!

### Performance Optimizations {#performance-optimizations}

One of the most commonly used mixins is [`PureRenderMixin`](/docs/pure-render-mixin.html). You might be using it in some components to [prevent unnecessary re-renders](/docs/advanced-performance.html#shouldcomponentupdate-in-action) when the props and state are shallowly equal to the previous props and state:

```javascript
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Button = React.createClass({
  mixins: [PureRenderMixin],

  // ...

});
```

#### Solution {#solution}

To express the same without mixins, you can use the [`shallowCompare`](/docs/shallow-compare.html) function directly instead:

```js
var shallowCompare = require('react-addons-shallow-compare');

var Button = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  // ...

});
```

If you use a custom mixin implementing a `shouldComponentUpdate` function with different algorithm, we suggest exporting just that single function from a module and calling it directly from your components.

We understand that more typing can be annoying. For the most common case, we plan to [introduce a new base class](https://github.com/facebook/react/pull/7195) called `React.PureComponent` in the next minor release. It uses the same shallow comparison as `PureRenderMixin` does today.

### Subscriptions and Side Effects {#subscriptions-and-side-effects}

The second most common type of mixins that we encountered are mixins that subscribe a React component to a third-party data source. Whether this data source is a Flux Store, an Rx Observable, or something else, the pattern is very similar: the subscription is created in `componentDidMount`, destroyed in `componentWillUnmount`, and the change handler calls `this.setState()`.

```javascript
var SubscriptionMixin = {
  getInitialState: function() {
    return {
      comments: DataSource.getComments()
    };
  },

  componentDidMount: function() {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function() {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function() {
    this.setState({
      comments: DataSource.getComments()
    });
  }
};

var CommentList = React.createClass({
  mixins: [SubscriptionMixin],

  render: function() {
    // Reading comments from state managed by mixin.
    var comments = this.state.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />
        })}
      </div>
    )
  }
});

module.exports = CommentList;
```

#### Solution {#solution-1}

If there is just one component subscribed to this data source, it is fine to embed the subscription logic right into the component. Avoid premature abstractions.

If several components used this mixin to subscribe to a data source, a nice way to avoid repetition is to use a pattern called [“higher-order components”](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750). It can sound intimidating so we will take a closer look at how this pattern naturally emerges from the component model.

#### Higher-Order Components Explained {#higher-order-components-explained}

Let’s forget about React for a second. Consider these two functions that add and multiply numbers, logging the results as they do that:

```js
function addAndLog(x, y) {
  var result = x + y;
  console.log('result:', result);
  return result;
}

function multiplyAndLog(x, y) {
  var result = x * y;
  console.log('result:', result);
  return result;
}
```

These two functions are not very useful but they help us demonstrate a pattern that we can later apply to components.

Let’s say that we want to extract the logging logic out of these functions without changing their signatures. How can we do this? An elegant solution is to write a [higher-order function](https://en.wikipedia.org/wiki/Higher-order_function), that is, a function that takes a function as an argument and returns a function.

Again, it sounds more intimidating than it really is:

```js
function withLogging(wrappedFunction) {
  // Return a function with the same API...
  return function(x, y) {
    // ... that calls the original function
    var result = wrappedFunction(x, y);
    // ... but also logs its result!
    console.log('result:', result);
    return result;
  };
}
```

The `withLogging` higher-order function lets us write `add` and `multiply` without the logging statements, and later wrap them to get `addAndLog` and `multiplyAndLog` with exactly the same signatures as before:

```js
function add(x, y) {
  return x + y;
}

function multiply(x, y) {
  return x * y;
}

function withLogging(wrappedFunction) {
  return function(x, y) {
    var result = wrappedFunction(x, y);
    console.log('result:', result);
    return result;
  };
}

// Equivalent to writing addAndLog by hand:
var addAndLog = withLogging(add);

// Equivalent to writing multiplyAndLog by hand:
var multiplyAndLog = withLogging(multiply);
```

Higher-order components are a very similar pattern, but applied to components in React. We will apply this transformation from mixins in two steps.

As a first step, we will split our `CommentList` component in two, a child and a parent. The child will be only concerned with rendering the comments. The parent will set up the subscription and pass the up-to-date data to the child via props.

```js
// This is a child component.
// It only renders the comments it receives as props.
var CommentList = React.createClass({
  render: function() {
    // Note: now reading from props rather than state.
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />
        })}
      </div>
    )
  }
});

// This is a parent component.
// It subscribes to the data source and renders <CommentList />.
var CommentListWithSubscription = React.createClass({
  getInitialState: function() {
    return {
      comments: DataSource.getComments()
    };
  },

  componentDidMount: function() {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function() {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function() {
    this.setState({
      comments: DataSource.getComments()
    });
  },

  render: function() {
    // We pass the current state as props to CommentList.
    return <CommentList comments={this.state.comments} />;
  }
});

module.exports = CommentListWithSubscription;
```

There is just one final step left to do.

Remember how we made `withLogging()` take a function and return another function wrapping it? We can apply a similar pattern to React components.

We will write a new function called `withSubscription(WrappedComponent)`. Its argument could be any React component. We will pass `CommentList` as `WrappedComponent`, but we could also apply `withSubscription()` to any other component in our codebase.

This function would return another component. The returned component would manage the subscription and render `<WrappedComponent />` with the current data.

We call this pattern a “higher-order component”.

The composition happens at React rendering level rather than with a direct function call. This is why it doesn’t matter whether the wrapped component is defined with `createClass()`, as an ES6 class or a function. If `WrappedComponent` is a React component, the component created by `withSubscription()` can render it.

```js
// This function takes a component...
function withSubscription(WrappedComponent) {
  // ...and returns another component...
  return React.createClass({
    getInitialState: function() {
      return {
        comments: DataSource.getComments()
      };
    },

    componentDidMount: function() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function() {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function() {
      this.setState({
        comments: DataSource.getComments()
      });
    },

    render: function() {
      // ... and renders the wrapped component with the fresh data!
      return <WrappedComponent comments={this.state.comments} />;
    }
  });
}
```

Now we can declare `CommentListWithSubscription` by applying `withSubscription` to `CommentList`:

```js
var CommentList = React.createClass({
  render: function() {
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />
        })}
      </div>
    )
  }
});

// withSubscription() returns a new component that
// is subscribed to the data source and renders
// <CommentList /> with up-to-date data.
var CommentListWithSubscription = withSubscription(CommentList);

// The rest of the app is interested in the subscribed component
// so we export it instead of the original unwrapped CommentList.
module.exports = CommentListWithSubscription;
```

#### Solution, Revisited {#solution-revisited}

Now that we understand higher-order components better, let’s take another look at the complete solution that doesn’t involve mixins. There are a few minor changes that are annotated with inline comments:

```js
function withSubscription(WrappedComponent) {
  return React.createClass({
    getInitialState: function() {
      return {
        comments: DataSource.getComments()
      };
    },

    componentDidMount: function() {
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function() {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function() {
      this.setState({
        comments: DataSource.getComments()
      });
    },

    render: function() {
      // Use JSX spread syntax to pass all props and state down automatically.
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  });
}

// Optional change: convert CommentList to a function component
// because it doesn't use lifecycle methods or state.
function CommentList(props) {
  var comments = props.comments;
  return (
    <div>
      {comments.map(function(comment) {
        return <Comment comment={comment} key={comment.id} />
      })}
    </div>
  )
}

// Instead of declaring CommentListWithSubscription,
// we export the wrapped component right away.
module.exports = withSubscription(CommentList);
```

Higher-order components are a powerful pattern. You can pass additional arguments to them if you want to further customize their behavior. After all, they are not even a feature of React. They are just functions that receive components and return components that wrap them.

Like any solution, higher-order components have their own pitfalls. For example, if you heavily use [refs](/docs/more-about-refs.html), you might notice that wrapping something into a higher-order component changes the ref to point to the wrapping component. In practice we discourage using refs for component communication so we don’t think it’s a big issue. In the future, we might consider adding [ref forwarding](https://github.com/facebook/react/issues/4213) to React to solve this annoyance.

### Rendering Logic {#rendering-logic}

The next most common use case for mixins that we discovered in our codebase is sharing rendering logic between components.

Here is a typical example of this pattern:

```js
var RowMixin = {
  // Called by components from render()
  renderHeader: function() {
    return (
      <div className='row-header'>
        <h1>
          {this.getHeaderText() /* Defined by components */}
        </h1>
      </div>
    );
  }
};

var UserRow = React.createClass({
  mixins: [RowMixin],

  // Called by RowMixin.renderHeader()
  getHeaderText: function() {
    return this.props.user.fullName;
  },

  render: function() {
    return (
      <div>
        {this.renderHeader() /* Defined by RowMixin */}
        <h2>{this.props.user.biography}</h2>
      </div>
    )
  }
});
```

Multiple components may be sharing `RowMixin` to render the header, and each of them would need to define `getHeaderText()`.

#### Solution {#solution-2}

If you see rendering logic inside a mixin, it’s time to extract a component!

Instead of `RowMixin`, we will define a `<RowHeader>` component. We will also replace the convention of defining a `getHeaderText()` method with the standard mechanism of top-data flow in React: passing props.

Finally, since neither of those components currently need lifecycle methods or state, we can declare them as simple functions:

```js
function RowHeader(props) {
  return (
    <div className='row-header'>
      <h1>{props.text}</h1>
    </div>
  );
}

function UserRow(props) {
  return (
    <div>
      <RowHeader text={props.user.fullName} />
      <h2>{props.user.biography}</h2>
    </div>
  );
}
```

Props keep component dependencies explicit, easy to replace, and enforceable with tools like [Flow](https://flowtype.org/) and [TypeScript](https://www.typescriptlang.org/).

> **Note:**
>
> Defining components as functions is not required. There is also nothing wrong with using lifecycle methods and state—they are first-class React features. We use function components in this example because they are easier to read and we didn’t need those extra features, but classes would work just as fine.

### Context {#context}

Another group of mixins we discovered were helpers for providing and consuming [React context](/docs/context.html). Context is an experimental unstable feature, has [certain issues](https://github.com/facebook/react/issues/2517), and will likely change its API in the future. We don’t recommend using it unless you’re confident there is no other way of solving your problem.

Nevertheless, if you already use context today, you might have been hiding its usage with mixins like this:

```js
var RouterMixin = {
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  // The mixin provides a method so that components
  // don't have to use the context API directly.
  push: function(path) {
    this.context.router.push(path)
  }
};

var Link = React.createClass({
  mixins: [RouterMixin],

  handleClick: function(e) {
    e.stopPropagation();

    // This method is defined in RouterMixin.
    this.push(this.props.to);
  },

  render: function() {
    return (
      <a onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Link;
```

#### Solution {#solution-3}

We agree that hiding context usage from consuming components is a good idea until the context API stabilizes. However, we recommend using higher-order components instead of mixins for this.

Let the wrapping component grab something from the context, and pass it down with props to the wrapped component:

```js
function withRouter(WrappedComponent) {
  return React.createClass({
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },

    render: function() {
      // The wrapper component reads something from the context
      // and passes it down as a prop to the wrapped component.
      var router = this.context.router;
      return <WrappedComponent {...this.props} router={router} />;
    }
  });
};

var Link = React.createClass({
  handleClick: function(e) {
    e.stopPropagation();

    // The wrapped component uses props instead of context.
    this.props.router.push(this.props.to);
  },

  render: function() {
    return (
      <a onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
});

// Don't forget to wrap the component!
module.exports = withRouter(Link);
```

If you’re using a third party library that only provides a mixin, we encourage you to file an issue with them linking to this post so that they can provide a higher-order component instead. In the meantime, you can create a higher-order component around it yourself in exactly the same way.

### Utility Methods {#utility-methods}

Sometimes, mixins are used solely to share utility functions between components:

```js
var ColorMixin = {
  getLuminance(color) {
    var c = parseInt(color, 16);
    var r = (c & 0xFF0000) >> 16;
    var g = (c & 0x00FF00) >> 8;
    var b = (c & 0x0000FF);
    return (0.299 * r + 0.587 * g + 0.114 * b);
  }
};

var Button = React.createClass({
  mixins: [ColorMixin],

  render: function() {
    var theme = this.getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return (
      <div className={theme}>
        {this.props.children}
      </div>
    )
  }
});
```

#### Solution {#solution-4}

Put utility functions into regular JavaScript modules and import them. This also makes it easier to test them or use them outside of your components:

```js
var getLuminance = require('../utils/getLuminance');

var Button = React.createClass({
  render: function() {
    var theme = getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return (
      <div className={theme}>
        {this.props.children}
      </div>
    )
  }
});
```

### Other Use Cases {#other-use-cases}

Sometimes people use mixins to selectively add logging to lifecycle methods in some components. In the future, we intend to provide an [official DevTools API](https://github.com/facebook/react/issues/5306) that would let you implement something similar without touching the components. However it’s still very much a work in progress. If you heavily depend on logging mixins for debugging, you might want to keep using those mixins for a little longer.

If you can’t accomplish something with a component, a higher-order component, or a utility module, it could be mean that React should provide this out of the box. [File an issue](https://github.com/facebook/react/issues/new) to tell us about your use case for mixins, and we’ll help you consider alternatives or perhaps implement your feature request.

Mixins are not deprecated in the traditional sense. You can keep using them with `React.createClass()`, as we won’t be changing it further. Eventually, as ES6 classes gain more adoption and their usability problems in React are solved, we might split `React.createClass()` into a separate package because most people wouldn’t need it. Even in that case, your old mixins would keep working.

We believe that the alternatives above are better for the vast majority of cases, and we invite you to try writing React apps without using mixins.
