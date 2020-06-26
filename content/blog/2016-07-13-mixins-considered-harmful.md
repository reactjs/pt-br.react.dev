---
title: "Mixins Considerados Nocivos"
author: [gaearon]
---

“Como eu compartilho o código entre diversos componentes?" é uma das primeiras perguntas que as pessoas fazem quando aprendem React. Nossa resposta sempre foi usar composição de componentes para reutilização do código. Você pode definir um componente e usá-lo em diversos outros componentes.

Nem sempre é óbvio como um determinado padrão pode ser resolvido com a componetização. O React é influenciado pela programacão funcional, mas entrou em um campo que é dominado por bibliotecas orientadas à objetos. Foi difícil para os engenheiros, dentro e fora do Facebook, de abrir mão dos padrões que estavam acostumados.

Para facilitar a adoção e o aprendizado inicial, incluimos algumas válvulas de escape no React. O sistema mixin era uma dessas válvulas de escape, e seu objetivo era dar a você uma maneira de reutilizar o código entre os componentes, quando você não tem certeza de como resolver o mesmo problema com a composição.

Três anos se passaram desde que o React foi lançado. O cenário mudou. Agora, várias bibliotecas de visualizações adotam um modelo de componente semelhante ao React. Usar composição sobre a herança para criar interfaces de usuário declarativas não é mais uma novidade. Também estamos mais confiantes no modelo do componente React, e vimos muitos usos criativos dele tanto internamente quanto na comunidade.

Neste post, vamos considerar os problemas comumentes causados por mixins. Em seguida, sugeriremos vários padrões alternativos para os mesmos casos de uso. Descobrimos que esses padrões escalam melhor com a complexidade da base de código do que os mixins.

## Por que Mixins estão quebrados? {#why-mixins-are-broken}

No Facebook, o uso do React cresceu de alguns componentes para milhares deles. Isso nos dá uma janela sobre como as pessoas usam o React. Graças à renderização declarativa e ao fluxo de dados de cima para baixo, muitas equipes conseguiram corrigir vários bugs ao enviar novos recursos à medida que o React era adotado.

No entando, é inevitável que parte do nosso código usando React se torne gradualmente incompreensível. Ocasionalmente, a equipe do React veria grupos de componentes em diferentes projetos que as pessoas tinham medo de tocar. Esses componentes eram muito fáceis de serem quebrados acidentalmente, eram confusos para novos desenvolvedores e acabaram se tornando tão confusos para as pessoas que os escreveram em primeiro lugar. Muito dessa confusão ocorreu por causa dos mixins. Na época, eu não estava trabalhando no Facebook, mas cheguei [as mesmas conclusões](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) depois de escrever vários de terríveis mixins.

Isso não significa que os próprios mixins são ruins. As pessoas empregam com sucesso em diferentes linguagens e paradigmas, incluindo algumas linguagens funcionais. No Facebook, usamos extensivamente traços no Hack que são bastante semelhantes aos mixins. No entanto, pensamos que os mixins são desnecessários e problemáticos nas bases de código do React. E aqui está o porquê.

### Mixins introduzem dependências implícitas {#mixins-introduce-implicit-dependencies}

Às vezes, um componente depende de um determinado método definido no mixin, como `getClassName()`. Às vezes é o contrário, e mixins chama um método como `renderHeader()` no componente. JavaScript é uma linguagem dinâmica, por isso é difícil impor ou documentar tais dependências.

Os mixins quebram a suposição comum e geralmente segura de que você pode renomear uma chave de estado ou um método pesquisando suas ocorrências no arquivo do componente. Você pode escrever um componente com estado e, em seguida, seu colega de trabalho pode adicionar um mixin que leia esse estado. Em alguns meses, você pode querer mover esse estado para o componente pai para que ele possa ser compartilhado com um irmão. Você vai se lembrar de atualizar o mixin para ler a prop em vez disso? E se, até agora, outros componentes também usarem este mixin?

Essas dependências implícitas dificultam que novos membros da equipe contribuam para uma base de código. O método `render()` de um componente pode fazer referência a algum método que não está definido na classe. É seguro remover? Talvez esteja definido em um dos mixins. Mas qual deles? Você precisa rolar até a lista de mixins, abrir cada um desses arquivos e procurar por este método. Pior ainda, mixins podem especificar seus próprios mixins, então a pesquisa pode se aprofundar.

