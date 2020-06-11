---
titulo: "Considerando Mixins Nocivos"
autor: [gaearon]
---

“Como eu compartilho o código entre diversos componentes?" é uma das primeiras perguntas que as pessoas fazem quando aprendem React. Nossa resposta sempre foi, usar composição de componentes para reutilizaçaão do código. Você pode definir um componente e usá-lo em diversos outros componentes.

Nem sempre é óbvio como um determinado padrão pode ser resolvido com a componetização. O React é influenciado pela programacão funcional, mas entrou em um campo que é dominado por bibliotecas orientadas à objetos. Foi difícil para os engenheiros, dentro e fora do Facebook, de abrir mão dos padrões que estavam acostumados.

Para facilitar a adoção e o aprendizado inicial, incluimos algumas válvulas de escape no React. O sistema mixin era uma dessas válvulas de escape, e seu objetivo era dar a você uma maneira de reutilizar o código entre os componentes, quando você não tem certeza de como resolver o mesmo problema com a composição.

Três anos se passaram desde que o React foi lancado. O cenário mudou. Agora, várias bibliotecas de visualizões adotam um modelo de componente semelhante ao React. Usar composição sobre a herança para criar interfaces de usuário declarativas não é mais uma novidade. Também estamos mais confiantes no modelo do componente React, e vimos muitos usos criativos dele tanto internamente quanto na comunidade.

Neste post, vamos considerar os problemas comumentes causados por mixins. Em seguida, sugeriremos vários padrões alternativos para os mesmos casos de uso. Descobrimos que esses padrões escalam melhor com a complexidade da base de código do que os mixins.


## Porque Mixins estão quebrados  {#porque-mixins-estao-quebrados}

No Facebook, o uso do React cresceu de alguns componentes para milhares deles. Isso nos dá uma janela sobre como as pessoas usam o React. Graças à renderização declarativa e ao fluxo de dados de cima para baixo, muitas equipes conseguiram corrigir vários bugs ao enviar novos recursos à medida que o React era adotado.

No entando, é inevitável que parte do nosso código usando React se torne gradualmente incompreensível. Ocasionalmente, a equipe do React veria grupos de componentes em diferentes projetos que as pessoas tinham medo de tocar. Esses componentes eram muito fáceis de serem quebrados acidentalmente, eram confusos para novos desenvolvedores e acabaram se tornando tão confusos para as pessoas que os escreveram em primeiro lugar. Muito dessa confusão ocorreu por causa dos mixins. Na época, eu não estava trabalhando no Facebook, mas cheguei [as mesmas conclusões]((https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)) depois de escrever vários de terríveis mixins.

Isso não significa que os próprios mixins são ruins. As pessoas empregam com sucesso em diferentes linguagens e paradigmas, incluindo algumas linguagens funcionais. No Facebook, usamos extensivamente traços no Hack que são bastante semelhantes aos mixins. No entanto, pensamos que os mixins são desnecessários e problemáticos nas bases de código do React. E aqui está o porquê.

### Mixins introduzem dependências implícitas {#mixins-introduzem-dependencias-implicitas}

Às vezes, um componente depende de um determinado método definido no mixin, como `getClassName()`. Às vezes é o contrário, e mixins chama um método como `renderHeader()` no componente. JavaScript é uma linguagem dinâmica, por isso é difícil impor ou documentar tais dependências.

Os mixins quebram a suposição comum e geralmente segura de que você pode renomear uma chave de estado ou um método pesquisando suas ocorrências no arquivo do componente. Você pode escrever um componente com estado e, em seguida, seu colega de trabalho pode adicionar um mixin que leia esse estado. Em alguns meses, você pode querer mover esse estado para o componente pai para que ele possa ser compartilhado com um irmão. Você vai se lembrar de atualizar o mixin para ler a prop em vez disso? E se, até agora, outros componentes também usarem este mixin?

Essas dependências implícitas dificultam que novos membros da equipe contribuam para uma base de código. O método `render()` de um componente pode fazer referência a algum método que não está definido na classe. É seguro remover? Talvez esteja definido em um dos mixins. Mas qual deles? Você precisa rolar até a lista de mixins, abrir cada um desses arquivos e procurar por este método. Pior ainda, mixins podem especificar seus próprios mixins, então a pesquisa por se aprofundar.

