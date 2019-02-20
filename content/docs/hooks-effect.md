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
    document.title = `Você clicou ${count} vezes`;
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
    document.title = `Você clicou ${this.state.count} vezes`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `Você clicou ${this.state.count} vezes`;
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

Note como a logica que define `document.title` esta dividida entre `componentDidMount` e `componentDidUpdate`. A logica do subscription tambem esta dividida entre `componentDidMount` e `componentWillUnmount`. E o `componentDidMount` contem codigo das duas tarefas.

Então, como Hook resolvem esse problema? Assim como [você pode usra o Hooks *State* mais de uma vez](/docs/hooks-state.html#tip-using-multiple-state-variables), você tambem pode usar varios efeitos. Isso nos permite separar logicas não relacionadas em diferentes efeitos:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Você clicou ${count} vezes`;
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

**Hooks nos permite dividir o código com base no que ele está fazendo** ao invez de em um metodo do ciclo de vida. React irá aplicar *todos* os efeitos usados por um componente, na ordem em que eles foram especificados.

### Explicação: Por Que Efeitos Executam em Cada Atualização {#explanation-why-effects-run-on-each-update}

Se você esta acostumado a classes, você pode estar se perguntando o porque a fase de limpeza dos efeitos acontecem depois de cada re-renderização, e não apenas uma vez durante a desmontagem. Vamos dar uma olhada em um exemplo pratico para ver o porque desse design nos ajudar a criar componentes com menos bugs.

[Mais cedo nessa pagina](#example-using-classes-1), nós introduzimos um componente de exemplo `FriendStatus` que mostra quando um amigo esta online ou não. Nossa classes lê `friend.id` do `this.props`, subscribes ao statudo do amigo depois que o componente monta, e unsubscribes durante a desmontagem:

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

**Mas oque acontece se a prop `friend` mudar** enquanto o componente esta na tela? Nosso componente deveria continuar exibindo o status de online de um amigo diferente. Isso é um bug. Nós tambem causariamos um memory leak ou um crash quando durante o desmonte já que a chamada do unsubscribe estaria usando o id do amigo errado.

Em componentes de classe, nós precisariamos adicionar `componentDidUpdate` para cuidar desse caso:

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe no friend.id antigo
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe no próximo friend.id
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

Esquecer de cuidar do `componentDidUpdate` devidamente é uma fonte comum de bug em aplicações React.

Agora considere a versão desse componente que usa Hooks:

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

Ele não sofre desse bug. (Mas tambem nós não fizemos nenhuma mudança nele.)

Não existe nenhum código especial para cuidar de updates porque `useEffect` cuida deles *por padrão*. Ele limpa os efeitos anteriores antes de aplicar os próximos efeitos. Para ilustrar isso, aqui está a sequencia de chamadas ao subscribe e unsubscribe que o componente fez ao longo do tempo:

```js
// Monta com as props { friend: { id: 100 } }
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Executa o primeiro efeito

// Atualiza as props para { friend: { id: 200 } }
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Limpa o efeito antigo
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Executa o próximo efeito

// Atualiza as props para { friend: { id: 300 } }
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Limpa o efeito antigo
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Executa o próximo efeito

// Desmonta
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Limpa o último efeito
```

Este comportamento garante a consistencia por padrão e previne bugs que são comuns aos componente de classe devido à falta de lógica de autalização.

### Dica: Otimizando a Performance ao Pular Efeitos {#tip-optimizing-performance-by-skipping-effects}

Em alguns casos, limpar ou aplicar o efeito em cada renderização pode criar um problema de performance. Em componentes de classes, nós resolvemos isso escrevendo uma comparação extra com `prevProps` ou `prevState` dentro do `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `Você clicou ${this.state.count} vezes`;
  }
}
```

Esse requerimento é comum o bastante para estar embutido na API do Hook `useEffect`. Você pode dizer ao React para *pular* a aplicação de um efeito se certos valores não mudaram entre as renderizações. Para fazer isso, passe uma array como um segundo argumento opcional ao `useEffect`:

```js{3}
useEffect(() => {
  document.title = `Você clicou ${count} vezes`;
}, [count]); // Apenas re-execute o efeito quando o count mudar
```

No exemplo acima, nós passamos o `[count]` como segundo argumento. O que isso quer dizer? Se `count` é `5`, e o nosso componente re-renderiza com `count` ainda sendo `5`, o React irá comparar `[5]` da renderização passada e `[5]` da próxima renderização. Porque todos os itens na array são o mesmo (`5 === 5`), o React ira pular o efeito. Essa é a nossa otimização.

Quando nós renderizamos com `count` atualizado para `6`, o React irá comparar os itenst na array `[5]` da renderização passada com os items no array `[6]` da próxima renderização. Desta vez, o React irá re-aplicar o efeito porque `5 !== 6`. Se houver multiplos itens na array, o React ira re-executar o efeitos mesmo se apenas um deles for diferente.

Isso também funciona para efeitos que tenham uma fase de limpeza:

```js{6}
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Apenas re-subscribe se props.friend.id mudar
```

No futuro, talvez o segundo argumento seja adicionado automaticamente por uma transformação em tempo de build.

>Nota
>
>Se você usar essa otimização, tenha certeza de que a array inclua **qualquer valor do escopo acima que mude com o tempo e que ele seja usado pelo efeito**. Do contrario, seu código ira referenciar valores estagnados da renderização passada. Nós iremos discurtir outras opções de otimização nas [referencias da API do Hooks](/docs/hooks-reference.html).
>
>Se você quer executar um efeito e limpa-lo apenas uma vez (na montagem e desmontagem), você pode passar uma array vazia (`[]`) como segundo argumento. Isso diz ao React que o seu efeito não depende de *nenhum* valor das props ou state, então ele nunca precisa re-executar. Isso não é tratado como um caso especial -- ele segue diretamente como os inputs de uma array sempre funcionaram. Passando `[]` fica mais perto do familiar modelo mental de `componentDidMount` e `componentWillUnmount`, contudo nós não sugerimos fazer disso um habito pois facilmente gera bugs, [como discutido acima](#explanation-why-effects-run-on-each-update). Não esqueca de que o React adia a execução do `useEffect` até o browser ser pintado, então fazer trabalho extra é menos problematico.

## Próximos Passos {#next-steps}

Parabens! Essa foi uma página longa, mas com sorte ao fim a maioria das suas perguntas sobre efeitos foram respondidas. Você aprendeu sobre o Hook State e o Hook Effect, e ainda hà *muito* mais o que você pode fazer com os dois combinados. Eles cobrem a maioria dos casos de uso para classes -- e ainda algumas coisas que elas não fazem, talvez você encontre algums [Hooks adicionais](/docs/hooks-reference.html) uteis.

Nós tambem estamos começando a ver como Hooks resolvem problemas levantados na [Motivação](/docs/hooks-intro.html#motivation). Nós vemos como a limpeza dos efeitos evitam duplicação de código no `componentDidUpdate` e `componentWillUnmount`, mantém códigos relacionados juntos, e ajuda a evitar bugs. Nós tambem vimos como separar efeitos pelo seu proposito, que é uma coisa que não conseguiamos fazer com classes.

Nesse ponto você pode estar se perguntando como Hooks funcionam. Como o React sabe qual chamada do `useState` corresponde a qual vairavel do state entre as re-renderizações? Como o React "compara" os efeitos anteriores e os próximos toda atualiação? **Na próxima pagina nos iremos aprender sobre as [Regras dos Hooks](/docs/hooks-rules.html) -- elas são essenciais para fazer os Hooks funcionarem.**