Muitas vezes, os mixins passam a depender de outros mixins, e a remoção de um deles quebra o outro. Nessas situações, é muito complicado dizer como os dados entram e saem dos mixins e como é o seu gráfico de dependências. Ao contrário dos componentes, os mixins não formam uma hierarquia: eles são achatados e operam no mesmo namespace.

### Mixins causam confronto de nomes {#mixins-cause-name-clashes}

Não há garantia de que duas misturas específicas possam ser usadas juntas. Por exemplo, se `FluxListenerMixin` define `handleChange()` e `WindowSizeMixin` define `handleChange()`, você não pode usá-los juntos. Você também não pode definir um método com esse nome em seu próprio componente.

Não é um grande problema se você controlar o código do <em>mixin</em>. Quando você tem um conflito, você pode renomear esse método em um dos <em>mixins</em>. No entanto, é complicado porque alguns componentes ou outros <em>mixins</em> já podem estar chamando esse métodos diretamente, e você precisa encontrar e corrigir essas chamadas também.

Se você tiver um conflito de nome com um <em>mixin</em> de um pacote de terceiros, não será possível renomear um método dele. Em vez disso, você precisa usar nomes desconhecidos de métodos em seu componente para evitar conflitos.

A situação não é melhor para os autores dos <em>mixins</em>. Até mesmo a adição de um novo método a um <em>mixin</em> é sempre uma alteração potencial, pois um método com o mesmo nome já pode existir em alguns dos componentes que o usam, diretamente ou por meio de outro <em>mixin</em>. Uma vez escritos, os <em>mixins</em> são difíceis de remover ou mudar. Idéias ruins não são refatoradas porque a refatoração é muito arriscada.

### Mixins desencadeiam complexidade de bola de neve {#mixins-cause-snowballing-complexity}

Mesmo quando os <em>mixins</em> começam de forma simples, eles tendem a se tornar complexos ao longo do tempo. O exemplo abaixo é baseado em um cenário real que vi em um repositório.

Um componente precisa de algum estado para rastrear o foco do mouse. Para manter essa lógica reutilizável, você pode extrair `handleMouserEnter()`, `handleMouseLeave()` e `isHovering()` em um `HoverMixin`. Em seguida, alguém precisa implementar uma dica de ferramenta. Eles não querem duplicar a lógica em `HoverMixin`, de modo que criam um `TooltipMixin` que usa o `HoverMixin`. `TooltipMix` lê `isHovering()` fornecido pelo `HoverMixin` no seu `componentDidUpdate()` e mostra ou oculta a dica da ferramenta.

Alguns meses depois, alguém quer tornar a direção da dica de ferramenta configurável. Em um esforço para evitar a duplicação de código, eles adicionam suporte a um novo método opcional chamado `getTooltipOptions ()` em `TooltipMixin`. A essa altura, os componentes que mostram popovers também usam o `HoverMixin`. No entanto, os popovers precisam de um atraso diferente. Para resolver isso, alguém adiciona suporte para um método opcional `getHoverOptions ()` e o implementa no `TooltipMixin`. Esses mixins estão agora fortemente acoplados.

Isso é bom enquanto não há novos requisitos. No entanto esta solução não escala muito bem. E se você deseja oferecer suporte à exibição de várias dicas de ferramentas em um único componente? Você não pode definir o mesmo mixin duas vezes em um componente. E se as dicas de ferramentas precisarem ser exibidas automaticamente em um tour guiado ao invés do hover? Boa sorte ao separar o `TooltipMixin` do `HoverMixin`. E se você precisar dar suporte ao caso onde a área do hover e a âncora da dica de ferramenta estejam localizadas em componentes diferentes? Você não pode elevar facilmente o estado usado misturando-se ao componente pai. Ao contrário dos componentes, mixins não se prestam naturalmente a essas mudanças.

Cada novo requisito torna os mixins mais difíceis de entender. Os componentes que usam o mesmo mixin ficam cada vez mais acoplados ao tempo. Qualquer novo recurso é adicionado a todos os componentes usando esse mixin. Não há como dividir uma parte "mais simples" do mixin sem duplicar o código ou introduzir mais dependências e indiretas entre mixins. Gradualmente, os limites do encapsulamento diminuem e, como é difícil alterar ou remover os mixins existentes, eles ficam cada vez mais abstratos até que ninguém entenda como eles funcionam.

Esses são os mesmos problemas que enfrentamos ao criar aplicativos antes do React. Descobrimos que eles são resolvidos por renderização declarativa, fluxo de dados de cima para baixo e componentes encapsulados. No Facebook, estamos migrando nosso código para usar padrões alternativos para mixins, e geralmente estamos felizes com os resultados. Você pode ler sobre esses padrões logo abaixo.

