---
id: thinking-in-react
title: Pensando em React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React é, na nossa opinião, o principal modo de se construir aplicações grandes e rápidas com JavaScript. Ele tem escalado muito bem para nós no Facebook e Instagram.

Uma das muitas excelentes partes do React é o modo que ele faz você pensar sobre apps enquanto você os constrói. Neste documento, nós iremos ensinar o processo mental envolvido na construção de uma tabela de produtos buscáveis utilizando o React.

## Comece Com Um Mock {#start-with-a-mock}

Imagine que nós já tivéssemos uma API JSON e um mock desenvolvido pelo nosso designer. O mock se parece com isso:

![Mockup](../images/blog/thinking-in-react-mock.png)

Nossa API JSON retorna dados como esses:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Passo 1: Separe A UI Em Uma Hierarquia De Componentes{#step-1-break-the-ui-into-a-component-hierarchy}

A primeira coisa que você vai querer fazer é dar nomes e desenhar retângulos em volta de cada componente (e subcomponente) do mock. Se você estiver trabalhando com designers, eles podem já ter feito isso, então vá falar com eles! Os nomes das camadas no Photoshop podem acabar sendo os nomes dos seus componentes React!

Mas como você sabe o que deveria ser seu próprio componente? Simplesmente use as mesmas técnicas que você usaria para decidir se você deveria criar uma nova função ou objeto. Uma dessas técnicas é o [princípio da responsabilidade única](https://en.wikipedia.org/wiki/Single_responsibility_principle), ou seja, um componente deve idealmente fazer apenas uma coisa. Se ele acabar crescendo, deverá ser decomposto em subcomponentes menores.

Uma vez que você estará frequentemente exibindo um modelo de dados em JSON ao usuário, você perceberá que caso o seu modelo esteja corretamente construído, sua UI (e portanto a sua estrutura de componente) será mapeada satisfatoriamente. Isso acontece pois UI e modelo de dados tendem a aderir à mesma *arquitetura de informação*, o que significa que o trabalho de separar a UI em componentes é muitas vezes trivial. Apenas separe em componentes o que representa exatamente uma pedaço do seu modelo de dados.

![Diagrama de componente](../images/blog/thinking-in-react-components.png)

Você verá que nós temos cinco componentes nessa simples aplicação. Em itálico estão os dados que cada componente representa.

  1. **`FilterableProductTable` (laranja):** contém a totalidade do exemplo
  2. **`SearchBar` (azul):** recebe todo *input do usuário*
  3. **`ProductTable` (verde):** exibe e filtra a *coleção de dados* baseado no *input do usuário*
  4. **`ProductCategoryRow` (turquesa):** exibe um cabeçalho para cada *categoria*
  5. **`ProductRow` (vermelho):** exibe uma linha para cada *produto*

Se você olhar para `ProductTable`, verá que o cabeçalho da tabela (contendo as labels "Name" and "Price") não é um componente separado. Isso é uma questão de preferência, e pode-se fazer um argumento contrário. Para esse exemplo, nós o deixamos como parte de `ProductTable` pois o cabeçalho faz parte da renderização da *coleção de dados*, que é responsabilidade de `ProductTable`. Entretanto, se a sua complexidade aumentar (i.e. se nós adicionássemos a capacidade de ordenação), certamente faria sentido a criação do componente `ProductTableHeader`.

Agora que nós já identificamos os componentes do nosso mock, vamos organizá-los em uma hierarquia. Isso é fácil. Componentes que aparecem dentro de outros no mock devem aparecer como filhos na hierarquia:

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Passo 2: Crie Uma Versão Estática Em React {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Veja o Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Pensando em React: Passo 2</a> no <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Agora que você já tem sua hierarquia de componentes, chegou a hora de implementar o seu app. O modo mais fácil é construir uma versão que recebe o seu modelo de dados e renderiza a UI, mas sem interatividade. É melhor dissociar esses processos uma vez que criar uma versão estática requer muita digitação e pouco pensamento, enquanto adicionar interatividade requer muito pensamento e pouca digitação. Nós veremos o porquê.

Para construir uma versão estática do seu app que renderiza seu modelo de dados, você quer criar componentes que reutilizem outros componentes e passem dados utilizando *props*. *props* são uma forma de passar dados de pai para filho. Se você é familiar com o conceito de *state* (estado), **não use o state** para construir essa versão estática. State é reservado apenas para interatividade, ou seja, dados que mudam com o tempo. Uma vez que essa é uma versão estática do app, você não precisa dele.

Você pode seguir uma abordagem top-down ou bottom-up. Isso significa que você pode começar criando os componentes no topo da hierarquia (i.e. começar com `FilterableProductTable`) ou com os da base (`ProductRow`). Em exemplos simples, top-down é normalmente mais fácil, enquanto que para projetos maiores o melhor é usar uma estratégia bottom-up e escrever testes à medida que você for avançando.

No final dessa etapa, você terá uma biblioteca de componentes reutilizáveis que renderizam seu modelo de dados. Seus componentes terão apenas o método `render()` uma vez que é apenas uma versão estática do seu app. O componente no topo da hierarquia (`FilterableProductTable`) receberá o modelo de dados como uma prop. Se você fizer alguma alteração no seu modelo de dados e chamar `ReactDOM.render()` novamente, a UI será atualizada. É fácil entender como sua UI é atualizada e onde realizar as alterações uma vez que não há nada de mais complicado acontecendo. O **fluxo de dados unidirecional** (_one-way data flow_) do React (também chamado de **ligação unidirecional** _ou one-way binding_) mantém tudo rápido e modular.

Recorra à [documentação do React](/docs/) caso você precise de ajuda para executar esse passo.

### Um Breve Interlúdio: Props vs State {#a-brief-interlude-props-vs-state}

Existem dois tipos de "modelo" de dados em React: props e state. É de suma importância entender a distinção entre os dois; dê uma olhada na [documentação oficial do React](/docs/interactivity-and-dynamic-uis.html) caso você não esteja certo da diferença.

## Step 3: Identifique a Representação Mínima (mas completa) do Estado da UI{#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

Para tornar sua UI interativa, você precisa poder desencadear mudanças no seu modelo de dados. React torna isso fácil com **state**.

Para construir seu app corretamente, você primeiro deve pensar no conjunto mínimo de estados mutáveis que ele precisa. A chave aqui é [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (_Não repita a si mesmo_). Descubra a representação mínima do estado que a sua aplicação precisa e compute todo o resto sob demanda. Por exemplo, se você está criando uma lista de afazeres, simplesmente mantenha um array com cada item a ser feito; não tenha uma variável de estado separada para a contagem. Ao contrário, quando você quiser renderizar a quantidade de afazeres, simplesmente calcule o comprimento do array.

Pense em todos os pedaços de dados do nosso exemplo. Nós temos:

  * A lista original de produtos
  * O texto de busca que o usuário digitou
  * O valor do checkbox
  * A lista filtrada de produtos

Vamos analisar um a um e descobrir quais fazem parte do state. Simplesmente faça três perguntas para cada pedaço de dado:

  1. Ele é recebido pelo pai via props? Se sim, provavelmente não é state.
  2. Ele se mantém inalterado ao longo do tempo? Se sim, provavelmente não é state.
  3. Ele pode ser computado através de qualquer outro state ou props do seu componente? Se sim, não é state.

A lista original de produtos é passada via props, então não é state. O texto de busca e o checkbox parecem ser state uma vez que eles mudam com o tempo e não podem ser computados por qualquer outro valor. Finalmente, a lista filtrada de produtos não é state pois pode ser computada ao se combinar a lista original com o texto de busca e o valor do checkbox.

Então, finalmente, nosso state é:

  * O texto de busca que o usuário digitou
  * O valor do checkbox

## Step 4: Identify Where Your State Should Live {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> on <a href="http://codepen.io">CodePen</a>.</p>

OK, so we've identified what the minimal set of app state is. Next, we need to identify which component mutates, or *owns*, this state.

Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. **This is often the most challenging part for newcomers to understand,** so follow these steps to figure it out:

For each piece of state in your application:

  * Identify every component that renders something based on that state.
  * Find a common owner component (a single component above all the components that need the state in the hierarchy).
  * Either the common owner or another component higher up in the hierarchy should own the state.
  * If you can't find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

Let's run through this strategy for our application:

  * `ProductTable` needs to filter the product list based on state and `SearchBar` needs to display the search text and checked state.
  * The common owner component is `FilterableProductTable`.
  * It conceptually makes sense for the filter text and checked value to live in `FilterableProductTable`

Cool, so we've decided that our state lives in `FilterableProductTable`. First, add an instance property `this.state = {filterText: '', inStockOnly: false}` to `FilterableProductTable`'s `constructor` to reflect the initial state of your application. Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a prop. Finally, use these props to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

You can start seeing how your application will behave: set `filterText` to `"ball"` and refresh your app. You'll see that the data table is updated correctly.

## Step 5: Add Inverse Data Flow {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> on <a href="http://codepen.io">CodePen</a>.</p>

So far, we've built an app that renders correctly as a function of props and state flowing down the hierarchy. Now it's time to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`.

React makes this data flow explicit to make it easy to understand how your program works, but it does require a little more typing than traditional two-way data binding.

If you try to type or check the box in the current version of the example, you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.

Let's think about what we want to happen. We want to make sure that whenever the user changes the form, we update the state to reflect the user input. Since components should only update their own state, `FilterableProductTable` will pass callbacks to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. The callbacks passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

Though this sounds complex, it's really just a few lines of code. And it's really explicit how your data is flowing throughout the app.

## And That's It {#and-thats-it}

Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more than it's written, and it's extremely easy to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
