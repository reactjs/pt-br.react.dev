---
id: hooks-overview
title: Hooks de forma resumida
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hooks* são uma nova adição no React 16.8. Eles permitem que você use o state e outros recursos do React sem escrever uma classe.

Hooks são [compativeis com versões anteriores](/docs/hooks-intro.html#no-breaking-changes). Esta página fornece uma visão geral de Hooks para usuários experientes em React. Esta é uma visão geral rápida. Se você se sentir confuso, procure uma caixa amarela com esta:

>Explicação Detalhada
>
>Leia a [Motivação](/docs/hooks-intro.html#motivation) para entender porque estamos introruzindo Hooks para o React.

**↑↑↑ Cada seção termina com uma caixa amarela como esta.** Eles linkam para explicações detalhadas.

## 📌 State Hook {#-state-hook}

Este exemplo renderiza um contador. Quando você clica no botão, ele incrementa o valor:

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Aqui, <code>useState</code> é um <em>Hook</em> (nós vamos falar sobre o que isso significa em instantes). Nós chamamos dentro de um componente funcional para adicionar alguns states locais a ele. React irá presevar este state entre re-renderizações. `useState` returna um par: o valor do estado *atual* e uma função que permite atualizá-lo. Você pode chamar essa função de um manipulador de evento ou de qualquer outro lugar. É parecido com `this.setState` em uma classe, exceto que não mescla o antigo estado com novo. (Nós iremos mostrar um exemplo comprando `useState` com `this.state` em [Utilizando o State Hook](/docs/hooks-state.html).)

O Único argumento para `useState` é o estado inicial. No exemplo acima, é `0` porque nosso contador começa do zero. Perceba que diferente de `this.state`, o estado não precisa ser um objeto -- apesar de que possa ser se você quiser. O argumento de estado inicial é utilizado apenas durante a primeira renderização.

#### Declarando multiplas variáveis de estado {#declaring-multiple-state-variables}

Você pode utilizar o State Hook mais de uma vez em um único componente:

```js
function ExampleWithManyStates() {
  // Declara várias variáveis de estado!
  const [idade, alterarIdade] = useState(42);
  const [fruta, alterarFruta] = useState('banana');
  const [tarefas, alterarTarefas] = useState([{ text: 'Aprender Hooks' }]);
  // ...
}
```

A sintaxe de [desestruturação de arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) nos permite atribuir diferentes nomes para as variáveis de estado que declaramos chamando `useState`. Esses nomes não fazem parte da API `useState`. Em vez disso, React presume que se você chamar `useState` muitas vezes, você faz isso na mesma ordem a cada renderização. Nós iremos voltar no porquê isso funciona e quando é útil mais tarde.

#### Mas, o que é um Hook? {#but-what-is-a-hook}

Hooks são funções que permitem a você "ligar-se" aos recursos de state e ciclo de vida do React com componentes funcionais. Hooks não funcionam dentro de classes -- eles permitem que você use React sem classes. (Nós [não recomendamos](/docs/hooks-intro.html#gradual-adoption-strategy) reescrever seus componentes já existentes de um dia para o outro, mas você pode começar a usar Hooks nos novos se você quiser.)

React fornece alguns hooks internos como `useState`. Você também pode criar os seus próprios Hooks para reutilizar o comportamento stateful entre componentes diferentes. Vamos dar uma olhada nos Hooks internos primeiramente.

>Explicação Detalhada
>
>Você pode aprender mais sobre State Hook em sua página dedicada: [Utilizando o State Hook](/docs/hooks-state.html).

## ⚡️ Effect Hook {#️-effect-hook}

Você provavelmente já realizou busca de dados, subscriptions ou mudanças manuais no DOM através de componentes React antes. Nós chamamos essas operações de "efeitos colaterais" (side effects ou resumidamente effects) porque eles podem afetar outros componentes e não podem ser feitos durante a renderização.

O Effect Hook, `useEffect`, adiciona a funcionalidade de executar efeitos colaterais em um componente funcional. Segue a mesma finalidade do `componentDidMount`, `componentDidUpdate`, e `componentWillUnmount` das classes React, mas unificado em uma mesma API. (Nós mostraremos exemplos comparando `useEffect` com esses métodos em [Utilizando o Effect Hook](/docs/hooks-effect.html).)

Por exemplo, este componente define o título da página após o React atualizar o DOM:

```js{1,6-10}
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar com componentDidMount e componentDidUpdate:
  useEffect(() => {
    // Atualiza o título do documento utilizando a API do navegador
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Quando você chama `useEffect`, você está dizendo ao React para executar a sua função de "efeito" após liberar as mudanças para o DOM. Efeitos são declarados dentro do componente, para que eles tenham acesso as suas props e state. Por padrão, React executa os efeitos após cada renderização -- *incluindo* a primeira renderização. (Falaremos mais sobre como isso se compara aos ciclos de vida das classes em [Utilizando o Effect Hook](/docs/hooks-effect.html).)

Efeitos também podem opcionalmente especificar como "limpar" retornando uma função após a execução deles. Por exemplo, este componente utiliza um efeito para se inscrever no status de online de um amigo e limpar cancelando a sua assinatura:

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

In this example, React would unsubscribe from our `ChatAPI` when the component unmounts, as well as before re-running the effect due to a subsequent render. (If you want, there's a way to [tell React to skip re-subscribing](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) if the `props.friend.id` we passed to `ChatAPI` didn’t change.)

Just like with `useState`, you can use more than a single effect in a component:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

Hooks let you organize side effects in a component by what pieces are related (such as adding and removing a subscription), rather than forcing a split based on lifecycle methods.

>Detailed Explanation
>
>You can learn more about `useEffect` on a dedicated page: [Using the Effect Hook](/docs/hooks-effect.html).

## ✌️ Rules of Hooks {#️-rules-of-hooks}

Hooks are JavaScript functions, but they impose two additional rules:

* Only call Hooks **at the top level**. Don’t call Hooks inside loops, conditions, or nested functions.
* Only call Hooks **from React function components**. Don’t call Hooks from regular JavaScript functions. (There is just one other valid place to call Hooks -- your own custom Hooks. We'll learn about them in a moment.)

We provide a [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to enforce these rules automatically. We understand these rules might seem limiting or confusing at first, but they are essential to making Hooks work well.

>Detailed Explanation
>
>You can learn more about these rules on a dedicated page: [Rules of Hooks](/docs/hooks-rules.html).

## 💡 Building Your Own Hooks {#-building-your-own-hooks}

Sometimes, we want to reuse some stateful logic between components. Traditionally, there were two popular solutions to this problem: [higher-order components](/docs/higher-order-components.html) and [render props](/docs/render-props.html). Custom Hooks let you do this, but without adding more components to your tree.

Earlier on this page, we introduced a `FriendStatus` component that calls the `useState` and `useEffect` Hooks to subscribe to a friend's online status. Let's say we also want to reuse this subscription logic in another component.

First, we'll extract this logic into a custom Hook called `useFriendStatus`:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

It takes `friendID` as an argument, and returns whether our friend is online.

Now we can use it from both components:


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

The state of these components is completely independent. Hooks are a way to reuse *stateful logic*, not state itself. In fact, each *call* to a Hook has a completely isolated state -- so you can even use the same custom Hook twice in one component.

Custom Hooks are more of a convention than a feature. If a function's name starts with "`use`" and it calls other Hooks, we say it is a custom Hook. The `useSomething` naming convention is how our linter plugin is able to find bugs in the code using Hooks.

You can write custom Hooks that cover a wide range of use cases like form handling, animation, declarative subscriptions, timers, and probably many more we haven't considered. We are excited to see what custom Hooks the React community will come up with.

>Detailed Explanation
>
>You can learn more about custom Hooks on a dedicated page: [Building Your Own Hooks](/docs/hooks-custom.html).

## 🔌 Other Hooks {#-other-hooks}

There are a few less commonly used built-in Hooks that you might find useful. For example, [`useContext`](/docs/hooks-reference.html#usecontext) lets you subscribe to React context without introducing nesting:

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

And [`useReducer`](/docs/hooks-reference.html#usereducer) lets you manage local state of complex components with a reducer:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>Detailed Explanation
>
>You can learn more about all the built-in Hooks on a dedicated page: [Hooks API Reference](/docs/hooks-reference.html).

## Next Steps {#next-steps}

Phew, that was fast! If some things didn't quite make sense or you'd like to learn more in detail, you can read the next pages, starting with the [State Hook](/docs/hooks-state.html) documentation.

You can also check out the [Hooks API reference](/docs/hooks-reference.html) and the [Hooks FAQ](/docs/hooks-faq.html).

Finally, don't miss the [introduction page](/docs/hooks-intro.html) which explains *why* we're adding Hooks and how we'll start using them side by side with classes -- without rewriting our apps.
