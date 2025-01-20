---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` é um Hook do React que permite que você se inscreva em um armazenamento externo.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Chame `useSyncExternalStore` no nível superior do seu componente para ler um valor de um armazenamento de dados externo.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Ele retorna o snapshot dos dados no armazenamento. Você precisa passar duas funções como argumentos:

1. A função `subscribe` deve se inscrever no armazenamento e retornar uma função que cancela a inscrição.
2. A função `getSnapshot` deve ler um snapshot dos dados do armazenamento.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `subscribe`: Uma função que aceita um único argumento `callback` e o inscreve no armazenamento. Quando o armazenamento muda, ela deve invocar o `callback` fornecido. Isso fará com que o componente seja re-renderizado. A função `subscribe` deve retornar uma função que limpa a inscrição.

* `getSnapshot`: Uma função que retorna um snapshot dos dados no armazenamento que são necessários para o componente. Enquanto o armazenamento não tiver mudado, chamadas repetidas a `getSnapshot` devem retornar o mesmo valor. Se o armazenamento mudar e o valor retornado for diferente (conforme comparado por [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), o React re-renderiza o componente.

* **opcional** `getServerSnapshot`: Uma função que retorna o snapshot inicial dos dados no armazenamento. Ele será usado apenas durante a renderização no servidor e durante a hidratação do conteúdo renderizado no servidor no cliente. O snapshot do servidor deve ser o mesmo entre o cliente e o servidor, e geralmente é serializado e passado do servidor para o cliente. Se você omitir este argumento, renderizar o componente no servidor gerará um erro.

#### Retornos {/*returns*/}

O snapshot atual do armazenamento que você pode usar na sua lógica de renderização.

#### Ressalvas {/*caveats*/}

* O snapshot do armazenamento retornado por `getSnapshot` deve ser imutável. Se o armazenamento subjacente tiver dados mutáveis, retorne um novo snapshot imutável se os dados mudarem. Caso contrário, retorne o último snapshot em cache.

* Se uma função `subscribe` diferente for passada durante uma re-renderização, o React re-inscreverá no armazenamento usando a função `subscribe` passada recentemente. Você pode evitar isso declarando `subscribe` fora do componente.

* Se o armazenamento for mutado durante uma [atualização de Transição não bloqueante](/reference/react/useTransition), o React fará fallback para realizar essa atualização como bloqueante. Especificamente, para cada atualização de Transição, o React chamará `getSnapshot` uma segunda vez antes de aplicar as alterações ao DOM. Se ele retornar um valor diferente do que foi chamado originalmente, o React reiniciará a atualização do zero, desta vez aplicando-a como uma atualização bloqueante, para garantir que cada componente na tela esteja refletindo a mesma versão do armazenamento.

* Não é recomendável _suspender_ uma renderização com base em um valor de armazenamento retornado por `useSyncExternalStore`. A razão é que as mutações para o armazenamento externo não podem ser marcadas como [atualizações de Transição não bloqueantes](/reference/react/useTransition), então elas acionarão o mais próximo [`Suspense` fallback](/reference/react/Suspense), substituindo o conteúdo já renderizado na tela por um carregador, o que geralmente resulta em uma experiência de usuário ruim. 

  Por exemplo, o seguinte é desencorajado:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Chamando `use` com uma Promise dependente de `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Renderizando condicionalmente um componente lazy com base em `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Uso {/*usage*/}

### Inscrevendo-se em um armazenamento externo {/*subscribing-to-an-external-store*/}

A maioria dos seus componentes React apenas lerá dados de suas [props](/learn/passing-props-to-a-component), [state](/reference/react/useState) e [context](/reference/react/useContext). No entanto, às vezes um componente precisa ler alguns dados de um armazenamento fora do React que muda ao longo do tempo. Isso inclui:

* Bibliotecas de gerenciamento de estado de terceiros que mantêm estado fora do React.
* APIs do navegador que expõem um valor mutável e eventos para se inscrever em suas mudanças.

Chame `useSyncExternalStore` no nível superior do seu componente para ler um valor de um armazenamento de dados externo.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Ele retorna o <CodeStep step={3}>snapshot</CodeStep> dos dados no armazenamento. Você precisa passar duas funções como argumentos:

1. A <CodeStep step={1}>função `subscribe`</CodeStep> deve se inscrever no armazenamento e retornar uma função que cancela a inscrição.
2. A <CodeStep step={2}>função `getSnapshot`</CodeStep> deve ler um snapshot dos dados do armazenamento.

O React usará essas funções para manter seu componente inscrito no armazenamento e re-renderizá-lo em mudanças.

Por exemplo, no sandbox abaixo, `todosStore` é implementado como um armazenamento externo que armazena dados fora do React. O componente `TodosApp` se conecta a esse armazenamento externo com o Hook `useSyncExternalStore`. 

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Adicionar todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// Este é um exemplo de um armazenamento de terceiros
// que você pode precisar integrar com o React.

// Se seu aplicativo for totalmente construído com o React,
// recomendamos usar o estado do React.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Quando possível, recomendamos usar o estado integrado do React com [`useState`](/reference/react/useState) e [`useReducer`](/reference/react/useReducer) em vez disso. A API `useSyncExternalStore` é mais útil se você precisar integrar com código não-React existente.

</Note>

---

### Inscrevendo-se em uma API do navegador {/*subscribing-to-a-browser-api*/}

Outra razão para adicionar `useSyncExternalStore` é quando você deseja se inscrever em algum valor exposto pelo navegador que muda ao longo do tempo. Por exemplo, suponha que você queira que seu componente exiba se a conexão de rede está ativa. O navegador expõe essa informação através de uma propriedade chamada [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Esse valor pode mudar sem o conhecimento do React, então você deve lê-lo com `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Para implementar a função `getSnapshot`, leia o valor atual da API do navegador:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Em seguida, você precisa implementar a função `subscribe`. Por exemplo, quando `navigator.onLine` muda, o navegador dispara os eventos [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) e [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) no objeto `window`. Você precisa inscrever o argumento `callback` nos eventos correspondentes e, em seguida, retornar uma função que limpa as inscrições:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Agora o React sabe como ler o valor da API externa `navigator.onLine` e como se inscrever em suas mudanças. Desconecte seu dispositivo da rede e observe que o componente re-renderiza em resposta:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Desconectado'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Extraindo a lógica para um Hook personalizado {/*extracting-the-logic-to-a-custom-hook*/}