## Migrando de Mixins {#migrating-from-mixins}

Vamos deixar claro que mixins não são tecnicamente obsoletos. Se você usar `React.createClass()`, poderá continuar usando-os. Dizemos apenas que eles não funcionaram bem para nós e, portanto, não recomendamos usá-los no futuro.

Cada seção abaixo corresponde a um padrão de uso de mixin que encontramos na base de código do Facebook. Para cada um deles, descrevemos o problema e uma solução que achamos que funciona melhor que os mixins. Os exemplos estão escritos no ES5, mas quando você não precisar de mixins, poderá mudar para as aulas do ES6, se desejar.

Esperamos que você ache esta lista útil. Informe-nos se não citamos algum caso de uso importante, para que possamos alterar a lista ou provar que estamos errados!

### Otimizações de desempenho {#performance-optimizations}

Um dos mixins mais usados é o [`PureRenderMixin`](/docs/pure-render-mixin.html). Você pode usá-lo em alguns componentes para [impedir repetições desnecessárias](/docs/advanced-performance.html#shouldcomponentupdate-in-action) quando os props e o estado são superficialmente iguais aos props e estado anteriores:

```javascript
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Button = React.createClass({
  mixins: [PureRenderMixin],

  // ...

});
```

#### Solução {#solution}

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

Entendemos que mais digitação pode ser chato. Para o caso mais comum, planejamos [introduzir uma nova classe base](https://github.com/facebook/react/pull/7195) chamada `React.PureComponent` na próxima versão menor. Ele usa a mesma comparação superficial que o `PureRenderMixin` faz hoje.

## Assinaturas e efeitos colaterais {#subscriptions-and-side-effects}

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

#### Solução {#solution-1}

Se houver apenas um componente inscrito nessa fonte de dados, não há problema em incorporar a lógica de assinatura diretamente no componente. Evite abstrações prematuras.

Se vários componentes usaram esse mixin para assinar uma fonte de dados, uma boa maneira de evitar a repetição é usar um padrão chamado ["componentes de ordem superior"](https://medium.com/@dan_abramov/mixins-are-dead-long-live-high-order-components-94a0d2f9e750). Pode parecer intimidador, portanto, examinaremos mais de perto como esse padrão emerge naturalmente do modelo de componentes.

#### Explicação dos componentes de ordem superior {#higher-order-components-explained}

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

Essas duas funções não são muito úteis, mas nos ajudam a demonstrar um padrão que podemos aplicar posteriormente aos componentes.

Digamos que queremos extrair a lógica de log dessas funções sem alterar suas assinaturas. Como podemos fazer isso? Uma solução elegante é escrever uma [função de ordem superior](https://en.wikipedia.org/wiki/Higher-order_function), ou seja, uma função que assume uma função como argumento e retorna uma função.

Novamente, parece mais intimidador do que realmente é:


```js
function withLogging(wrappedFunction) {
  // Retorna uma função com a mesma API...
  return function(x, y) {
    // ... que chama a função original
    var result = wrappedFunction(x, y);
    // ... mas também registra o resultado
    console.log('result:', result);
    return result;
  };
}
```
A função de ordem superior `withLogging` nos permite escrever `add` e `multiply` sem as instruções de log e depois envolvê-las para obter `addAndLog` e `multiplyAndLog` com exatamente as mesmas assinaturas de antes:

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

// Equivalente a escrever addLAndLog manualmente:
var addAndLog = withLogging(add);

// Equivalente a escrever multiplyAndLog manualmente:
var multiplyAndLog = withLogging(multiply);
```

Higher-order components are a very similar pattern, but applied to components in React. We will apply this transformation from mixins in two steps.

As a first step, we will split our `CommentList` component in two, a child and a parent. The child will be only concerned with rendering the comments. The parent will set up the subscription and pass the up-to-date data to the child via props.

```js
// Este é um componente filho.
// Apenas gera os comentários que recebe como props.
var CommentList = React.createClass({
  render: function() {
    // Nota: agora lendo das props em vez de estado.
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

// Este é um componente pai.
// Ele assina a fonte de dados e renderiza <CommentList />.
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
    // Passamos o estado atual como props para CommentList.
    return <CommentList comments={this.state.comments} />;
  }
});

module.exports = CommentListWithSubscription;
```

Há apenas um passo final a ser feito.

Lembra como fizemos com `withLogging ()` pegar uma função e retornar outra função envolvendo-a? Podemos aplicar um padrão semelhante aos componentes React.

Escreveremos uma nova função chamada `withSubscription (WrappedComponent)`. Seu argumento pode ser qualquer componente React. Passaremos `CommentList` como `WrappedComponent`, mas também poderíamos aplicar `withSubscription ()` a qualquer outro componente em nossa base de código.

Esta função retornaria outro componente. O componente retornado gerenciaria a assinatura e renderizaria `<WrappedComponent />` com os dados atuais.

Chamamos esse padrão de "componente de ordem superior".

A composição acontece no nível de renderização React, e não com uma chamada direta da função. É por isso que não importa se o componente agrupado está definido com `createClass()`, como uma classe ou função ES6. Se `WrappedComponent` for um componente React, o componente criado por `withSubscription()` poderá renderizá-lo.

```js
// Esta função pega um componente ...
function withSubscription(WrappedComponent) {
  // ...e retorna um outro componente...
  return React.createClass({
    getInitialState: function() {
      return {
        comments: DataSource.getComments()
      };
    },

    componentDidMount: function() {
      // ...que cuida da assinatura...
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
      // ... e renderiza o componente agrupado com os novos dados! 
      return <WrappedComponent comments={this.state.comments} />;
    }
  });
}
```

Agora podemos declarar `CommentListWithSubscription` aplicando `withSubscription` ao `CommentList`:

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

// withSubscription() retorna um novo componente que
// é inscrito na fonte de dados e renderiza
// <CommentList /> com os dados atualizados.
var CommentListWithSubscription = withSubscription(CommentList);

// O restante da aplicação está interessada no componente inscrito
// então exportamos em vez do CommentList original.
module.exports = CommentListWithSubscription;
```

#### Solution, Revisited {#solution-revisited}

Agora que entendemos melhor os componentes de ordem superior, vamos dar uma olhada na solução completa que não envolve mixins. Existem algumas pequenas alterações anotadas com comentários inseridos nas linhas:

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
      // Use o spread no JSX para passar todas as props e state para baixo automaticamente.
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  });
}

// Alteração opcional: converte CommentList em um componente de função
// porque não usa métodos ou estados do ciclo de vida.
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

// Em vez de declarar CommentListWithSubscription,
// exportamos o componente envolvido
module.exports = withSubscription(CommentList);
```

Os componentes de ordem superior são um padrão poderoso. Você pode passar argumentos adicionais para eles, se desejar personalizar ainda mais o comportamento deles. Afinal, eles nem são um recurso do React. São apenas funções que recebem componentes e retornam componentes que os envolvem.

Como qualquer solução, os componentes de ordem superior têm suas próprias armadilhas. Por exemplo, se você usar fortemente [refs](/docs/more-about-refs.html), poderá notar que agrupar algo em um componente de ordem superior altera o ref para apontar para o componente de agrupamento. Na prática, desencorajamos o uso de referências para a comunicação de componentes, por isso não achamos que seja um grande problema. No futuro, podemos considerar a adição de [ref forwarding](https://github.com/facebook/react/issues/4213) ao React para resolver esse incômodo.

### Lógica de renderização {#rendering-logic}

O próximo caso de uso mais comum para mixins que descobrimos em nossa base de código é o compartilhamento da lógica de renderização entre os componentes.

Aqui está um exemplo típico desse padrão:

```js
var RowMixin = {
  // Chamado por componentes a partir do render()
  renderHeader: function() {
    return (
      <div className='row-header'>
        <h1>
          {this.getHeaderText() /* Definido por componentes */}
        </h1>
      </div>
    );
  }
};

var UserRow = React.createClass({
  mixins: [RowMixin],

  // Chamado por RowMixin.renderHeader()
  getHeaderText: function() {
    return this.props.user.fullName;
  },

  render: function() {
    return (
      <div>
        {this.renderHeader() /* Definido por RowMixin */}
        <h2>{this.props.user.biography}</h2>
      </div>
    )
  }
});
```
Vários componentes podem estar compartilhando `RowMixin` para renderizar o cabeçalho, e cada um deles precisaria definir `getHeaderText()`.

#### Solução {#solution-2}

Se você ver a lógica de renderização dentro de um mixin, é hora de extrair um componente!

Em vez de `RowMixin`, definiremos um componente `<RowHeader>`. Também substituiremos a convenção de definir um método `getHeaderText ()` pelo mecanismo padrão do fluxo de dados principais no React: passando adereços.

Por fim, como atualmente nenhum desses componentes precisa de métodos ou estados do ciclo de vida, podemos declará-los como funções simples:

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
As props mantêm as dependências de componentes explícitas, fáceis de substituir e aplicáveis com ferramentas como [Flow](https://flowtype.org/) e [TypeScript](https://www.typescriptlang.org/).

> **Nota:**
>
> Definir componentes como funções não é necessário. Também não há nada de errado em usar métodos e estados do ciclo de vida - eles são os primeiros recursos do React quando usado em formato de classe. Usamos componentes de função neste exemplo porque são mais fáceis de ler e não precisávamos desses recursos extras, mas as classes funcionariam da mesma maneira.

### Contexto {#context}

Outro grupo de mixins que descobrimos eram helpers por fornecer e consumir [React context](/docs/context.html). O contexto é um recurso instável experimental, possui [certos problemas](https://github.com/facebook/react/issues/2517) e provavelmente mudará sua API no futuro. Não recomendamos o uso, a menos que você tenha certeza de que não há outra maneira de resolver seu problema.

No entanto, se você já usa o contexto hoje, pode estar ocultando seu uso com mixins como este:

```js
var RouterMixin = {
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  // O mixin fornece um método para que os componentes
  // não precisem utilizar a API de contexto diretamente
  push: function(path) {
    this.context.router.push(path)
  }
};

var Link = React.createClass({
  mixins: [RouterMixin],

  handleClick: function(e) {
    e.stopPropagation();

    // Este método é definido em RouterMixin.
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

#### Solução {#solution-3}

Concordamos que ocultar o uso do contexto do consumo de componentes é uma boa ideia até que a API do contexto se estabilize. No entanto, recomendamos o uso de componentes de ordem superior em vez de mixins para isso.

Deixe o componente de empacotamento pegar algo do contexto e transmiti-lo com as props para o componente empacotado:

```js
function withRouter(WrappedComponent) {
  return React.createClass({
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },

    render: function() {
       // O componente wrapper lê algo do contexto
       // e o passa para baixo como uma prop ao componente empacotado.
      var router = this.context.router;
      return <WrappedComponent {...this.props} router={router} />;
    }
  });
};

var Link = React.createClass({
  handleClick: function(e) {
    e.stopPropagation();

    // O componente empacotado usa props ao invés do context.
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

// Não se esqueça de empacotar o componente!
module.exports = withRouter(Link);
```

Se você estiver usando uma biblioteca de terceiros que fornece apenas um mixin, recomendamos que você arquive um problema vinculado a esta postagem para que eles possam fornecer um componente de ordem superior. Enquanto isso, você pode criar um componente de ordem superior exatamente da mesma maneira.

### Métodos de utilidade {#utility-methods}

Às vezes, os mixins são usados apenas para compartilhar funções utilitárias entre componentes:

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

#### Solução {#solution-4}

Coloque funções utilitárias em módulos JavaScript regulares e importe-as. Isso também facilita testá-los ou usá-los fora dos seus componentes:

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

### Outros casos de uso {#other-use-cases}

Às vezes, as pessoas usam mixins para adicionar seletivamente o log aos métodos do ciclo de vida em alguns componentes. No futuro, pretendemos fornecer uma [API oficial do DevTools](https://github.com/facebook/react/issues/5306) que permita implementar algo semelhante sem tocar nos componentes. No entanto, ainda é um trabalho em andamento. Se você depende muito de registrar mixins para depuração, convém continuar usando esses mixins por mais algum tempo.

Se você não conseguir realizar algo com um componente, um componente de ordem superior ou um módulo utilitário, isso pode significar que o React deve fornecer isso imediatamente. [Arquive um problema](https://github.com/facebook/react/issues/new) para nos informar sobre seu caso de uso para mixins, e ajudaremos você a considerar alternativas ou talvez implementar sua solicitação de recurso.

Mixins não são descontinuados no sentido tradicional. Você pode continuar usando-os com `React.createClass ()`, pois não mudaremos mais. Eventualmente, à medida que as classes ES6 ganham mais adoção e seus problemas de usabilidade no React são resolvidos, podemos dividir `React.createClass ()` em um pacote separado, porque a maioria das pessoas não precisa disso. Mesmo nesse caso, seus antigos mixins continuariam funcionando.

Acreditamos que as alternativas acima são melhores para a grande maioria dos casos, e convidamos você a escrever aplicativos React sem usar mixins.
