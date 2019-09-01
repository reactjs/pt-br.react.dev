---
id: hooks-overview
title: Hooks de forma resumida
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hooks* são uma nova adição no React 16.8. Eles permitem que você use o state e outros recursos do React sem escrever uma classe.

Hooks são [retrocompatíveis](/docs/hooks-intro.html#no-breaking-changes). Esta página fornece uma visão geral de Hooks para usuários experientes em React. Esta é uma visão geral rápida. Se você se sentir confuso, procure uma caixa amarela com esta:

>Explicação Detalhada
>
>Leia a [Motivação](/docs/hooks-intro.html#motivation) para entender porque estamos introduzindo Hooks para o React.

**↑↑↑ Cada seção termina com uma caixa amarela como esta.** Elas linkam para explicações detalhadas.

## 📌 State Hook {#state-hook}

Este exemplo renderiza um contador. Quando você clica no botão, ele incrementa o valor:

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // Declara uma nova variável de state, que chamaremos de "count"
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

Aqui, `useState` é um *Hook* (nós vamos falar sobre o que isso significa em instantes). Nós o chamamos dentro de um componente funcional para adicionar alguns states locais a ele. React irá presevar este state entre re-renderizações. `useState` retorna um par: o valor do state *atual* e uma função que permite atualizá-lo. Você pode chamar essa função a partir de um manipulador de evento ou de qualquer outro lugar. É parecido com `this.setState` em uma classe, exceto que não mescla o antigo state com o novo. (Nós iremos mostrar um exemplo comparando `useState` com `this.state` em [Utilizando o State Hook](/docs/hooks-state.html).)

O único argumento para `useState` é o state inicial. No exemplo acima, é `0` porque nosso contador começa do zero. Perceba que diferente de `this.state`, o state não precisa ser um objeto -- apesar de que possa ser se você quiser. O argumento de state inicial é utilizado apenas durante a primeira renderização.

#### Declarando multiplas variáveis de state {#declaring-multiple-state-variables}

Você pode utilizar o State Hook mais de uma vez em um único componente:

```js
function ExampleWithManyStates() {
  // Declara várias variáveis de state!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

A sintaxe de [desestruturação de arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) nos permite atribuir diferentes nomes para as variáveis de state que declaramos chamando `useState`. Esses nomes não fazem parte da API `useState`. Em vez disso, React presume que se você chamar `useState` muitas vezes, você faz isso na mesma ordem a cada renderização. Mais tarde, voltaremos no porquê disso funcionar e quando será útil.

#### Mas, o que é um Hook? {#but-what-is-a-hook}

Hooks são funções que permitem a você "ligar-se" aos recursos de state e ciclo de vida do React a partir de componentes funcionais. Hooks não funcionam dentro de classes -- eles permitem que você use React sem classes. (Nós [não recomendamos](/docs/hooks-intro.html#gradual-adoption-strategy) reescrever seus componentes já existentes de um dia para o outro, mas você pode começar a usar Hooks nos novos se você quiser.)

React fornece alguns Hooks internos como `useState`. Você também pode criar os seus próprios Hooks para reutilizar o comportamento de state entre componentes diferentes. Vamos dar uma olhada nos Hooks internos primeiramente.

>Explicação Detalhada
>
>Você pode aprender mais sobre State Hook em sua página dedicada: [Utilizando o State Hook](/docs/hooks-state.html).


## ⚡️ Hook de Efeito {#effect-hook}

Você provavelmente já realizou obtenção de dados (data fetching), subscrições (subscriptions) ou mudanças manuais no DOM através de componentes React antes. Nós chamamos essas operações de "efeitos colaterais" (side effects ou apenas effects) porque eles podem afetar outros componentes e não podem ser feitos durante a renderização.

O Hook de Efeito, `useEffect`, adiciona a funcionalidade de executar efeitos colaterais através de um componente funcional. Segue a mesma finalidade do `componentDidMount`, `componentDidUpdate`, e `componentWillUnmount` em classes React, mas unificado em uma mesma API. (Nós mostraremos exemplos comparando `useEffect` com esses métodos em [Utilizando o Hook de Efeito](/docs/hooks-effect.html).)

Por exemplo, este componente define o título da página após o React atualizar o DOM:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar a componentDidMount e componentDidUpdate:
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

Quando você chama `useEffect`, você está dizendo ao React para executar a sua função de "efeito" após liberar as mudanças para o DOM. Efeitos são declarados dentro do componente, para que eles tenham acesso as suas props e state. Por padrão, React executa os efeitos após cada renderização -- *incluindo* a primeira renderização. (Falaremos mais sobre como isso se compara aos ciclos de vida das classes em [Utilizando o Hook de Efeito](/docs/hooks-effect.html).)

Efeitos também podem opcionalmente especificar como "limpar" (clean up) retornando uma função após a execução deles. Por exemplo, este componente utiliza um efeito para se subscrever ao status online de um amigo e limpa-se (clean up) cancelando a sua subscrição:

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

Neste exemplo, o React cancelaria a subscrição da nossa `ChatAPI` quando o componente se desmontar, e também antes de reexecutar o efeito devido a uma renderização subsequente. (Se você quiser, há uma maneira de [dizer ao React para ignorar a nova subscrição](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) se o `props.friend.id` que passamos para `ChatAPI` não tiver mudado.)

Assim como `useState`, você pode utilizar mais de um efeito em um componente:

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

Hooks permitem a você organizar efeitos colaterais *(side effects)* em um componente por partes relacionadas (como adicionar e remover uma subscrição), em vez de forçar uma divisão baseada nos métodos de ciclo de vida.

> Explicação Detalhada
>
> Você pode aprender mais sobre `useEffect` na sua página dedicada: [Utilizando o Hook de Efeito](/docs/hooks-effect.html).

## ✌️ Regras dos Hooks {#rules-of-hooks}

Hooks são funções JavaScript, mas eles impões duas regras adicionais:

* Apenas chame Hooks **no nível mais alto**. Não chame Hooks dentro de loops, condições ou funções aninhadas.
* Apenas chame Hooks **de componentes funcionais**. Não chame Hooks de funções JavaScript comuns. (Há apenas um outro lugar válido para se chamar Hooks -- dentro dos seus próprios Hooks customizados. Iremos aprender sobre eles em breve.)

Nós fornecemos um [plugin de linter](https://www.npmjs.com/package/eslint-plugin-react-hooks) para assegurar essas regras automaticamente. Entendemos que essas regras podem parecer limitantes ou confusas a princípio, mas são essenciais para fazer com que os Hooks funcionem bem.

> Explicação Detalhada
>
> Você pode aprender mais sobre essas regras na sua página dedicada: [Regras dos Hooks](/docs/hooks-rules.html).

## 💡 Construindo Seus Próprios Hooks {#building-your-own-hooks}

Às vezes, queremos reutilizar algumas lógicas de state entre componentes. Tradicionalmente, haviam duas soluções populares para este problema: [componentes de ordem superior](/docs/higher-order-components.html) e [renderização de props](/docs/render-props.html). Hooks Customizados te permitem fazer isso, mas sem adicionar mais componentes para a sua árvore.

Anteriormente nesta página, nós introduzimos um componente `FriendStatus` que chama os Hooks `useState` e `useEffect` para subscrever-se ao status de online de um amigo. Digamos que também precisaremos reutilizar essa lógica de subscrição em outro componente.

Primeiramente, iremos extrair esta lógica para um Hook customizado chamado `useFriendStatus`:

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

Que recebe `friendID` como um argumento, e sempre retorna se nosso amigo está online.

Agora podemos utilizar a partir dos dois componentes:

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

O estado (state) destes componentes é completamente independente. Hooks são a forma de reutilizar *lógica de state*, não o state em si. De fato, cada *chamada* para um Hook tem um state completamente isolado -- então você pode até utilizar o mesmo Hook custom duas vezes em um componente.

Hooks customizados são mais uma convenção do que uma funcionalidade. Se o nome de uma função começa com "`use`" e chama outros Hooks, consideramos que é um Hook customizado. A convenção de nome `useSomething` é como nosso plugin de linter é capaz de encontrar bugs no nosso código que utiliza Hooks.

Você pode escrever Hooks customizados que abrangem uma ampla gama de casos de uso, como manipulação de formulários, animações, subscrições declarativas, temporizadores e provavelmente muitos outros que não consideramos. Estamos animados para ver quais Hooks customizados a comunidade React irá criar.

> Explicação Detalhada
>
> Você pode aprender mais sobre Hooks Customizados na sua página dedicada: [Construindo Seus Próprios Hooks](/docs/hooks-custom.html).

## 🔌 Outros Hooks {#other-hooks}

Existem alguns Hooks internos menos utilizados que você pode achar úteis. Por exemplo, [`useContext`](/docs/hooks-reference.html#usecontext) permite subscrever-se para o context do React sem adicionar aninhamento:

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

E [`useReducer`](/docs/hooks-reference.html#usereducer) permite gerenciar state local de componentes complexos com um reducer:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

> Explicação Detalhada
>
> Você pode aprender mais sobre todos os Hooks internos na sua página dedicada: [Referência da API de Hooks](/docs/hooks-reference.html).

## Próximos Passos {#next-steps}

Ufa, essa foi rápida! Se algumas coisas não fizeram sentido ou se você quiser aprender mais detalhes, você pode ler as próximas páginas, começando com a documentação de [State Hook](/docs/hooks-state.html).

Você também pode conferir a [Referência de API de Hooks ](/docs/hooks-reference.html) e o [FAQ de Hooks](/docs/hooks-faq.html).

Por fim, não perca a [página de introdução](/docs/hooks-intro.html) que explica *porque* estamos adicionando Hooks e como iremos começar a utilizá-los lado a lado com as classes -- sem reescrever os nossos apps.