Muitas vezes, os mixins passam a depender de outros mixins, e a remoção de um deles quebra o outro. Nessas situações, é muito complicado dizer como os dados entram e saem dos mixins e como é o seu gráfico de dependências. Ao contrário dos componentes, os mixins não formam uma hierarquia: eles são achatados e operam no mesmo namespace.

### Mixins causam confronto de nomes {#mixins-causam-confronto-de-nomes}

Não há garantia de que duas misturas específicas possam ser usadas juntas. Por exemplo, se `FluxListenerMixin` define `handleChange()` e `WindowSizeMixin` define `handleChange()`, voceê não pode usá-los juntos. Você também não pode definir um método com esse nome em seu próprio componente.

Não é um grande problema se você controlar o código do <em>mixin</em>. Quando você tem um conflito, você pode renomear esse método em um dos <em>mixins</em>. No entanto, é complicado porque alguns componentes ou outros <em>mixins</em> já podem estar chamando esse métodos diretamente, e você precisa encontrar e corrigir essas chamadas também.

Se você tiver um conflito de nome com um <em>mixin</em> de um pacote de terceiros, não será possível renomear um método dele. Em vez disso, você precisa usar nomes estanhos de métodos em seu componente para evitar conflitos.

A situação não é melhor para os autores dos <em>mixins</em>. Até mesmo a adição de um novo método a um <em>mixin</em> é sempre uma alteração potencial, pois um método com o memso nome já pode existir em alguns dos componentes que o usam, diretamente ou por meio de outro <em>mixin</em>. Uma vez escritos, os <em>mixins</em> são difíceis de remover ou mudar. Idéias ruins não são refatoradas porque a refatoração é muito arriscada.

### Mixins desencadeiam complexidade de bola de neve {#mixins-desencadeiam-complexidade-de-bola-de-neve}

Mesmo quando os <em>mixins</em> começam de forma simples, eles tendem a se tornar complexos ao longo do tempo. O exemplo abaixo é baseado em um cenário real que vi em um repositório.

Um componente precisa de algum estado para rastrear o foco do mouse. Para manter essa lógica reutilizável, você pode extrair `handleMouserEnter()`, `handleMouseLeave()` e `isHovering()` em um `HoverMixin`. Em seguida, alguém precisa implementar uma dica de ferramenta. Eles não querem duplicar a lógica em `HoverMixin`, de modo que criam um `TooltipMixin` que usa o `HoverMixin`. `TooltipMix` lê `isHovering()` fornecido pelo `HoverMixin` no seu `componentDidUpdate()` e mostra ou oculta a dica da ferramenta.

Alguns meses depois, alguém quer tornar a direção da dica de ferramenta configurável. Em um esforço para evitar a duplicação de código, eles adicionam suporte a um novo método opcional chamado `getTooltipOptions ()` em `TooltipMixin`. A essa altura, os componentes que mostram popovers também usam o `HoverMixin`. No entanto, os popovers precisam de um atraso diferente. Para resolver isso, alguém adiciona suporte para um método opcional `getHoverOptions ()` e o implementa no `TooltipMixin`. Esses mixins estão agora fortemente acoplados.

Isso é bom enquanto não há novos requisitos. No entanto esta solução não escala muito bem. E se você deseja oferecer suporte à exibição de várias dicas de ferramentas em um único componente? Você não pode definir o mesmo mixin duas vezes em um componente. E se as dicas de ferramentas precisarem ser exibidas automaticamente em um tour guiado ao invés do houver? Boa sorte ao separar o `TooltipMixin` do` HoverMixin`. E se você precisar dar suporte ao caso onde a area do hover e a âncora da dica de ferramenta estejam localizadas em componentes diferentes? Você não pode elevar facilmente o estado usado misturando-se ao componente pai. Ao contrário dos componentes, os mixins não se servem para essas mudanças.

