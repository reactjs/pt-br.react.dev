---
id: jsx-in-depth
title: JSX In Depth
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

Fundamentalmente, JSX é somente um açúcar sintático (syntactic sugar) para a função `React.createElement(component, props, ...children)`. O código JSX:

```js
<MyButton color="blue" shadowSize={2}>
  Clique aqui
</MyButton>
```

é compilado para:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Clique aqui'
)
```

Você também pode fechar a tag imediatamente se não tiver elementos filhos. Então:

```js
<div className="sidebar" />
```

é compilado para:

```js
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

Se você quiser testar como um JSX em específico é convertido em JavaScript, você pode usar [o compilador online do Babel](babel://jsx-simple-example).

## Especificando o Tipo do Elemento React {#specifying-the-react-element-type}

A primeira parte de uma tag JSX determina o tipo do elemento React.

Tipos que começam com letra maiúscula se referem a um componente React. Essas tags são compiladas para uma referência direta da variável nomeada, então se você usar a expressão JSX `<Foo />`, `Foo` tem que estar no escopo.

### O React Tem Que Estar no Escopo{#react-must-be-in-scope}

Já que JSX compila em chamadas para `React.createElement`, a biblioteca `React` também tem sempre que estar no escopo do seu código JSX.

Por exemplo, os dois imports são necessários nesse código, apesar de que `React` e `CustomButton` não são referenciados diretamente pelo JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Se você não usa um bundler JavaScript e carrega o React de uma tag `<script>`, ele já estará no escopo global como `React`.

### Usando Notação Pontuada (_Dot Notation_) Para Tipos JSX {#using-dot-notation-for-jsx-type}

Você também pode se referir a um componente React usando notação pontuada no próprio JSX. Isso é conveniente se você tem um único módulo que exporta vários componentes React. Por exemplo, se `MyComponents.DatePicker` é um componente, você pode usá-lo diretamente no JSX como:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine um datepicker {props.color} aqui.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Componentes Defindos pelo Usuário Precisam Começar com Letras Maiúsculas {#user-defined-components-must-be-capitalized}

Quando um tipo elemento começar com uma letra minúscula, ele se refere a um componente interno `<div>` ou `<span>` e resulta na string `'div'` ou `'span'` passada para `React.createElement`. Tipos que começam com letra maiúscula como `<Foo />` são compilados para `React.createElement(Foo)` e correspondem a um componente definido ou importado no seu arquivo JavaScript.

Nós recomendamos nomear componentes com letras maiúsculas. Se você realmente tiver um componente que comece com letra minúscula, guarde-o em uma variável que comece com letra maiúscula antes de usá-lo no JSX.

Por exemplo, esse código não vai rodar como esperado:

```js{3,4,10,11}
import React from 'react';

// Errado! Isso é um componente e devia começar com letra maiúscula:
function hello(props) {
  // Correto! Esse uso da <div> é legítimo porque div é uma tag HTML válida:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Errado! O React pensa que <hello /> é uma tag HTML porque não começa com letra maiúscula:
  return <hello toWhat="World" />;
}
```

Para consertar isso, nós vamos renomear `hello` para `Hello` e usar `<Hello />` quando nos referirmos a ele:

```js{3,4,10,11}
import React from 'react';

// Correto! Isso é um componente e deve começar com letra maiúscula:
function Hello(props) {
  // Correto! Esse uso da <div> é legítimo porque div é uma tag HTML válida:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Correto! O React sabe que <Hello /> é um componente porque ele começa com letra maiúscula.
  return <Hello toWhat="World" />;
}
```

### Escolhendo o Tipo em Tempo de Execução {#choosing-the-type-at-runtime}

Você não pode usar uma expressão genérica como tipo do elemento React. Se você realmente quiser usar uma expressão genérica para indicar tipo do elemento, guarde-a em uma variável que comece com letra maiúscula primeiro. Isso geralmente é usado quando você quer renderizar um componente diferente baseado em uma prop:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Errado! O tipo do JSX não pode ser uma expressão.
  return <components[props.storyType] story={props.story} />;
}
```

Para consertar isso, nós vamos guardar o tipo em uma variável começando com letra maiúscula primeiro:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Correto! O tipo JSX pode ser uma variável começando com letra maiúscula.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Props no JSX {#props-in-jsx}

Existem várias maneiras de especificar uma prop em JSX.

### Expressões JavaScript como Props {#javascript-expressions-as-props}

Você pode passar qualquer expressão JavaScript como prop, colocando ela em volta de `{}`. Por exemplo, nesse JSX:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Para `MyComponent`, o valor de `props.foo` será `10` porque a expressão `1 + 2 + 3 + 4` é calculada.

Declarações `if` e loops `for` não são expressões em JavaScript, então elas não podem ser usadas no JSX diretamente. Ao invés disso, você pode colocá-las no código ao redor. Por exemplo:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

Você pode aprender mais sobre [renderização condicional](/docs/conditional-rendering.html) e [loops](/docs/lists-and-keys.html) nas seções correspondentes.

### String Literals {#string-literals}

Você pode passar uma string literal como uma prop. Essas duas expressões JSX são equivalentes:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Quando você passa uma string literal, seu valor é um HTML não escapado. Então essas duas expressões são equivalentes:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

O comportamento geralmente não é relevante. Ele só é mencionado aqui pela integridade.

### Props com Valor Padrão "True" {#props-default-to-true}

Se você não passar nenhum valor para a prop, seu valor padrão será `true`. Essas duas expressões JSX são equivalentes:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

No geral, nós não recomendamos *não* a passagem de um valor para uma prop, porque pode ser confundido com [abreviação de objeto do ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` que é a abreviação de `{foo: foo}` em vez de `{foo: true}`. Esse comportamente só está ai para estar de acordo com o comportamento do HTML.

### Atributos com Spread {#spread-attributes}

Se você já tiver `props` como um objeto e quiser passar em JSX, você pode usar `...` como um operador "spread" para passar todo o objeto props. Esses dois componentes são equivalentes:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

Você também pode escolher props específicas que seu componente irá consumir enquanto passa todas as outras props usando o operador spread.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

No exemplo acima, a prop `kind` é consumida em segurança *e não* é passada para o elemento `<button>` no DOM.
Todas as outras props são passadas pelo objeto `...other` tornando esse componente bastante flexível. Você pode ver que ele passa as props `onClick` e `children`.

Atributos spread podem ser úteis mas eles facilitam a passagem de props desnecessárias para componentes que não precisam delas ou a passagem de atributos HTML inválidos para o DOM. Nós recomendamos usá-lo com moderação.  

## Elementos Filhos em JSX {#children-in-jsx}

Nas expressões JSX que contêm tags para abrir e tags para fechar, o conteúdo entre essas tags é passado na forma de uma prop especial `props.children`. Existem diversas formas diferentes de passar essa prop children:

### String Literals {#string-literals-1}

Você pode por uma string entre tags que abrem e tags que fecham e `props.children` será essa string. Isso é útil para vários dos elementos HTML internos. Por exemplo:

```js
<MyComponent>Hello world!</MyComponent>
```

Esse é um JSX válido e `props.children` em `MyComponent` será a string `"Hello world!"`. O HTML não é escapado, então você pode escrever JSX da mesma maneira que você escreveria HTML:

```html
<div>Esse é um HTML válido &amp; e JSX ao mesmo tempo.</div>
```

O JSX remove espaços em branco no início e no final da linha. Ele também remove linhas vazias. Linhas novas adjacentes a tags são removidas; novas linhas que ocorrem no meio de uma string literal são condensadas em um único espaço. Então todos esses são renderizados da mesma forma:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### Elemento Filhos JSX {#jsx-children}

Você pode fornecer mais elementos JSX como elementos filhos. Isso é útil para exibir componentes aninhados:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Você pode misturar elementos filhos de tipos diferentes, assim você pode usar string literals com elementos filhos JSX. Essa é outra forma em que o JSX é como o HTML, então isso é ao mesmo tempo um HTML e um JSX válido:

```html
<div>
  Aqui está uma lista:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

Um componente React pode retornar um array de elementos:

```js
render() {
  // Não há necessidade de envolver uma lista de itens em um elemento extra!
  return [
    // Não esqueça das keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### Expressões JavaScript como Elementos Filhos {#javascript-expressions-as-children}

Você pode passar expressões JavaScript como elementos filhos, envolvendo elas com `{}`. Por exemplo, essas expressões são equivalentes:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Isso é geralmente útil para renderizar uma lista de expressões JSX de um tamanho arbitrário. Por exemplo, isso renderiza uma lista HTML:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

Expressões JavaScript podem ser misturadas com outros tipos de elementos filhos. Isso é geralmente útil para templates de string:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Funções como Elementos Filhos {#functions-as-children}

Normalmente, expressões JavaScript inseridas no JSX vão ser avaliadas em uma string, um elemento React ou uma lista dessas coisas. No entando, `props.children` funciona como qualquer outra prop podendo passar qualquer tipo de dado, não somente os tipos que o React sabe renderizar. Por exemplo, se você tem um componente customizado, você pode fazê-lo receber um callback na forma de um `props.children`:

```js{4,13}
// Chama o callback do elemento filho numTimes para produzir um componente repetido
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>Esse é o item {index} na lista </div>}
    </Repeat>
  );
}
```

Elementos filhos passados a um componente customizado podem ser qualquer coisa, contanto que aquele componente transforme-os em algo que o React possa entender antes de renderizá-lo. Esse tipo de uso não é comum, mas funciona se você quiser estender o que o JSX é capaz.

### Booleans, Null, e Undefined são Ignorados {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, e `true` são elementos filhos válidos. Eles somente não renderizam. Essas expressões JSX vão todas renderizar da mesma forma::

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Isso pode ser útil para renderizar condicionalmente elementos React. Esse JSX renderiza o componente `<Header />` apenas se `showHeader` for `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Um problema é que alguns [valores "falsy"](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), como o número `0`, ainda são renderizados pelo React. Por exemplo, esse código não vai se comportar como você espera porque `0` será printado quando `props.messages` for um array vazio:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Para consertar isso, tenha certeza de que a expressão antes do `&&` é sempre booleana:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

De modo inverso, se você quer que um valor como `false`, `true`, `null`, ou `undefined` apareça na saída, você tem que [convertê-lo para uma string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) primeiro:

```js{2}
<div>
  Minha variável JavaScript é {String(myVariable)}.
</div>
```
