---
id: hooks-state
title: Usando Effect Hook (Hook de Efeito)
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

_Hooks_ são uma nova adição ao React 16.8. Eles permitem que você use o state e outros recursos do React sem escrever uma classe.

O *Effect Hook* (Hook de Efeito) te permite executar efeitos colaterais em componentes funcionais:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Exemplo() {
  const [count, setCount] = useState(0);

  // Similar ao componentDidMount e componentDidUpdate:
  useEffect(() => {
    // Atualiza o titulo do documento usando a API do browser
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

Esse trecho de código é baseado no [exemplo de contador da pagina anterior](/docs/hooks-state.html), mas nós adicionamos uma nova funcionalidade a ele: nós definimos o titulo do documento para ser uma mensagem customizada que inclua o número de cliques.

Buscar dados, configurar uma subscription, e mudar o DOM manualmente dentro do componentes React são todos exemplos de efeitos colaterais. Esteja você acostumado ou não a chamar essas operações de "efeitos colaterais" (ou somente "efeitos"), você provavelmente já usou eles em seus componentes antes.

>Dica
>
>Se você está familiarizado com os métodos do ciclo de vida do React, você pode pensar no Hook `useEffect` como `componentDidMount`, `componentDidUpdate`, e `componentWillUnmount` combinados.

Existem dois tipos comuns de efeitos colaterais nos componentes React: aqueles que não precisam de limpeza, e aqueles que precisam. Vamos ver as suas diferenças mais detalhadamente.

## Efeitos Sem Limpeza {#effects-without-cleanup}

De vez em quando, nós queremos **executar algum código adicional depois que o React atualizou a DOM.** Requisições, mutações manuais do DOM e log são exemplos comuns de efeitos que não precisam de limpeza. Nós dizemos isso porque podemos executa-los e imediatamente esquecer deles. Vamos comparar como classes e Hooks nos permitem expressar tais efeitos colaterais.

### Exemplo Usando Classes {#example-using-classes}

Em um componente de classe do React, o método `render` não deve causar efeitos colaterais. Seria muito cedo -- nós geralmente queremos executar nossos efeitos *depois* que o React atualizou a DOM.

Isso é o porque nas classes do React, nós colocamos efeitos dentro de `componentDidMount` e `componentDidUpdate`. Voltando ao nosso exemplo, aqui está um componente de classe do React chamado contador que atualiza o titulo logo após o React faz as mudanças na DOM:

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

Note que **nós temos que duplicar o código entre esses dois métodos do ciclo de vida na classe.**

Isso acontece porque em muitos casos nós queremos executar o mesmo efeito colateral não importando se o componente acabou de ser montado ou foi atualizado. Conceitualmente, nós queremos que isso aconteça em cada renderização -- mas componentes de classe do React não tem um método assim. Nós poderíamos extrair um método separado mas ainda assim teríamos que chamá-lo em dois lugares.

Agora vamos ver como podemos fazer a mesma coisa com o Hook `useEffect`.

### Exemplo Usando Hooks {#example-using-hooks}

Nós já vimos esse exemplo no topo da pagina, mas vamos dar uma olhada mais de perto:

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

**O que o `useEffect` faz?** Usando esse Hook, você diz ao React que o componente precisa fazer algo apenas depois da renderização. O React ira se lembrar da função que você passou (nos referiremos a ele como nosso "efeito"), e chamá-la depois que realizar as atualizações do DOM. Nesse efeito, mudamos o título do documento, mas podemos também realizar busca de dados ou chamar alguma API imperativa.

**Porquê `useEffect` é chamado dentro de um componente?** Colocando `useEffect` dentro do componente nos permite acessar o state `count` (ou qualquer outra prop) direto do efeito. Nós não precisamos de uma API especial para lê-los -- já esta no escopo da função. Hooks adotam as closures do JavaScript e evitam APIs especificas do React onde o JavaScript já provê uma solução.

**`useEffect` executa depois de toda renderização?** Sim! Por padrão, ele roda depois da primeira renderização *e* depois de toda atualização. (Falaremos sobre [como customizar isso](#tip-optimizing-performance-by-skipping-effects) depois.) Em vez de pensar em termos de "montando" ("mounting") e "atualizando" ("updating"), você pode achar mais fácil pensar que efeitos acontecem "depois da renderização". React garante que o DOM foi atualizado na hora de executar os efeitos.

### Explicação detalhada{#detailed-explanation}

Agora que já sabemos mais sobre os efeitos, essas linhas devem fazer sentido:

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Você clicou ${count} vezes`;
  });
}
```

Declaramos o state `count`, e então dizemos ao React que precisamos usar um efeito. Passamos uma função para o Hook `useEffect`. Essa função que passamos *é* o nosso efeito. Dentro do nosso efeito, definimos o título do documento usando `document.title` da API do navegador. Podemos ler o último `count` dentro do nosso efeito por que ele está dentro do escopo da nossa função. Quando o React renderizar nosso componente, ele ira se lembrar do efeito que usamos, e então executar os nossos efeitos depois de atualizar o DOM. Isso acontece para cada renderização, incluindo a primeira.

Desenvolvedores JavaScript experientes podem perceber que a função passada para o `useEffect` vai ser diferente a cada renderização. Isso é intencional. Na verdade, isso é o que nos deixa ler o valor de `count` de dentro do efeito sem nos preocuparmos com ele ficar obsoleto. Toda vez que nós re-renderizarmos, agendamos um efeito _diferente_, substituindo o antigo. De uma maneira, isso faz os efeitos se comportarem mais como o resultado da renderização -- cada efeito "pertence" à sua renderização especifica. Vamos ver mais claramente como isso pode ser útil [depois, nessa página](#explanation-why-effects-run-on-each-update).

>Dica
>
>Ao contrário de `componentDidMount` ou `componentDidUpdate`, efeitos agendados com  `useEffect` não bloqueiam o navegador a atualizar a tela. Isso faz seu app parecer mais responsivo. A grande parte dos efeitos não precisam acontecer de forma síncrona. Nos casos incomuns em que eles precisam (como medir o layout), existe um Hook [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) separado com uma API idêntica ao `useEffect`.

## Efeitos Com Limpeza {#effects-with-cleanup}

Anteriormente, nós vimos como expressar efeitos colaterais que não precisam de limpeza. Contudo, alguns efeitos precisam. Por exemplo, **nós podemos querer configurar uma subscription** para alguma origem de dados externa. Nesse caso, é importante limpar para que não causemos um vazamento de memória! Vamos comparar como faríamos isso com classes e com Hooks.

### Exemplo Usando Classes {#example-using-classes-1}

Em uma classe React, geralmente você configura uma subscription no `componentDidMount`, e limpa no `componentWillUnmount`. Por exemplo, digamos que nós temos um módulo `ChatAPI` que nos permite fazer um subscribe ao status de online de um amigo. Aqui esta como nós poderíamos fazer o subscribe e mostrar o status usando uma classe:

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

Preste atenção como `componentDidMount` e `componentWillUnmount` precisam espelhar um ao outro. Métodos do ciclo de vida nos forçam a dividir essa lógica mesmo quando conceitualmente o código dos dois é relacionado ao mesmo efeito.

>Nota
>
>Leitores atentos talvez notem que esse exemplo também precisa de um método `componentDidUpdate` para ficar totalmente correto. Nós ignoraremos isso por enquanto, mas voltaremos nisso em uma [sessão mais abaixo](#explanation-why-effects-run-on-each-update) nessa página.

### Exemplo Usando Hooks {#example-using-hooks-1}

Vamos ver como poderíamos escrever esse componente usando Hooks.

Você pode pensar que precisamos de um efeito separado para executarmos a limpeza. Mas o código para adicionar e remover uma subscription é tão relacionado um com o outro que o `useEffect` foi desenhado para mantê-los juntos. Se o seu efeito retornar uma função, o React irá executá-la quando for a hora de limpar:

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

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

**Por que precisamos retornar uma função dos nossos efeitos?** Isso é um mecanismo opcional de limpeza para efeitos. Cada efeito pode retornar uma função que irá limpar depois dela. Isso nos permite manter a lógica para adicionar e remover subscriptions perto uma da outra. Elas são parte do mesmo efeito!

**Quando exatamente o React limpa um efeito?** O React executa a limpeza quando o componente desmonta. Contudo, como aprendemos anteriormente, efeitos rodam em todas as renderizações e não apenas uma vez. É por isso que o React *também* limpa os efeitos da renderização anterior antes de rodar os efeitos da próxima vez. Nós discutiremos o [porquê disso evitar bugs](#explanation-why-effects-run-on-each-update) e [como podemos desabilitar esse comportamento caso isso cause problemas de performance](#tip-optimizing-performance-by-skipping-effects) abaixo.

>Nota
>
>Nós não precisamos retornar uma função nomeada do efeito. Nós chamamos de `cleanup` aqui apenas para esclarecer seu propósito, mas nós podemos retornar uma arrow function ou chamarmos de qualquer coisa diferente.

## Recapitulando {#recap}

Nós aprendemos que `useEffect` nos deixa expressar diferentes tipos de efeitos colaterais depois que o componente renderiza. Alguns efeitos podem requerir limpeza, então eles retornam uma função:

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

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

O Effect Hook unifica ambos casos com uma única API.

-------------

**Se você acha que tem um bom entendimento de como o Effect Hook funciona, ou se você se sente sobrecarregado, você já pode pular para a [próxima pagina sobre as Regras dos Hooks](/docs/hooks-rules.html).**

-------------

## Dicas para Usar Efeitos {#tips-for-using-effects}

Vamos continuar essa página com um olhar mais aprofundado em alguns aspectos do `useEffect` sobre os quais alguns usuários mais experientes do React provavelmente ficarão curiosos. Não se sinta obrigado a se aprofundar neles agora. Você sempre pode voltar nessa página para saber mais sobe o Effect Hook.

### Dica: Use Múltiplos Efeitos para Separar Preocupações {#tip-use-multiple-effects-to-separate-concerns}

Um dos problemas que nós levantamos na [Motivação](/docs/hooks-intro.html#complex-components-become-hard-to-understand) dos Hooks era que os métodos do ciclo de vida das classes muitas vezes continham lógicas não relacionadas, mas as lógicas relacionadas (entre si) estavam separadas em vários métodos. Aqui temos um componente que combina o contador e o indicador de status de amizade dos exemplos anteriores:

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

Note como a lógica que define `document.title` esta dividida entre `componentDidMount` e `componentDidUpdate`. A lógica do subscription também esta dividida entre `componentDidMount` e `componentWillUnmount`. E o `componentDidMount` contém código das duas tarefas.

Então, como Hook resolvem esse problema? Assim como [você pode usar o Hooks *State* mais de uma vez](/docs/hooks-state.html#tip-using-multiple-state-variables), você também pode usar vários efeitos. Isso nos permite separar lógicas não relacionadas em diferentes efeitos:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Você clicou ${count} vezes`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

**Hooks nos permitem dividir o código com base no que ele está fazendo** em vez de encaixá-lo em algum nome dos métodos do ciclo de vida. React irá aplicar *todos* os efeitos usados por um componente, na ordem em que eles foram especificados.

### Explicação: Por Que Efeitos Executam em Cada Atualização {#explanation-why-effects-run-on-each-update}

Se você esta acostumado com classes, você pode estar se perguntando o porquê da fase de limpeza dos efeitos acontecerem depois de cada re-renderização, e não apenas uma vez durante a desmontagem. Vamos dar uma olhada em um exemplo prático para ver porque esse design nos ajuda a criar componentes com menos bugs.

[Anteriormente nessa página](#example-using-classes-1), nós introduzimos um componente de exemplo `FriendStatus` que mostra quando um amigo está online ou não. Nossa classes lê `friend.id` do `this.props`, faz subscribe no status do amigo após a montagem do componente e faz unsubscribe durante a desmontagem:

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

**Mas o que acontece se a prop `friend` mudar** enquanto o componente está na tela? Nosso componente deveria continuar exibindo o status de online de um amigo diferente. Isso é um bug. Nós também causaríamos um memory leak ou um crash durante o desmonte, já que a chamada do unsubscribe estaria usando o id do amigo errado.

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

Esquecer de cuidar do `componentDidUpdate` devidamente é uma fonte comum de bugs em aplicações React.

Agora considere a versão desse componente que usa Hooks:

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Ele não sofre desse bug. (Mas nós também não fizemos nenhuma mudança nele.)

Não existe nenhum código especial para cuidar das atualizações porque `useEffect` cuida delas *por padrão*. Ele limpa os efeitos anteriores antes de aplicar os próximos efeitos. Para ilustrar isso, aqui está a sequência de chamadas ao subscribe e unsubscribe que o componente fez ao longo do tempo:

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

Este comportamento garante a consistência por padrão e previne bugs que são comuns aos componente de classe devido à falta da lógica de atualização.

### Dica: Otimizando a Performance ao Pular Efeitos {#tip-optimizing-performance-by-skipping-effects}

Em alguns casos, limpar ou aplicar o efeito em cada renderização pode criar um problema de performance. Em componentes de classes, nós resolvemos isso escrevendo uma comparação extra com `prevProps` ou `prevState` dentro do `componentDidUpdate`:

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `Você clicou ${this.state.count} vezes`;
  }
}
```

Esse requerimento é comum o bastante para estar embutido na API do Hook `useEffect`. Você pode dizer ao React para *pular* a aplicação de um efeito se certos valores não tiverem mudado entre as renderizações. Para fazer isso, passe uma array como um segundo argumento opcional ao `useEffect`:

```js{3}
useEffect(() => {
  document.title = `Você clicou ${count} vezes`;
}, [count]); // Apenas re-execute o efeito quando o count mudar
```

No exemplo acima, nós passamos o `[count]` como segundo argumento. O que isso quer dizer? Se `count` é `5`, e o nosso componente re-renderiza com `count` ainda sendo `5`, o React irá comparar `[5]` da renderização passada e `[5]` da próxima renderização. Por todos os itens na array serem o mesmo (`5 === 5`), o React ira pular o efeito. Essa é a nossa otimização.

Quando nós renderizamos com `count` atualizado para `6`, o React irá comparar os itens no array `[5]` da renderização passada com os items no array `[6]` da próxima renderização. Desta vez, o React irá re-aplicar o efeito porque `5 !== 6`. Se houver múltiplos itens no array, o React irá re-executar o efeitos mesmo se apenas um deles for diferente.

Isso também funciona para efeitos que tenham uma fase de limpeza:

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Apenas re-subscribe se props.friend.id mudar
```

No futuro, talvez o segundo argumento seja adicionado automaticamente por uma transformação em tempo de build.

>Nota
>
>Se você usar essa otimização, tenha certeza de que a array inclua **qualquer valor do escopo acima (como props e state) que mude com o tempo e que ele seja usado pelo efeito**. Caso contrário, seu código fará referência a valores obsoletos de renderizações anteriores. Saiba mais sobre [como lidar com funções](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) e [o que fazer quando a matriz muda com muita frequência](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Se você quer executar um efeito e limpá-lo apenas uma vez (na montagem e desmontagem), você pode passar um array vazio (`[]`) como segundo argumento. Isso conta ao React que o seu efeito não depende de *nenhum* valor das props ou state, então ele nunca precisa re-executar. Isso não é tratado como um caso especial -- segue diretamente de como o array de dependências sempre funciona.
>
>Se você passar um array vazio (`[]`), a props e o state passados dentro do efeito sempre terão seus valores iniciais.  Enquanto passando `[]` como segundo parâmetro aproxima-se do modelo mental familiar de `componentDidMount` e `componentWillUnmount`, geralmente há [melhores](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [soluções](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) para evitar efeitos repetidos com muita frequência. Além disso, não esqueça de que o React adia a execução do `useEffect` até o navegador ser pintado, então fazer trabalho extra é menos problemático.
>
>Recomendamos usar as regras do [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) como parte do nosso pacote [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Ele avisa quando as dependências são especificadas incorretamente e sugere uma correção.

## Próximos Passos {#next-steps}

Parabéns! Essa foi uma página longa, mas com sorte ao fim a maioria das suas perguntas sobre efeitos foram respondidas. Você aprendeu sobre o Hook State e o Hook Effect, e há *muito* o que você pode fazer com os dois combinados. Eles cobrem a maioria dos casos de uso para classes -- e para os que eles não cobrirem, talvez você encontre alguns [Hooks adicionais](/docs/hooks-reference.html) úteis.

Nós também estamos começando a ver como Hooks resolvem problemas levantados na [Motivação](/docs/hooks-intro.html#motivation). Nós vimos como a limpeza dos efeitos evitam duplicação de código no `componentDidUpdate` e `componentWillUnmount`, mantém códigos relacionados juntos, e ajuda a evitar bugs. Nós também vimos como separar efeitos pelo seu propósito, que é uma coisa que não conseguíamos fazer com classes.

Nesse ponto você pode estar se perguntando como Hooks funcionam. Como o React sabe qual chamada do `useState` corresponde a qual variável de state entre as re-renderizações? Como o React "compara" os efeitos anteriores e os próximos toda atualização? **Na próxima pagina nos iremos aprender sobre as [Regras dos Hooks](/docs/hooks-rules.html) -- elas são essenciais para fazer os Hooks funcionarem.**
