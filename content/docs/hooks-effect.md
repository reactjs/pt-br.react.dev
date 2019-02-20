---
id: hooks-state
title: Usando o Hook Effect
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-intro.html
---

*Hooks* são a nova adição ao React 16.8. Eles deixam você usar state e outras funcionalidades do React sem escrever uma classe.

O *Hook de Efeito* te permite executar efeitos colaterais em componentes funcionais:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Exemplo() {
  const [count, setCount] = useState(0);

  // Similar ao componentDidMount e componentDidUpdate:
  useEffect(() => {
    // Atualiza o titulod do documento usando a API do browser
    document.title = `Você clicou ${count} vezes`;
  });

  return (
    <div>
      <p>Você clicou {count} vezes</p>
      <button onClick={() => setCount(count + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
```

Esse trecho de código é baseado no [exemplo de contador da pagina anterior](/docs/hooks-state.html), mas nós adicionamos uma nova funcionalidade nele: nos definimos o titulo do documento para uma mensagem customizada, incluindo o numero de cliques.

Busca de dados, definindo uma subscription, e mudar o DOM manualmente dentro do componente React são exemplos de efeitos colaterais. Chamando ou não essas operações de "efeitos colaterais" (ou somente "efeitos"), você provavelmente já usou eles em seus componentes antes.

>Dica
>
>Se você é familiarizado com os métodos do ciclo de vida do React, você pode pensar no Hook `useEffect` como `componentDidMount`, `componentDidUpdate`, e `componentWillUnmount` combinados.

Tem dois tipos de efeitos colaterais nos componentes React: aqueles que não precisam de limpeza, e aqueles que precisam. Vamos ver as suas diferenças mais detalhadamente.

## Efeitos Sem Limpeza {#effects-without-cleanup}

De vez em quando, nós queremos **executar algum código adicional depois de o React atualizou a DOM.** Requisições, mutações manuais do DOM, e log são exemplos comuns de efeitos que não precisam de limpeza. Nós dizemos isso porque podemos executa-los e imediatamente esquecer deles. Vamos comparar como classes e Hooks expressam tais efeitos colaterais.

### Exemplo Usando Classes {#example-using-classes}

Em um componente React com classe, o metodo `render` não deve causar efeitos colaterais. Seria muito cedo -- nós geralmente queremos executar nossos efeitos *depois* que o React atualizou a DOM.

Isso é o porque nas classes do React, nós colocamos efeitos dentro de `componentDidMount` e `componentDidUpdate`. Voltando ao nosso exemplo, aqui está um componente React com classe chamado contador que atualiza o titulo logo após o React faz as mudanças na DOM:

```js{9-15}
class Exemplo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `Você clicou ${this.state.count} vezes`;
  }

  componentDidUpdate() {
    document.title = `Você clicou ${this.state.count} vezes`;
  }

  render() {
    return (
      <div>
        <p>Você clicou {this.state.count} vezes</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

Note que **nós temos que duplicar o codigo entre esses dois metodos do ciclo de vida na classe.**

Isso acontece por que em muitos casos nós queremos executar o mesmo efeito colateral não importando se o componente acabou de ser montado ou foi atualizado. Conceitualmente, nós queremos que isso aconteça em cada renderização -- mas componentes de classe do React não tem um método assim. Nós devemos extrair um método separado mas ainda assim chama-lo em dois lugares.

Agora vamos ver como podemos fazer a mesma coisa com o Hook `useEffect`.

### Exemplo Usando Hooks {#example-using-hooks}

Nós já vimos esse exemplo no top da pagina, mas vamos dar uma olhada mais de perto:

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Você clicou ${count} vezes`;
  });

  return (
    <div>
      <p>Você clicou {count} vezes</p>
      <button onClick={() => setCount(count + 1)}>
        Clique aqui
      </button>
    </div>
  );
}
```

**O que o `useEffect` faz?** Usando esse Hook, você diz ao React que o componente precisa fazer algo apenas depois da renderização. O React ira se lembrar da função que voce passou (nos referiremos a ele como nosso "efeito"), e chama-lo depois que realizar as atualizações do DOM. Nesse efeito, nós mudamos o titulo do documento, mas nós podemos tambem realizar busca de dados ou chamar alguma API imperativa.

**Porque `useEffect` é chamado dentro de um componente?** Colocando `useEffect` dentro do componente nos permite acessar a variavel de estado `count` (ou qualquer outra prop) direto do efeito. Nós não precisamos de uma API especial para lê-los -- já esta no escopo da função. Hooks adota as closures do JavaScript e evita API's especificas do React onde o JavaScript já provê uma solução.

**`useEffect` executa depois de toda renderização?** Sim! Por padrão, ele roda depois da primeira renderização *e* depois de toda atualização. (Falaremos sobre [como customizar isso](#tip-optimizing-performance-by-skipping-effects) depois.) Ao invés de pensar em temos de "montando" e "atualizando", você pode achar mais facil pensar que efeitos acontecem "depois da renderização". React garante que o DOM foi atualizado na hora de executar os efeitos.

### Explicação detalhada{#detailed-explanation}

Agora que né sabemos mais sobre os efeitos, essas linhas devem fazer sentido:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Você clicou ${count} vezes`;
  });
```

Nós declaramos a variavel de estado `count`, e entao dizemos ao React que precisamos usar um efeito.Nós passamos uma função para o Hook `useEffect`. Essa função que nós passamos *é* o nosso efeito. Dentro do nosso efeito, nós definimos o titulo do documento usando `document.title` da API do browser. Nós podemos ler o ultimo `count` dentro do nosso efeito por que ele está dentro do escopo da nossa função. Quando o React renderizar nosso componente, ele ira se lembrar do efeito que usamos, e então executar os nossos efeitos depois de atualizar o DOM. Isso acontece para cada renderização, incluindo a primeira.

Desenvolvedores JavaScript experientes podem perceber que a função passada para o `useEffect` vai ser diferente a cada renderização. Isso é intencional. Na verdade, isso é oque nos deixa ler o valor de `count` de dentro do efeito sem nos preocuparmos em ele ficar obsoleto. Toda vez que nós re-renderizarmos, nós agendamos um efeito _diferente_, substituindo o antigo. De uma maneira, isso faz os efeitos se comportarem mais como o resultado da renderização -- cada efeito "pertence" à sua renderização especifica. Nós vamos ver como isso pode ser util mais claramente [depois nessa pagina](#explanation-why-effects-run-on-each-update).

>Dica
>
>Ao contrario de `componentDidMount` ou `componentDidUpdate`, efeitos agendados com  `useEffect` não bloqueiam o browser de atualizar a tela. Isso faz seu app parecer mais responsivo. A grande parte dos efeitos não precisam acontecer de forma sincrona. Nos casos incomuns em que eles precisam (como medir o layout), existe o Hook [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) separado com uma API identica ao `useEffect`.

## Efeitos Com Limpeza {#effects-with-cleanup}

Mais cedo, nós vimos como expressar efeitos colaterais que não precisam de limpeza. Contudo, algums efeitos precisam. Por examplo, **nós podemos querer usar uma subscription** para alguma origem de dados externo. Nesse caso, é importante limpar para que não causemos um vazamento de memoria! Vamos comparar como fariamos isso com classes e com Hooks.

### Exemplo Usando Classes {#example-using-classes-1}

Em uma classe React, geralmente você configura uma subscription no `componentDidMount`, e limpa no `componentWillUnmount`. Por exemplo, digamos que nós temos um módulo `ChatAPI` que nos permite fazer um subscribe ao status de online de um amigo. Aqui esta como nós poderiamos fazer um subscribe e mostrar o status usando uma classe:

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

Preste atenção como `componentDidMount` e `componentWillUnmount` precisam espelhar um ao outro. Metodos do ciclo de vida nos forçam a dividir essa logica mesmo quando conceitualmente o codigo dos dois é relacionado ao mesmo efeito.

>Nota
>
>Leitores atentos talvez notem que esse exemplo tambem precisa de um método `componentDidUpdate` para ficar totalmente correto. Nós ignoraremos isso por enquanto, mas voltaremos nisso em um [sessão mais abaixo](#explanation-why-effects-run-on-each-update) nessa pagina.

### Exemplo Usando Hooks {#example-using-hooks-1}

Vamos ver como podemos escrever esse componente usando Hooks.

Você pode pensar que precisamos de um efeito separado para executarmos a limpeza. Mas o codigo para adicionar e remover uma subscription é tão relacionado um com o outro que o `useEffect` foi desenhado para mante-los juntos. Se o seu efeito retornar uma função, o React ira executa-la quando for a hora de limpar:

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Especifique como limpar depois desse efeito:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**Porque precisamos retornar uma função dos nossos efeitos?** Isso é um mecanismo opcional de limpeza para efeitos. Cada efeito pode retornar uma funçào que ira limpar depois dela. Isso nos permite manter a logica para adicionar e remover subscriptions perto uma da outra. Elas são parte do mesmo efeito!

**Quando exatamente o React limpa um efeito?** O React executa a limpeza quando o componente desmonta. Contudo, comos nós aprendemos anteriormente, efeitos rodam em todas as renderizações e não apenas uma vez. É por isso que o React *tambem* limpa os efeitos da renderização anterior antes de rodar os efeitos da proxima vez. Nós discutiremos o [por que disso evitar bug](#explanation-why-effects-run-on-each-update) e [como podemos desabilitar esse comportamento caso isso cause problemas de performance](#tip-optimizing-performance-by-skipping-effects) abaixo.

>Nota
>
>Nós não precisamos retornar uma função nomeada do efeito. Nós chamamos de `cleanup` aqui apenas para esclarecer seu propósito, mas nós podemos retornar uma arrow function ou chamarmos de qualquer coisa diferente.

## Recapitulando {#recap}

Nós aprendemos que `useEffect` nos deixa expressar diferentes tipos de efeitos colaterais depois que o componente renderiza. Alguns efeitos podem requerir limpeza, então eles retornam uma função:

```js
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Outros efeitos não precisam ter a fase de limpeza, e não retornam nada.

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

O Hook de Efeito unifica ambos casos com uma unica API.

-------------

**Se você acha que tem um entendimento decente de como o Hook de Efeito funciona, ou se você se sente sobrecarregado, você já pode pular para a [proxima pagina sobre as Regras dos Hooks](/docs/hooks-rules.html).**

-------------

## Dicas para Usar Efeitos {#tips-for-using-effects}

Nós vamos continuar essa pagina com um olhar mais aprofundado em alguns aspectos do `useEffect` que alguns usuarios mais experientes do React devem estar curiosos. Não se sinta obrigado a se aprofundar neles agora. Você sempre pode voltar nessa pagina para saber mais sobe o Hook de Efeito.

### Dica: Use Multiplos Efeitos para Separar Preocupações {#tip-use-multiple-effects-to-separate-concerns}

Um dos problemas que nós levantamos na [Motivação](/docs/hooks-intro.html#complex-components-become-hard-to-understand) dos Hooks era que os metodos do ciclo de vida das classes muitas vezes continha logicas não relacionadas, mas a logica relacionada se quebrava em varios metodos. Aqui temos um componente que combina o contador e o indicador de status de amizades dos exemplos anteriores:

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

Note how the logic that sets `document.title` is split between `componentDidMount` and `componentDidUpdate`. The subscription logic is also spread between `componentDidMount` and `componentWillUnmount`. And `componentDidMount` contains code for both tasks.

So, how can Hooks solve this problem? Just like [you can use the *State* Hook more than once](/docs/hooks-state.html#tip-using-multiple-state-variables), you can also use several effects. This lets us separate unrelated logic into different effects:

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
}
```

**Hooks lets us split the code based on what it is doing** rather than a lifecycle method name. React will apply *every* effect used by the component, in the order they were specified.

### Explanation: Why Effects Run on Each Update {#explanation-why-effects-run-on-each-update}

If you're used to classes, you might be wondering why the effect cleanup phase happens after every re-render, and not just once during unmounting. Let's look at a practical example to see why this design helps us create components with fewer bugs.

[Earlier on this page](#example-using-classes-1), we introduced an example `FriendStatus` component that displays whether a friend is online or not. Our class reads `friend.id` from `this.props`, subscribes to the friend status after the component mounts, and unsubscribes during unmounting:

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**But what happens if the `friend` prop changes** while the component is on the screen? Our component would continue displaying the online status of a different friend. This is a bug. We would also cause a memory leak or crash when unmounting since the unsubscribe call would use the wrong friend ID.

In a class component, we would need to add `componentDidUpdate` to handle this case:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Forgetting to handle `componentDidUpdate` properly is a common source of bugs in React applications.

Now consider the version of this component that uses Hooks:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

It doesn't suffer from this bug. (But we also didn't make any changes to it.)

There is no special code for handling updates because `useEffect` handles them *by default*. It cleans up the previous effects before applying the next effects. To illustrate this, here is a sequence of subscribe and unsubscribe calls that this component could produce over time:

```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

This behavior ensures consistency by default and prevents bugs that are common in class components due to missing update logic.

### Tip: Optimizing Performance by Skipping Effects {#tip-optimizing-performance-by-skipping-effects}

In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison with `prevProps` or `prevState` inside `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

This requirement is common enough that it is built into the `useEffect` Hook API. You can tell React to *skip* applying an effect if certain values haven't changed between re-renders. To do so, pass an array as an optional second argument to `useEffect`:

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```

In the example above, we pass `[count]` as the second argument. What does this mean? If the `count` is `5`, and then our component re-renders with `count` still equal to `5`, React will compare `[5]` from the previous render and `[5]` from the next render. Because all items in the array are the same (`5 === 5`), React would skip the effect. That's our optimization.

When we render with `count` updated to `6`, React will compare the items in the `[5]` array from the previous render to items in the `[6]` array from the next render. This time, React will re-apply the effect because `5 !== 6`. If there are multiple items in the array, React will re-run the effect even if just one of them is different.

This also works for effects that have a cleanup phase:

```js{6}
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
```

In the future, the second argument might get added automatically by a build-time transformation.

>Note
>
>If you use this optimization, make sure the array includes **any values from the outer scope that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders. We'll also discuss other optimization options in the [Hooks API reference](/docs/hooks-reference.html).
>
>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn't depend on *any* values from props or state, so it never needs to re-run. This isn't handled as a special case -- it follows directly from how the inputs array always works. While passing `[]` is closer to the familiar `componentDidMount` and `componentWillUnmount` mental model, we suggest not making it a habit because it often leads to bugs, [as discussed above](#explanation-why-effects-run-on-each-update). Don't forget that React defers running `useEffect` until after the browser has painted, so doing extra work is less of a problem.

## Next Steps {#next-steps}

Congratulations! This was a long page, but hopefully by the end most of your questions about effects were answered. You've learned both the State Hook and the Effect Hook, and there is a *lot* you can do with both of them combined. They cover most of the use cases for classes -- and where they don't, you might find the [additional Hooks](/docs/hooks-reference.html) helpful.

We're also starting to see how Hooks solve problems outlined in [Motivation](/docs/hooks-intro.html#motivation). We've seen how effect cleanup avoids duplication in `componentDidUpdate` and `componentWillUnmount`, brings related code closer together, and helps us avoid bugs. We've also seen how we can separate effects by their purpose, which is something we couldn't do in classes at all.

At this point you might be questioning how Hooks work. How can React know which `useState` call corresponds to which state variable between re-renders? How does React "match up" previous and next effects on every update? **On the next page we will learn about the [Rules of Hooks](/docs/hooks-rules.html) -- they're essential to making Hooks work.**
