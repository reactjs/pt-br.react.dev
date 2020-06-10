---
id: hooks-custom
title: Criando seus próprios Hooks
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

_Hooks_ são uma nova adição ao React 16.8. Eles permitem que você use o state e outros recursos do React sem escrever uma classe.

Criar seus próprios Hooks permite que você extraia a lógica de um componente em funções reutilizáveis.

Quando estávamos aprendendo sobre [usar o Hook de Efeito](/docs/hooks-effect.html#example-using-hooks-1), vimos esse componente de uma aplicação de chat que mostra uma mensagem indicando se um amigo está online ou offline:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
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

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Agora, digamos que nossa aplicação de chat também possua uma lista de contatos e que queremos renderizar os nomes de usuários online com a cor verde. Poderíamos copiar e colar a lógica similar acima em nosso componente `FriendListItem`, mas isso não seria o ideal:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
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

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Ao invés disso, gostaríamos de compartilhar essa lógica entre `FriendStatus` e `FriendListItem`.

Tradicionalmente em React, tínhamos duas maneiras populares para compartilhar lógica com estado entre componentes: [render props](/docs/render-props.html) e [componentes de alta-ordem](/docs/higher-order-components.html). Iremos agora ver como os Hooks resolvem diversos dos mesmos problemas sem nos forçar a adicionar mais componentes à árvore de renderização.

## Extraindo um Hook Customizado {#extracting-a-custom-hook}

Quando queremos compartilhar lógica entre duas funções JavaScript, extraímos ela para uma terceira função. Ambos componentes e Hooks são funções, então isso funciona para eles também!

**Um Hook customizado é uma função JavaScript cujo nome começa com "`use`" e que pode utilizar outros Hooks.** Por exemplo, `useFriendStatus` abaixo é nosso primeiro Hook customizado:

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Não há nenhuma novidade nele - a lógica foi copiada dos componentes acima. Assim como em um componente, certifique-se de apenas chamar outros Hooks fora de condições e no nível mais alto do seu Hook customizado.

Diferente de um componente React, um Hook customizado não precisa ter uma assinatura específica. Podemos decidir o que ele recebe como argumentos e o que ele retorna, caso necessário. Em outras palavras, é como uma função normal. Seu nome deve sempre começar com `use` para que você possa ver de forma fácil que [as regras dos Hooks](/docs/hooks-rules.html) se aplicam a ele.

O propósito do nosso Hook `useFriendStatus` é nos dizer o status de um amigo. Por isso ele recebe `friendID` como argumento e retorna se esse amigo está online:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Agora vamos ver como podemos usar o nosso Hook customizado.

## Usando um Hook Customizado {#using-a-custom-hook}

No começo, nosso objetivo era remover a lógica duplicada dos componentes `FriendStatus` e `FriendListItem`. Ambos precisam saber se um amigo está online ou não.

Agora que extraímos essa lógica para o Hook `useFriendStatus`, nós podemos *apenas usá-lo:*

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

**Esse código equivale aos exemplos originais?** Sim, ele funciona exatamente do mesmo modo. Se você olhar com atenção, irá ver que não fizemos nenhuma alteração ao comportamento. Apenas extraímos uma parte de código comum entre as duas funções para uma função separada. **Hooks customizados são uma convenção que surgiu naturalmente do design dos Hooks, mais do que de uma funcionalidade do React.**

**Eu tenho de nomear meus Hooks customizados começando com "`use`"?** Por favor, faça isso. Essa convenção é muito importante. Sem ela, não seríamos capazes de automaticamente verificar por violações nas [regras dos Hooks](/docs/hooks-rules.html) porque não poderíamos dizer se certa função contém chamadas a Hooks dentro dela.

**Dois componentes usando o mesmo Hook compartilham estado (`state`)?** Não. Hooks customizados são um mecanismo para reutilizar *lógica com estado* (como configurar uma subscrição ou lembrar de um valor atual), mas sempre que você usa um Hook customizado, todo o estado (`state`) e os efeitos dentro dele são completamente isolados.

**Como um Hook customizado isola o estado (`state`)?** Cada *chamada* a um Hook gera um estado (`state`) isolado. Por utilizarmos `useFriendStatus` diretamente, do ponto de vista do React, nosso componente está apenas chamando `useState` e `useEffect`. E como [aprendemos](/docs/hooks-state.html#tip-using-multiple-state-variables) [anteriormente](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), podemos chamar `useState` e `useEffect` diversas vezes em um componente e eles irão ser completamente independentes.

### Dica: Passando Informações entre Hooks {#tip-pass-information-between-hooks}

Visto que Hooks são funções, podemos passar informações entre eles.

Para ilustrar isso, iremos utilizar outro componente do nosso exemplo hipotético de um chat. Esse é um selecionador de destinatário para mensagens do chat que mostra se o amigo selecionado está online:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Nós colocamos o ID do atual amigo selecionado na variável de estado (`state`) `recipientID` e atualizamos ela se o usuário escolher um amigo diferente no selecionador `<select>`.

Pelo fato de o Hook `useState` nos fornecer o último valor da variável de estado (`state`) `recipientID`, podemos passá-la para nosso Hook customizado `useFriendStatus` como um parâmetro:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Isto nos informa se o amigo *atualmente seleccionado* está online. Se escolhermos um amigo diferente e atualizarmos a variável de estado `recipientID`, o nosso Hook `useFriendStatus` irá cancelar a subscrição do amigo seleccionado anteriormente, e subscrever para o status do recém-selecionado. 

## `useSuaImaginação()` {#useyourimagination}

Hooks customizados oferecem a flexibilidade de compartilhar lógica de uma forma que não era possível de fazer em componentes React anteriormente. Você pode escrever Hooks customizados que cobrem uma vasta gama de casos de uso como manipulação de formulários, animações, subscrições declarativas, contadores e provavelmente muitas outras que não pensamos. Melhor ainda, você pode criar Hooks que são fáceis de usar tanto quanto as funcionalidades nativas do React.

Tente resistir à tentação de adicionar uma abstração cedo demais. Agora que componentes de função podem fazer mais, provavelmente os componentes de função no seu código irão se tornar maiores. Isso é normal -- não sinta que você **têm** de os separar imediatamente em Hooks. Mas também incentivamos você a começar a achar casos onde um Hook customizado pode esconder uma lógica complexa atrás de uma interface simples ou ajudar a organizar um componente bagunçado.

Por exemplo, você pode ter um componente complexo que tenha um estado local `state` grande que seja manipulado de forma ad-hoc. `useState` não torna mais fácil a centralização da lógica de atualização, então você pode preferir escrever isso como um *reducer* do [Redux](https://redux.js.org/):

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

Reducers são muito convenientes para testar de forma isolada e escalonar para expressar uma lógica complexa de atualização. Você pode ainda quebrar eles em reducers menores caso necessário. Contudo, você pode também gostar dos benefícios de utilizar a lógica local (`state`) do React ou não queira instalar outra biblioteca.

Então se pudéssemos escrever um Hook `useReducer` que nos permite gerenciar o estado *local* (`state`) do nosso componente com um reducer? Uma versão simplificada deveria ser mais ou menos assim:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Agora podemos usar ele em nosso componente e deixar com que o reducer gerencie o estado (`state`) dele:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

A necessidade de se gerenciar o estado local (`state`) com um reducer em um componente complexo é comum o bastante que construímos o Hook `useReducer` no próprio React. Você o achará juntamente com outros Hooks nativos na [referência da API dos Hooks](/docs/hooks-reference.html).
