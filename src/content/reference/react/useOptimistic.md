---
title: useOptimistic
---

<Intro>

`useOptimistic` é um Hook do React que permite que você atualize a UI de forma otimista.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` é um Hook do React que permite que você mostre um estado diferente enquanto uma ação assíncrona está em andamento. Ele aceita algum estado como argumento e retorna uma cópia desse estado que pode ser diferente durante a duração de uma ação assíncrona, como uma requisição de rede. Você fornece uma função que recebe o estado atual e a entrada para a ação, e retorna o estado otimista a ser usado enquanto a ação está pendente.

Este estado é chamado de estado "otimista" porque geralmente é usado para apresentar imediatamente ao usuário o resultado da execução de uma ação, mesmo que a ação realmente leve tempo para ser concluída.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

*   `state`: o valor a ser retornado inicialmente e sempre que nenhuma ação estiver pendente.
*   `updateFn(currentState, optimisticValue)`: uma função que recebe o estado atual e o valor otimista passado para `addOptimistic` e retorna o estado otimista resultante. Deve ser uma função pura. `updateFn` recebe dois parâmetros, o `currentState` e o `optimisticValue`. O valor de retorno será o valor mesclado do `currentState` e `optimisticValue`.

#### Retorna {/*returns*/}

*   `optimisticState`: O estado otimista resultante. É igual a `state`, a menos que uma ação esteja pendente, caso em que é igual ao valor retornado por `updateFn`.
*   `addOptimistic`: `addOptimistic` é a função de dispatch para chamar quando você tem uma atualização otimista. Ele recebe um argumento, `optimisticValue`, de qualquer tipo e chamará o `updateFn` com `state` e `optimisticValue`.

---

## Uso {/*usage*/}

### Atualizando formulários de forma otimista {/*optimistically-updating-with-forms*/}

O Hook `useOptimistic` fornece uma maneira de atualizar a interface do usuário de forma otimista antes que uma operação em segundo plano, como uma requisição de rede, seja concluída. No contexto de formulários, essa técnica ajuda a tornar os aplicativos mais responsivos. Quando um usuário envia um formulário, em vez de esperar pela resposta do servidor para refletir as alterações, a interface é imediatamente atualizada com o resultado esperado.

Por exemplo, quando um usuário digita uma mensagem no formulário e aperta o botão "Enviar", o Hook `useOptimistic` permite que a mensagem apareça imediatamente na lista com um rótulo "Enviando...", mesmo antes que a mensagem seja realmente enviada a um servidor. Essa abordagem "otimista" dá a impressão de velocidade e responsividade. O formulário tenta então enviar a mensagem de verdade em segundo plano. Depois que o servidor confirma que a mensagem foi recebida, o rótulo "Enviando..." é removido.

<Sandpack>

```js src/App.js
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>