Normalmente, você não escreverá `useSyncExternalStore` diretamente em seus componentes. Em vez disso, você tipicamente o chamará de seu próprio Hook personalizado. Isso permite que você use o mesmo armazenamento externo de diferentes componentes.

Por exemplo, este Hook personalizado `useOnlineStatus` rastreia se a rede está online:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Agora diferentes componentes podem chamar `useOnlineStatus` sem repetir a implementação subjacente:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Desconectado'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progresso salvo');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Salvar progresso' : 'Reconectando...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Adicionando suporte para renderização no servidor {/*adding-support-for-server-rendering*/}

Se seu aplicativo React usa [renderização no servidor](/reference/react-dom/server), seus componentes React também serão executados fora do ambiente do navegador para gerar o HTML inicial. Isso cria alguns desafios ao conectar-se a um armazenamento externo:

- Se você estiver se conectando a uma API apenas do navegador, ela não funcionará porque não existe no servidor.
- Se você estiver se conectando a um armazenamento de dados de terceiros, você precisará que seus dados correspondam entre o servidor e o cliente.

Para resolver esses problemas, passe uma função `getServerSnapshot` como o terceiro argumento para `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Sempre mostre "Online" para HTML gerado no servidor
}

function subscribe(callback) {
  // ...
}
```

A função `getServerSnapshot` é semelhante à `getSnapshot`, mas ela é executada apenas em duas situações:

- Ela é executada no servidor ao gerar o HTML.
- Ela é executada no cliente durante a [hidratação](/reference/react-dom/client/hydrateRoot), ou seja, quando o React pega o HTML do servidor e o torna interativo.

Isso permite que você forneça o valor inicial do snapshot que será usado antes que o aplicativo se torne interativo. Se não houver um valor inicial significativo para a renderização no servidor, omita este argumento para [forçar a renderização no cliente.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

<Note>

Certifique-se de que `getServerSnapshot` retorne os mesmos dados exatos na renderização inicial do cliente que retornou no servidor. Por exemplo, se `getServerSnapshot` retornou algum conteúdo de armazenamento pré-populado no servidor, você precisa transferir esse conteúdo para o cliente. Uma maneira de fazer isso é emitir uma tag `<script>` durante a renderização no servidor que define uma global como `window.MY_STORE_DATA`, e ler dessa global no cliente em `getServerSnapshot`. Seu armazenamento externo deve fornecer instruções sobre como fazer isso.

</Note>

---

## Solução de Problemas {/*troubleshooting*/}

### Estou recebendo um erro: "O resultado de `getSnapshot` deve ser cacheado" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Esse erro significa que sua função `getSnapshot` retorna um novo objeto toda vez que é chamada, por exemplo:

```js {2-5}
function getSnapshot() {
  // 🔴 Não retorne sempre objetos diferentes de getSnapshot
  return {
    todos: myStore.todos
  };
}
```

O React re-renderizará o componente se o valor de retorno de `getSnapshot` for diferente do último valor. É por isso que, se você sempre retornar um valor diferente, você entrará em um loop infinito e receberá esse erro.

Seu objeto `getSnapshot` deve retornar um objeto diferente somente se algo realmente mudou. Se seus dados de armazenamento contêm dados imutáveis, você pode retornar esses dados diretamente:

```js {2-3}
function getSnapshot() {
  // ✅ Você pode retornar dados imutáveis
  return myStore.todos;
}
```

Se seus dados de armazenamento forem mutáveis, sua função `getSnapshot` deve retornar um snapshot imutável deles. Isso significa que *realmente deve* criar novos objetos, mas não deve fazer isso para cada chamada. Em vez disso, deve armazenar o último snapshot calculado e retornar o mesmo snapshot que a última vez se os dados no armazenamento não tiverem mudado. Como você determina se os dados mutáveis mudaram depende do seu armazenamento mutável.

---

### Minha função `subscribe` é chamada após cada re-renderização {/*my-subscribe-function-gets-called-after-every-re-render*/}

Essa função `subscribe` é definida *dentro* de um componente, então ela é diferente a cada re-renderização:

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Sempre uma função diferente, então o React irá re-inscrever em cada re-renderização
  function subscribe() {
    // ...
  }

  // ...
}
```
  
O React irá re-inscrever no seu armazenamento se você passar uma função `subscribe` diferente entre as re-renderizações. Se isso causar problemas de performance e você quiser evitar re-inscrições, mova a função `subscribe` para fora:

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Sempre a mesma função, então o React não precisará re-inscrever
function subscribe() {
  // ...
}
```

Alternativamente, envolva `subscribe` em [`useCallback`](/reference/react/useCallback) para re-inscrever apenas quando algum argumento mudar:

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ Mesma função enquanto userId não mudar
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```