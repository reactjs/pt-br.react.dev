---
title: useOptimistic
canary: true
---

<Canary>

O Hook `useOptimistic` está atualmente disponível apenas nos canais Canary e experimentais do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useOptimistic` é um Hook do React que permite atualizar a interface do usuário de forma otimista.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` é um Hook do React que permite mostrar um estado diferente enquanto uma ação assíncrona está em andamento. Ele aceita algum estado como argumento e retorna uma cópia desse estado que pode ser diferente durante a duração de uma ação assíncrona, como uma solicitação de rede. Você fornece uma função que recebe o estado atual e a entrada para a ação e retorna o estado otimista a ser usado enquanto a ação está pendente.

Esse estado é chamado de estado "otimista" porque geralmente é usado para apresentar imediatamente ao usuário o resultado de realizar uma ação, mesmo que a ação realmente leve tempo para ser concluída.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // mesclar e retornar novo estado
      // com valor otimista
    }
  );
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `state`: o valor a ser retornado inicialmente e sempre que nenhuma ação estiver pendente.
* `updateFn(currentState, optimisticValue)`: uma função que recebe o estado atual e o valor otimista passado para `addOptimistic` e retorna o estado otimista resultante. Deve ser uma função pura. `updateFn` aceita dois parâmetros. O `currentState` e o `optimisticValue`. O valor de retorno será o valor mesclado do `currentState` e `optimisticValue`.


#### Retornos {/*returns*/}

* `optimisticState`: O estado otimista resultante. É igual a `state`, a menos que uma ação esteja pendente, caso em que é igual ao valor retornado por `updateFn`.
* `addOptimistic`: `addOptimistic` é a função de despacho a ser chamada quando você tiver uma atualização otimista. Aceita um argumento, `optimisticValue`, de qualquer tipo e chamará `updateFn` com `state` e `optimisticValue`.

---

## Uso {/*usage*/}

### Atualizando formulários de forma otimista {/*optimistically-updating-with-forms*/}

O Hook `useOptimistic` fornece uma maneira de atualizar de forma otimista a interface do usuário antes que uma operação em segundo plano, como uma solicitação de rede, seja concluída. No contexto de formulários, essa técnica ajuda a fazer os aplicativos parecerem mais responsivos. Quando um usuário envia um formulário, em vez de esperar pela resposta do servidor para refletir as mudanças, a interface é imediatamente atualizada com o resultado esperado.

Por exemplo, quando um usuário digita uma mensagem no formulário e clica no botão "Enviar", o Hook `useOptimistic` permite que a mensagem apareça imediatamente na lista com um rótulo "Enviando...", mesmo antes que a mensagem seja realmente enviada para um servidor. Essa abordagem "otimista" dá a impressão de velocidade e responsividade. O formulário então tenta realmente enviar a mensagem em segundo plano. Assim que o servidor confirma que a mensagem foi recebida, o rótulo "Enviando..." é removido.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Enviando...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Olá!" />
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Olá!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>