Cada novo requisito torna os mixins mais difíceis de entender. Os componentes que usam o mesmo mixin ficam cada vez mais acoplados ao tempo. Qualquer novo recurso é adicionado a todos os componentes usando esse mixin. Não há como dividir uma parte "mais simples" do mixin sem duplicar o código ou introduzir mais dependências e indiretas entre mixins. Gradualmente, os limites do encapsulamento diminuem e, como é difícil alterar ou remover os mixins existentes, eles ficam cada vez mais abstratos até que ninguém entenda como eles funcionam.

Esses são os mesmos problemas que enfrentamos ao criar aplicativos antes do React. Descobrimos que eles são resolvidos por renderização declarativa, fluxo de dados de cima para baixo e componentes encapsulados. No Facebook, estamos migrando nosso código para usar padrões alternativos para mixins, e geralmente estamos felizes com os resultados. Você pode ler sobre esses padrões logo abaixo.

## Migrando de Mixins {#migrando-de-mixins}

Vamos deixar claro que mixins não são tecnicamente obsoletos. Se você usar `React.createClass ()`, poderá continuar usando-os. Dizemos apenas que eles não funcionaram bem para nós e, portanto, não recomendamos usá-los no futuro.

Cada seção abaixo corresponde a um padrão de uso de mixin que encontramos na base de código do Facebook. Para cada um deles, descrevemos o problema e uma solução que achamos que funciona melhor que os mixins. Os exemplos estão escritos no ES5, mas quando você não precisar de mixins, poderá mudar para as aulas do ES6, se desejar.

Esperamos que você ache esta lista útil. Informe-nos se não citamos algum caso de uso importante, para que possamos alterar a lista ou provar que estamos errados!

### Otimizações de desempenho {#otimizacao-de-desempenho}

Uma das mixins mais usadas é o [`PureRenderMixin`](/docs/pure-render-mixin.html). Você pode usá-lo em alguns componentes para [impedir repetições desnecessárias](/docs/advanced-performance.html#shouldcomponentupdate-in-action) quando os props e o estado são superficialmente iguais aos props e estado anteriores:

```javascript
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Button = React.createClass({
  mixins: [PureRenderMixin],

  // ...

});
```

#### Solução {#solucao}

Para expressar o mesmo sem mixins, você pode usar a função [`shallowCompare`](/docs/shallow-compare.html):

```js
var shallowCompare = require('react-addons-shallow-compare');

var Button = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  // ...

});
```
Se você usar um mix personalizado implementando uma função `shouldComponentUpdate` com algoritmo diferente, sugerimos exportar apenas essa função única de um módulo e chamá-la diretamente de seus componentes.

Entendemos que mais digitação pode ser chato. Para o caso mais comuns, planejamos [introduzir uma nova classe base](https://github.com/facebook/react/pull/7195) chamada `React.PureComponent` na próxima versão menor. Ele usa a mesma comparação superficial que o `PureRenderMixin` faz hoje.

## Assinaturas e efeitos colaterais {#assinaturas-e-efeitos-colaterais}

O segundo tipo mais comum de mixins que encontramos são os mixins que assinam um componente React em uma fonte de dados de terceiros. Se essa fonte de dados é um Flux Store, um Rx Observable ou qualquer outra coisa, o padrão é muito semelhante: a assinatura é criada em `componentDidMount`, destruída em` componentWillUnmount` e o manipulador de alterações chama `this.setState ()` .

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
    // Lendo comentários do estado gerenciado por mixin.
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

#### Solução {#solucao-1}

Se houver apenas um componente inscrito nessa fonte de dados, não há problema em incorporar a lógica de assinatura diretamente no componente. Evite abstrações prematuras.

Se vários componentes usaram esse mixin para assinar uma fonte de dados, uma boa maneira de evitar a repetição é usar um padrão chamado ["componentes de ordem superior"](https://medium.com/@dan_abramov/mixins-are-dead-long-live-high-order-components-94a0d2f9e750). Pode parecer intimidador, portanto, examinaremos mais de perto como esse padrão emerge naturalmente do modelo de componentes.

#### Explicação dos componentes de ordem superior {# explicacao-dos-componentes-de-ordem-superior}

Vamos esquecer o React por um segundo. Considere estas duas funções que adicionam e multiplicam números, registrando os resultados conforme são executadas:

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
