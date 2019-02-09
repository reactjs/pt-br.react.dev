---
id: introducing-jsx
title: Introduzindo JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Considere esta declaração de variável:

```js
const element = <h1>Hello, world!</h1>;
```

Esta sintaxe estranha de tags não é uma string, nem HTML.

É chamada JSX, e é uma extensão de sintaxe para JavaScript. Recomendamos usá-la com o React para descrever como a UI deveria parecer. JSX pode lembrar uma linguagem de template, mas vem com todo o poder do JavaScript.

JSX produz "elementos" do React. Nós iremos explorar a renderização para o DOM na [próxima seção](/docs/rendering-elements.html). Abaixo você descobrirá o básico de JSX necessário para começar.

### Por que JSX? {#why-jsx}

O React abraça o fato de que a lógica de renderização é inerentemente acoplada com outras lógicas de UI: como eventos são manipulados, como o state muda com o tempo, e como os dados são preparados para exibição.

Ao invés de separar *tecnologias* artificialmente colocando markup e lógica em arquivos separados, o React [separa *conceitos*](https://pt.wikipedia.org/wiki/Separa%C3%A7%C3%A3o_de_conceitos) com unidades livremente acopladas chamadas "componentes" que contém ambos. Voltaremos aos componentes em 
 [outra seção](/docs/components-and-props.html), mas se você ainda não está confortável em usar markup em JS, [esta talk](https://www.youtube.com/watch?v=x7cQ3mrcKaY) pode convencer você do contrário.

O React [não requer](/docs/react-without-jsx.html) o uso do JSX, mas a maioria das pessoas acha prático como uma ajuda visual quando se está trabalhando com uma UI dentro do código em JavaScript. Ele permite ao React mostrar mensagens mais úteis de erro e aviso.

Com isso fora do caminho, vamos começar!

### Incorporando Expressões em JSX {#embedding-expressions-in-jsx}

No exemplo abaixo, declaramos uma variável chamada `name` e então a usamos dentro do JSX ao envolvê-la com chaves:

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Você pode por qualquer [expressão JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) válida dentro das chaves em JSX. Por exemplo, `2 + 2`, `user.firstName`, ou `formatName(user)` são todas expressões JavaScript válidas.

No exemplo abaixo, incorporamos o resultado da chamada de uma função JavaScript, `formatName(user)`, dentro de um elemento `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

Separamos o JSX em múltiplas linhas para melhorar a legibilidade. Mesmo que não seja requerido, quando fizer isso, também recomendamos cercá-lo com parênteses para evitar as armadilhas da [inserção automática de ponto-e-vírgula](http://stackoverflow.com/q/2846283).

### JSX is an Expression Too {#jsx-is-an-expression-too}

After compilation, JSX expressions become regular JavaScript function calls and evaluate to JavaScript objects.

This means that you can use JSX inside of `if` statements and `for` loops, assign it to variables, accept it as arguments, and return it from functions:

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### Specifying Attributes with JSX {#specifying-attributes-with-jsx}

You may use quotes to specify string literals as attributes:

```js
const element = <div tabIndex="0"></div>;
```

You may also use curly braces to embed a JavaScript expression in an attribute:

```js
const element = <img src={user.avatarUrl}></img>;
```

Don't put quotes around curly braces when embedding a JavaScript expression in an attribute. You should either use quotes (for string values) or curly braces (for expressions), but not both in the same attribute.

>**Warning:**
>
>Since JSX is closer to JavaScript than to HTML, React DOM uses `camelCase` property naming convention instead of HTML attribute names.
>
>For example, `class` becomes [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) in JSX, and `tabindex` becomes [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex).

### Specifying Children with JSX {#specifying-children-with-jsx}

If a tag is empty, you may close it immediately with `/>`, like XML:

```js
const element = <img src={user.avatarUrl} />;
```

JSX tags may contain children:

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX Prevents Injection Attacks {#jsx-prevents-injection-attacks}

It is safe to embed user input in JSX:

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

By default, React DOM [escapes](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that's not explicitly written in your application. Everything is converted to a string before being rendered. This helps prevent [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

### JSX Represents Objects {#jsx-represents-objects}

Babel compiles JSX down to `React.createElement()` calls.

These two examples are identical:

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` performs a few checks to help you write bug-free code but essentially it creates an object like this:

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

These objects are called "React elements". You can think of them as descriptions of what you want to see on the screen. React reads these objects and uses them to construct the DOM and keep it up to date.

We will explore rendering React elements to the DOM in the next section.

>**Tip:**
>
>We recommend using the ["Babel" language definition](http://babeljs.io/docs/editors) for your editor of choice so that both ES6 and JSX code is properly highlighted. This website uses the [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) color scheme which is compatible with it.
